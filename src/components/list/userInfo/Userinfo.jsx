import React from 'react';
import './UserInfo.css';

const Userinfo = () => {
  return (
    <div className="userInfo">
      <div className="user">
        <img
          src="./avatar.png"
          alt="User Avatar"
        />
        <h2>John Doe</h2>
      </div>

      <div className="icons">
        <img src="./more.png" alt="more" />
        <img src="./video.png" alt="video" />
        <img src="./edit.png" alt="edit" />
      </div>
    </div>
  );
};

export default Userinfo;
