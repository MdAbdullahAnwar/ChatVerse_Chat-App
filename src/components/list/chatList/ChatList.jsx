import React, { useState } from "react";
import AddUser from "./addUser/addUser";
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
import "./ChatList.css";

const ChatList = () => {
  const [addMode, setAddMode] = useState(false);
  return (
    <div className="chatList">
      <div className="search">
        <div className="searchBar">
          <img src="./search.png" alt="" />
          <input type="text" placeholder="Search" />
        </div>
        <img
          src={addMode ? "./minus.png" : "./plus.png"}
          alt=""
          className="add"
          onClick={() => setAddMode((prev) => !prev)}
        />
      </div>
      <PerfectScrollbar
        options={{
          suppressScrollX: true,
          wheelSpeed: 0.3,
          swipeEasing: true,
          minScrollbarLength: 20,
        }}
      >
        <div className="item">
          <img src="./avatar.png" alt="" />
          <div className="texts">
            <span>Jane Doe</span>
            <p>Hello</p>
          </div>
        </div>
        <div className="item">
          <img src="./avatar.png" alt="" />
          <div className="texts">
            <span>Jane Doe</span>
            <p>Hello</p>
          </div>
        </div>
        <div className="item">
          <img src="./avatar.png" alt="" />
          <div className="texts">
            <span>Jane Doe</span>
            <p>Hello</p>
          </div>
        </div>
        <div className="item">
          <img src="./avatar.png" alt="" />
          <div className="texts">
            <span>Jane Doe</span>
            <p>Hello</p>
          </div>
        </div>
        <div className="item">
          <img src="./avatar.png" alt="" />
          <div className="texts">
            <span>Jane Doe</span>
            <p>Hello</p>
          </div>
        </div>
        <div className="item">
          <img src="./avatar.png" alt="" />
          <div className="texts">
            <span>Jane Doe</span>
            <p>Hello</p>
          </div>
        </div>
        <div className="item">
          <img src="./avatar.png" alt="" />
          <div className="texts">
            <span>Jane Doe</span>
            <p>Hello</p>
          </div>
        </div>
        <div className="item">
          <img src="./avatar.png" alt="" />
          <div className="texts">
            <span>Jane Doe</span>
            <p>Hello</p>
          </div>
        </div>
        <div className="item">
          <img src="./avatar.png" alt="" />
          <div className="texts">
            <span>Jane Doe</span>
            <p>Hello</p>
          </div>
        </div>
      </PerfectScrollbar>
      {addMode && <AddUser/>}
    </div>
  );
};

export default ChatList;
