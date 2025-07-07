import React, { useEffect, useRef, useState } from "react";
import EmojiPicker from "emoji-picker-react";
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
import "./Chat.css";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useChatStore } from "../../lib/chatStore";

const Chat = () => {
  const [chat, setChat] = useState();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");

  const { chatId } = useChatStore();

  const endRef = useRef(null);

  useEffect(()=>{
    endRef.current?.scrollIntoView({behavior:"smooth"})
  },[])

  useEffect(()=>{
    const unSub = onSnapshot(doc(db,"chats", chatId), (res) => {
      setChat(res.data());
    })
    return () => {
      unSub();
    }
  },[chatId])

  console.log(chat);

  const handleEmoji = (e) => {
    setText((prev) => prev + e.emoji);
    setOpen(false);
  };

  //   console.log(text);

  return (
    <div className="chat">
      <div className="top">
        <div className="user">
          <img src="./avatar.png" alt="" />
          <div className="texts">
            <span>Jane Doe</span>
            <p>Lorem ipsum dolor sit amet.</p>
          </div>
        </div>
        <div className="icons">
          <img src="./phone.png" alt="" />
          <img src="./video.png" alt="" />
          <img src="./info.png" alt="" />
        </div>
      </div>
      <PerfectScrollbar
        options={{
          suppressScrollX: true,
          wheelSpeed: 0.3,
          swipeEasing: true,
          minScrollbarLength: 20,
        }}
      >
        <div className="center">
          <div className="message own">
            <div className="texts">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhqT4UBhTEjhlwPcwK9H7HJqKLUY2sPMNyjw&s"
                alt=""
              />
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Quibusdam necessitatibus ex a quas? Enim error quod atque!
                Animi, nisi officia.
              </p>
              <span>1 min ago</span>
            </div>
          </div>
          <div className="message">
            <img src="./avatar.png" alt="" />
            <div className="texts">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Quibusdam necessitatibus ex a quas? Enim error quod atque!
                Animi, nisi officia.
              </p>
              <span>1 min ago</span>
            </div>
          </div>
          <div className="message own">
            <div className="texts">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Quibusdam necessitatibus ex a quas? Enim error quod atque!
                Animi, nisi officia.
              </p>
              <span>1 min ago</span>
            </div>
          </div>
          <div className="message">
            <img src="./avatar.png" alt="" />
            <div className="texts">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Quibusdam necessitatibus ex a quas? Enim error quod atque!
                Animi, nisi officia.
              </p>
              <span>1 min ago</span>
            </div>
          </div>
          <div className="message own">
            <div className="texts">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Quibusdam necessitatibus ex a quas? Enim error quod atque!
                Animi, nisi officia.
              </p>
              <span>1 min ago</span>
            </div>
          </div>
          <div className="message">
            <img src="./avatar.png" alt="" />
            <div className="texts">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Quibusdam necessitatibus ex a quas? Enim error quod atque!
                Animi, nisi officia.
              </p>
              <span>1 min ago</span>
            </div>
          </div>
          <div ref={endRef}></div>
        </div>
      </PerfectScrollbar>
      <div className="bottom">
        <div className="icons">
          <img src="./img.png" alt="" />
          <img src="./camera.png" alt="" />
          <img src="./mic.png" alt="" />
        </div>
        <input
          type="text"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
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
        <button className="sendButton">Send</button>
      </div>
    </div>
  );
};

export default Chat;
