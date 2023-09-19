"use client"

import { useEffect, useState } from "react"

import CreateLobby from "../components/CreateLobby"
import JoinLobby from '../components/JoinLobby'

import { useRouter } from "next/navigation"


const Dashboard = ( {searchParams}) => {

  const router = useRouter();

  if(searchParams.reload){

    setTimeout(()=>{
      const baseUrl = window.location.origin + window.location.pathname;
       window.location.href = baseUrl;
    },100)
    
  }

  const [roomId,setRoomId]=useState("")
 
  
  
  return (

    <main className="w-full">
      <h1 className="text-center font-mono text-5xl mt-10">Connect-4!!</h1>
      <h3 className="text-center font-sans text-slate-400 text-sm mb-10">created by Harshith ©</h3>

      <div className="flex flex-col justify-center items-center">

        <h2 className="font-mono text-xl mt-10"> Enter room name:</h2>
        <input className="w-[280px] h-[30px] mt-3 mb-5 text-center text-md font-mono rounded-md border-[1px] border-black" type="text" value={roomId} onChange={(e)=>{
          setRoomId(e.target.value)
        }} />
      </div>
      
      <CreateLobby 
        // playerName={playerName}
        roomId={roomId}
      />

      <JoinLobby 
        roomId={roomId}
      />

      <p className="text-center font-mono mt-10 text-sm text-red-400">Enter new RoomId after each game.</p>
    </main>
  )
}

export default Dashboard
