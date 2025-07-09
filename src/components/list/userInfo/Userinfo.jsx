import React, { useState } from "react";
import "./UserInfo.css";
import { useUserStore } from "../../../lib/userStore";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import upload from "../../../lib/upload";

const Userinfo = () => {
  const { currentUser, fetchUserInfo } = useUserStore();
  const [openEdit, setOpenEdit] = useState(false);
  const [username, setUsername] = useState(currentUser.username);
  const [bio, setBio] = useState(currentUser.bio || "");
  const [file, setFile] = useState(null);

  const handleSave = async () => {
    try {
      let avatarUrl = currentUser.avatar;
      if (file) {
        avatarUrl = await upload(file);
      }

      const userRef = doc(db, "users", currentUser.id);
      await updateDoc(userRef, {
        username,
        bio,
        avatar: avatarUrl,
      });

      await fetchUserInfo(currentUser.id);
      setOpenEdit(false);
    } catch (err) {
      console.log("Error updating profile:", err);
    }
  };

  return (
    <div className="userInfo">
      <div className="user">
        <img src={currentUser.avatar || "./avatar.png"} alt="User Avatar" />
        <h2>{currentUser.username}</h2>
      </div>

      <div className="icons">
        <p>Edit Profile</p>
        <img src="./edit.png" alt="edit" onClick={() => setOpenEdit(true)} />
      </div>

      {openEdit && (
        <div className="editModal">
          <h3>Edit Profile</h3>
          <input
            type="text"
            placeholder="New Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="text"
            placeholder="New Bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
          <div className="buttons">
            <button onClick={handleSave}>Save</button>
            <button onClick={() => setOpenEdit(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Userinfo;
