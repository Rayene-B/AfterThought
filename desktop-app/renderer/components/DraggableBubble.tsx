import React, { useRef, useState } from 'react';

export function DraggableBubble({ onOpen }: { onOpen: () => void }) {
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const dragRef = useRef<{ startX: number; startY: number; startXPos: number; startYPos: number } | null>(null);

  function onPointerDown(event: React.PointerEvent<HTMLButtonElement>) {
    event.preventDefault();
    dragRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      startXPos: position.x,
      startYPos: position.y,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event: React.PointerEvent<HTMLButtonElement>) {
    if (!dragRef.current) return;
    const deltaX = event.clientX - dragRef.current.startX;
    const deltaY = event.clientY - dragRef.current.startY;

    setPosition({
      x: Math.max(0, Math.min(window.innerWidth - 72, dragRef.current.startXPos - deltaX)),
      y: Math.max(0, Math.min(window.innerHeight - 72, dragRef.current.startYPos - deltaY)),
    });
  }

  function onPointerUp(event: React.PointerEvent<HTMLButtonElement>) {
    dragRef.current = null;
    event.currentTarget.releasePointerCapture(event.pointerId);
  }

  return (
    <button
      onClick={onOpen}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      style={{
        position: 'absolute',
        right: position.x,
        bottom: position.y,
        width: 64,
        height: 64,
        borderRadius: '50%',
        border: '1px solid rgba(186, 203, 255, 0.2)',
        background: 'rgba(22, 25, 35, 0.75)',
        backdropFilter: 'blur(20px) saturate(140%)',
        color: 'oklch(0.72 0.16 248)',
        fontSize: 16,
        fontWeight: 700,
        cursor: 'grab',
        boxShadow: '0 8px 32px -8px rgba(0, 0, 0, 0.55), 0 0 15px rgba(109, 93, 252, 0.3)',
        touchAction: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'border-color 0.3s, transform 0.2s',
        outline: 'none',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(109, 93, 252, 0.5)';
        e.currentTarget.style.transform = 'scale(1.05)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(186, 203, 255, 0.2)';
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      <span style={{ position: 'relative' }}>
        AT
        {/* Pink micro dot indicator */}
        <span
          style={{
            position: 'absolute',
            top: -6,
            right: -8,
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: 'oklch(0.68 0.23 354)', // pink accent
            border: '2px solid rgba(22, 25, 35, 0.75)',
          }}
        />
      </span>
    </button>
  );
}
