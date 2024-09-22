import React, { useRef, useState, useEffect } from 'react';

function Whiteboard() {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);

  const startDrawing = (e) => {
    e.preventDefault(); // Prevent default behavior
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    setDrawing(true);
    ctx.beginPath();

    const { offsetX, offsetY } = e.nativeEvent ? e.nativeEvent : getTouchPosition(e);
    ctx.moveTo(offsetX, offsetY);
  };

  const draw = (e) => {
    if (!drawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const { offsetX, offsetY } = e.nativeEvent ? e.nativeEvent : getTouchPosition(e);
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight * 0.6;
    }
  }, []);

  return (
    <div className="whiteboard-container">
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        style={{ border: '2px solid white', backgroundColor: 'lightgrey' }}
      />
    </div>
  );
}

export default Whiteboard;
