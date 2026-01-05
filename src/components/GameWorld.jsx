import { useState } from "react";
import Player from "./Player";
import useMovement from "../hooks/useMovement";
import Avatar from "./Avatar";

export default function GameWorld({ setRoom }) {
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const { direction, isMoving } = useMovement(position, setPosition);
  const [myAvatarStyle, setMyAvatarStyle] = useState({
    body: 0,
    hair: 1,
    outfit: 2,
  });

  const enterCafe = position.x > 300 && position.y < 150;
  const enterStudy = position.x > 300 && position.y > 200;

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "#E8E0F0",
        position: "relative",
      }}
    >
      <Player
        position={position}
        direction={direction}
        isMoving={isMoving}
        avatarStyle={myAvatarStyle}
      />

      {/* <Avatar
        size={200}
        direction="down"
        isMoving={true}
        style={myAvatarStyle}
      /> */}

      {/* Cafe */}
      <div style={{ position: "absolute", right: 50, top: 50 }}>☕ Cafe</div>
      {enterCafe && <button onClick={() => setRoom("cafe")}>Enter Cafe</button>}

      {/* Study Room */}
      <div style={{ position: "absolute", right: 50, bottom: 50 }}>
        📚 Study
      </div>
      {enterStudy && (
        <button onClick={() => setRoom("study")}>Enter Study</button>
      )}
    </div>
  );
}
