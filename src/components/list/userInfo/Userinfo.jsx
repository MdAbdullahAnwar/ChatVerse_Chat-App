import React from 'react';

const Userinfo = () => {
  return (
    <div className="p-5 flex items-center justify-between">
      <div className="flex items-center gap-5">
        <img
          src="./avatar.png"
          alt="User Avatar"
          className="w-[50px] h-[50px] rounded-full object-cover"
        />
        <h2 className="text-lg font-semibold">John Doe</h2>
      </div>

      <div className="flex gap-5">
        <img src="./more.png" alt="more" className="w-5 h-5 cursor-pointer" />
        <img src="./video.png" alt="video" className="w-5 h-5 cursor-pointer" />
        <img src="./edit.png" alt="edit" className="w-5 h-5 cursor-pointer" />
      </div>
    </div>
  );
};

export default Userinfo;
