import React, {
  createContext,
  ReactElement,
  SetStateAction,
  useState,
} from "react";
import { User } from "../backend/src/entities/user";

type LoggedInUser = Pick<User, "avatar" | "username" | "name"> | null;

export const AuthContext = createContext<{
  user: LoggedInUser;
  setUser: React.Dispatch<SetStateAction<LoggedInUser | null>>;
}>({ user: null, setUser: () => {} });

const Auth = ({ children }: { children: ReactElement[] | ReactElement }) => {
  const [user, setUser] = useState<LoggedInUser>(null);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
export default Auth;
