import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Video,
  VideoOff,
  Mic,
  MicOff,
  Users,
  Clock,
  BookOpen,
  Sparkles,
} from "lucide-react";
import { Button } from "./Button";
import Avatar from "./Avatar";

// Virtual study buddies (simulated)
const STUDY_BUDDIES = [
  {
    id: 1,
    name: "Alex",
    subject: "Mathematics",
    time: "45 min",
    style: { body: 2, hair: 1, outfit: 2 },
    hasCamera: true,
  },
  {
    id: 2,
    name: "Jamie",
    subject: "History",
    time: "1h 20min",
    style: { body: 0, hair: 3, outfit: 4 },
    hasCamera: false,
  },
  {
    id: 3,
    name: "Sam",
    subject: "Physics",
    time: "30 min",
    style: { body: 1, hair: 5, outfit: 1 },
    hasCamera: true,
  },
  {
    id: 4,
    name: "Riley",
    subject: "Literature",
    time: "2h 5min",
    style: { body: 3, hair: 2, outfit: 5 },
    hasCamera: true,
  },
];

export default function StudyRoom({ setRoom, avatarStyle }) {
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [studyTime, setStudyTime] = useState(0);
  const [hasJoined, setHasJoined] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    let interval;
    if (hasJoined) {
      interval = setInterval(() => {
        setStudyTime((t) => t + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [hasJoined]);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    }
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const toggleCamera = async () => {
    if (isCameraOn) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      setIsCameraOn(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsCameraOn(true);
      } catch (err) {
        console.log("Camera access denied:", err);
      }
    }
  };

  const handleJoin = () => {
    setHasJoined(true);
  };

  const handleLeave = () => {
    setHasJoined(false);
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-gradient-to-b from-slate-900 to-slate-800"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-teal-400" />
          <h2 className="text-xl font-bold text-white">Study Hall</h2>
          {hasJoined && (
            <div className="ml-4 flex items-center gap-2 px-3 py-1 bg-teal-500/20 rounded-full">
              <Clock className="h-4 w-4 text-teal-400" />
              <span className="text-teal-300 font-mono">
                {formatTime(studyTime)}
              </span>
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setRoom("town")}
          className="rounded-full bg-white/10 text-white hover:bg-white/20"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {!hasJoined ? (
        /* Join Screen */
        <div className="h-full flex flex-col items-center justify-center px-4">
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-teal-400 to-cyan-400 rounded-3xl flex items-center justify-center">
              <Users className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              Silent Study Session
            </h3>
            <p className="text-gray-400">
              Study together in peaceful silence with others
            </p>
          </motion.div>

          <motion.div
            className="flex items-center gap-3 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex -space-x-3">
              {STUDY_BUDDIES.slice(0, 4).map((buddy, i) => (
                <div
                  key={buddy.id}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 border-2 border-slate-800 flex items-center justify-center"
                >
                  <span className="text-white text-sm font-medium">
                    {buddy.name[0]}
                  </span>
                </div>
              ))}
            </div>
            <span className="text-gray-300">
              {STUDY_BUDDIES.length} studying now
            </span>
          </motion.div>

          <Button
            onClick={handleJoin}
            className="h-14 px-8 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 rounded-2xl text-lg font-semibold"
          >
            <Sparkles className="mr-2 h-5 w-5" />
            Join Session
          </Button>
        </div>
      ) : (
        /* Study Room View */
        <div className="h-full pt-16 pb-24 px-4">
          {/* Video Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 h-full max-h-[60vh] overflow-y-auto">
            {/* Your video */}
            <motion.div
              className="relative aspect-video bg-slate-700 rounded-2xl overflow-hidden"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              {isCameraOn ? (
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Avatar style={avatarStyle} size={64} direction="down" />
                </div>
              )}
              <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/50 rounded-lg">
                <span className="text-white text-sm font-medium">You ✨</span>
              </div>
              {!isCameraOn && (
                <div className="absolute top-2 right-2 p-1.5 bg-red-500/80 rounded-lg">
                  <VideoOff className="h-4 w-4 text-white" />
                </div>
              )}
            </motion.div>

            {/* Study buddies */}
            {STUDY_BUDDIES.map((buddy, index) => (
              <motion.div
                key={buddy.id}
                className="relative aspect-video bg-slate-700 rounded-2xl overflow-hidden"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: (index + 1) * 0.1 }}
              >
                <div className="w-full h-full flex items-center justify-center">
                  {buddy.hasCamera ? (
                    <div className="w-full h-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center">
                      <Avatar style={buddy.style} size={56} direction="down" />
                    </div>
                  ) : (
                    <Avatar style={buddy.style} size={64} direction="down" />
                  )}
                </div>
                <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center">
                  <span className="px-2 py-1 bg-black/50 rounded-lg text-white text-sm font-medium">
                    {buddy.name}
                  </span>
                  <span className="px-2 py-0.5 bg-teal-500/30 rounded text-teal-300 text-xs">
                    {buddy.time}
                  </span>
                </div>
                {!buddy.hasCamera && (
                  <div className="absolute top-2 right-2 p-1.5 bg-slate-600/80 rounded-lg">
                    <VideoOff className="h-4 w-4 text-gray-400" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Study subject indicator */}
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            {STUDY_BUDDIES.map((buddy) => (
              <div
                key={buddy.id}
                className="px-3 py-1 bg-white/10 rounded-full text-sm text-gray-300"
              >
                {buddy.name}: {buddy.subject}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Controls */}
      {hasJoined && (
        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 p-3 bg-slate-800/90 backdrop-blur-lg rounded-2xl"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <Button
            variant={isMicOn ? "default" : "secondary"}
            size="icon"
            onClick={() => setIsMicOn(!isMicOn)}
            className={`h-12 w-12 rounded-xl ${
              isMicOn
                ? "bg-teal-500 hover:bg-teal-600"
                : "bg-slate-600 hover:bg-slate-500"
            }`}
          >
            {isMicOn ? (
              <Mic className="h-5 w-5 text-white" />
            ) : (
              <MicOff className="h-5 w-5 text-white" />
            )}
          </Button>

          <Button
            variant={isCameraOn ? "default" : "secondary"}
            size="icon"
            onClick={toggleCamera}
            className={`h-12 w-12 rounded-xl ${
              isCameraOn
                ? "bg-teal-500 hover:bg-teal-600"
                : "bg-slate-600 hover:bg-slate-500"
            }`}
          >
            {isCameraOn ? (
              <Video className="h-5 w-5 text-white" />
            ) : (
              <VideoOff className="h-5 w-5 text-white" />
            )}
          </Button>

          <Button
            variant="destructive"
            onClick={handleLeave}
            className="h-12 px-6 rounded-xl bg-red-500 hover:bg-red-600"
          >
            Leave
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}
