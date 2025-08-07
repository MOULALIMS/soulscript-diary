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

export const createUser = async (
  email: string,
  password: string,
  displayName: string,
  phone?: string
): Promise<User> => {
  const allowedEmail = process.env.NEXT_PUBLIC_ALLOWED_EMAIL;

  if (email !== allowedEmail) {
    throw new Error("Email is not accepted due to restrictions.");
  }
  // 🚫 Block all signups explicitly
  throw new Error(
    "Account creation is restricted. Please sign in if you already have access."
  );

  /*
  // Check if the user already exists
  try {
    await signInWithEmailAndPassword(auth, email, password);
    throw new Error("Email already exists. Please sign in.");
  } catch (error: any) {

    if (error.code === "auth/user-not-found") {
       Proceed to create new user
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await updateProfile(user, { displayName });

      const userProfile: UserProfile = {
        uid: user.uid,
        email: user.email!,
        phoneNumber: phone || null,
        plan: "free",
        displayName:
          user.displayName || displayName || "User" + user.uid.slice(0, 6),
        createdAt: new Date(),
        preferences: {
          theme: "light",
          reminderTime: "20:00",
          enableReminders: true,
        },
      };

      await setDoc(doc(db, "users", user.uid), userProfile);
      return user;
    } else {
      throw error;*/
};

export const signInUser = async (
  email: string,
  password: string
): Promise<User> => {
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  return user;
};

export const signOutUser = async (): Promise<void> => {
  await signOut(auth);
};

export const resetPassword = async (email: string): Promise<void> => {
  await sendPasswordResetEmail(auth, email);
};

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
