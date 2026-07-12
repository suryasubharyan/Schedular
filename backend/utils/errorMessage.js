const FALLBACK = "Something went wrong on our end. Please try again shortly.";

export const getUserFriendlyError = (error, fallback = FALLBACK) => {
  if (!error) return fallback;

  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern || {})[0] || "value";
    return `That ${field} is already in use.`;
  }

  if (error.name === "ValidationError") {
    const firstError = Object.values(error.errors || {})[0];
    return firstError?.message || "Please check your details and try again.";
  }

  if (error.name === "CastError") {
    return "That request wasn't valid. Please check the details and try again.";
  }

  return fallback;
};

export default getUserFriendlyError;
