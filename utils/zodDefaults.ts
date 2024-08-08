import { z } from "zod";

const x: z.ZodErrorMap = (issue, ctx) => {
  if (issue.code === z.ZodIssueCode.invalid_type) {
    if (issue.received === "undefined") {
      return {
        message: "Kötelező",
      };
    }
  }

  return {
    message: ctx.defaultError,
  };
};

z.setErrorMap(x);
