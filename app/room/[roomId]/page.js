"use client"
import { pusherClient } from "@/pusher/pusher";
import { useEffect, useState } from "react";
import { useSearchParams } from 'next/navigation'
import Game from "@/components/Game";


const page = ({params}) => {

  const {roomId} =params;
  const searchParams = useSearchParams()
  const player = searchParams.get('player')
  const [startGame,setStartGame] = useState(false);

  const fstartGame=async ()=>{
    if(startGame){
      return;
    }
    setStartGame(true);  
  }

  useEffect(()=>{

    

    if(player==='red') {
      if(!pusherClient) console.log("NO PUSHER CLIENT")
      
      pusherClient.subscribe(roomId);

      pusherClient.bind('player-join',(data)=>{
        if(data==='player-2 joined') {
          fstartGame();
        }        
      })
    }
    else if (player==='yellow') {
      fstartGame();
    }

    return () => {
      pusherClient.unsubscribe(roomId);

      pusherClient.unbind('player-join',(data)=>{
        fstartGame();
      })
    }

  },[])
  
  return (
    <div>
      <p className="text-center">Joined room: {roomId}   <span className="text-red-400">DO NOT REFRESH</span>  </p>

      <p className="text-center">{ !startGame && "Waiting for other player to join..."   }</p>

       { startGame &&
        <Game 
          roomId={roomId}
          player={player}
        />
       }

    </div>
  )
}

export default page
