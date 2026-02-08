import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Mic, MicOff, Users, Clock, BookOpen, Sparkles } from "lucide-react";
import { Button } from "./Button";
import Avatar from "./Avatar";
import { startLocalStream, createRoom, joinRoom } from "../services/webrtc";

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
  const [isMicOn, setIsMicOn] = useState(false);
  const [studyTime, setStudyTime] = useState(0);
  const [hasJoined, setHasJoined] = useState(false);

  const videoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  // Study timer
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

  const handleJoin = async () => {
    try {
      setHasJoined(true);

      // Start camera immediately
      await startLocalStream(videoRef);

      const roomId = prompt("Enter room ID");
      if (!roomId) return;

      const create = window.confirm("OK = create room, Cancel = join");

      if (create) {
        await createRoom(roomId, remoteVideoRef);
      } else {
        await joinRoom(roomId, remoteVideoRef);
      }
    } catch (err) {
      console.error("JOIN ERROR:", err);
      alert("Something went wrong starting the video. Check console.");
    }
  };

  const handleLeave = () => {
    window.location.reload(); // simplest safe reset for WebRTC
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-gradient-to-b from-slate-900 to-slate-800"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* HEADER */}
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
        /* JOIN SCREEN */
        <div className="h-full flex flex-col items-center justify-center px-4">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-teal-400 to-cyan-400 rounded-3xl flex items-center justify-center">
              <Users className="h-10 w-10 text-white" />
            </div>

            <h3 className="text-2xl font-bold text-white mb-2">
              Silent Study Session
            </h3>

            <p className="text-gray-400">
              Study together in peaceful silence with others
            </p>
          </div>

          <Button
            onClick={handleJoin}
            className="h-14 px-8 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 rounded-2xl text-lg font-semibold"
          >
            <Sparkles className="mr-2 h-5 w-5" />
            Join Session
          </Button>
        </div>
      ) : (
        /* VIDEO ROOM */
        <div className="h-full pt-20 pb-24 px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
            {/* YOUR VIDEO */}
            <motion.div className="relative aspect-video bg-slate-700 rounded-2xl overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />

              <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/50 rounded-lg">
                <span className="text-white text-sm font-medium">You ✨</span>
              </div>
            </motion.div>

            {/* REMOTE VIDEO */}
            <motion.div className="relative aspect-video bg-slate-700 rounded-2xl overflow-hidden">
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />

              <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/50 rounded-lg">
                <span className="text-white text-sm font-medium">Partner</span>
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* CONTROLS */}
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
            className="h-12 w-12 rounded-xl bg-slate-600 hover:bg-slate-500"
          >
            {isMicOn ? (
              <Mic className="h-5 w-5 text-white" />
            ) : (
              <MicOff className="h-5 w-5 text-white" />
            )}
          </Button>

          <Button
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
