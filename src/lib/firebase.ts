import type {User} from 'firebase/auth';
export const auth = {signOut: async () => {}};
export const googleProvider = null;
export const initAuth = (_success?: (user: User, token: string) => void, failure?: () => void) => { failure?.(); return () => {}; };
export const googleSignIn = async (): Promise<{user: User; accessToken: string} | null> => {throw new Error('Google Drive is not connected. Upload an Excel file from your device.');};
export const getAccessToken = async (): Promise<string | null> => null;
export const setAccessToken = (_token: string | null) => {};
export const logout = async () => {};
