// Centralized token configuration helpers handling Storage and Cookies

const TOKEN_KEY = "flameintel_token";


export const setAuthToken = (token: string): void => {
  if (typeof window !== "undefined") {
    
    localStorage.setItem(TOKEN_KEY, token);
   
    const maxAge = 7 * 24 * 60 * 60; 
    document.cookie = `${TOKEN_KEY}=${token}; path=/; max-age=${maxAge}; SameSite=Lax; Secure`;
  }
};


export const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
};


export const logoutUser = (): void => {
  if (typeof window !== "undefined") {
   
    localStorage.removeItem(TOKEN_KEY);

    document.cookie = `${TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax; Secure`;

    window.location.href = "/";
  }
};
