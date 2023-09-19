"use client"
import { isWinner,emptyBoard} from '@/utils';
import React, { useEffect, useState } from 'react';
import { rows, cols } from '@/constants/constants';
import Identifier from '@/components/Identifier';
import Slot from '@/components/Slot'; 
import { pusherClient } from '@/pusher/pusher';
import axios from 'axios';
import {useRouter} from 'next/navigation'
const Game = ({roomId,player}) => {

  const router = useRouter();

  const [turn, setTurn] = useState('red')
  const isTurn = turn===player

  const [ board, setBoard ] = useState(emptyBoard);


  useEffect(()=>{
    console.log("called")
    setBoard(emptyBoard)

    pusherClient.subscribe(roomId);
    
    if(player==='red'){
      pusherClient.bind('player2move',(data)=>{
        console.log("Recieved message !!")
        const {colIndex}=data
        handleOpClick(colIndex)
      })
    }
    else if(player==='yellow'){
      pusherClient.bind('player1move',(data)=>{
        console.log("Recieved message !!")
        const {colIndex}=data
        handleOpClick(colIndex)
    
      })
    }

    return () => {
      pusherClient.unsubscribe(roomId)
      if(player==='red'){
        pusherClient.unbind('player2move',(data)=>{
          console.log("Recieved message !!")
          const {colIndex}=data
          handleOpClick(colIndex)
        })
      }
      else if(player==='yellow'){
        pusherClient.unbind('player1move',(data)=>{
          console.log("Recieved message !!")
          const {colIndex}=data
          handleOpClick(colIndex)
      
        })
      }
    }

  },[])

  useEffect(()=>{
    if(isWinner(board,player)){

      setTimeout(() => {
        alert(`Player ${player} won`)
      }, 500);

      

      setTimeout(() => {
        router.push('/?reload=true');

      }, 1000);
      
    }
    if(isWinner(board, player==='red'? "yellow" : "red")){
      setTimeout(() => {
        alert(`Player ${player==='red'? "yellow" : "red"} won`)
      }, 500);

      setTimeout(() => {
        router.push('/?reload=true');

      }, 1000);
    }

  },[turn])



  const handleOpClick = (colIndex)=> {

    const updatedBoard = [...board];

    for (let rowIndex = rows - 1; rowIndex >= 0; rowIndex--) {
      if (updatedBoard[rowIndex][colIndex] === '#') {
        updatedBoard[rowIndex][colIndex] = (player==="red"? "yellow" : "red");
        break; 
      }   
    }

    setBoard(updatedBoard);
    setTurn((prev)=>{
      if(prev==='red') return 'yellow'
      else return 'red'
    })

    
   
  }

  const handleMyClick = (colIndex)=> {
    
    if(!isTurn)  return;

    const updatedBoard = [...board];

    for (let rowIndex = rows - 1; rowIndex >= 0; rowIndex--) {
      if (updatedBoard[rowIndex][colIndex] === '#') {
        updatedBoard[rowIndex][colIndex] = turn;
        break; 
      }   
    }

    setBoard(updatedBoard);
    setTurn((prev)=>{
      if(prev==='red') return 'yellow'
      else return 'red'
    })
    console.log("switchedTurn!!",turn)
    

    const sendMessage = async (colIndex) =>{
      const response = axios.post('/api/message',{
        roomId,
        player,
        colIndex
      })
    }

    sendMessage(colIndex).then(
      console.log("Message sent!! ",turn)
    )

    
  }



  return (
    <main className={`w-full text-center`}>
      {`You are colour ${player}.`}
      <h1 className="text-center font-mono text-5xl mt-10">Connect-4!!</h1>
      <h3 className="text-center font-sans text-slate-400 text-sm mb-10">created by Harshith K©</h3>

      <div className='flex flex-col justify-center items-center '>
      
      <div className={`w-[359px] sm:w-[280px] p-1 rounded-md mt-2 bg-blue-400 grid-cols-${rows} justify-center`}>

        {board.map((row, rowIndex) => (
          <div className='flex flex-row justify-center' key={rowIndex}>
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
  
      <div className={`flex justify-center  w-[359px] sm:w-[295px] p-1 rounded-md mt-2 ${turn === 'red' && 'bg-red-400' } ${turn === 'yellow' && 'bg-yellow-300' } grid-cols-${rows} justify-center`}>
        {board.map((col,colIndex) => (
          <Identifier 
            key={`${colIndex}`}
            turn={turn}
          />
        ))}
      </div>
      
      <div className='flex justify-center mt-8'>
        <p>
          It's {turn }'s turn
        </p>
      </div>
      
    </div>
    </main>
  )
}

export default Game
