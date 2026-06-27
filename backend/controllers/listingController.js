import { Listing } from "../Schema/Listing.js";
import { StatusCodes } from "http-status-codes";
import { wrapAsync } from "../utils/wrapAsync.js";

// 1. GET ALL LISTINGS
export const getAllListings = wrapAsync(async (req, res) => {
  const { search } = req.query;
  let query = {};

  if (search && search.trim() !== "") {
    query = {
      $or: [
        { title: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { country: { $regex: search, $options: "i" } },
      ],
    };
  }

  const data = await Listing.find(query);
  return res
    .status(StatusCodes.OK)
    .json({ success: true, message: "Data fetched successfully", data });
});

// 2. CREATE NEW LISTING
export const createListings = wrapAsync(async (req, res) => {
  const { title, description, category, price, location, country } = req.body;

  if (!title || !description || !category || !price || !location || !country) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Bhai saheb, saari fields bharna zaroori hai!",
    });
  }

  if (!req.file) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Bhai saheb, ek sunder si image upload karna zaroori hai!",
    });
  }

  const imageUrl = req.file.path;

  const data = {
    title,
    description,
    image: [imageUrl],
    category,
    price,
    location,
    country,
    owner: req.user._id,
  };
  const response = await Listing.create(data);

  console.log("New Listing Created:", response.title);
  return res.status(StatusCodes.CREATED).json({
    success: true,
    message: "Data added in Database successfully! 🎉",
    response,
  });
});

// 3. GET LISTING BY ID
export const getListingById = wrapAsync(async (req, res) => {
  const { id } = req.params;
  const data = await Listing.findById(id)
    .populate({
      path: "review",

      populate: {
        path: "author",
      },
    })
    .populate("owner");

  if (!data) {
    return res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      message: "Bhai, yeh hotel database mein nahi mila!",
    });
  }
  return res.status(StatusCodes.OK).json({ message: "Success", data });
});

// 4. UPDATE LISTING BY ID
export const updateListing = wrapAsync(async (req, res) => {
  const { id } = req.params;
  const { title, description, image, category, price, location, country } =
    req.body;

  if (!title || !description || !category || !price || !location || !country) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Bhai saheb, saari fields bharna zaroori hai!" });
  }

  const updateData = {
    title,
    description,
    image,
    category,
    price,
    location,
    country,
  };

  // { new: true } lagaya hai taaki updated data response mein mile
  const response = await Listing.findByIdAndUpdate(id, updateData, {
    new: true,
  });

  if (!response) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "Data not found to update!" });
  }

  console.log("Listing Updated:", response.title);
  return res
    .status(StatusCodes.OK)
    .json({ success: true, message: "Update successful", response });
});

// 5. DELETE LISTING BY ID
export const deleteListing = wrapAsync(async (req, res) => {
  const { id } = req.params;
  const response = await Listing.findByIdAndDelete(id);

  if (!response) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "Data not found to delete!" });
  }

  console.log("Listing Deleted ID:", id);
  return res.status(StatusCodes.OK).json({
    success: true,
    message: "Data deleted successfully from DB",
    response,
  });
});
