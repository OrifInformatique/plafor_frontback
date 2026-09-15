import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import logOut from "../../features/auth/ui/api/logOut";

import useAuthStore from "../../features/auth/authStore";

const readStoredUser = () => {
  try {
    const raw = localStorage.getItem("auth-storage");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.state?.user || null;
  } catch (e) {
    return null;
  }
};

const useLayoutAuth = () => {
  const navigate = useNavigate();
  const [remountKey, setRemountKey] = useState(0);
  const user = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const effectiveUser = useMemo(() => user ?? readStoredUser(), [user]);

  const handleLogout = useCallback(async () => {
    try {
      await logOut();
    } catch (err) {
      // Remote logout best effort; proceed with local cleanup either way
    }

    clearAuth();
    localStorage.removeItem("loginType");
    navigate("/");
    setRemountKey((k) => k + 1); // force remount for a cleaner visual reset
  }, [clearAuth, navigate]);
  return { effectiveUser, remountKey, handleLogout };
};

export default useLayoutAuth;
