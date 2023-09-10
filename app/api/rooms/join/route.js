import { pusherServer } from '@/pusher/pusher'

export const POST = async (req) => { 

  try{
    const { roomId } = await req.json();

    await pusherServer.trigger(roomId,'player-join',"player-2 joined");
    
    return new Response(JSON.stringify(roomId),{status:200});
  }
  catch (e) {
    console.log(e)
    return new Response(e,{status:511})
  }
}

