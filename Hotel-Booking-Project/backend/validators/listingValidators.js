import { z } from "zod";

export const listingValidationSchema = z.object({
  title: z
    .string({ required_error: "Property title is required" })
    .trim()
    .min(3, "Title required 3 characters"),

  description: z
    .string({ required_error: "Description is required" })
    .trim()
    .min(10, "description required 10 characters"),

  category: z.enum(["Hotel", "Villa", "Resort", "Apartment"], {
    errorMap: () => ({
      message: "Category only Hotel, Villa, Resort ya Apartment ho sakti hai!",
    }),
  }),

  price: z
    .number({ required_error: "Price is required" })
    .positive("Price always grater than 0"),

  location: z.string({ required_error: "Location is required" }).trim(),
  country: z.string({ required_error: "Country is required" }).trim(),

  // 🔥 FIX: Ab yeh simple string, empty string, ya database wala image object/array sab accept karega!
  image: z
    .union([
      z.string().url(),
      z.literal(""),
      z.object({
        url: z.string().url().optional(),
        filename: z.string().optional(),
      }),
      z.array(z.any()),
    ])
    .optional(),
});
