import { pusherServer } from '@/pusher/pusher'


export const POST= async (req)=>{

  const {roomId , player, colIndex} = await req.json();

  console.log(roomId,player,colIndex)

  try {
    if (player==='red'){
      await pusherServer.trigger(roomId,'player1move',{
        colIndex
      })
      
    }
    else if(player==='yellow'){
      await pusherServer.trigger(roomId,'player2move',{
        colIndex
      })
    }
    return new Response("Sent Message",{status:200})
  }
  catch(e){
    console.log(e);
    return new Response("Message Failed ",{status:500})
  }
 

} 