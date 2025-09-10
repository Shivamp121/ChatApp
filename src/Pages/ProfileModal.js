import React, { useState } from "react";

const ProfileModal = ({ user, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  return (
    <>
      {children ? (
        <span onClick={() => setIsOpen(true)}>{children}</span>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 rounded-full hover:bg-gray-200"
        >
          👁
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
            {/* Header */}
            <h2 className="text-3xl font-bold text-center mb-4">
              {user.name}
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 text-xl font-bold hover:text-red-500"
            >
              &times;
            </button>

            {/* Body */}
            <div className="flex flex-col items-center gap-4">
              <img
                src={user.pic}
                alt={user.name}
                className="w-36 h-36 rounded-full object-cover border"
              />
              <p className="text-lg font-medium">
                Email: <span className="text-gray-700">{user.email}</span>
              </p>
            </div>

            {/* Footer */}
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileModal;
