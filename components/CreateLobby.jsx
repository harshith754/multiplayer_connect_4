"use client"
import axios from 'axios'

import { useRouter } from 'next/navigation'


const CreateLobby = ({roomId}) => {

  const router = useRouter()

  const handleEnter= async ()=>{

    const res= await axios.post('/api/rooms/create',{roomId})

    console.log(res)

    router.push(`/room/${roomId}?player=red`);
  }

  return (
    <div className="flex justify-center">
        <button 
          className='bg-blue-500 mt-5 px-10 py-2 rounded-md text-white hover:bg-blue-600 '
          onClick={handleEnter}
        >
          Create Lobby
        </button>
      </div>
  )
}

export default CreateLobby
