# Smart Private Diary Platform 📔

A modern, secure, and intelligent digital diary platform built with Next.js, React, and Firebase. Features end-to-end encryption, AI-powered insights, and beautiful mood tracking.

## ✨ Features

### Core Features
- 📝 **Rich Text Journaling** - Write beautiful entries with formatting support
- 😌 **Mood Tracking** - Track your emotions with 8 different mood options
- 📅 **Calendar View** - Navigate through your memories easily
- 🔒 **End-to-End Encryption** - Your data is completely private and secure
- 📊 **Analytics & Insights** - AI-powered insights about your emotional patterns
- 🎨 **Multiple Themes** - Choose from Light, Dark, Vintage, and Minimal themes

### Advanced Features
- 🌟 **Streak Tracking** - Maintain your journaling habit
- 🏷️ **Tags & Organization** - Organize entries with custom tags
- 📱 **Responsive Design** - Works perfectly on all devices
- ☁️ **Cloud Sync** - Your entries sync across all your devices
- 📈 **Mood Analytics** - Visualize your emotional journey over time
- 💡 **Daily Reminders** - Never miss a journaling session

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Storage**: Firebase Storage
- **Encryption**: CryptoJS (AES-256)
- **Charts**: Recharts
- **Rich Text**: React Quill
- **UI Components**: Headless UI, Heroicons

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Firebase project with Firestore and Authentication enabled

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd smart-diary-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com)
   - Enable Authentication (Email/Password)
   - Enable Firestore Database
   - Enable Storage
   - Copy your Firebase configuration

4. **Environment Variables**
   - Copy `.env.example` to `.env.local`
   - Add your Firebase configuration
   - Generate a secure encryption key

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Visit [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Firebase Setup

1. **Authentication Rules**
   Enable Email/Password authentication in Firebase Console.

2. **Firestore Security Rules**
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Users can only access their own data
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }

       // Entries are private to each user
       match /entries/{document} {
         allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
         allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
       }
     }
   }
   ```

3. **Storage Rules**
   ```javascript
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /users/{userId}/{allPaths=**} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
     }
   }
   ```

### Environment Variables

Create a `.env.local` file with your Firebase configuration:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_ENCRYPTION_KEY=your_secure_encryption_key
```

## 📱 Features in Detail

### Security & Privacy
- **End-to-End Encryption**: All diary entries are encrypted before storage
- **Local Encryption**: Sensitive data is encrypted in local storage
- **Firebase Security Rules**: Server-side protection of user data
- **No Data Mining**: Your personal thoughts are never analyzed or sold

### Mood Tracking
- 8 different mood options with emojis
- Historical mood visualization
- Mood-based insights and patterns
- Weekly and monthly mood trends

### AI Insights
- Pattern recognition in your writing
- Emotional trend analysis
- Personalized recommendations
- Habit tracking and streak analysis

### User Experience
- Clean, distraction-free writing interface
- Multiple beautiful themes
- Responsive design for all devices
- Offline support with sync when online

## 🎨 Themes

The app includes 4 beautiful themes:

1. **Light & Bright** - Clean and fresh for daily writing
2. **Dark & Cozy** - Easy on the eyes for evening journaling  
3. **Vintage Paper** - Classic notebook feel
4. **Minimal Focus** - Distraction-free writing experience

## 📊 Monetization

The app follows a freemium model:

### Free Plan (₹0)
- Unlimited entries
- Basic mood tracking
- Calendar view
- Local storage
- Basic themes

### Premium Plan (₹79/month)
- AI mood insights
- Cloud sync & backup
- Advanced themes
- Export to PDF
- Priority support
- Advanced analytics

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy with automatic CI/CD

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- DigitalOcean App Platform
- Railway

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and commit: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Firebase for backend infrastructure
- Tailwind CSS for styling
- React ecosystem for UI components
- The open-source community

## 💬 Support

For support, questions, or feedback:
- Open an issue on GitHub
- Contact: your-email@example.com

---

**Built with ❤️ for mental health and self-reflection**
