import { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import { loginRequest } from '../../config/auth';
import { InteractionStatus } from '@azure/msal-browser';

interface AuthContextType {
  accounts: any;
  name: string | undefined;
  email: string | undefined;
  isAuthenticated: boolean;
  signInUser: () => Promise<void>;
  signOutUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const isAuthenticated = useIsAuthenticated();
  const { accounts, instance, inProgress } = useMsal();
  const [name, setName] = useState<string>();
  const [email, setEmail] = useState<string | undefined>();

  const handleSignInUser = async () => {
    try {
      if (inProgress === InteractionStatus.None && !isAuthenticated) {
        await instance.loginRedirect(loginRequest);
      }
    } catch (e) {
      console.error('Login redirect error:', e);
    }
  };

  const handleSignOutUser = () => {
    instance.logoutRedirect({
      postLogoutRedirectUri: "/",
    });
  };

  const decodeTokenManually = (token: string) => {
    try {
      const payload = token.split(".")[1]; // Get the payload (second part)
      const decoded = JSON.parse(atob(payload)); // Base64 decode
      return decoded;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  const checkTokenExpiryAndLogout = (token: string) => {
    const decodedToken = decodeTokenManually(token);

    if (decodedToken) {
      const expiryTime = decodedToken.exp * 1000;
      const currentTime = Date.now();

      const logoutThreshold = expiryTime - 60000;

      const timeDifference = logoutThreshold - currentTime;

      if (timeDifference <= 0) {
        handleSignOutUser();
      }
    }
  };


  useEffect(() => {
    const handleRedirect = async () => {
      try {
        const response = await instance.handleRedirectPromise();
        if (response) {
          const accessToken = response.accessToken;

          localStorage.setItem("accessToken", accessToken);
          checkTokenExpiryAndLogout(accessToken);

          const intervalId = setInterval(() => {
            checkTokenExpiryAndLogout(accessToken);
          }, 60000);

          return () => clearInterval(intervalId);
        }
      } catch (error) {
        console.error("Error handling redirect response", error);
      }
    };

    // Call the function to handle the redirect response
    handleRedirect();
  }, []);

  useEffect(() => {
    if (accounts.length > 0) {
      const account = accounts[0];
      setEmail(account.username as string);
      setName(account.idTokenClaims?.given_name as string | undefined);
    }
  }, [accounts]);

  return (
    <AuthContext.Provider
      value={{
        name,
        email,
        accounts,
        isAuthenticated,
        signInUser: handleSignInUser,
        signOutUser: handleSignOutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
