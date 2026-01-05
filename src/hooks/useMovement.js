import { useEffect, useRef, useState } from "react";

export default function useMovement(position, setPosition) {
  const [direction, setDirection] = useState("down");
  const [isMoving, setIsMoving] = useState(false);

  const keys = useRef(new Set());
  const frameRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const active = document.activeElement;
      if (
        active &&
        (active.tagName === "INPUT" || active.tagName === "TEXTAREA")
      ) {
        return;
      } else if (
        [
          "w",
          "a",
          "s",
          "d",
          "ArrowUp",
          "ArrowDown",
          "ArrowLeft",
          "ArrowRight",
        ].includes(e.key)
      ) {
        keys.current.add(e.key);
      }
    };

    const handleKeyUp = (e) => {
      keys.current.delete(e.key);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useEffect(() => {
    const speed = 2.5; // pixels per frame (smooth)

    const update = () => {
      if (keys.current.size === 0) {
        setIsMoving(false);
        frameRef.current = requestAnimationFrame(update);
        return;
      }

      setIsMoving(true);

      setPosition((pos) => {
        let { x, y } = pos;

        if (keys.current.has("w") || keys.current.has("ArrowUp")) {
          y -= speed;
          setDirection("up");
        }
        if (keys.current.has("s") || keys.current.has("ArrowDown")) {
          y += speed;
          setDirection("down");
        }
        if (keys.current.has("a") || keys.current.has("ArrowLeft")) {
          x -= speed;
          setDirection("left");
        }
        if (keys.current.has("d") || keys.current.has("ArrowRight")) {
          x += speed;
          setDirection("right");
        }

        return { x, y };
      });

      frameRef.current = requestAnimationFrame(update);
    };

    frameRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  return { direction, isMoving };
}
