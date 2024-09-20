import React, { useState, useEffect } from 'react';
import MessageIcon from './components/MessageIcon';
import HeartCard from './components/HeartCard';
import './styles.css';
import { getFirestore, collection, addDoc } from 'firebase/firestore'; // Firebase setup
import backgroundImage from './img/heart-themed-pink-valentine-wallpaper.jpg';
import tutfile from './tutfile.mp3'; // Import your audio file

function App() {
  const [stage, setStage] = useState(1);
  const [typedMessage] = useState("My dearest, I’ve admired you for so long... Will you be mine forever?");
  const [isNoButtonVisible, setIsNoButtonVisible] = useState(true);
  const [noButtonAttempts, setNoButtonAttempts] = useState(0);
  const [finalMessage, setFinalMessage] = useState('');
  const [showGlitter, setShowGlitter] = useState(false); // State to show glitter effect
  const [isGlitterBackground, setIsGlitterBackground] = useState(false); // Track if glitter background is active
  const [showHeartMessage, setShowHeartMessage] = useState(false); // Track if heart message is shown
  const [audio] = useState(new Audio(tutfile));

  const playAudio = () => {
    audio.loop = true;
    audio.play().catch((error) => console.log('Audio play failed:', error)); // Handle play error
  };

  useEffect(() => {
    return () => {
      audio.pause(); // Stop audio when component unmounts
    };
  }, [audio]);

  const handleOpenMessage = () => {
    playAudio(); // Play the music on the first user interaction
    setStage(2);
  };

  const handleOpenHeart = () => {
    playAudio(); // Ensure the music continues playing after user interactions
    setStage(3);
  };

  const handleYesClick = async () => {
    // Show glitter effect
    setShowGlitter(true);
    setIsGlitterBackground(true); // Switch to glitter-friendly background
    setShowHeartMessage(true); // Show heart message

    // Display a beautiful thank you message with emoji
    const thankYouMessage = "Thank you, my love! 🌹✨ You've made my heart so happy! 💖";
    alert(thankYouMessage);
    
    await addDoc(collection(getFirestore(), 'responses'), { response: 'yes' });
    setFinalMessage("Abhi got your response! You can close the page now. 💌");

    // Remove glitter effect and heart message after 5 seconds and restore original background
    setTimeout(() => {
      setShowGlitter(false);
      setIsGlitterBackground(false); // Restore original background
      setShowHeartMessage(false); // Hide heart message
    }, 5000); // Glitter effect lasts for 5 seconds
  };

  const handleNoClick = async () => {
    if (noButtonAttempts < 3) {
      setIsNoButtonVisible(false);
      setNoButtonAttempts((prev) => prev + 1);
      setTimeout(() => setIsNoButtonVisible(true), 500); // Reappear after a short delay

      // Show an emotional message to persuade her to rethink
      alert("Abhi wants you forever... 💔 Please think again!");
    } else {
      // Final No response
      alert("Abhi wants you forever... 💔");
      await addDoc(collection(getFirestore(), 'responses'), { response: 'no' });
      setFinalMessage("Abhi got your response! You can close the page now. 💌");
    }
  };

  const renderGlitter = () => {
    const sparkleElements = Array.from({ length: 100 }).map((_, index) => (
      <div
        key={index}
        className="sparkle"
        style={{
          top: `${Math.random() * 100}vh`,
          left: `${Math.random() * 100}vw`,
          animationDuration: `${Math.random() * 2 + 1}s`,
        }}
      />
    ));
    return <div className="glitter">{sparkleElements}</div>;
  };

  return (
    <div 
      className="App" 
      style={{
        width: '100%',
        height: '100vh',
        background: isGlitterBackground 
          ? '#000'  // Dark background for better glitter visibility
          : `url(${backgroundImage}) no-repeat center center`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        overflow: 'hidden', // Ensure glitter doesn't overflow
        position: 'relative', // Ensure glitter overlay is positioned correctly
      }}
    >
      {showGlitter && (
        <div className="glitter-overlay">
          {renderGlitter()}
          {showHeartMessage && (
            <div className="heart-message">
              <span role="img" aria-label="heart" style={{ fontSize: '5rem' }}>❤️</span>
              <p>You're the heartbeat of my life! ❤️</p>
            </div>
          )}
        </div>
      )}
      {stage === 1 && <MessageIcon onOpen={handleOpenMessage} />}
      {stage === 2 && <HeartCard onOpen={handleOpenHeart} />}
      {stage === 3 && !showGlitter && ( // Hide final message box during glitter effect
        <div className="final-message">
          <p>{typedMessage}</p>
          <button className="heart-button yes" onClick={handleYesClick}>Yes ❤️</button>
          {isNoButtonVisible && (
            <button className="heart-button no" onClick={handleNoClick}>No 💔</button>
          )}
          {finalMessage && <p>{finalMessage}</p>}
        </div>
      )}
    </div>
  );
}

export default App;
