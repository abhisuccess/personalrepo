import React from 'react'; 

const MessageIcon = ({ onOpen }) => {
  return (
    <div className="message-icon" onClick={onOpen}>
      <div className="envelope">
        <p>Click to Open</p>
      </div>
    </div>
  );
};

export default MessageIcon;
