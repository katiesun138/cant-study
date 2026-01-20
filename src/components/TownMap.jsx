import React from "react";
import Building from "./Building";

const BUILDINGS = [
  { id: "cafe", type: "cafe", x: 80, y: 120, width: 24, height: 28 },
  { id: "study", type: "study", x: 280, y: 80, width: 24, height: 28 },
  { id: "home", type: "home", x: 480, y: 140, width: 24, height: 28 },
  { id: "social", type: "social", x: 180, y: 280, width: 24, height: 28 },
];

const MAP_WIDTH = 800;
const MAP_HEIGHT = 600;

export default function TownMap({
  playerX,
  playerY,
  onBuildingClick,
  nearBuilding,
}) {
  return (
    <div className="relative w-full h-full bg-gradient-to-b from-green-200 via-green-300 to-green-400">
      {/* Ground texture */}
      <div className="absolute inset-0 opacity-30">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-4 h-4 bg-green-500 rounded-full"
            style={{
              left: Math.random() * MAP_WIDTH,
              top: Math.random() * MAP_HEIGHT,
              opacity: 0.3 + Math.random() * 0.3,
            }}
          />
        ))}
      </div>

      {/* Paths */}
      <div
        className="absolute top-1/2 left-0 right-0 h-16 bg-amber-200/60"
        style={{ transform: "translateY(-50%)" }}
      />
      <div className="absolute left-1/3 top-0 bottom-0 w-16 bg-amber-200/60" />

      {/* Path details */}
      <div
        className="absolute top-1/2 left-0 right-0 h-12 flex items-center justify-around"
        style={{ transform: "translateY(-50%)" }}
      >
        {[...Array(10)].map((_, i) => (
          <div key={i} className="w-8 h-2 bg-amber-300/50 rounded-full" />
        ))}
      </div>

      {/* Decorative trees */}
      {[
        { x: 40, y: 60 },
        { x: 580, y: 50 },
        { x: 650, y: 200 },
        { x: 100, y: 400 },
        { x: 400, y: 380 },
        { x: 700, y: 450 },
      ].map((tree, i) => (
        <div key={i} className="absolute" style={{ left: tree.x, top: tree.y }}>
          <div className="w-2 h-8 bg-amber-700 mx-auto" />
          <div className="w-12 h-12 bg-green-600 rounded-full -mt-4 shadow-lg" />
          <div className="w-8 h-8 bg-green-500 rounded-full -mt-6 mx-auto" />
        </div>
      ))}

      {/* Flowers */}
      {[...Array(15)].map((_, i) => (
        <div
          key={`flower-${i}`}
          className="absolute"
          style={{
            left: 50 + Math.random() * (MAP_WIDTH - 100),
            top: 50 + Math.random() * (MAP_HEIGHT - 100),
          }}
        >
          <div
            className={`w-3 h-3 rounded-full ${
              ["bg-pink-400", "bg-yellow-400", "bg-purple-400", "bg-red-400"][
                i % 4
              ]
            }`}
          />
        </div>
      ))}

      {/* Pond */}
      <div className="absolute" style={{ left: 550, top: 350 }}>
        <div className="w-32 h-20 bg-blue-300 rounded-full opacity-80" />
        <div className="w-24 h-14 bg-blue-400 rounded-full absolute top-2 left-4 opacity-60" />
      </div>

      {/* Buildings */}
      {BUILDINGS.map((building) => (
        <Building
          key={building.id}
          type={building.type}
          x={building.x}
          y={building.y}
          isNear={nearBuilding === building.id}
          onClick={() => onBuildingClick(building.id)}
        />
      ))}

      {/* Benches */}
      {[
        { x: 350, y: 200 },
        { x: 150, y: 450 },
      ].map((bench, i) => (
        <div
          key={`bench-${i}`}
          className="absolute"
          style={{ left: bench.x, top: bench.y }}
        >
          <div className="w-16 h-3 bg-amber-600 rounded" />
          <div className="flex justify-between">
            <div className="w-2 h-4 bg-amber-700" />
            <div className="w-2 h-4 bg-amber-700" />
          </div>
        </div>
      ))}
    </div>
  );
}

export { BUILDINGS, MAP_WIDTH, MAP_HEIGHT };
