import { useContext, useEffect } from "react";
import { AuthContext } from "../../Auth";

export const useAuth = () => {
  const { user: userContext, setUser: setUserContext } =
    useContext(AuthContext);

  const setUser = (user: typeof userContext) => {
    localStorage.setItem("user", JSON.stringify(user));
    setUserContext(user);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && !userContext) {
      setUserContext(JSON.parse(storedUser));
    }
  }, [setUserContext, userContext]);

  return { user: userContext, setUser };
};
