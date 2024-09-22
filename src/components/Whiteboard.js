import React, { useRef, useState } from 'react';

function Whiteboard() {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);

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

  return (
    <div className="whiteboard-container">
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
    </div>
  );
}

export default Whiteboard;
