const FALLBACK = "Something went wrong. Please try again.";

const STATUS_MESSAGES = {
  400: "That request wasn't valid. Please check the details and try again.",
  401: "Invalid email or password.",
  403: "You don't have permission to do that.",
  404: "We couldn't find what you were looking for.",
  409: "That already exists. Please try something else.",
  429: "Too many attempts. Please wait a moment and try again.",
  500: "Something went wrong on our end. Please try again shortly.",
  502: "Server is temporarily unavailable. Please try again shortly.",
  503: "Server is temporarily unavailable. Please try again shortly.",
};

export const getErrorMessage = (error) => {
  if (!error) return FALLBACK;

  if (!error.response) {
    if (error.code === "ECONNABORTED") {
      return "The request timed out. Please check your connection and try again.";
    }
    if (error.message === "Network Error") {
      return "Can't reach the server. Please check your internet connection.";
    }
    return error.message || FALLBACK;
  }

  const { status, data } = error.response;
  const serverMessage =
    typeof data === "string"
      ? data
      : data?.error || data?.message;

  if (serverMessage && typeof serverMessage === "string") {
    return serverMessage;
  }

  return STATUS_MESSAGES[status] || FALLBACK;
};

export default getErrorMessage;
