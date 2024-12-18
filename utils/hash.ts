import { createHash } from "crypto";

export function sha256(input: string): string {
  let hasher = createHash("sha256");
  hasher.update(input);
  return hasher.digest("base64");
}
