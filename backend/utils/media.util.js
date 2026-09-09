export const parseDataUrl = (dataUrl) => {
  if (typeof dataUrl !== "string") {
    throw new Error("Invalid image data");
  }

  const parts = dataUrl.split(",");
  if (parts.length !== 2) {
    throw new Error("Image must be a base64 data URL");
  }

  const meta = parts[0];
  const base64 = parts[1];
  const mimeMatch = meta.match(/data:(.*?);base64/);
  const contentType = mimeMatch?.[1] || "application/octet-stream";
  const buffer = Buffer.from(base64, "base64");

  return { buffer, contentType };
};
