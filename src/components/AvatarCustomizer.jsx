import React from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Avatar, { AVATAR_STYLES } from "./Avatar";

export default function AvatarCustomizer({ style, onChange, onConfirm }) {
  const handleChange = (key, delta) => {
    const maxVal = AVATAR_STYLES[key].length;
    const newVal = (style[key] + delta + maxVal) % maxVal;
    onChange({ ...style, [key]: newVal });
  };

  const options = [
    { key: "body", label: "Skin Tone", icon: "👤" },
    { key: "hair", label: "Hair Style", icon: "💇" },
    { key: "outfit", label: "Outfit", icon: "👕" },
  ];

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-gradient-to-b from-purple-100 to-pink-100 flex flex-col items-center justify-center p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="text-center mb-8"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Create Your Avatar
        </h1>
        <p className="text-gray-500">Customize your study buddy!</p>
      </motion.div>

      {/* Avatar Preview */}
      <motion.div
        className="bg-white rounded-3xl p-8 shadow-2xl mb-8"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="w-32 h-32 flex items-center justify-center">
          <Avatar style={style} size={96} direction="down" />
        </div>
      </motion.div>

      {/* Customization Options */}
      <motion.div
        className="w-full max-w-sm space-y-4 mb-8"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {options.map(({ key, label, icon }) => (
          <div
            key={key}
            className="bg-white rounded-2xl p-4 shadow-lg flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{icon}</span>
              <span className="font-medium text-gray-700">{label}</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full bg-gray-100 hover:bg-gray-200"
                onClick={() => handleChange(key, -1)}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <span className="w-8 text-center font-mono text-gray-600">
                {style[key] + 1}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full bg-gray-100 hover:bg-gray-200"
                onClick={() => handleChange(key, 1)}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Confirm Button */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Button
          onClick={onConfirm}
          className="h-14 px-8 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-2xl text-lg font-semibold shadow-lg"
        >
          <Sparkles className="mr-2 h-5 w-5" />
          Start Exploring!
        </Button>
      </motion.div>
    </motion.div>
  );
}
