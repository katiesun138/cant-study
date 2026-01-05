import React from "react";
import { motion } from "framer-motion";

const AVATAR_STYLES = {
  body: ["#FFB5BA", "#D4A574", "#8B6914", "#F5DEB3"],
  hair: ["#2C1810", "#8B4513", "#FFD700", "#FF6B6B", "#9B59B6", "#3498DB"],
  outfit: ["#FF6B6B", "#4ECDC4", "#9B59B6", "#F39C12", "#1ABC9C", "#E74C3C"],
};

export default function Avatar({
  direction = "down",
  isMoving = false,
  style = {},
  size = 64,
}) {
  const { body = 0, hair = 0, outfit = 0 } = style;

  const bodyColor = AVATAR_STYLES.body[body % AVATAR_STYLES.body.length];
  const hairColor = AVATAR_STYLES.hair[hair % AVATAR_STYLES.hair.length];
  const outfitColor =
    AVATAR_STYLES.outfit[outfit % AVATAR_STYLES.outfit.length];

  const getEyePosition = () => {
    switch (direction) {
      case "left":
        return { left: -2, right: -2 };
      case "right":
        return { left: 2, right: 2 };
      default:
        return { left: 0, right: 0 };
    }
  };

  const eyePos = getEyePosition();
  const showBack = direction === "up";

  return (
    <motion.div
      className="relative w-full h-full flex flex-col items-center justify-end"
      style={{ width: size, height: size }}
      animate={isMoving ? { y: [0, -3, 0] } : { y: [0, -1.5, 0] }}
      transition={{
        duration: isMoving ? 0.3 : 0.6,
        repeat: Infinity,
        repeatType: "easeInOut",
      }}
    >
      {/* Shadow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full bg-black/20"
        style={{ width: size * 0.6, height: size * 0.15 }}
      />

      {/* Stack Head + Body vertically */}
      <div className="flex flex-col items-center">
        {/* Head */}
        <div
          className="relative rounded-full"
          style={{
            width: size * 0.6,
            height: size * 0.5,
            backgroundColor: bodyColor,
          }}
        >
          {/* Hair */}
          <div
            className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full"
            style={{
              width: size * 0.65,
              height: size * 0.35,
              backgroundColor: hairColor,
            }}
          />

          {!showBack && (
            <>
              {/* Eyes */}
              <div
                className="absolute bg-gray-800 rounded-full"
                style={{
                  width: size * 0.1,
                  height: size * 0.12,
                  top: "45%",
                  left: `calc(30% + ${eyePos.left}px)`,
                }}
              />
              <div
                className="absolute bg-gray-800 rounded-full"
                style={{
                  width: size * 0.1,
                  height: size * 0.12,
                  top: "45%",
                  right: `calc(30% - ${eyePos.right}px)`,
                }}
              />

              {/* Blush */}
              <div
                className="absolute rounded-full opacity-50"
                style={{
                  width: size * 0.12,
                  height: size * 0.08,
                  backgroundColor: "#FFB5BA",
                  top: "60%",
                  left: "15%",
                }}
              />
              <div
                className="absolute rounded-full opacity-50"
                style={{
                  width: size * 0.12,
                  height: size * 0.08,
                  backgroundColor: "#FFB5BA",
                  top: "60%",
                  right: "15%",
                }}
              />
            </>
          )}
        </div>

        {/* Body */}
        <div
          className="rounded-lg mt-1"
          style={{
            width: size * 0.5,
            height: size * 0.4,
            backgroundColor: outfitColor,
          }}
        />
      </div>
    </motion.div>
  );
}

export { AVATAR_STYLES };
