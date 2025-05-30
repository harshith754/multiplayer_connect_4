"use client"


import CreateLobby from "../components/CreateLobby"

import { useRouter } from "next/navigation"


const Dashboard = ( {searchParams}) => {


  if(searchParams.reload){

    setTimeout(()=>{
      const baseUrl = window.location.origin + window.location.pathname;
       window.location.href = baseUrl;
    },100)
    
  }

  return (

    <main className="w-full">
      <h1 className="text-center font-mono text-5xl mt-10">Connect-4!!</h1>
      <h3 className="text-center font-sans text-slate-400 text-sm mb-10">created by Harshith ©</h3>

      <CreateLobby />

    </main>
  )
}

export default Dashboard
