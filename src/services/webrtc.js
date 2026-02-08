import {
  collection,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  addDoc,
} from "firebase/firestore";
import { db } from "./firebase";

const servers = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

let peerConnection = null;
let localStream = null;

export const startLocalStream = async (videoRef) => {
  localStream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  });

  videoRef.current.srcObject = localStream;

  return localStream;
};

export const createRoom = async (roomId, remoteVideoRef) => {
  peerConnection = new RTCPeerConnection(servers);

  // ⭐ THIS is where your question line goes:
  localStream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, localStream);
  });

  // Listen for remote stream
  peerConnection.ontrack = (event) => {
    const remoteStream = event.streams[0];
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  };

  const roomRef = doc(db, "rooms", roomId);
  const callerCandidates = collection(roomRef, "callerCandidates");

  peerConnection.onicecandidate = async (event) => {
    if (event.candidate) {
      await addDoc(callerCandidates, event.candidate.toJSON());
    }
  };

  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);

  await setDoc(roomRef, {
    offer: {
      type: offer.type,
      sdp: offer.sdp,
    },
  });

  // Listen for answer
  onSnapshot(roomRef, async (snapshot) => {
    const data = snapshot.data();

    if (!peerConnection.currentRemoteDescription && data?.answer) {
      const answer = new RTCSessionDescription(data.answer);
      await peerConnection.setRemoteDescription(answer);
    }
  });

  // Listen for ICE candidates
  const calleeCandidates = collection(roomRef, "calleeCandidates");

  onSnapshot(calleeCandidates, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        peerConnection.addIceCandidate(new RTCIceCandidate(change.doc.data()));
      }
    });
  });
};

export const joinRoom = async (roomId, remoteVideoRef) => {
  peerConnection = new RTCPeerConnection(servers);

  localStream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, localStream);
  });

  peerConnection.ontrack = (event) => {
    remoteVideoRef.current.srcObject = event.streams[0];
  };

  const roomRef = doc(db, "rooms", roomId);
  const roomSnapshot = await getDoc(roomRef);

  if (!roomSnapshot.exists()) {
    alert("Room does not exist!");
    return;
  }

  const calleeCandidates = collection(roomRef, "calleeCandidates");

  peerConnection.onicecandidate = async (event) => {
    if (event.candidate) {
      await addDoc(calleeCandidates, event.candidate.toJSON());
    }
  };

  const offer = roomSnapshot.data().offer;

  await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);

  await setDoc(
    roomRef,
    {
      answer: {
        type: answer.type,
        sdp: answer.sdp,
      },
    },
    { merge: true }
  );

  const callerCandidates = collection(roomRef, "callerCandidates");

  onSnapshot(callerCandidates, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        peerConnection.addIceCandidate(new RTCIceCandidate(change.doc.data()));
      }
    });
  });
};
