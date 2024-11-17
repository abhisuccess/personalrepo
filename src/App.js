import React from 'react';
import './styles.css';
import errorEmoji from './img/error-404.png'; // Import an error emoji image if available

function App() {
  return (
    <div className="App">
      <img className="error-emoji" src={errorEmoji} alt="Error" />
      <h1>ERROR 404!</h1>
      <p className="error-message">
        The Admin could not succeed in this mission. With a heavy heart, this page is now permanently closed.
      </p>
    </div>
  );
}

export default App;
