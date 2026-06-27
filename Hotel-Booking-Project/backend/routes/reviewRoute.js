import { Router } from "express";
import {
  createReviews,
  deleteReviews,
  updateReviews,
} from "../controllers/reviewController.js";
import {
  isReviewAuthor,
  reviewValidate,
} from "../Middleware/ReviewValidateReq.js";
import { isLoggedIn } from "../Middleware/AuthMiddleware.js";

const router = Router({ mergeParams: true });

router.post("/:id/reviews", isLoggedIn, reviewValidate, createReviews);
router.delete(
  "/:id/reviews/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  deleteReviews,
);
router.put(
  "/:id/reviews/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  reviewValidate,
  updateReviews,
);
export const reviewRouter = router;
