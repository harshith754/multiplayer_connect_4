"use client";
import { pusherClient } from "@/pusher/pusher";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Game from "@/components/Game";
import { toast } from "sonner";

const page = ({ params }) => {
  const { roomId } = params;
  const searchParams = useSearchParams();
  const player = searchParams.get("player");
  const [startGame, setStartGame] = useState(false);
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  const fstartGame = async () => {
    if (startGame) {
      return;
    }
    setStartGame(true);
    toast.success("Game Started!");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    toast.success("Room ID copied!");
    setTimeout(() => setCopied(false), 1500);
  };

  useEffect(() => {
    if (player === "red") {
      if (!pusherClient) console.log("NO PUSHER CLIENT");

      pusherClient.subscribe(roomId);

      pusherClient.bind("player-join", (data) => {
        if (data === "player-2 joined") {
          fstartGame();
        }
      });
    } else if (player === "yellow") {
      fstartGame();
    }

    const cleanup = () => {
      pusherClient.unsubscribe(roomId);
      pusherClient.unbind("player-join", (data) => {
        fstartGame();
      });
    };

    // Listen for route changes
    const handleRouteChange = () => {
      cleanup();
    };
    router.events?.on?.("routeChangeStart", handleRouteChange);

    return () => {
      cleanup();
      router.events?.off?.("routeChangeStart", handleRouteChange);
    };
  }, []);

  return (
    <div className="flex flex-col items-center mt-8 gap-4">
      {!startGame && (
        <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded shadow">
          <span className="font-semibold text-lg">Room ID:</span>
          <span className="font-mono text-blue-600 select-all">{roomId}</span>
          <button
            onClick={handleCopy}
            className="ml-2 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      )}
      <p className="text-center text-sm text-gray-500">
        <span className="text-red-400 font-bold">DO NOT REFRESH</span>
      </p>
      <p className="text-center text-lg">
        {!startGame && "Waiting for other player to join..."}
      </p>
      {startGame && <Game roomId={roomId} player={player} />}
    </div>
  );
};

export default page;
