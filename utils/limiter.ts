import { RateLimiter } from "limiter";

export const mailLimiter: RateLimiter = new RateLimiter({
  tokensPerInterval: 15,
  interval: "second",
});
