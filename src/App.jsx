import React, { useEffect } from "react";
import List from "./components/list/List.jsx";
import Chat from "./components/chat/Chat.jsx";
import Detail from "./components/detail/detail.jsx";
import Login from "./components/login/Login.jsx";
import Notification from "./components/notification/Notification.jsx";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./lib/firebase.js"
import { useUserStore } from "./lib/userStore.js";

const App = () => {

  const {currentUser, isLoading, fetchUserInfo} = useUserStore();

  useEffect(()=>{
    const unSub = onAuthStateChanged(auth, (user)=>{
      // console.log(user.uid);
      fetchUserInfo(user?.uid);
    });

    return() => {
      unSub();
    };
  }, [fetchUserInfo]);

  // console.log(currentUser);

  if(isLoading) return <div className="loading">Loading...</div>

  return (
    <div className="container">
      {currentUser ? (
        <>
          <List />
          <Chat />
          <Detail />
        </>
      ) : (
        <Login />
      )}
      <Notification/>
    </div>
  );
};

export default App;
