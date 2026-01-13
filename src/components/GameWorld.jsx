import { useEffect, useState } from "react";
import Player from "./Player";
import useMovement from "../hooks/useMovement";
import TownMap, { BUILDINGS, MAP_WIDTH, MAP_HEIGHT } from "./TownMap";

export default function GameWorld({ setRoom }) {
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const { direction, isMoving } = useMovement(position, setPosition);
  const [nearBuilding, setNearBuilding] = useState(null);
  const handleBuildingClick = (id) => {
    if (nearBuilding === id) {
      setRoom(id);
    }
  };
  const [myAvatarStyle, setMyAvatarStyle] = useState({
    body: 0,
    hair: 1,
    outfit: 2,
  });

  useEffect(() => {
    let nearest = null;
    let minDist = Infinity;
    BUILDINGS.forEach((building) => {
      const centreX = building.x + 48;
      const centreY = building.y + 56;

      const dx = position.x - centreX;
      const dy = position.y - centreY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 60 && dist < minDist) {
        nearest = b.id;
        minDist = dist;
      }
    });

    setNearBuilding(nearest);
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

    <div className="relative w-screen h-screen overflow-hidden bg-[#E8E0F0]">
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
