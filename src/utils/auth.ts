import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

export interface UserProfile {
  uid: string;
  email: string;
  phoneNumber: string | null;
  displayName: string;
  createdAt: Date;
  plan: "free" | "premium";
  preferences: {
    theme: "light" | "dark" | "auto";
    reminderTime: string;
    enableReminders: boolean;
  };
}

// ✅ Check if the email exists in allowed_users by document ID
const isEmailAllowed = async (email: string): Promise<boolean> => {
  const lowerEmail = email.toLowerCase(); // avoid case mismatch
  const docRef = doc(db, "allowed_user", lowerEmail);
  const snapshot = await getDoc(docRef);
  return snapshot.exists();
};

// ✅ Create User - only if email is in allowed_users
export const createUser = async (
  email: string,
  password: string,
  displayName: string,
  phone?: string
): Promise<User> => {
  const allowed = await isEmailAllowed(email);
  if (!allowed) {
    throw new Error("Access Denied: Only invited members can sign up.");
  }

  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(user, { displayName });

  const userProfile: UserProfile = {
    uid: user.uid,
    email: user.email!,
    phoneNumber: phone || null,
    displayName:
      user.displayName || displayName || "User" + user.uid.slice(0, 6),
    createdAt: new Date(),
    plan: "free",
    preferences: {
      theme: "light",
      reminderTime: "20:00",
      enableReminders: true,
    },
  };

  await setDoc(doc(db, "users", user.uid), userProfile);

  return user;
};

// ✅ Sign In User - only if email is allowed
export const signInUser = async (
  email: string,
  password: string
): Promise<User> => {
  const allowed = await isEmailAllowed(email);
  if (!allowed) {
    throw new Error("Access Denied: This email is not authorized.");
  }

  const { user } = await signInWithEmailAndPassword(auth, email, password);
  return user;
};

// ✅ Sign Out
export const signOutUser = async (): Promise<void> => {
  await signOut(auth);
};

// ✅ Password Reset
export const resetPassword = async (email: string): Promise<void> => {
  await sendPasswordResetEmail(auth, email);
};

// ✅ Get User Profile
export const getUserProfile = async (
  uid: string
): Promise<UserProfile | null> => {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data() as UserProfile;
  }

  return null;
};
