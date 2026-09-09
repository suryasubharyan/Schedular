import { useEffect } from "react";
import { formatPlatformLabel } from "../lib/platforms";

export const useDashboardRedirectEffects = ({
  location,
  navigate,
  openCreateView,
  showSuccess,
  showError,
}) => {
  useEffect(() => {
    if (location.state?.openCreate) {
      openCreateView("draft");
      navigate(location.pathname, { replace: true, state: {} });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const connected = params.get("connected");
    const error = params.get("error");
    const mode = params.get("mode");

    if (connected) {
      showSuccess(
        mode === "demo"
          ? `${formatPlatformLabel(connected)} connected in demo mode`
          : `${formatPlatformLabel(connected)} connected successfully`
      );
      navigate(location.pathname, { replace: true });
    } else if (error) {
      const platformFromError = error.replace("_connect_failed", "");
      showError(`Couldn't connect ${formatPlatformLabel(platformFromError)}. Please try again.`);
      navigate(location.pathname, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);
};

export default useDashboardRedirectEffects;
