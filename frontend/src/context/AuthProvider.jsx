import { useEffect } from "react";
import { useAuth } from "../store/useAuth";
import authApi from "../api/api-auth";

const AuthProvider = ({ children }) => {
  const { setUser, setAuthenticated, setAppLoading } = useAuth();

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const res = await authApi.fetchAccount();
        if (res.status === 200 && res.data) {
          setUser(res.data);
          setAuthenticated(true);
        }
      } catch (error) {
        console.error("Fetch account error:", error);
      } finally {
        setAppLoading(false);
      }
    };
    fetchAccount();
  }, [setUser, setAuthenticated, setAppLoading]);

  return <>{children}</>;
};

export default AuthProvider;