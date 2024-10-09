import { loginRequest } from '../../config/auth';
import { InteractionStatus, IPublicClientApplication, AccountInfo } from '@azure/msal-browser';



export const signInUser = async (
  instance: IPublicClientApplication, 
  inProgress: InteractionStatus, 
  isAuthenticated: boolean
) => {
  try {
    if (inProgress === InteractionStatus.None && !isAuthenticated) {
      await instance.loginRedirect(loginRequest);
    }
  } catch (e) {
    console.error('Login redirect error:', e);
  }
};

export const signOutUser = (
  instance: IPublicClientApplication, 
  postLogoutRedirectUri: string = "/"
): void => {
  instance.logoutRedirect({
    postLogoutRedirectUri: postLogoutRedirectUri,
  });
};


interface AccountDetails {
  email: string;
  name: string | any;
}


export const getUserDetailsFromMsal = (accounts: AccountInfo[]): AccountDetails => {
  if (accounts.length > 0) {
    const account = accounts[0];

    return {
      email: account.username, 
      name: account.idTokenClaims?.given_name || '', 
    };
  }
  return {
    email: '',
    name: '',
  };
};