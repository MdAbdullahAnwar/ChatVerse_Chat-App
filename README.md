# 💬 ChatVerse

Welcome to **ChatVerse**, a beautifully designed real-time chat application powered by **React** and **Firebase**. With a modern UI and powerful chat features, ChatVerse lets you connect, chat, and share moments with your friends effortlessly.

---

## 🌐 Live Demo

👉 [Click here to try ChatVerse](https://chat-verse-chat-app.vercel.app/)  

---

## 🔧 Tech Stack

- **Frontend**: React.js  
- **Styling**: CSS  
- **Backend as a Service**: Firebase (Auth & Firestore)  
- **State Management**: Zustand  
- **Media Uploads**: ImgBB for image hosting, Dropbox API for voice note storage  
- **Media Handling**: Custom camera and audio modals  
- **Scrolling**: `react-perfect-scrollbar`  
- **UI Enhancements**: Toast notifications, modals, emoji picker  
- **Deployment**: Hosted on Vercel for fast and reliable CI/CD  
- **Version Control**: Git + GitHub  

---

## 🚀 Features

### 🔐 Authentication

- **Sign Up**
  - Avatar upload (optional; default avatar applied if not provided)
  - Username, Email, and Password fields
  - Toast feedback for success or failure (via Firebase Auth)

- **Sign In**
  - Login using Email and Password
  - Welcome message and toast notifications

---

### 💬 Beautiful Chat Interface

- Three-panel layout for optimal messaging experience
- Elegant UI with smooth animations
- Perfect Scrollbar for seamless navigation

---

### 👥 User Management

- Edit profile with updated username, bio, and profile picture
- Search and add new friends by username
- Friend list displays last message preview
- Clear indicators for message type (text, photo, or 📎 attachment)

---

### ✨ Rich Messaging Features

- Real-time text messaging
- Image sharing from gallery or camera
- Voice notes with recording functionality
- Emoji support using Emoji Picker
- Delete individual messages
- Clear entire chat history

---

### 📸 Media Management

- Shared photos section with collapsible view
- Instant camera integration to take and send photos
- Scrollable shared photo history using Perfect Scrollbar
- Download any shared image

---

### ⚙️ Advanced Controls

- Block/unblock users with real-time UI updates
- Profile editing with immediate state reflection
- Secure logout functionality

---

## 💡 App Layout

ChatVerse features a clean, three-section layout:

---

### 1. 📜 ChatList (Left Sidebar)

- **User Info Panel**
  - Shows current user's avatar and username
  - ✏️ **Edit Profile** icon opens modal to change avatar, username, and bio

- **Friend Discovery**
  - 🔍 Search bar to filter friends
  - ➕ Add User modal to search and add new friends
  - Friend list with avatar, name, and last message:
    - Text: displays actual text
    - Image: shown as 📎 **Attachment**

- Smooth scrolling experience powered by Perfect Scrollbar

---

### 2. 💬 Chat Window (Middle Section)

- **Top Bar**
  - Displays friend's avatar, username, and bio
  - Clear Chat button removes the conversation history

- **Messages Area**
  - Supports:
    - ✅ Text messages
    - ✅ Emojis (via Emoji Picker)
    - ✅ Gallery image sharing
    - ✅ Camera capture and send
    - ✅ Voice notes
    - ✅ Timestamps for all messages
    - ✅ Delete individual messages

- **Action Bar**
  - 🖼️ Image upload icon
  - 📸 Open camera modal
  - 🎤 Record and send voice note
  - 😀 Insert emojis
  - ✉️ Send button to deliver the message

---

### 3. ℹ️ Detail Panel (Right Sidebar)

- **Friend Info**
  - Friend's avatar, name, and bio

- **Shared Photos**
  - Toggleable gallery showing shared images
  - Latest images at the top
  - Scrollable with Perfect Scrollbar
  - Download buttons for each photo

- **Controls**
  - **Block User** button disables messaging for both users
    - UI updates input field and disables send button
    - Also restricts friend from sending you messages or viewing your avatar
  - **Unblock User** to restore messaging functionality
  - **Logout** to securely sign out and return to login/signup screen

---

## 📁 Folder Structure

```
src/
├── components/
│   ├── chat/
│   │   ├── CameraComponent.css
│   │   ├── CameraComponent.jsx
│   │   ├── Chat.css
│   │   ├── Chat.jsx
│   │   ├── VoiceRecorder.css
│   │   ├── VoiceRecorder.jsx
│   ├── detail/
│   │   ├── Detail.css
│   │   ├── Detail.jsx
│   ├── list/
│   │   ├── chatList/
│   │   │   ├── addUser/
│   │   │   │   ├── AddUser.css
│   │   │   │   ├── AddUser.jsx
│   │   │   ├── ChatList.css
│   │   │   ├── ChatList.jsx
│   │   ├── userInfo/
│   │   │   ├── Userinfo.css
│   │   │   ├── Userinfo.jsx
│   │   ├── List.css
│   │   ├── List.jsx
│   ├── login/
│   │   ├── Login.css
│   │   ├── Login.jsx
│   ├── notification/
│   │   ├── Notification.jsx
├── lib/
│   ├── chatStore.js
│   ├── dropboxUpload.js
│   ├── firebase.js
│   ├── upload.js
│   ├── userStore.js
├── App.jsx
├── index.css
├── main.jsx
```

---

## 🧠 Future Enhancements

- Responsive design for mobile and tablet
- Real-time typing indicators
- Online/offline status indicators
- Group chats and media previews
- Dark mode support

---

## 🧑‍💻 Author

Made with 💙 by **MD Abdullah Anwar**  
Feel free to contribute or reach out!

---

## 📄 License

This project is licensed under the **MIT License**.

---