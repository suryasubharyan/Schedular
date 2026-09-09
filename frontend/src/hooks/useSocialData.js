import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { openSocialPlatformConnect } from "../api/social.api";
import { formatPlatformLabel } from "../lib/platforms";

import {
    loadAccounts as loadAccountsThunk,
    loadPosts as loadPostsThunk,
    refresh as refreshThunk,
    disconnectPlatform as disconnectPlatformThunk,
} from "../store/socialDataSlice";
import { useNotification } from "./useNotification";

export const useSocialData = () => {
    const dispatch = useDispatch();
    const { showSuccess, showError } = useNotification();

    const accounts = useSelector((state) => state.socialData.accounts);
    const posts = useSelector((state) => state.socialData.posts);
    const loading = useSelector((state) => state.socialData.loading);

    const connectedAccounts = useMemo(
        () => accounts.filter((account) => account.connected),
        [accounts]
    );
    const hasConnectedAccounts = connectedAccounts.length > 0;
    const loadAccounts = useCallback(() => dispatch(loadAccountsThunk()).unwrap(), [dispatch]);

    const loadPosts = useCallback(
        (nextAccounts) => dispatch(loadPostsThunk(nextAccounts)).unwrap(),
        [dispatch]
    );

    const refresh = useCallback(() => dispatch(refreshThunk()).unwrap(), [dispatch]);

    const handleConnect = useCallback((platform) => {
        openSocialPlatformConnect(platform);
    }, []);

    const handleDisconnect = useCallback(
        async (platform) => {
            try {
                await dispatch(disconnectPlatformThunk(platform)).unwrap();
                showSuccess(`${formatPlatformLabel(platform)} disconnected`);
            } catch {
                showError("Failed to disconnect");
            }
        },
        [dispatch, showSuccess, showError]
    );

    return {
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
    };
};

export default useSocialData;