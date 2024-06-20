import { useCallback, useEffect, createContext, useState } from "react";
import { io } from "socket.io-client";
import { baseUrl, getRequest, postRequest } from "../utils/services";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children, user }) => {
  const [userChats, setUserChats] = useState(null);
  const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
  const [userChatsError, setUserChatsError] = useState(null);
  const [potentialChats, setPotentialChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState(null);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState(null);
  const [sendTextMessageError, setSendTextMessageError] = useState(null);
  const [newMessage, setNewMessage] = useState(null);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  // Establish socket connection
  useEffect(() => {
    const newSocket = io("http://localhost:3000");
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  // Load notifications from localStorage
  useEffect(() => {
    const savedNotifications = JSON.parse(localStorage.getItem('notifications')) || [];
    console.log('Loaded notifications from localStorage:', savedNotifications);
    setNotifications(savedNotifications);
  }, []);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    console.log('Saving notifications to localStorage:', notifications);
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Add online users
  useEffect(() => {
    if (socket === null) return;
    socket.emit("addNewUser", user?._id);
    socket.on("getOnlineUsers", (res) => {
      setOnlineUsers(res);
    });

    return () => {
      socket.off("getOnlineUsers");
    };
  }, [socket]);

  // Send message
  useEffect(() => {
    if (socket === null) return;

    const recipientId = currentChat?.members?.find((id) => id !== user?._id);
    socket.emit("sendMessage", { ...newMessage, recipientId });
  }, [newMessage]);

  // Receive message and notifications
  useEffect(() => {
    if (socket === null) return;

    socket.on("getMessage", (res) => {
      if (currentChat?._id !== res.chatId) return;
      setMessages((prev) => [...prev, res]);
    });

    socket.on("getNotification", (res) => {
      const isChatOpen = currentChat?.members.some((id) => id === res.senderId);
      if (isChatOpen) {
        setNotifications((prev) => [{ ...res, isRead: true }, ...prev]);
      } else {
        setNotifications((prev) => [res, ...prev]);
      }
    });

    return () => {
      socket.off("getMessage");
      socket.off("getNotification");
    };
  }, [socket, currentChat]);

  // Save notifications to local storage whenever they change
  const saveNotificationsToLocalStorage = (notifications) => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  };

  useEffect(() => {
    saveNotificationsToLocalStorage(notifications);
  }, [notifications]);

  // Fetch all users
  useEffect(() => {
    const getUsers = async () => {
      const response = await getRequest(`${baseUrl}/users`);
      if (response.error) {
        return console.log("Error fetching users", response);
      }

      const pChats = response.filter((u) => {
        let isChatCreated = false;
        if (user?._id === u._id) return false;
        if (userChats) {
          isChatCreated = userChats.some((chat) => {
            return chat.members[0] === u._id || chat.members[1] === u._id;
          });
        }
        return !isChatCreated;
      });

      setPotentialChats(pChats);
      setAllUsers(response);
    };

    getUsers();
  }, [userChats]);

  // Fetch user chats
  useEffect(() => {
    const getUserChats = async () => {
      if (user?._id) {
        setIsUserChatsLoading(true);
        setUserChatsError(null);

        const response = await getRequest(`${baseUrl}/chats/${user?._id}`);
        setIsUserChatsLoading(false);

        if (response.error) {
          return setUserChatsError(response);
        }

        setUserChats(response);

        // Set the first chat as currentChat
        if (response.length > 0) {
          setCurrentChat(response[0]);
        }
      }
    };

    getUserChats();
  }, [user]);

  // Fetch messages
  useEffect(() => {
    const getMessages = async () => {
      setIsMessagesLoading(true);
      setMessagesError(null);

      if (currentChat) {
        const response = await getRequest(`${baseUrl}/messages/${currentChat._id}`);
        setIsMessagesLoading(false);

        if (response.error) {
          return setMessagesError(response);
        }

        setMessages(response);
      }
    };

    getMessages();
  }, [currentChat]);

  const sendTextMessage = useCallback(async (textMessage, sender, currentChatId, setTextMessage) => {
    if (!textMessage) return console.log("You must type something...");

    const response = await postRequest(
      `${baseUrl}/messages`,
      JSON.stringify({
        chatId: currentChatId,
        senderId: sender._id,
        text: textMessage,
      })
    );

    if (response.error) {
      return setSendTextMessageError(response);
    }

    console.log("Response from sending message:", response);

    setNewMessage(response);
    setMessages((prev) => [...prev, response]);
    setTextMessage("");
  }, []);

  const updateCurrentChat = useCallback((chat) => {
    setCurrentChat(chat);
  }, []);

  const createChat = useCallback(async (firstId, secondId) => {
    const response = await postRequest(
      `${baseUrl}/chats`,
      JSON.stringify({
        firstId,
        secondId,
      })
    );
    if (response.error) {
      return console.log("Error creating chat", response);
    }

    setUserChats((prev) => [...prev, response]);
  }, []);

  const markAllNotificationAsRead = useCallback((notifications) => {
    if (!Array.isArray(notifications)) {
      console.error('notifications is not an array:', notifications);
      return;
    }

    const mNotifications = notifications.map((n) => {
      return { ...n, isRead: true };
    });

    setNotifications(mNotifications);
  }, []);

  const markNotificationAsRead = useCallback(
    (n, userChats, user, notifications) => {
      const desiredChat = userChats.find((chat) => {
        const chatMembers = [user._id, n.senderId];
        const isDesiredChat = chat?.members.every((member) => {
          return chatMembers.includes(member);
        });
        return isDesiredChat;
      });

      const mNotifications = notifications.map((el) => {
        if (n.senderId === el.senderId) {
          return { ...el, isRead: true };
        } else {
          return el;
        }
      });

      setNotifications(mNotifications);
      updateCurrentChat(desiredChat);
    },
    [updateCurrentChat]
  );

  const markThisUserNotificationsAsRead = useCallback((thisUserNotifications, notifications) => {
    const mNotifications = notifications.map((el) => {
      let notification = el;
      thisUserNotifications.forEach((n) => {
        if (n.senderId === el.senderId) {
          notification = { ...el, isRead: true };
        }
      });
      return notification;
    });

    setNotifications(mNotifications);
  }, []);

  return (
    <ChatContext.Provider
      value={{
        userChats,
        currentChat,
        isUserChatsLoading,
        userChatsError,
        potentialChats,
        createChat,
        updateCurrentChat,
        messages,
        isMessagesLoading,
        messagesError,
        sendTextMessage,
        onlineUsers,
        notifications,
        allUsers,
        markAllNotificationAsRead,
        markNotificationAsRead,
        markThisUserNotificationsAsRead,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
