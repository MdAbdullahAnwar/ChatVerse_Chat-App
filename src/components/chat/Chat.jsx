import React, { useEffect, useRef, useState } from "react";
import EmojiPicker from "emoji-picker-react";
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
import "./Chat.css";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useChatStore } from "../../lib/chatStore";
import { useUserStore } from "../../lib/userStore";
import upload from "../../lib/upload";
import CameraComponent from "./CameraComponent";
import VoiceRecorder from "./VoiceRecorder";

const Chat = () => {
  const [chat, setChat] = useState();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [img, setImg] = useState({
    file: null,
    url: "",
  });
  const [showCamera, setShowCamera] = useState(false);
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);

  const { currentUser } = useUserStore();
  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } =
    useChatStore();

  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chat?.messages, img.url]);

  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
      setChat(res.data());
    });
    return () => {
      unSub();
    };
  }, [chatId]);

  const handleEmoji = (e) => {
    setText((prev) => prev + e.emoji);
    setOpen(false);
  };

  const handleImg = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setImg({ file, url: previewUrl });

    try {
      const imgUrl = await upload(file);

      if (!imgUrl) throw new Error("No image URL returned");

      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: currentUser.id,
          text: "",
          createdAt: new Date(),
          img: imgUrl,
        }),
      });

      const userIDs = [currentUser.id, user.id];
      for (const id of userIDs) {
        const userChatsRef = doc(db, "userchats", id);
        const snapshot = await getDoc(userChatsRef);
        if (!snapshot.exists()) continue;

        const userChatsData = snapshot.data();
        const chatIndex = userChatsData.chats.findIndex(
          (c) => c.chatId === chatId
        );
        if (chatIndex !== -1) {
          userChatsData.chats[chatIndex].lastMessage = "📷 Photo";
          userChatsData.chats[chatIndex].isSeen = id === currentUser.id;
          userChatsData.chats[chatIndex].updatedAt = Date.now();

          await updateDoc(userChatsRef, {
            chats: userChatsData.chats,
          });
        }
      }

      setImg({ file: null, url: "" });
    } catch (error) {
      console.error("Image send failed:", error.message);
      alert("Image upload failed. Try again.");
    }
  };

  const handleSend = async () => {
    if (text.trim() === "" && !img.file) return;

    let imgUrl = null;

    try {
      if (img.file) {
        imgUrl = await upload(img.file);
      }

      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: currentUser.id,
          text: text.trim(),
          createdAt: new Date(),
          ...(imgUrl && { img: imgUrl }),
        }),
      });

      const lastMsg = imgUrl ? "📷 Photo" : text;

      const userIDs = [currentUser.id, user.id];

      userIDs.forEach(async (id) => {
        const userChatsRef = doc(db, "userchats", id);
        const userChatsSnapshot = await getDoc(userChatsRef);

        if (userChatsSnapshot.exists()) {
          const userChatsData = userChatsSnapshot.data();

          const chatIndex = userChatsData.chats.findIndex(
            (c) => c.chatId === chatId
          );

          if (chatIndex !== -1) {
            userChatsData.chats[chatIndex].lastMessage = lastMsg;
            userChatsData.chats[chatIndex].isSeen = id === currentUser.id;
            userChatsData.chats[chatIndex].updatedAt = Date.now();

            await updateDoc(userChatsRef, {
              chats: userChatsData.chats,
            });
          }
        }
      });
    } catch (err) {
      console.error("Send error:", err);
    }

    setImg({ file: null, url: "" });
    setText("");
  };

  const handleSendCameraPhoto = async (imgUrl) => {
    try {
      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: currentUser.id,
          text: "",
          createdAt: new Date(),
          img: imgUrl,
        }),
      });

      const userIDs = [currentUser.id, user.id];
      for (const id of userIDs) {
        const userChatsRef = doc(db, "userchats", id);
        const snapshot = await getDoc(userChatsRef);
        if (!snapshot.exists()) continue;

        const userChatsData = snapshot.data();
        const chatIndex = userChatsData.chats.findIndex(
          (c) => c.chatId === chatId
        );
        if (chatIndex !== -1) {
          userChatsData.chats[chatIndex].lastMessage = "📷 Photo";
          userChatsData.chats[chatIndex].isSeen = id === currentUser.id;
          userChatsData.chats[chatIndex].updatedAt = Date.now();

          await updateDoc(userChatsRef, {
            chats: userChatsData.chats,
          });
        }
      }
    } catch (error) {
      console.error("Error sending camera photo:", error);
      throw error;
    }
  };

  const handleSendVoiceNote = async (audioUrl) => {
    try {
      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: currentUser.id,
          text: "",
          createdAt: new Date(),
          audio: audioUrl,
        }),
      });

      const userIDs = [currentUser.id, user.id];
      for (const id of userIDs) {
        const userChatsRef = doc(db, "userchats", id);
        const snapshot = await getDoc(userChatsRef);
        if (!snapshot.exists()) continue;

        const userChatsData = snapshot.data();
        const chatIndex = userChatsData.chats.findIndex(
          (c) => c.chatId === chatId
        );
        if (chatIndex !== -1) {
          userChatsData.chats[chatIndex].lastMessage = "🎤 Voice note";
          userChatsData.chats[chatIndex].isSeen = id === currentUser.id;
          userChatsData.chats[chatIndex].updatedAt = Date.now();

          await updateDoc(userChatsRef, {
            chats: userChatsData.chats,
          });
        }
      }
    } catch (error) {
      console.error("Error sending voice note:", error);
      throw error;
    }
  };

  return (
    <div className="chat">
      <div className="top">
        <div className="user">
          <img src={user?.avatar || "./avatar.png"} alt="" />
          <div className="texts">
            <span>{user?.username}</span>
            <p>{user?.bio || "Hey, I am using ChatVerse"}</p>
          </div>
        </div>
        <div className="icons">
          <img src="./phone.png" alt="" />
          <img src="./video.png" alt="" />
          <img src="./info.png" alt="" />
        </div>
      </div>

      {showCamera && (
        <CameraComponent
          onSendPhoto={handleSendCameraPhoto}
          onClose={() => setShowCamera(false)}
          currentUser={currentUser}
          chatId={chatId}
          user={user}
        />
      )}

      <PerfectScrollbar
        containerRef={(ref) => (scrollRef.current = ref)}
        options={{
          suppressScrollX: true,
          wheelSpeed: 0.3,
          swipeEasing: true,
          minScrollbarLength: 20,
        }}
      >
        <div className="center">
          {chat?.messages?.map((message) => (
            <div
              className={
                message.senderId === currentUser?.id ? "message own" : "message"
              }
              key={message.createdAt?.seconds || Math.random()}
            >
              <div className="texts">
                {message.img && <img src={message.img} alt="" />}
                {message.audio && (
                  <audio controls className="audio-message">
                    <source src={message.audio} type="audio/mp3" />
                    <source src={message.audio} type="audio/webm" />
                    Your browser doesn't support audio playback
                  </audio>
                )}
                {message.text && <p>{message.text}</p>}
                <span>
                  {message.createdAt?.seconds
                    ? new Date(
                        message.createdAt.seconds * 1000
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Sending..."}
                </span>
              </div>
            </div>
          ))}
          {img.url && (
            <div className="message own">
              <div className="texts">
                <img src={img.url} alt="" />
              </div>
            </div>
          )}
        </div>
      </PerfectScrollbar>

      <div className="bottom">
        <div className="icons">
          <label htmlFor="file">
            <img src="./img.png" alt="" />
          </label>
          <input
            type="file"
            id="file"
            style={{ display: "none" }}
            onChange={handleImg}
          />
          <img
            src="./camera.png"
            alt=""
            onClick={() => setShowCamera(true)}
            style={{ cursor: "pointer" }}
          />
          <img
            src="./mic.png"
            alt=""
            onClick={() => setShowVoiceRecorder(true)}
            style={{ cursor: "pointer" }}
          />
          {/* // Add this near your camera component render: */}
          {showVoiceRecorder && (
            <VoiceRecorder
              onSendVoiceNote={handleSendVoiceNote}
              onClose={() => setShowVoiceRecorder(false)}
            />
          )}
          {/* <img src="./mic.png" alt="" /> */}
        </div>
        <input
          type="text"
          placeholder={
            isCurrentUserBlocked || isReceiverBlocked
              ? "You cannot send a message"
              : "Type a message..."
          }
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isCurrentUserBlocked || isReceiverBlocked}
        />
        <div className="emoji">
          <img
            src="./emoji.png"
            alt=""
            onClick={() => setOpen((prev) => !prev)}
          />
          <div className="picker">
            <EmojiPicker open={open} onEmojiClick={handleEmoji} />
          </div>
        </div>
        <button
          className="sendButton"
          onClick={handleSend}
          disabled={isCurrentUserBlocked || isReceiverBlocked}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
