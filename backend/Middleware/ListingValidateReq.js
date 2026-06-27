import { Listing } from "../Schema/Listing.js";
import { listingValidationSchema } from "../validators/listingValidators.js";
import { StatusCodes } from "http-status-codes";

export const listingValidate = (req, res, next) => {
  if (req.body.price) {
    req.body.price = Number(req.body.price);
  }

  const result = listingValidationSchema.safeParse(req.body);

  if (!result.success) {
    // 🔥 DEBUG HACK: Terminal par exact Zod issues dekhne ke liye
    console.log(
      "❌ ZOD VALIDATION FAILED! Issues:",
      JSON.stringify(result.error.issues, null, 2),
    );

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

export const isOwner = async (req, res, next) => {
  let { id } = req.params;

  let listing = await Listing.findById(id);

  if (!listing) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .JSON({ success: false, message: "Listing is Not Found" });
  }

  if (!listing.owner.equals(req.user.id)) {
    return res.status(StatusCodes.FORBIDDEN).JSON({
      success: false,
      message: "Permission Denied! You are not the owner of this listing. ❌",
    });
  }

  next();
};
