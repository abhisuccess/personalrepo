import React, { useState, useEffect, useRef } from 'react';
import MessageIcon from './components/MessageIcon';
import HeartCard from './components/HeartCard';
import './styles.css';
import { getFirestore, collection, addDoc } from 'firebase/firestore'; // Firebase setup
import backgroundImage from './img/heart-themed-pink-valentine-wallpaper.jpg';
import tutfile from './tutfile.mp3'; // Import your audio file

function App() {
  const [stage, setStage] = useState(0); // Ensure stage starts at 0 to load the authentication page first
  const [typedMessage] = useState("My dearest, I’ve admired you for so long... Will you be mine forever?");
  const [isNoButtonVisible, setIsNoButtonVisible] = useState(true);
  const [noButtonAttempts, setNoButtonAttempts] = useState(0);
  const [showGlitter, setShowGlitter] = useState(false);
  const [isGlitterBackground, setIsGlitterBackground] = useState(false);
  const [showHeartMessage, setShowHeartMessage] = useState(false);
  const [audio] = useState(new Audio(tutfile));
  const [password, setPassword] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authProgress, setAuthProgress] = useState(0);
  const [drawing, setDrawing] = useState(false);
  const [canvasVisible, setCanvasVisible] = useState(false); // State to control canvas visibility
  const [finalMessage, setFinalMessage] = useState(''); // State for final message
  const canvasRef = useRef(null); // Canvas reference for drawing

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

    setTimeout(() => {
      setShowGlitter(false);
      setIsGlitterBackground(false);
      setShowHeartMessage(false);
      setStage(4); // Move to the drawing stage
      setCanvasVisible(true); // Show the canvas
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
      setFinalMessage("Abhi got your response! You can close the page now. Thank you!"); // Set final message
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
            setStage(2); // Move to the next stage after successful authentication
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

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return; // Ensure canvas is not null
    const ctx = canvas.getContext("2d");
    setDrawing(true);
    ctx.beginPath();

    const { offsetX, offsetY } = e.nativeEvent || getTouchPosition(e);
    ctx.moveTo(offsetX, offsetY);
  };

  const draw = (e) => {
    if (!drawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return; // Ensure canvas is not null
    const ctx = canvas.getContext("2d");
    const { offsetX, offsetY } = e.nativeEvent || getTouchPosition(e);
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return; // Ensure canvas is not null
    const ctx = canvas.getContext("2d");
    ctx.closePath();
  };

  const getTouchPosition = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    return {
      offsetX: touch.clientX - rect.left,
      offsetY: touch.clientY - rect.top,
    };
  };

  const saveDrawing = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return; // Ensure canvas is not null
    const imageData = canvas.toDataURL('image/png');
    await addDoc(collection(getFirestore(), 'drawings'), { image: imageData });
    alert("Your drawing has been saved! 🌟");
    setCanvasVisible(false); // Hide the canvas after saving
    alert("Abhi got your response! You can close the page now. Thank you!");
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

      {stage === 1 && <MessageIcon onOpen={handleOpenMessage} />}
      {stage === 2 && <HeartCard onOpen={handleOpenHeart} />}

      {stage === 3 && !showGlitter && (
        <div className="final-message">
          <p>{typedMessage}</p>
          <button className="heart-button yes" onClick={handleYesClick}>Yes ❤️</button>
          {isNoButtonVisible && (
            <button className="heart-button no" onClick={handleNoClick}>No 💔</button>
          )}
          {finalMessage && (
            <div className="final-message-box" style={{ color: 'white', backgroundColor: 'pink', padding: '20px', borderRadius: '10px', textAlign: 'center', marginTop: '20px' }}>
              {finalMessage}
            </div>
          )}
        </div>
      )}

      {canvasVisible && stage === 4 && (
        <div className="drawing-container">
          <h2 style={{ color: 'black' }}>"🎨✨ Share Your Current Mood! How are you feeling right now? Express it through a drawing!😊💖</h2>
          <canvas
            ref={canvasRef}
            width={window.innerWidth}
            height={window.innerHeight * 0.6}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            style={{ border: '2px solid white', backgroundColor: 'lightgrey' }}
          />
          <button onClick={saveDrawing} style={{ marginTop: '20px' }}>Save Drawing</button>
        </div>
      )}

      {/* Authentication Page */}
      {stage === 0 && (
        <div className="auth-container">
          <form onSubmit={handlePasswordSubmit}>
            <h2 style={{ color: 'white', textAlign: 'center' }}>Enter Password</h2>
            <input
              type="password"
              placeholder="Enter your password..."
              className="auth-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ color: 'white', textAlign: 'center' }}
            />
            <button type="submit" className="auth-button">Submit</button>
          </form>
          {isAuthenticating && (
            <div className="progress-bar">
              <p style={{ color: 'green' }}>Authenticating: {authProgress}%</p>
              <div className="progress" style={{ width: `${authProgress}%`, backgroundColor: 'green', height: '10px' }}></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
