import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { getPostsAPI } from "../api/post.api";
import {
  disconnectSocialPlatformAPI,
  getSocialAccountsAPI,
  openSocialPlatformConnect,
} from "../api/social.api";
import api from "../api/axios";
import { formatPlatformLabel } from "../lib/platforms";
import { useNotification } from "./NotificationContext";
import useAuth from "../hooks/useAuth";

const SocialDataContext = createContext();

export const SocialDataProvider = ({ children }) => {
  const { user } = useAuth();
  const { showSuccess, showError } = useNotification();

  const [accounts, setAccounts] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const connectedAccounts = accounts.filter((account) => account.connected);
  const hasConnectedAccounts = connectedAccounts.length > 0;

  const loadAccounts = useCallback(async () => {
    try {
      const res = await getSocialAccountsAPI();
      const nextAccounts = Array.isArray(res.data) ? res.data : [];
      setAccounts(nextAccounts);
      return nextAccounts;
    } catch {
      setAccounts([]);
      return [];
    }
  }, []);

  const loadPosts = useCallback(async (nextAccounts) => {
    const connected = (nextAccounts || accounts).some((account) => account.connected);
    if (!connected) {
      setPosts([]);
      return [];
    }

    try {
      const res = await getPostsAPI();
      const nextPosts = Array.isArray(res.data) ? res.data : [];
      setPosts(nextPosts);
      return nextPosts;
    } catch {
      setPosts([]);
      return [];
    }
  }, [accounts]);

  const refresh = useCallback(async () => {
    setLoading(true);
    const nextAccounts = await loadAccounts();
    await loadPosts(nextAccounts);
    setLoading(false);
    return nextAccounts;
  }, [loadAccounts, loadPosts]);

  useEffect(() => {
    if (!user) return;
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleConnect = (platform) => {
    openSocialPlatformConnect(platform);
  };

  const handleDisconnect = async (platform) => {
    try {
      if (platform === "linkedin") {
        await api.post("/api/linkedin/disconnect");
      } else {
        await disconnectSocialPlatformAPI(platform);
      }

      const nextAccounts = await loadAccounts();
      await loadPosts(nextAccounts);
      showSuccess(`${formatPlatformLabel(platform)} disconnected`);
      return nextAccounts;
    } catch {
      showError("Failed to disconnect");
      return accounts;
    }
  };

  return (
    <SocialDataContext.Provider
      value={{
        accounts,
        posts,
        loading,
        connectedAccounts,
        hasConnectedAccounts,
        loadAccounts,
        loadPosts,
        refresh,
        handleConnect,
        handleDisconnect,
      }}
    >
      {children}
    </SocialDataContext.Provider>
  );
};

export const useSocialData = () => useContext(SocialDataContext);

export default SocialDataContext;
