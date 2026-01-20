import { useEffect, useState } from "react";
import Player from "./Player";
import useMovement from "../hooks/useMovement";
import TownMap, { BUILDINGS, MAP_WIDTH, MAP_HEIGHT } from "./TownMap";

export default function GameWorld({ setRoom }) {
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const { direction, isMoving } = useMovement(position, setPosition);
  const [nearBuilding, setNearBuilding] = useState(null);
  const handleBuildingClick = (id) => {
    // if (nearBuilding === id) {
    console.log("Entering building:", id);
    setRoom(id);
    // }
  };
  const AVATAR_WIDTH = 32;
  const AVATAR_HEIGHT = 48;
  const [myAvatarStyle, setMyAvatarStyle] = useState({
    body: 0,
    hair: 1,
    outfit: 2,
  });

  useEffect(() => {
    let nearest = null;
    let minDist = Infinity;

    const avatarX = position.x + AVATAR_WIDTH / 2;
    const avatarY = position.y + AVATAR_HEIGHT / 2;

    BUILDINGS.forEach((building) => {
      const centreX = building.x;
      const centreY = building.y + building.height / 2;

      const dx = avatarX - centreX;
      const dy = avatarY - centreY;
      const dist = Math.hypot(dx, dy);

      if (dist < 90 && dist < minDist) {
        nearest = building.id;
        minDist = dist;
      }
    });

    setNearBuilding(nearest);
    console.log("Nearest building:", nearest);
  }, [position]);

  return (
    // <div
    //   style={{
    //     width: "100vw",
    //     height: "100vh",
    //     background: "#E8E0F0",
    //     position: "relative",
    //   }}
    // >

    <div className="w-screen h-screen overflow-hidden">
      <TownMap
        playerX={position.x}
        playerY={position.y}
        nearBuilding={nearBuilding}
        onBuildingClick={handleBuildingClick}
      />

      <div
        style={{
          position: "absolute",
          left: position.x - 24,
          top: position.y - 24,
          zIndex: 20,
          pointerEvents: "none",
        }}
      >
        <Player
          position={position}
          direction={direction}
          isMoving={isMoving}
          avatarStyle={myAvatarStyle}
        />
      </div>
      {/* </div> */}

      {/* 
      <div style={{ position: "absolute", right: 50, top: 50 }}>☕ Cafe</div>
      {enterCafe && <button onClick={() => setRoom("cafe")}>Enter Cafe</button>}

      <div style={{ position: "absolute", right: 50, bottom: 50 }}>
        📚 Study
      </div>
      {enterStudy && (
        <button onClick={() => setRoom("study")}>Enter Study</button>
      )} */}
    </div>
  );
}
