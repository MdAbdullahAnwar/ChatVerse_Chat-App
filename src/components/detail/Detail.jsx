import React, { useEffect, useRef, useState } from "react";
import "./Detail.css";
import { auth, db } from "../../lib/firebase";
import { useChatStore } from "../../lib/chatStore";
import { useUserStore } from "../../lib/userStore";
import {
  arrayRemove,
  arrayUnion,
  doc,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";

const Detail = () => {
  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked, changeBlock } =
    useChatStore();
  const { currentUser } = useUserStore();

  const [sharedPhotos, setSharedPhotos] = useState([]);
  const [showSharedPhotos, setShowSharedPhotos] = useState(true);

  const photoScrollRef = useRef(null);

  useEffect(() => {
    if (!chatId) return;

    const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
      const chatData = res.data();
      const messages = chatData?.messagesByUser?.[currentUser.id] || [];

      const images = messages
        .filter((msg) => msg.img)
        .sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);

      setSharedPhotos(images);
    });

    return () => unSub();
  }, [chatId, currentUser.id]);

  useEffect(() => {
    if (photoScrollRef.current) {
      photoScrollRef.current.scrollTop = 0;
    }
  }, [sharedPhotos.length, showSharedPhotos]);

  const handleBlock = async () => {
    if (!user) return;

    const userDocRef = doc(db, "users", currentUser.id);

    try {
      await updateDoc(userDocRef, {
        blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
      });
      changeBlock();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="detail">
      <div className="user">
        <img src={user?.avatar || "./avatar.png"} alt="" />
        <h2>{user?.username}</h2>
        <p>{user?.bio || "Hey, I am using ChatVerse"}</p>
      </div>

      <div className="info">
        <div className="option">
          <div
            className="title"
            onClick={() => setShowSharedPhotos((prev) => !prev)}
            style={{ cursor: "pointer" }}
          >
            <span>Shared Photos</span>
            <img
              src={showSharedPhotos ? "./arrowUp.png" : "./arrowDown.png"}
              alt=""
            />
          </div>

          {showSharedPhotos && (
            <PerfectScrollbar
              containerRef={(ref) => (photoScrollRef.current = ref)}
              options={{ suppressScrollX: true }}
            >
              <div className="photos" style={{ maxHeight: "360px" }}>
                {sharedPhotos.length > 0 ? (
                  sharedPhotos.map((photo, index) => (
                    <div className="photoItem" key={index}>
                      <div className="photoDetail">
                        <img src={photo.img} alt={`shared-${index}`} />
                        <span>{`photo_${index + 1}.png`}</span>
                      </div>
                      <a href={photo.img} download className="icon">
                        <img src="./download.png" alt="download" />
                      </a>
                    </div>
                  ))
                ) : (
                  <p style={{ padding: "10px", color: "gray" }}>
                    No shared images yet.
                  </p>
                )}
              </div>
            </PerfectScrollbar>
          )}

        </div>

        <button onClick={handleBlock}>
          {isCurrentUserBlocked
            ? "You are Blocked!"
            : isReceiverBlocked
            ? "User Blocked"
            : "Block User"}
        </button>

        <button className="logout" onClick={() => auth.signOut()}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Detail;
