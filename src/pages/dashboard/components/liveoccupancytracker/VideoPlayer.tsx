import React, { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { Box } from '@mui/material';

interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface IProps {
  source: string;
  fullscreen?: boolean;
  settingCoordinates?: boolean;
  onClick?: () => void;
  onCoordinateCapture?: (newCoordinates: number[][]) => void;
  coordinates?: number[][];
}

export const VideoPlayer: React.FC<IProps> = ({ 
  source, 
  fullscreen = false, 
  settingCoordinates = false, 
  onClick, 
  onCoordinateCapture, 
  coordinates = []
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [rectangle, setRectangle] = useState<Rectangle | null>(null);
  const [drawing, setDrawing] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const [initialClick, setInitialClick] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (fullscreen && settingCoordinates && canvasRef.current) {
      const canvas = canvasRef.current;
      const rectCanvas = canvas.getBoundingClientRect();
      const x = e.clientX - rectCanvas.left;
      const y = e.clientY - rectCanvas.top;
      const handleSize = 10;

      if (rectangle) {
        if (
          x >= rectangle.x &&
          x <= rectangle.x + rectangle.width &&
          y >= rectangle.y &&
          y <= rectangle.y + rectangle.height
        ) {
          setInitialClick({ x, y });

          if (
            x >= rectangle.x + rectangle.width - handleSize &&
            x <= rectangle.x + rectangle.width &&
            y >= rectangle.y + rectangle.height - handleSize &&
            y <= rectangle.y + rectangle.height
          ) {
            setResizing(true);
            setResizeHandle('bottomRight');
          } else if (
            x >= rectangle.x - handleSize &&
            x <= rectangle.x &&
            y >= rectangle.y - handleSize &&
            y <= rectangle.y
          ) {
            setResizing(true);
            setResizeHandle('topLeft');
          } else {
            setDragging(true);
          }
        } else {
          setRectangle(null);
        }
      }

      if (!rectangle) {
        setDrawing(true);
        setRectangle({ x, y, width: 0, height: 0 });
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (fullscreen && settingCoordinates && canvasRef.current && rectangle) {
      const canvas = canvasRef.current;
      const rectCanvas = canvas.getBoundingClientRect();
      const x = e.clientX - rectCanvas.left;
      const y = e.clientY - rectCanvas.top;

      if (drawing) {
        setRectangle(prevRect => ({
          ...prevRect!,
          width: x - prevRect!.x,
          height: y - prevRect!.y,
        }));
      } else if (resizing) {
        if (resizeHandle === 'bottomRight') {
          setRectangle(prevRect => ({
            ...prevRect!,
            width: x - prevRect!.x,
            height: y - prevRect!.y,
          }));
        } else if (resizeHandle === 'topLeft') {
          setRectangle(prevRect => ({
            x,
            y,
            width: prevRect!.width + (prevRect!.x - x),
            height: prevRect!.height + (prevRect!.y - y),
          }));
        }
      } else if (dragging) {
        const dx = x - initialClick.x;
        const dy = y - initialClick.y;
        setInitialClick({ x, y });

        setRectangle(prevRect => ({
          ...prevRect!,
          x: prevRect!.x + dx,
          y: prevRect!.y + dy,
        }));
      }
    }
  };

  const handleMouseUp = () => {
    setDrawing(false);
    setDragging(false);
    setResizing(false);
    setResizeHandle(null);

    if (rectangle && onCoordinateCapture) {
      const newCoordinate: number[][] = [
        [Math.round(rectangle.x), Math.round(rectangle.y)],
        [Math.round(rectangle.x + rectangle.width), Math.round(rectangle.y + rectangle.height)]
      ];
      onCoordinateCapture(newCoordinate);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = 'green';
        ctx.lineWidth = 2;

        // Draw existing coordinates
        coordinates.forEach(coord => {
          if (coord.length === 2 && Array.isArray(coord[0]) && Array.isArray(coord[1])) {
            const [x1, y1] = coord[0];
            const [x2, y2] = coord[1];
            ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
          }
        });

        // Draw current rectangle
        if (rectangle) {
          ctx.strokeRect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
          ctx.fillStyle = 'green';
          ctx.fillRect(rectangle.x - 5, rectangle.y - 5, 10, 10);
          ctx.fillRect(rectangle.x + rectangle.width - 5, rectangle.y + rectangle.height - 5, 10, 10);
        }
      }
    }
  }, [rectangle, coordinates]);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: fullscreen ? '100vh' : '100%',
        position: 'relative',
        cursor: settingCoordinates ? 'crosshair' : 'pointer',
      }}
      onClick={onClick}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <ReactPlayer url={source} controls width="100%" height="100%" playing={true} />
      {fullscreen && settingCoordinates && (
        <canvas
          ref={canvasRef}
          width={canvasRef.current?.offsetWidth}
          height={canvasRef.current?.offsetHeight}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }}
        />
      )}
    </Box>
  );
};

export default VideoPlayer;