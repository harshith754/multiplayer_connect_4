
export const POST = async (req) => { 

  try{
    
    const { roomId } = await req.json();
    
    return new Response(JSON.stringify(roomId),{status:200});
  }
  catch (e) {
    console.log(e)
    return new Response(e,{status:511})
  }
}

