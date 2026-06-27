import { z } from "zod";

const reviewSchemaValidator = z.object({
  comment: z
    .string({ required_error: "Comment is required" })
    .trim()
    .min(5, "comment required 5 characters"),

  rating: z.number({ required_error: "Rating is required" }).min(1).max(5),
});

export default reviewSchemaValidator;
