import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  X,
  Play,
  Pause,
  SkipForward,
  Volume2,
  VolumeX,
  Coffee,
  Music,
} from "lucide-react";
import { Button } from "./Button";
import { Slider } from "@radix-ui/react-slider";
import Avatar from "./Avatar";

// Lofi stations
const LOFI_STATIONS = [
  {
    name: "Chill Beats",
    url: "https://streams.ilovemusic.de/iloveradio17.mp3",
    vibe: "🎹",
  },
  {
    name: "Jazz Hop",
    url: "https://streams.ilovemusic.de/iloveradio21.mp3",
    vibe: "🎷",
  },
  {
    name: "Study Vibes",
    url: "https://streams.ilovemusic.de/iloveradio17.mp3",
    vibe: "📖",
  },
];

// Fake cafe patrons
const CAFE_PATRONS = [
  {
    id: 1,
    name: "Luna",
    activity: "Reading a novel",
    style: { body: 1, hair: 2, outfit: 0 },
    x: 15,
    y: 30,
  },
  {
    id: 2,
    name: "Kai",
    activity: "Writing notes",
    style: { body: 2, hair: 0, outfit: 3 },
    x: 70,
    y: 25,
  },
  {
    id: 3,
    name: "Mira",
    activity: "Sketching",
    style: { body: 0, hair: 4, outfit: 1 },
    x: 40,
    y: 60,
  },
];

export default function CafeRoom({ setRoom, avatarStyle }) {
  const [hasEnteredCafe, setHasEnteredCafe] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const [currentStation, setCurrentStation] = useState(0);
  const audioRef = useRef(null);

  // Setup audio
  useEffect(() => {
    if (!hasEnteredCafe) return;
    audioRef.current = new Audio(LOFI_STATIONS[currentStation].url);
    audioRef.current.volume = volume / 100;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [hasEnteredCafe, currentStation]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current
          .play()
          .catch((e) => console.log("Audio play failed:", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const nextStation = () => {
    const wasPlaying = isPlaying;
    if (audioRef.current) audioRef.current.pause();

    const nextIndex = (currentStation + 1) % LOFI_STATIONS.length;
    setCurrentStation(nextIndex);

    audioRef.current = new Audio(LOFI_STATIONS[nextIndex].url);
    audioRef.current.volume = isMuted ? 0 : volume / 100;

    if (wasPlaying)
      audioRef.current
        .play()
        .catch((e) => console.log("Audio play failed:", e));
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-gradient-to-b from-amber-100 to-orange-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <Coffee className="h-6 w-6 text-amber-700" />
          <h2 className="text-xl font-bold text-amber-900">Cozy Café</h2>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setRoom("town")}
          className="rounded-full bg-white/50"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {!hasEnteredCafe ? (
        /* Enter Cafe Screen */
        <div className="h-full flex flex-col items-center justify-center px-4">
          <h3 className="text-2xl font-bold mb-4">
            Welcome to the Cozy Café ☕
          </h3>
          <p className="text-gray-600 mb-8 text-center">
            Sit back, relax, and enjoy some lofi vibes.
          </p>
          <Button
            onClick={() => setHasEnteredCafe(true)}
            className="h-14 px-8 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 rounded-2xl text-lg font-semibold"
          >
            Enter Cafe
          </Button>
        </div>
      ) : (
        /* Cafe Experience */
        <>
          {/* Cafe patrons */}
          {CAFE_PATRONS.map((patron) => (
            <motion.div
              key={patron.id}
              className="absolute"
              style={{ left: `${patron.x}%`, top: `${patron.y}%` }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: patron.id * 0.2 }}
            >
              <div className="flex flex-col items-center">
                <Avatar style={patron.style} size={40} direction="down" />
                <div className="mt-1 px-2 py-0.5 bg-white/80 rounded-full text-xs text-gray-600">
                  {patron.activity}
                </div>
              </div>
            </motion.div>
          ))}

          {/* Your avatar */}
          <motion.div
            className="absolute"
            style={{ left: "50%", top: "75%", transform: "translateX(-50%)" }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex flex-col items-center">
              <Avatar style={avatarStyle} size={48} direction="down" />
              <div className="mt-1 px-2 py-0.5 bg-white/80 rounded-full text-xs font-medium text-amber-700">
                You ✨
              </div>
            </div>
          </motion.div>

          {/* Music Player */}
          <motion.div
            className="absolute bottom-6 left-4 right-4 bg-white/90 backdrop-blur-lg rounded-3xl p-6 shadow-2xl"
            initial={{ y: 100 }}
            animate={{ y: 0 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center">
                <Music className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800">
                  {LOFI_STATIONS[currentStation].name}
                </p>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  {LOFI_STATIONS[currentStation].vibe} Lofi Radio
                </p>
              </div>
              {isPlaying && (
                <div className="flex gap-0.5">
                  {[...Array(4)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-1 bg-purple-400 rounded-full"
                      animate={{ height: [8, 16, 8] }}
                      transition={{
                        duration: 0.5,
                        repeat: Infinity,
                        delay: i * 0.1,
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-center gap-4 mb-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMuted(!isMuted)}
                className="rounded-full"
              >
                {isMuted ? (
                  <VolumeX className="h-5 w-5" />
                ) : (
                  <Volume2 className="h-5 w-5" />
                )}
              </Button>

              <Button
                size="icon"
                onClick={togglePlay}
                className="h-14 w-14 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                {isPlaying ? (
                  <Pause className="h-6 w-6 text-white" />
                ) : (
                  <Play className="h-6 w-6 text-white ml-1" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={nextStation}
                className="rounded-full"
              >
                <SkipForward className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex items-center gap-3">
              <VolumeX className="h-4 w-4 text-gray-400" />
              <Slider
                value={[volume]}
                onValueChange={(val) => setVolume(val[0])}
                max={100}
                step={1}
                className="flex-1"
              />
              <Volume2 className="h-4 w-4 text-gray-400" />
            </div>

            {/* Leave Cafe Button */}
            <Button
              variant="destructive"
              onClick={() => setHasEnteredCafe(false)}
              className="mt-4 w-full"
            >
              Leave Cafe
            </Button>
          </motion.div>
        </>
      )}
    </motion.div>
  );
}
