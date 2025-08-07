import React from "react";

const AboutPage: React.FC = () => {
  return (
    <main
      className="min-h-screen px-4 py-16 max-w-4xl mx-auto prose prose-lg"
      style={{
        backgroundColor: "var(--color-background)",
        color: "var(--color-text)",
      }}
    >
      <h1>About YourDiary</h1>
      <p>
        YourDiary is a smart, private diary platform designed to help you
        capture your thoughts and track your moods daily. With powerful AI
        insights and secure cloud synchronization, your emotional journey has
        never been easier to understand and improve.
      </p>
      <p>
        Our goal is to provide a distraction-free, beautiful writing experience
        that keeps your data private and safe. Whether you want to reflect,
        track moods, or get personalized insights, YourDiary is built with your
        mental wellness in mind.
      </p>
      <h2>Features</h2>
      <ul>
        <li>End-to-end encryption to keep your entries safe</li>
        <li>AI-powered mood analysis and insights</li>
        <li>Beautiful mood tracking with interactive charts</li>
        <li>Cross-platform syncing across your devices</li>
        <li>Intuitive calendar view to navigate your memories</li>
      </ul>
      <p>
        Start your journaling journey today, and take control of your emotional
        wellbeing one entry at a time.
      </p>
    </main>
  );
};

export default AboutPage;
