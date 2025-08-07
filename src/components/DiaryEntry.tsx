// DiaryEntry.tsx
import React, { useState, useEffect, useRef } from "react";
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
import { MicrophoneIcon, StopIcon } from "@heroicons/react/outline";

const encoder = new TextEncoder();
const decoder = new TextDecoder();

declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

type SpeechRecognitionEvent = Event & {
  results: SpeechRecognitionResultList;
};
type SpeechRecognitionErrorEvent = Event & {
  error: string;
};

const SpeechRecognition = (window.SpeechRecognition ||
  window.webkitSpeechRecognition) as any;

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
  return (
    btoa(String.fromCharCode(...Array.from(iv))) +
    ":" +
    btoa(String.fromCharCode(...Array.from(new Uint8Array(encrypted))))
  );
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
  createdAt: any;
  salt: string;
  decryptedContent?: string;
}

const DiaryEntry: React.FC = () => {
  const user = auth.currentUser;
  const [password, setPassword] = useState("");
  const [key, setKey] = useState<CryptoKey | null>(null);
  const [salt, setSalt] = useState("");
  const [text, setText] = useState("");
  const [entries, setEntries] = useState<DiaryEntryData[]>([]);
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [speechText, setSpeechText] = useState("");
  const recognitionRef = useRef<any>(null);

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
          return { ...data, id: doc.id, decryptedContent };
        })
      );
      setEntries(decrypted);
    });

    return () => unsubscribe();
  }, [user, key]);

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
    } catch (err) {
      alert("Failed to save diary: " + (err as Error).message);
    }
    setLoading(false);
  }

  // Speech input handlers
  function startRecording() {
    if (!SpeechRecognition) {
      alert("Your browser does not support Speech Recognition.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.continuous = false;
    recognition.lang = "en-US";
    recognition.interimResults = false;

    const stopId = setTimeout(() => recognition.stop(), 30_000);

    recognition.onstart = () => setIsRecording(true);
    recognition.onerror = (e: SpeechRecognitionErrorEvent) => {
      alert("Speech recognition error: " + e.error);
      clearTimeout(stopId);
      setIsRecording(false);
    };
    recognition.onend = () => {
      clearTimeout(stopId);
      setIsRecording(false);
    };
    recognition.onresult = (e: SpeechRecognitionEvent) => {
      const transcript = Array.from(e.results)
        .map((r) => r[0].transcript)
        .join("");
      setSpeechText(transcript);
      setText((t) => t + " " + transcript);
    };
    recognition.start();
  }
  function stopRecording() {
    recognitionRef.current?.abort();
    recognitionRef.current = null;
    setIsRecording(false);
  }

  if (!user) {
    return (
      <p className="text-center p-4 text-[var(--color-text)]">
        You must be logged in to view and add entries.
      </p>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 text-[var(--color-text)]">
      <h2 className="text-2xl font-bold mb-4">Your Encrypted Diary</h2>

      <label className="block mb-2">
        Enter your password to decrypt and add entries:
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Your diary password"
          className="
            w-full border rounded px-3 py-2 mt-1
            bg-[var(--color-surface)]
            text-[var(--color-text)]
            border-[var(--color-background)]
          "
          autoComplete="off"
        />
      </label>

      {!key && password && (
        <p className="text-red-600 mb-4">
          Unable to derive key. Please check your password.
        </p>
      )}

      <div className="relative mb-4 overflow-visible">
        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            e.target.style.height = "auto";
            e.target.style.height = `${e.target.scrollHeight}px`;
          }}
          placeholder="Write your diary entry..."
          disabled={!key || loading}
          rows={1}
          className="
            w-full border rounded p-3 pr-12 resize-none
            bg-[var(--color-surface)]
            text-[var(--color-text)]
            border-[var(--color-background)]
          "
        />

        <button
          type="button"
          onClick={isRecording ? stopRecording : startRecording}
          disabled={!key}
          className={`
            absolute top-2 right-2 z-10 p-2 rounded-full bg-white border
            ${
              isRecording
                ? "border-green-500 text-green-500 animate-pulse"
                : "border-gray-300 text-gray-500 hover:text-gray-700"
            }
          `}
          title={isRecording ? "Stop Recording" : "Start Voice Input"}
        >
          {isRecording ? (
            <StopIcon className="h-6 w-6" />
          ) : (
            <MicrophoneIcon className="h-6 w-6" />
          )}
        </button>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <Button onClick={saveEntry} disabled={loading || !text.trim() || !key}>
          {loading ? "Saving..." : "Save Entry"}
        </Button>
        <Button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={!key}
          className={isRecording ? "animate-pulse border-green-500" : ""}
        >
          {isRecording ? (
            <StopIcon className="inline h-5 w-5 mr-2" />
          ) : (
            <MicrophoneIcon className="inline h-5 w-5 mr-2" />
          )}
          {isRecording ? "Listening..." : "Start Voice Input"}
        </Button>
      </div>

      {speechText && (
        <p className="text-sm italic text-green-500 mb-2">
          Transcribed: {speechText}
        </p>
      )}

      <hr className="my-8 border-[var(--color-background)]" />

      <h3 className="text-xl font-semibold mb-2">Previous Entries</h3>
      {entries.length === 0 ? (
        <p>No entries found or please enter the correct password.</p>
      ) : (
        <div className="space-y-4">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="
                border rounded p-4
                bg-[var(--color-surface)]
                border-[var(--color-background)]
                text-[var(--color-text)]
              "
            >
              <div className="text-xs mb-2 opacity-60">
                {entry.createdAt?.toDate
                  ? new Date(entry.createdAt.toDate()).toLocaleString()
                  : "Unknown date"}
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
