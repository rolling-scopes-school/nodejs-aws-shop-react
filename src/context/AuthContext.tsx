import { createContext, useState, useContext, PropsWithChildren } from "react";

// Create the AuthContext
const AuthContext = createContext<{
  auth: boolean;
  login?: (props: { username: string }) => void;
  logout?: () => void;
}>({
  auth: !!localStorage.getItem("authorization_token"),
});

// Create the AuthProvider component
export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [auth, setAuth] = useState(
    !!localStorage.getItem("authorization_token")
  );

  const login = ({ username }: { username: string }) => {
    localStorage.setItem(
      "authorization_token",
      btoa(username + ":" + "TEST_PASSWORD")
    );
    setAuth(true);
  };

  const logout = () => {
    localStorage.removeItem("authorization_token");
    setAuth(false);
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Create a custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
