import React from "react";
import { motion } from "framer-motion";
import { Coffee, BookOpen, Home, Users } from "lucide-react";

const BUILDING_CONFIGS = {
  cafe: {
    icon: Coffee,
    name: "Cozy Café",
    colors: {
      roof: "#8B4513",
      wall: "#DEB887",
      door: "#654321",
      accent: "#FFD700",
    },
    emoji: "☕",
  },
  study: {
    icon: BookOpen,
    name: "Study Hall",
    colors: {
      roof: "#4A5568",
      wall: "#E2E8F0",
      door: "#2D3748",
      accent: "#4ECDC4",
    },
    emoji: "📚",
  },
  home: {
    icon: Home,
    name: "Your Room",
    colors: {
      roof: "#9B59B6",
      wall: "#F5E6FF",
      door: "#7B2CBF",
      accent: "#FFB5BA",
    },
    emoji: "🏠",
  },
  social: {
    icon: Users,
    name: "Community Center",
    colors: {
      roof: "#E74C3C",
      wall: "#FADBD8",
      door: "#B03A2E",
      accent: "#F39C12",
    },
    emoji: "👥",
  },
};

export default function Building({
  type = "cafe",
  x,
  y,
  isNear = false,
  onClick,
}) {
  const config = BUILDING_CONFIGS[type] || BUILDING_CONFIGS.cafe;
  const Icon = config.icon;

  return (
    <motion.div
      className="absolute cursor-pointer"
      style={{ left: x, top: y }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      {/* Building structure */}
      <div className="relative w-24 h-28">
        {/* Roof */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0"
          style={{
            borderLeft: "55px solid transparent",
            borderRight: "55px solid transparent",
            borderBottom: `35px solid ${config.colors.roof}`,
          }}
        />

        {/* Main wall */}
        <div
          className="absolute top-8 left-1/2 -translate-x-1/2 w-24 h-20 rounded-b-lg shadow-lg"
          style={{ backgroundColor: config.colors.wall }}
        >
          {/* Window */}
          <div className="absolute top-2 left-2 w-6 h-6 bg-sky-200 rounded border-2 border-white">
            <div className="w-full h-0.5 bg-white absolute top-1/2 -translate-y-1/2" />
            <div className="h-full w-0.5 bg-white absolute left-1/2 -translate-x-1/2" />
          </div>

          {/* Window 2 */}
          <div className="absolute top-2 right-2 w-6 h-6 bg-sky-200 rounded border-2 border-white">
            <div className="w-full h-0.5 bg-white absolute top-1/2 -translate-y-1/2" />
            <div className="h-full w-0.5 bg-white absolute left-1/2 -translate-x-1/2" />
          </div>

          {/* Door */}
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-12 rounded-t-lg"
            style={{ backgroundColor: config.colors.door }}
          >
            <div
              className="absolute top-1/2 right-1 w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: config.colors.accent }}
            />
          </div>

          {/* Sign */}
          <div
            className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-xs font-medium text-white shadow-md whitespace-nowrap"
            style={{ backgroundColor: config.colors.roof }}
          >
            {config.emoji} {config.name}
          </div>
        </div>

        {/* Interaction indicator */}
        {isNear && (
          <motion.div
            className="absolute -top-6 left-1/2 -translate-x-1/2 px-2 py-1 bg-white rounded-full shadow-lg text-xs font-medium flex items-center gap-1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span>Press</span>
            <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">E</kbd>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export { BUILDING_CONFIGS };
