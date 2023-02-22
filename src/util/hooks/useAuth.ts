import { useContext, createContext } from "react";
import { User } from "../../../backend/src/entities/user";

export const AuthContext = createContext<{
  user?: Pick<User, "id" | "avatar" | "username" | "name">;
}>({});

export const useAuth = () => {
  return useContext(AuthContext);
};
