import Lithic from "lithic";

export const lithic = new Lithic({
  apiKey: process.env.LITHIC_API_KEY!,
  environment: process.env.LITHIC_ENV === "production" ? "production" : "sandbox",
});
