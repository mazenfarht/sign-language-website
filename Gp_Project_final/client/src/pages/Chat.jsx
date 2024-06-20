// Chat.jsx
import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import UserChat from "../components/chat/UserChat";
import { AuthContext } from "../context/AuthContext";
import { Container, Stack } from "react-bootstrap";
import PotentialChats from "../components/chat/PotentialChats";
import BoxChat from "../components/chat/BoxChat";

const Chat = () => {
    const { user } = useContext(AuthContext);
    const { userChats, isUserChatsLoading, updateCurrentChat } =
        useContext(ChatContext);

    return (
        <Container>
            <PotentialChats />
            {userChats?.length < 1 ? null : (
                <Stack direction="horizontal" gap={4} className="align-items-start">
                    <Stack className="messages-box flex-grow-0 pe-3 user-card-container" gap={3}>
                        {isUserChatsLoading && <p>Loading chats....</p>}
                        {userChats?.map((chat, index) => {
                            return (
                                <div key={index} onClick={() => updateCurrentChat(chat)}>
                                    <UserChat chat={chat} user={user} />
                                </div>
                            );
                        })}
                    </Stack>
                    <BoxChat />
                </Stack>
            )}
        </Container>
    );
}

export default Chat;
