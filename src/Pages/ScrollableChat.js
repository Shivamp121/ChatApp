import { useEffect, useRef, useState } from "react";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics";
import { useSelector } from "react-redux";

const ScrollableChat = ({ messages }) => {
  const { user } = useSelector((state) => state.chat);
  const feedRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (feedRef.current) {
      const el = feedRef.current;
      el.scrollTop = el.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="relative h-full">
      {/* Modal for Image Preview */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Full View"
            className="max-w-full max-h-full rounded-lg shadow-lg"
          />
        </div>
      )}

      {/* Chat Feed */}
      <div ref={feedRef} className="h-full overflow-y-auto pr-2 scrollbar-hide">
        <ScrollableFeed forceScroll={true}>
          {messages &&
            messages.map((m, i) => (
              <div className="flex" key={m._id}>
                {(isSameSender(messages, m, i, user._id) ||
                  isLastMessage(messages, i, user._id)) && (
                  <div className="mr-2 mt-2" title={m.sender?.name}>
                    <img
                      src={m.sender?.pic}
                      alt={m.sender?.name}
                      className="w-8 h-8 rounded-full cursor-pointer"
                    />
                  </div>
                )}

                <div
                  className={`px-4 py-2 rounded-2xl text-sm max-w-[75%] break-words ${
                    m.sender?._id === user._id
                      ? "bg-blue-200 self-end"
                      : "bg-green-200"
                  }`}
                  style={{
                    marginLeft: isSameSenderMargin(messages, m, i, user._id),
                    marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                  }}
                >
                  {m.media ? (
                    <img
                      src={m.media}
                      alt="sent media"
                      className="rounded-lg object-cover cursor-pointer"
                      style={{
                        width: "200px",
                        height: "200px",
                        maxWidth: "100%",
                        borderRadius: "12px",
                      }}
                      onClick={() => setSelectedImage(m.media)}
                    />
                  ) : (
                    <span>{m.content || "[No content]"}</span>
                  )}
                </div>
              </div>
            ))}
        </ScrollableFeed>
      </div>
    </div>
  );
};

export default ScrollableChat;
