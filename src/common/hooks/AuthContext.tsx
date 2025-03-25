// React Dependancies
import { createContext, useContext, ReactNode, useEffect, useState } from 'react';

// Azure
import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import { InteractionStatus } from '@azure/msal-browser';

import { loginRequest } from '../../config/auth';

interface AuthContextType {
  accounts: any;
  name: string | undefined;
  email: string | undefined;
  jobTitle: string | undefined;
  newUser: boolean;
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
  const [jobTitle, setJobTitle] = useState<string>();
  const [newUser, setNewUser] = useState<boolean>(false);

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


  useEffect(() => {
    if (accounts.length > 0) {
      const account = accounts[0];
      console.log('account', account);
      setEmail(account.username as string);
      setName(account.idTokenClaims?.given_name as string | undefined);
      setJobTitle(account.idTokenClaims?.jobTitle?.toString());
      setNewUser(account.idTokenClaims?.newUser ? true : false);
    }
  }, [accounts]);

  return (
    <AuthContext.Provider
      value={{
        name,
        email,
        jobTitle,
        newUser,
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
