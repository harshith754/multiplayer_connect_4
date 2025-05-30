"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

const CreateLobby = () => {
  const router = useRouter();
  const [joinRoomId, setJoinRoomId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async () => {
    setLoading(true);
    setError("");
    const roomId = uuidv4();
    try {
      await axios.post("/api/rooms/create", { roomId });
      router.push(`/room/${roomId}?player=red`);
    } catch (err) {
      setError("Failed to create lobby.");
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    setLoading(true);
    setError("");
    if (!joinRoomId) {
      setError("Please enter a Room ID.");
      setLoading(false);
      return;
    }
    try {
      await axios.post("/api/rooms/join", { roomId: joinRoomId });
      router.push(`/room/${joinRoomId}?player=yellow`);
    } catch (err) {
      setError("Failed to join lobby. Check Room ID.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 mt-5">
      <button
        className="bg-blue-500 px-10 py-2 rounded-md text-white hover:bg-blue-600 disabled:opacity-50"
        onClick={handleCreate}
        disabled={loading}
      >
        {loading ? "Loading..." : "Create Lobby"}
      </button>
      <div className="flex gap-2 items-center">
        <input
          className="border px-3 py-2 rounded-md"
          type="text"
          placeholder="Enter Room ID to join"
          value={joinRoomId}
          onChange={(e) => setJoinRoomId(e.target.value)}
          disabled={loading}
        />
        <button
          className="bg-green-500 px-6 py-2 rounded-md text-white hover:bg-green-600 disabled:opacity-50"
          onClick={handleJoin}
          disabled={loading}
        >
          Join Lobby
        </button>
      </div>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default CreateLobby;
