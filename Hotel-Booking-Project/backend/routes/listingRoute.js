import { Router } from "express";
import {
  getAllListings,
  createListings,
  getListingById,
  updateListing,
  deleteListing,
} from "../controllers/listingController.js";
import { isOwner, listingValidate } from "../Middleware/ListingValidateReq.js";
import { isLoggedIn } from "../Middleware/AuthMiddleware.js";
import multer from "multer";
import { storage } from "../cloudConfig.js";

const upload = multer({ storage });

const router = Router();

router.get("/", getAllListings);
router.get("/:id", getListingById);
router.delete("/:id", isLoggedIn, isOwner, deleteListing);

router.post(
  "/",
  isLoggedIn,
  upload.single("image"),
  listingValidate,
  createListings,
);
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  upload.single("image"),
  listingValidate,
  updateListing,
);

export const listingRouter = router;
