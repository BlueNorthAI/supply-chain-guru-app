import crypto from "crypto";

export function verifyHmac(
  queryParams: Record<string, string>,
  secret: string
): boolean {
  const { hmac, ...params } = queryParams;

  if (!hmac) return false;

  // Sort parameters alphabetically and create query string
  const sortedParams = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  const calculatedHmac = crypto
    .createHmac("sha256", secret)
    .update(sortedParams)
    .digest("hex");

  // Use timing-safe comparison
  try {
    return crypto.timingSafeEqual(
      Buffer.from(hmac),
      Buffer.from(calculatedHmac)
    );
  } catch {
    return false;
  }
}

export function verifyWebhookHmac(
  body: string,
  hmacHeader: string,
  secret: string
): boolean {
  const calculatedHmac = crypto
    .createHmac("sha256", secret)
    .update(body, "utf8")
    .digest("base64");

  try {
    return crypto.timingSafeEqual(
      Buffer.from(hmacHeader),
      Buffer.from(calculatedHmac)
    );
  } catch {
    return false;
  }
}
