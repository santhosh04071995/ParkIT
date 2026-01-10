import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useEffect, useState } from "react"
import axios from "./config/axios"
export default function ChatBot(){
  let [text,setText] = useState({
    message :''
  })
  let [msg, setMsg] = useState({
    data:[],
    thinking:false
    }
  )
  // console.log('sampale array', msg.data)
  let handleAiSubmit=async(text)=> {
    setMsg({...msg,data:[...msg.data,text.message],thinking:true})     
  }
  useEffect(()=> {
    let myfunc = async ()=> {
      let result;
      try {
         result = await axios.post('/chat',text)
         setMsg({...msg,data:[...msg.data,result.data],thinking:false})
         setText({...text,message:''})
      } catch (error) {
        console.log('error', error.response.data)
         setMsg({...msg,data:[...msg.data,error.response.data],thinking:false})
      }
    }
   
    if(msg.thinking){
      myfunc()
    }
    
  },[msg])
  return (
    <div>
      <Sheet>
       
      <SheetTrigger asChild>
        <Button variant="outline" className='fixed bottom-6 right-6 flex items-center gap-2
         bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
         text-white font-semibold px-5 py-3 rounded-full
         shadow-lg hover:shadow-2xl
         hover:scale-105 transition-all duration-300
         animate-pulse"'>Ask AI</Button>
      </SheetTrigger>
      <SheetContent>
         <h1>{text.message}</h1>
         
        <SheetHeader>
          <SheetTitle>AI Chatbot</SheetTitle>
          <SheetDescription className='text-center'> Ask me anything... </SheetDescription>
        </SheetHeader>
        <div className="grid flex-1 auto-rows-min gap-6 px-4  h-[80%] overflow-auto">
          <div className="flex flex-col gap-2">
  {msg.data.map((msg, index) => (
    <div
  key={index}
  className={`relative max-w-[70%] p-2 rounded-2xl font-medium ${
    index % 2 === 0
      ? "self-end bg-red-400 text-right text-white"
      : "self-start bg-green-400 text-left text-white"
  }`}
>
  {msg}

  {/* Tail */}
  <span
    className={`absolute bottom-1 w-3 h-3 rotate-45 ${
      index % 2 === 0
        ? "bg-red-400 -right-1"
        : "bg-green-400 -left-1"
    }`}
  />
</div>

    
    
    // <div
    //   key={index}
    //   className={`max-w-[70%] p-1 rounded font-medium ${
    //     index % 2 === 0
    //       ? "self-end bg-red-400 text-right text-white"
    //       : "self-start bg-green-400 text-left text-white"
    //   }`}
    // >
    //   {msg}
    // </div>
  ))}
</div>


          
        
          
        </div>
        <SheetFooter>
          <Input id="sheet-demo-username" placeholder='Type your message...' value={text.message} 
            onChange={(event)=> setText({...text,message:event.target.value})}
           />
          <Button variant="outline" disabled={msg.thinking}  onClick={()=>handleAiSubmit(text)}>Send</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
    </div>
  )
}