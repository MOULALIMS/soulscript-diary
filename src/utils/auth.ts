import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  User,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

// Type for user profile stored in Firestore
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

// 🔒 Check if the email exists in allowed_users collection
const isEmailAllowed = async (email: string): Promise<boolean> => {
  const allowedUserRef = doc(db, "allowed_users", email);
  const snapshot = await getDoc(allowedUserRef);
  return snapshot.exists(); // ✅ Email is allowed only if a doc exists with ID = email
};

// ✅ Sign up a user ONLY if allowed
export const createUser = async (
  email: string,
  password: string,
  displayName: string,
  phone?: string
): Promise<User> => {
  const allowed = await isEmailAllowed(email);
  if (!allowed) {
    throw new Error("Access denied: Only approved family members can sign up.");
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

// ✅ Sign in ONLY if email is in allowed_users
export const signInUser = async (
  email: string,
  password: string
): Promise<User> => {
  const allowed = await isEmailAllowed(email);
  if (!allowed) {
    throw new Error("Access denied: This email is not authorized to sign in.");
  }

  const { user } = await signInWithEmailAndPassword(auth, email, password);
  return user;
};

// 🔓 Sign out
export const signOutUser = async (): Promise<void> => {
  await signOut(auth);
};

// 🔁 Reset password (no check needed here)
export const resetPassword = async (email: string): Promise<void> => {
  await sendPasswordResetEmail(auth, email);
};

// 📄 Fetch user profile
export const getUserProfile = async (
  uid: string
): Promise<UserProfile | null> => {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);

  return docSnap.exists() ? (docSnap.data() as UserProfile) : null;
};
