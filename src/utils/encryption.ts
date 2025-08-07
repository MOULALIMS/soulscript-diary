import CryptoJS from 'crypto-js';

const SECRET_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || 'your-secret-key-here';

export const encryptData = (text: string): string => {
  return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
};

export const decryptData = (ciphertext: string): string => {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Decryption failed:', error);
    return '';
  }
};

// Local storage with encryption
export const setEncryptedItem = (key: string, value: string): void => {
  const encrypted = encryptData(value);
  localStorage.setItem(key, encrypted);
};

export const getDecryptedItem = (key: string): string | null => {
  const encrypted = localStorage.getItem(key);
  if (!encrypted) return null;
  return decryptData(encrypted);
};

export const removeEncryptedItem = (key: string): void => {
  localStorage.removeItem(key);
};
