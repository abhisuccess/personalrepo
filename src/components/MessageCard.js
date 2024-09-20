import React from 'react';

const HeartCard = ({ onOpen }) => {
  return (
    <div className="heart-card" onClick={onOpen}>
      <div className="heart">
        <p className="heart-text">Open the Heart Message</p>
      </div>
    </div>
  );
};

export default HeartCard;
