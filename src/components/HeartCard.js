import React from 'react';

const HeartCard = ({ onOpen }) => {
  return (
    <div className="heart-card" onClick={onOpen}>
      <div className="heart">
        <p id="heart-text">Click Me!</p>
      </div>
    </div>
  );
};

export default HeartCard;
