import { useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { useSocialData } from "../hooks/useSocialData";

export default function SocialDataInitializer() {
    const { user } = useAuth();
    const { refresh } = useSocialData();


    useEffect(() => {
        if(!user) return;
        refresh();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);
    return null;
}