import { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import { loginRequest } from '../../config/auth';
import { InteractionStatus} from '@azure/msal-browser';
 
 
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
 
  useEffect(() => {
    if (accounts.length > 0) {
      const account = accounts[0];
      setEmail(account.username as string);
      setName(account.idTokenClaims?.given_name as string | undefined);
    }
  }, [accounts]);
 
 
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
 