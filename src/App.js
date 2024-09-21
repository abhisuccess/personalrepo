import React, { useState, useEffect } from 'react'; 
import MessageIcon from './components/MessageIcon';
import HeartCard from './components/HeartCard';
import './styles.css';
import { getFirestore, collection, addDoc } from 'firebase/firestore'; // Firebase setup
import backgroundImage from './img/heart-themed-pink-valentine-wallpaper.jpg';
import tutfile from './tutfile.mp3'; // Import your audio file

function App() {
  const [stage, setStage] = useState(0); // Start with authentication stage
  const [typedMessage] = useState("My dearest, I’ve admired you for so long... Will you be mine forever?");
  const [isNoButtonVisible, setIsNoButtonVisible] = useState(true);
  const [noButtonAttempts, setNoButtonAttempts] = useState(0);
  const [finalMessage, setFinalMessage] = useState('');
  const [showGlitter, setShowGlitter] = useState(false);
  const [isGlitterBackground, setIsGlitterBackground] = useState(false);
  const [showHeartMessage, setShowHeartMessage] = useState(false);
  const [audio] = useState(new Audio(tutfile));
  const [password, setPassword] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authProgress, setAuthProgress] = useState(0);

  const playAudio = () => {
    audio.loop = true;
    audio.play().catch((error) => console.log('Audio play failed:', error));
  };

  useEffect(() => {
    return () => {
      audio.pause();
    };
  }, [audio]);

  const handleOpenMessage = () => {
    playAudio();
    setStage(2);
  };

  const handleOpenHeart = () => {
    playAudio();
    setStage(3);
  };

  const handleYesClick = async () => {
    setShowGlitter(true);
    setIsGlitterBackground(true);
    setShowHeartMessage(true);

    const thankYouMessage = "Thank you, my love! 🌹✨ You've made my heart so happy! 💖";
    alert(thankYouMessage);
    
    await addDoc(collection(getFirestore(), 'responses'), { response: 'yes' });
    setFinalMessage("Abhi got your response! You can close the page now. 💌");

    setTimeout(() => {
      setShowGlitter(false);
      setIsGlitterBackground(false);
      setShowHeartMessage(false);
    }, 5000);
  };

  const handleNoClick = async () => {
    if (noButtonAttempts < 3) {
      setIsNoButtonVisible(false);
      setNoButtonAttempts((prev) => prev + 1);
      setTimeout(() => setIsNoButtonVisible(true), 500);
      alert("Abhi wants you forever... 💔 Please think again!");
    } else {
      alert("Abhi wants you forever... 💔");
      await addDoc(collection(getFirestore(), 'responses'), { response: 'no' });
      setFinalMessage("Abhi got your response! You can close the page now. 💌");
    }
  };

  const authenticatePassword = () => {
    setIsAuthenticating(true);
    setAuthProgress(0);

    const interval = setInterval(() => {
      setAuthProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          if (password.toLowerCase() === 'arjita') {
            setStage(1); // Move to the main stage after authentication
          } else {
            alert('Authentication failed! Please try again.');
          }
          setIsAuthenticating(false);
          return 0; // Reset progress
        }
        return prev + 10; // Increment progress
      });
    }, 100);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    authenticatePassword();
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
          ? '#000'
          : `url(${backgroundImage}) no-repeat center center`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        overflow: 'hidden',
        position: 'relative',
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

      {stage === 0 && (
        <div className="auth-container">
          <h1 style={{ color: 'white' }}>Enter Password</h1>
          <form onSubmit={handlePasswordSubmit}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              style={{ border: '2px solid white', background: 'transparent', color: 'white' }}
            />
            <button type="submit" style={{ marginTop: '20px' }}>Submit</button>
          </form>
          {isAuthenticating && (
            <div className="loading">
              <p style={{ color: 'green' }}>Authenticating... {authProgress}%</p>
            </div>
          )}
        </div>
      )}

      {stage === 1 && <MessageIcon onOpen={handleOpenMessage} />}
      {stage === 2 && <HeartCard onOpen={handleOpenHeart} />}
      {stage === 3 && !showGlitter && (
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
