import React from 'react';
import { useSelector } from 'react-redux';
import Navbar from './Navbar';
import MyChats from './MyChat';
import ChatBox from './ChatBox';

const ChatPage = () => {
  const { user, selectedChat } = useSelector((state) => state.chat);

  return (
    <div className="w-full h-screen flex flex-col">
      {user && (
        <>
         <div className={`${selectedChat ? 'hidden' : 'block'} md:block`}>
            <Navbar />
          </div>
          <div className="flex-1 flex flex-col md:flex-row gap-2 p-2 overflow-hidden">
  {/* MyChats - full screen on small devices when no chat is selected */}
  <div
    className={`${
      selectedChat ? 'hidden md:flex' : 'flex'
    } w-full h-full md:w-[35%] overflow-y-auto`}
  >
    <MyChats />
  </div>

  {/* ChatBox - full screen on small devices when chat is selected */}
  <div
    className={`${
      selectedChat ? 'flex' : 'hidden md:flex'
    } w-full h-full md:w-[65%] overflow-y-auto`}
  >
    <ChatBox />
  </div>
</div>
        </>
      )}
    </div>
  );
};

export default ChatPage;
