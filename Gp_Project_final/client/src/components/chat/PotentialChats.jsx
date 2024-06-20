import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext"; 
import { ChatContext } from "../../context/ChatContext"; 

const PotentialChats = () => {
  const { user } = useContext(AuthContext);
  const { potentialChats, createChat, onlineUsers } = useContext(ChatContext);

  // Filter out the current user and admin users
  const usersWithoutCurrentAndAdmins = potentialChats.filter(
    (u) => u._id !== user._id && u.role !== 'admin'
  );

  return (
    <div className="all-users">
      {usersWithoutCurrentAndAdmins.map((u) => (
        <button
          className="single-user-btn"
          key={u._id}
          onClick={() => createChat(user._id, u._id)}
        >
          {u.name}
          <span
            className={
              onlineUsers?.some((onlineUser) => onlineUser?.userId === u._id)
                ? "user-online"
                : ""
            }
          ></span>
        </button>
      ))}
    </div>
  );
};

export default PotentialChats;
