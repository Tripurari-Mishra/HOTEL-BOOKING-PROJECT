import { StatusCodes } from "http-status-codes";
import { Listing } from "../Models/Listing.js";
import { Review } from "../Models/Review.js";
import { wrapAsync } from "../utils/wrapAsync.js";

export const createReviews = wrapAsync(async (req, res) => {
  const { id } = req.params;
  const existingData = await Listing.findById(id);

  if (!existingData) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: "Listing id wrong" });
  }

  let { comment, rating } = req.body;

  const reviewResponse = await Review.create({
    comment,
    rating,
    author: req.user._id
  });
  console.log("Review Created with ID:", reviewResponse._id);

  if (!reviewResponse) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "Review is Not Add to DataBase" });
  }

  existingData.review.push(reviewResponse._id);

  const response = await existingData.save();

  if (response) {
    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Review is Create",
      data: reviewResponse,
    });
  }
});

export const deleteReviews = wrapAsync(async (req, res) => {
  let { id, reviewId } = req.params;

  let deleteReview = await Review.findByIdAndDelete(reviewId);

  if (!deleteReview) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "Review is Not Available" });
  }

  let updateListing = await Listing.findByIdAndUpdate(
    id,
    {
      $pull: { review: reviewId },
    },
    { new: true },
  );

  if (!updateListing) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Listing Id wrong, couldn't update array" });
  }

  return res
    .status(StatusCodes.OK)
    .json({ success: true, message: "Review is Deleted" });
});

export const updateReviews = wrapAsync(async (req, res) => {
  let { id, reviewId } = req.params;
  let { comment, rating } = req.body;

  let updateReview = await Review.findByIdAndUpdate(
    reviewId,
    { comment, rating },
    { new: true, runValidators: true },
  );

  if (!updateReview) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "Review Id is Not Valid" });
  }

  return res
    .status(StatusCodes.OK)
    .json({ success: true, message: "update Review " });
});
