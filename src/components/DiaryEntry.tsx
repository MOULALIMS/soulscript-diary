import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db, auth } from "@/utils/firebase";
import { Button } from "./Button";

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function generateSalt(length = 16): string {
  const array = new Uint8Array(length);
  window.crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...Array.from(array)));
}

async function deriveKey(
  password: string,
  saltB64: string
): Promise<CryptoKey> {
  const salt = Uint8Array.from(atob(saltB64), (c) => c.charCodeAt(0));
  const baseKey = await window.crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveKey"]
  );
  return window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

async function encrypt(content: string, key: CryptoKey): Promise<string> {
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoder.encode(content)
  );
  return `${btoa(String.fromCharCode(...Array.from(iv)))}:${btoa(
    String.fromCharCode(...Array.from(new Uint8Array(encrypted)))
  )}`;
}

async function decrypt(ciphertext: string, key: CryptoKey): Promise<string> {
  const [ivB64, dataB64] = ciphertext.split(":");
  const iv = Uint8Array.from(atob(ivB64), (c) => c.charCodeAt(0));
  const data = Uint8Array.from(atob(dataB64), (c) => c.charCodeAt(0));
  const decrypted = await window.crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    data
  );
  return decoder.decode(decrypted);
}

interface DiaryEntryData {
  id: string;
  userId: string;
  encryptedContent: string;
  createdAt: any; // Firestore timestamp
  salt: string;
  decryptedContent?: string;
  images?: string[];
  tags?: string[];
}

const DiaryEntry: React.FC = () => {
  const user = auth.currentUser;
  const [password, setPassword] = useState("");
  const [key, setKey] = useState<CryptoKey | null>(null);
  const [salt, setSalt] = useState("");
  const [text, setText] = useState("");
  const [entries, setEntries] = useState<DiaryEntryData[]>([]);
  const [loading, setLoading] = useState(false);

  // Derive key on password input
  useEffect(() => {
    async function derive() {
      if (!password) {
        setKey(null);
        return;
      }

      let localSalt = localStorage.getItem("encryptionSalt");
      if (!localSalt) {
        localSalt = generateSalt();
        localStorage.setItem("encryptionSalt", localSalt);
      }
      setSalt(localSalt);
      try {
        const derived = await deriveKey(password, localSalt);
        setKey(derived);
      } catch {
        setKey(null);
      }
    }
    derive();
  }, [password]);

  // Real-time fetch entries, decrypt with key
  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "diaryEntries"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      if (!key) {
        setEntries([]);
        return;
      }
      const decrypted = await Promise.all(
        snapshot.docs.map(async (doc) => {
          const data = doc.data() as DiaryEntryData;
          let decryptedContent = "[Decryption failed]";
          try {
            decryptedContent = await decrypt(data.encryptedContent, key);
          } catch {}
          return {
            ...data,
            id: doc.id,
            decryptedContent,
          };
        })
      );
      setEntries(decrypted);
    });

    return () => unsubscribe();
  }, [user, key]);

  // Save new encrypted entry
  async function saveEntry() {
    if (!key || !text.trim() || !user) return;
    setLoading(true);
    try {
      const encryptedContent = await encrypt(text.trim(), key);
      await addDoc(collection(db, "diaryEntries"), {
        userId: user.uid,
        encryptedContent,
        createdAt: serverTimestamp(),
        salt,
      });
      setText("");
      alert("Diary saved (encrypted) successfully!");
    } catch (err) {
      alert("Failed to save diary: " + (err as Error).message);
    }
    setLoading(false);
  }

  if (!user) {
    return (
      <p className="text-center p-4" style={{ color: "var(--color-text)" }}>
        You must be logged in to view and add entries.
      </p>
    );
  }

  return (
    <div
      className="max-w-3xl mx-auto p-4"
      style={{ color: "var(--color-text)" }}
    >
      <h2 className="text-2xl font-bold mb-4">Your Encrypted Diary</h2>

      <label className="block mb-2" style={{ color: "var(--color-text)" }}>
        Enter your password to decrypt and add entries:
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Your diary password"
          className="w-full border rounded px-3 py-2 mt-1"
          style={{
            backgroundColor: "var(--color-surface)",
            color: "var(--color-text)",
            borderColor: "var(--color-background)",
          }}
          autoComplete="off"
        />
      </label>

      {!key && password && (
        <p className="text-red-600 mb-4">
          Unable to derive key. Please check your password.
        </p>
      )}

      <textarea
        className="w-full border rounded p-3 mb-4 resize-none"
        placeholder="Write your diary entry here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={!key || loading}
        style={{
          backgroundColor: "var(--color-surface)",
          color: "var(--color-text)",
          borderColor: "var(--color-background)",
        }}
      />

      <Button onClick={saveEntry} disabled={loading || !text.trim() || !key}>
        {loading ? "Saving..." : "Save Entry"}
      </Button>

      <hr className="my-8" />

      <h3 className="text-xl font-semibold mb-2">Previous Entries</h3>

      {entries.length === 0 ? (
        <p style={{ color: "var(--color-text)" }}>
          No entries found or please enter the correct password.
        </p>
      ) : (
        <div className="space-y-4">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="border rounded p-4"
              style={{
                backgroundColor: "var(--color-surface)",
                borderColor: "var(--color-background)",
                color: "var(--color-text)",
              }}
            >
              <div
                className="text-xs mb-2"
                style={{ color: "var(--color-text)", opacity: 0.6 }}
              >
                {entry.createdAt?.toDate?.()
                  ? entry.createdAt.toDate().toLocaleString()
                  : ""}
              </div>
              <pre>{entry.decryptedContent}</pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DiaryEntry;
