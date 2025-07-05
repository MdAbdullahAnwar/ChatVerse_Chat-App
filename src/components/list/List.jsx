import React from 'react'
import './List.css';
import Userinfo from './userInfo/Userinfo';
import ChatList from './chatList/ChatList';

const List = () => {
  return (
    <div className="flex-1">
      <Userinfo />
      <ChatList />
    </div>
  )
}

export default List;
