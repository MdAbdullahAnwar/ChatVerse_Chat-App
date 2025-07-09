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
  const [img, setImg] = useState({ file: null, url: "" });
  const [showCamera, setShowCamera] = useState(false);
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const [hoveredMsgId, setHoveredMsgId] = useState(null);

  const { currentUser } = useUserStore();
  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } = useChatStore();

  const scrollRef = useRef(null);

  useEffect(() => {
    if (!chatId) return;
    const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
      setChat(res.data());
    });
    return () => unSub();
  }, [chatId]);

  useEffect(() => {
    scrollRef.current?.scrollTo?.(0, scrollRef.current.scrollHeight);
  }, [chat?.messagesByUser?.[currentUser?.id], img.url]);

  const handleEmoji = (e) => {
    setText((prev) => prev + e.emoji);
    setOpen(false);
  };

  const updateLastMessage = async (newMessage) => {
    const userChatsRef = doc(db, "userchats", currentUser.id);
    const receiverChatsRef = doc(db, "userchats", user.id);

    const [userChatsSnap, receiverChatsSnap] = await Promise.all([
      getDoc(userChatsRef),
      getDoc(receiverChatsRef),
    ]);

    if (!userChatsSnap.exists() || !receiverChatsSnap.exists()) return;

    const updateChatArray = (chats, isSender) =>
      chats.map((c) =>
        c.chatId === chatId
          ? {
              ...c,
              lastMessage: newMessage.text || "📎 Attachment",
              updatedAt: Date.now(),
              isSeen: isSender,
            }
          : c
      );

    await Promise.all([
      updateDoc(userChatsRef, {
        chats: updateChatArray(userChatsSnap.data().chats, true),
      }),
      updateDoc(receiverChatsRef, {
        chats: updateChatArray(receiverChatsSnap.data().chats, false),
      }),
    ]);
  };

  const handleImg = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setImg({ file, url: previewUrl });

    try {
      const imgUrl = await upload(file);
      const msg = {
        senderId: currentUser.id,
        text: "",
        createdAt: new Date(),
        img: imgUrl,
      };

      await updateDoc(doc(db, "chats", chatId), {
        [`messagesByUser.${currentUser.id}`]: arrayUnion(msg),
        [`messagesByUser.${user.id}`]: arrayUnion(msg),
      });

      await updateLastMessage(msg);
      setImg({ file: null, url: "" });
    } catch (err) {
      console.error("Image send error:", err);
    }
  };

  const handleSend = async () => {
    if (text.trim() === "" && !img.file) return;

    let imgUrl = null;
    if (img.file) imgUrl = await upload(img.file);

    const newMessage = {
      senderId: currentUser.id,
      text: text.trim(),
      createdAt: new Date(),
      ...(imgUrl && { img: imgUrl }),
    };

    try {
      await updateDoc(doc(db, "chats", chatId), {
        [`messagesByUser.${currentUser.id}`]: arrayUnion(newMessage),
        [`messagesByUser.${user.id}`]: arrayUnion(newMessage),
      });

      await updateLastMessage(newMessage);
      setImg({ file: null, url: "" });
      setText("");
    } catch (err) {
      console.error("Send error:", err);
    }
  };

  const handleClearChat = async () => {
    if (!chatId || !currentUser) return;
    try {
      await updateDoc(doc(db, "chats", chatId), {
        [`messagesByUser.${currentUser.id}`]: [],
      });
    } catch (err) {
      console.error("Clear chat failed:", err);
    }
  };

  const handleDeleteMessage = async (timestamp) => {
    const messages = chat?.messagesByUser?.[currentUser.id] || [];
    const newMessages = messages.filter(
      (m) => m.createdAt?.seconds !== timestamp?.seconds
    );

    try {
      await updateDoc(doc(db, "chats", chatId), {
        [`messagesByUser.${currentUser.id}`]: newMessages,
      });
    } catch (err) {
      console.error("Delete message failed:", err);
    }
  };

  const handleSendCameraPhoto = async (imgUrl) => {
    const newMessage = {
      senderId: currentUser.id,
      text: "",
      createdAt: new Date(),
      img: imgUrl,
    };

    try {
      await updateDoc(doc(db, "chats", chatId), {
        [`messagesByUser.${currentUser.id}`]: arrayUnion(newMessage),
        [`messagesByUser.${user.id}`]: arrayUnion(newMessage),
      });

      await updateLastMessage(newMessage);
    } catch (err) {
      console.error("Camera photo send error:", err);
    }
  };

  const handleSendVoiceNote = async (audioUrl) => {
    const newMessage = {
      senderId: currentUser.id,
      text: "",
      createdAt: new Date(),
      audio: audioUrl,
    };

    try {
      await updateDoc(doc(db, "chats", chatId), {
        [`messagesByUser.${currentUser.id}`]: arrayUnion(newMessage),
        [`messagesByUser.${user.id}`]: arrayUnion(newMessage),
      });

      await updateLastMessage(newMessage);
    } catch (err) {
      console.error("Voice note send error:", err);
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
          <button onClick={handleClearChat} className="clear-btn">
            Clear Chat
          </button>
        </div>
      </div>

      {showCamera && (
        <CameraComponent
          onSendPhoto={handleSendCameraPhoto}
          onClose={() => setShowCamera(false)}
        />
      )}

      <PerfectScrollbar
        containerRef={(ref) => (scrollRef.current = ref)}
        options={{ suppressScrollX: true }}
      >
        <div className="center">
          {chat?.messagesByUser?.[currentUser.id]?.map((message, i) => (
            <div
              className={`message ${
                message.senderId === currentUser.id ? "own" : ""
              }`}
              key={message.createdAt?.seconds || i}
              onMouseEnter={() => setHoveredMsgId(i)}
              onMouseLeave={() => setHoveredMsgId(null)}
            >
              <div className="texts">
                {message.img && <img src={message.img} alt="sent" />}
                {message.audio && (
                  <audio controls>
                    <source src={message.audio} type="audio/mp3" />
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
                {hoveredMsgId === i && (
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteMessage(message.createdAt)}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
          {img.url && (
            <div className="message own">
              <div className="texts">
                <img src={img.url} alt="preview" />
              </div>
            </div>
          )}
        </div>
      </PerfectScrollbar>

      <div className="bottom">
        <div className="icons">
          <label htmlFor="file">
            <img src="./img.png" alt="upload" />
          </label>
          <input
            type="file"
            id="file"
            style={{ display: "none" }}
            onChange={handleImg}
          />
          <img src="./camera.png" alt="" onClick={() => setShowCamera(true)} />
          <img
            src="./mic.png"
            alt=""
            onClick={() => setShowVoiceRecorder(true)}
          />
          {showVoiceRecorder && (
            <VoiceRecorder
              onSendVoiceNote={handleSendVoiceNote}
              onClose={() => setShowVoiceRecorder(false)}
            />
          )}
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
            style={{ cursor: "pointer" }}
          />
        </div>
        {open && (
          <div className="emoji-picker-container">
            <EmojiPicker onEmojiClick={handleEmoji} />
          </div>
        )}
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
