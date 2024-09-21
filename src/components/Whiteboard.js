// Whiteboard.js
import React, { useRef, useEffect } from 'react';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const Whiteboard = ({ promptMessage, onClose }) => {
  const canvasRef = useRef(null);
  const db = getFirestore();

  const saveDrawing = async (dataURL) => {
    await addDoc(collection(db, 'drawings'), { drawing: dataURL });
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL();
    saveDrawing(dataURL);
    onClose(); // Close the whiteboard after saving
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let isDrawing = false;

    const startDrawing = (e) => {
      isDrawing = true;
      ctx.beginPath();
      ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    };

    const draw = (e) => {
      if (!isDrawing) return;
      ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      ctx.stroke();
    };

    const endDrawing = () => {
      isDrawing = false;
      ctx.closePath();
    };

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', endDrawing);
    canvas.addEventListener('mouseleave', endDrawing);

    return () => {
      canvas.removeEventListener('mousedown', startDrawing);
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mouseup', endDrawing);
      canvas.removeEventListener('mouseleave', endDrawing);
    };
  }, []);

  return (
    <div className="whiteboard-container">
      <h2>{promptMessage}</h2>
      <canvas
        ref={canvasRef}
        width={400}
        height={300}
        style={{ border: '2px solid black', backgroundColor: 'white' }}
      />
      <button onClick={handleSave}>Save Drawing</button>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default Whiteboard;
