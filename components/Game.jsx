"use client";
import { isWinner, emptyBoard } from "@/utils";
import React, { useEffect, useState } from "react";
import { rows, cols } from "@/constants/constants";
import Identifier from "@/components/Identifier";
import Slot from "@/components/Slot";
import { pusherClient } from "@/pusher/pusher";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const Game = ({ roomId, player }) => {
  const router = useRouter();

  const [turn, setTurn] = useState("red");
  const [board, setBoard] = useState(emptyBoard);

  const isTurn = turn === player;

  useEffect(() => {
    setBoard(emptyBoard);
    setTurn("red");
  }, [roomId, player]);

  const handleOpClick = React.useCallback(
    (colIndex) => {
      setBoard((prevBoard) => {
        const updatedBoard = [...prevBoard];
        for (let rowIndex = rows - 1; rowIndex >= 0; rowIndex--) {
          if (updatedBoard[rowIndex][colIndex] === "#") {
            updatedBoard[rowIndex][colIndex] =
              player === "red" ? "yellow" : "red";
            break;
          }
        }
        return updatedBoard;
      });
      toast.success("Opponent Played!!");
      setTurn((prev) => (prev === "red" ? "yellow" : "red"));
    },
    [player]
  );

  useEffect(() => {
    pusherClient.subscribe(roomId);

    if (player === "red") {
      pusherClient.bind("player2move", (data) => {
        const { colIndex } = data;
        handleOpClick(colIndex);
      });
    } else if (player === "yellow") {
      pusherClient.bind("player1move", (data) => {
        const { colIndex } = data;
        handleOpClick(colIndex);
      });
    }

    return () => {
      pusherClient.unsubscribe(roomId);
      if (player === "red") {
        pusherClient.unbind("player2move");
      } else if (player === "yellow") {
        pusherClient.unbind("player1move");
      }
    };
  }, [roomId, player, handleOpClick]);

  useEffect(() => {
    if (isWinner(board, player)) {
      setTimeout(() => {
        alert(`Player ${player} won`);
      }, 500);

      setTimeout(() => {
        router.push("/?reload=true");
      }, 1000);
    }
    if (isWinner(board, player === "red" ? "yellow" : "red")) {
      setTimeout(() => {
        alert(`Player ${player === "red" ? "yellow" : "red"} won`);
      }, 500);

      setTimeout(() => {
        router.push("/?reload=true");
      }, 1000);
    }
  }, [turn]);

  const handleMyClick = (colIndex) => {
    if (!isTurn) {
      toast.error("Not your turn!!");
      return;
    }

    const updatedBoard = [...board];

    let hasPlayed = false;

    for (let rowIndex = rows - 1; rowIndex >= 0; rowIndex--) {
      if (updatedBoard[rowIndex][colIndex] === "#") {
        updatedBoard[rowIndex][colIndex] = turn;
        hasPlayed = true;
        break;
      }
    }

    if (!hasPlayed) {
      toast.error("Board overflow!!");
      return;
    }

    setBoard(updatedBoard);
    setTurn((prev) => {
      if (prev === "red") return "yellow";
      else return "red";
    });
    console.log("switchedTurn!!", turn);

    const sendMessage = async (colIndex) => {
      const response = axios.post("/api/message", {
        roomId,
        player,
        colIndex,
      });
    };
    sendMessage(colIndex).then(console.log("Message sent!! ", turn));
  };

  return (
    <main className={`w-full text-center`}>
      {`You are colour ${player}.`}
      <h1 className="text-center font-mono text-5xl mt-10">Connect-4!!</h1>
      <h3 className="text-center font-sans text-slate-400 text-sm mb-10">
        created by Harshith K©
      </h3>

      <div className="flex flex-col justify-center items-center ">
        <div
          className={`w-[359px] sm:w-[280px] p-1 rounded-md mt-2 bg-blue-400 grid-cols-${rows} justify-center`}
        >
          {board.map((row, rowIndex) => (
            <div className="flex flex-row justify-center" key={rowIndex}>
              {row.map((col, colIndex) => (
                <Slot
                  key={`(${rowIndex}, ${colIndex})`}
                  state={col}
                  handleClick={() => handleMyClick(colIndex)}
                />
              ))}
            </div>
          ))}
        </div>

        <div
          className={`flex justify-center  w-[359px] sm:w-[295px] p-1 rounded-md mt-2 ${
            turn === "red" && "bg-red-400"
          } ${
            turn === "yellow" && "bg-yellow-300"
          } grid-cols-${rows} justify-center`}
        >
          {board.map((col, colIndex) => (
            <Identifier key={`${colIndex}`} />
          ))}
        </div>

        <div className="flex justify-center mt-8">
          <p>It's {turn}'s turn</p>
        </div>
      </div>
    </main>
  );
};

export default Game;
