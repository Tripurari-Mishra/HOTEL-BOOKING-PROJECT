import { StatusCodes } from "http-status-codes";
import reviewSchemaValidator from "../validators/reviewValidators.js";
import { Review } from "../Schema/Review.js";
import { wrapAsync } from "../utils/wrapAsync.js";

export const reviewValidate = (req, res, next) => {
  if (req.body.rating) {
    req.body.rating = Number(req.body.rating);
  }

  const result = reviewSchemaValidator.safeParse(req.body);

  if (!result.success) {
    let errorMessage = "Validation failed";

    if (result.error && result.error.issues && result.error.issues.length > 0) {
      errorMessage = result.error.issues.map((err) => err.message).join(", ");
    } else if (result.error && typeof result.error.flatten === "function") {
      const flatErrors = result.error.flatten().fieldErrors;
      errorMessage = Object.values(flatErrors).flat().join(", ");
    }

    const error = new Error(errorMessage);
    error.statusCode = 400;
    return next(error);
  }

  req.body = result.data;

  next();
};

export const isReviewAuthor = wrapAsync(async (req, res, next) => {
  let { reviewId } = req.params;

  const review = await Review.findById(reviewId);

  if (!review) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ success: false, message: "Review is Not Found" });
  }

  // ✅ FIX: 'const' dhyan se laga diya hai taaki 'not defined' ka error na aaye
  const reviewAuthorId =
    review.author && review.author._id
      ? review.author._id.toString()
      : review.author.toString();

  const loggedInUserId = req.user._id
    ? req.user._id.toString()
    : req.user.toString();

  // 📝 TERMINAL LOGS: Dono IDs dekhne ke liye
  console.log("--- FINAL MATCHING CHECK ---");
  console.log("DB Author ID:", reviewAuthorId);
  console.log("Logged In User ID:", loggedInUserId);

  if (reviewAuthorId !== loggedInUserId) {
    return res.status(StatusCodes.FORBIDDEN).json({
      success: false,
      message: "Permission Denied!. ❌",
    });
  }

  next();
});
