import {
  Context,
  FunctionComponent,
  PropsWithChildren,
  createContext,
  useContext,
  useState,
} from "react";
import { Navigate } from "react-router-dom";

const AUTH_ENABLED = import.meta.env.VITE_AUTH_ENABLED === "true";
const AuthProviderContext: Context<any> = createContext(null);

const DEFAULT_USER = {
  username: "johnsmith",
  first_name: "John",
  last_name: "Smith",
  userType: "Admin",
  email: "johnsmith@providermanagement.com"
}

const getUserData = () => {
  if (!AUTH_ENABLED) {
    return DEFAULT_USER;
  }
  const user = localStorage.getItem("user");
  return user ? { ...JSON.parse(user)["user-account-details"], userType: "Admin" } : null;
}

export const AuthProvider: FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  const [userData, setUserData] = useState(getUserData());
  const logout = () => {
    localStorage.removeItem("user");
    setUserData(null);
  }
  
  return (
    <AuthProviderContext.Provider value={{
      userData,
      logout
    }}>
      {userData ? children : <Navigate to="/login" replace={true} />}
    </AuthProviderContext.Provider>
  );
};

export const useAuth = () => useContext(AuthProviderContext);