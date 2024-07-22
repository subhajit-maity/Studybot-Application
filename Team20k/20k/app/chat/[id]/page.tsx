"use client"
import "regenerator-runtime/runtime";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef } from 'react';
import React from 'react'
import {createRoot} from 'react-dom/client'
import { Suspense } from 'react'
import dynamic from 'next/dynamic';
import { useState } from 'react';
import MicButton from "@/app/component/micButton";
import { redirect } from 'next/navigation';

 





import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { toast } from "react-toastify";
import axios from "axios";
import fun from "@/app/test/[id]/result/page";
import { Chathura } from "next/font/google";
// import { redirect } from "next/dist/server/api-utils";
 
const ReactMarkdown = dynamic(() => import('react-markdown'), {
  ssr: false,
})

const science= [
  "Introduction to Scientific Methods",
  "Basics of Physics",
  "Principles of Chemistry",
  "Biological Foundations",
  "Earth and Environmental Science",
  "Introduction to Astronomy"
];
const computer = [
"Introduction to Computer Science",
"Programming Fundamentals",
"Data Structures and Algorithms",
"Computer Architecture",
"Operating Systems",
"Database Management Systems"
]



const ImageUpload = () => {
  const [base64Data, setBase64Data] = useState<string | null>(null);

  const onChange = (e:any) => {
    let file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = handleReaderLoaded;
      reader.readAsBinaryString(file);
    }
  };

  const handleReaderLoaded = (e:any) => {
    console.log("file uploaded 2: ", e);
    let binaryString = e.target.result;
    setBase64Data(btoa(binaryString));
  };


  return (
    <>
    
    {/* <div className="flex items-center space-x-4 fixed z-1 left-20 top-1 md:left-10 md:top-24">
  <label
    htmlFor="file"
    className="cursor-pointer bg-blue-500 text-white rounded-full hover:bg-blue-700"
  >
    <img
            src="/assets/clip-button.png"
            className="rounded-full w-10 h-10"
          />
  </label>

  
  <span id="file-chosen" className="text-white">{(base64Data)? "File chosen": "No file chosen"}</span>
  <input
    type="file"
    name="image"
    id="file"
    accept=".jpg, .jpeg, .png"
    onChange={onChange}
    className="hidden"
  />
</div> */}
</>
  );
};





const TextToSpeech = ({text}:any) => {
  const [isPaused, setIsPaused] = useState(false);
  const [utterance, setUtterance] = useState<null | SpeechSynthesisUtterance>(null);

  useEffect(() => {
    const synth = window.speechSynthesis;
    const u = new SpeechSynthesisUtterance(text);

    setUtterance(u);

    return () => {
      synth.cancel();
    };
  }, [text]);

  const handlePlay = () => {
    const synth = window.speechSynthesis;

    if (isPaused) {
      synth.resume();
    }
    synth.speak(utterance!);

    setIsPaused(false);
  };

  const handlePause = () => {
    const synth = window.speechSynthesis;

    synth.pause();

    setIsPaused(true);
  };

  const handleStop = () => {
    const synth = window.speechSynthesis;

    synth.cancel();

    setIsPaused(false);
  };

  return (
    <>
      <button onClick={handlePlay}>{isPaused ? <img src="/assets/resume-button.png" alt="" className="w-10 h-10 bg-blue-500 hover:bg-blue-700" /> : <img src="/assets/Play-button.png" className="bg-blue-500 w-10 h-10 hover:bg-blue-700"></img> }</button>
      <button onClick={handlePause}><img src="/assets/Pause-button.png" className="bg-blue-500 w-10 h-10 hover:bg-blue-700"></img></button>
      <button onClick={handleStop}><img src="/assets/stop-button.png" className="bg-blue-500 w-10 h-10 hover:bg-blue-700"></img></button>
    </>
  );
};




const DynamicTextarea = ({
  id,
}:any) => {

  //Please note here id is the subject name

  function callalert(data:string){
    toast(data);
  }

const [visibletools,setvisibletools]=useState(true);
const [speak,setSpeak]=useState("");  
const [tts,settts]=useState(0);


async function getdata(){
var q:string='';
  if(id==='science'){
    q=science[0];
  }else{
    q=computer[0];
  }
  
  try {
    const chat_res = await axios.get(`http://localhost:3002/chatid/${id}/${q}`, {
       headers: {
         Authorization: localStorage.getItem('token'),
       }
     });
     var k=[...(chat_res).data.chat];
     setcoversation(k);
   } catch (error:any) {
     console.error('There was an error!', error.response ? error.response.data : error.message);
   }
     setchapter(q);
}

useEffect(()=>{
localStorage.setItem('previous_conversation','');
  const token= localStorage.getItem("token");
  if(!token){
    redirect('/login');
  }
  getdata();
},[]);

//speech recognation
const startListening = () =>
    SpeechRecognition.startListening({ continuous: true, language: "en-IN" });

  const stopListening = () => SpeechRecognition.stopListening();

  const { transcript,resetTranscript,listening,
  browserSupportsSpeechRecognition } =
    useSpeechRecognition();
    
  if (!browserSupportsSpeechRecognition) {
    return null;
  }


  const scrollref=useRef<any> ();
  const [text,setetext]=useState('');
  const [visible,setvisible]=useState(false);
  const textareaRef = useRef<any>();
  const [conversation,setcoversation]=useState<string[]>([]);

 async function scroll(){

  setTimeout(() => {
    if (typeof window !== 'undefined') {
      const chatarea = scrollref.current;
      if (chatarea) {
        window.scrollTo({
          top: chatarea.scrollHeight,
          left: 0,
          behavior: "smooth",
        });
      }
    }
  }, 1000);
 }
      
 const [chapter,setchapter]=useState('');


  useEffect(() => {
    const textarea = textareaRef.current;

    const resizeTextarea = () => {
      textarea!.style.height = 'auto';
      textarea!.style.height = `${textarea!.scrollHeight}px`;
    };

    textarea!.addEventListener('input', resizeTextarea);

    if(id==='science'){
      setchapter(science[0]);
    }else{
      setchapter(computer[0]);
    }

    return () => {
      textarea!.removeEventListener('input', resizeTextarea);
    };


  }, []);



 


  return (
    <>
    <div className='flex h-screen w-screen justify-center bg-black'>
      {(visible) ? <div className='bg-gray-700 text-blue md:w-1/6 h-full fixed z-10 start-0 w-60 overflow-auto'> 
      <button className='bg-gray-700 w-10 rounded-lg' onClick={(visible)=>{
        setvisible(!visible);
      }}><img src="/assets/cross-image.png" className="bg-gray-700 w-10 h-10"></img></button>

{id === 'science' ?
  science.map((q, index) => (
    <div key={index} className='pl-2 bg-blue-500 hover:bg-blue-700 h-20 m-2 rounded-lg justify-center items-center flex text-white' onClick={async ()=>{
      try {
       const chat_res = await axios.get(`http://localhost:3002/chatid/${id}/${q}`, {
          headers: {
            Authorization: localStorage.getItem('token'),
          }
        });
        var k=[...(chat_res).data.chat];
        setcoversation(k);
      } catch (error:any) {
        console.error('There was an error!', error.response ? error.response.data : error.message);
      }

        setchapter(q);
      setchapter(q);


    }}>
      <div>{q}</div>
    </div>
  ))
  : computer.map((q, index) => (
    <div key={index} className='pl-2 bg-blue-500 hover:bg-blue-700 h-20 m-2 rounded-lg justify-center items-center flex text-white' onClick={async ()=>{

      try {
        const chat_res = await axios.get(`http://localhost:3002/chatid/${id}/${q}`, {
           headers: {
             Authorization: localStorage.getItem('token'),
           }
         });
         var k=[...(chat_res).data.chat];
         setcoversation(k);
       } catch (error:any) {
         console.error('There was an error!', error.response ? error.response.data : error.message);
       }
 
      setchapter(q);
      setchapter(q);
    }}>
      <div>{q}</div>
    </div>
  ))
}
      </div>
      :
      <button className='bg-black w-10 fixed z-100 start-0 rounded-2xl' onClick={(visible)=>{
        setvisible(true);
      }}><img src='/assets/hamburger-button.png' className="bg-gray-700 h-10 w-10 r-blue-700"></img></button>
      }
       
    <div className='flex flex-col items-center w-5/6 md:ml-52 h-full' >   
    <div ref={scrollref} className='h-5/6 w-5/6 mt-10 overflow-x-none' >
   {visibletools? <div className="w-full" onDoubleClick={()=>{
      setvisibletools(!visibletools);
    }}><div className="bg-black fixed z-1 rounded-lg h-12 w-32 bg-blue-500 flex flex-row justify-center items-center opacity-40 right-5">
      <TextToSpeech text={speak}/>
      
    </div>
    <ImageUpload/></div>:<div className="w-full h-full opacity-0 fixed z-1" onClick={()=>{
      setvisibletools(!visibletools);
    }}></div>
   }
    <div></div>

    <Suspense fallback={<p>Loading feed...</p>}>
   
    {conversation.map((d)=>{
      const base64ImageData = "iVBORw0KGgoAAAANSUhEUgAAAEYAAAAUCAAAAAAVAxSkAAABrUlEQVQ4y+3TPUvDQBgH8OdDOGa+oUMgk2MpdHIIgpSUiqC0OKirgxYX8QVFRQRpBRF8KShqLbgIYkUEteCgFVuqUEVxEIkvJFhae3m8S2KbSkcFBw9yHP88+eXucgH8kQZ/jSm4VDaIy9RKCpKac9NKgU4uEJNwhHhK3qvPBVO8rxRWmFXPF+NSM1KVMbwriAMwhDgVcrxeMZm85GR0PhvGJAAmyozJsbsxgNEir4iEjIK0SYqGd8sOR3rJAGN2BCEkOxhxMhpd8Mk0CXtZacxi1hr20mI/rzgnxayoidevcGuHXTC/q6QuYSMt1jC+gBIiMg12v2vb5NlklChiWnhmFZpwvxDGzuUzV8kOg+N8UUvNBp64vy9q3UN7gDXhwWLY2nMC3zRDibfsY7wjEkY79CdMZhrxSqqzxf4ZRPXwzWJirMicDa5KwiPeARygHXKNMQHEy3rMopDR20XNZGbJzUtrwDC/KshlLDWyqdmhxZzCsdYmf2fWZPoxCEDyfIvdtNQH0PRkH6Q51g8rFO3Qzxh2LbItcDCOpmuOsV7ntNaERe3v/lP/zO8yn4N+yNPrekmPAAAAAElFTkSuQmCC";
      const imageUrl = "";
      const markdown = `![Your Image](https://img.freepik.com/free-photo/luxurious-car-parked-highway-with-illuminated-headlight-sunset_181624-60607.jpg?t=st=1717850948~exp=1717854548~hmac=dd56d69aa2edbd1c7d07be7b4b5adce691aa3bb7c5289998d68c954749662c58&w=996)`;
  return <>

  <article className="w-full mr-10 break-words justify-end">
  <ReactMarkdown>{d}</ReactMarkdown>
  </article>
  <div className='w-full h-px bg-gray-300 rounded-md mt-4 mb-4'></div>

  </>
})}
      </Suspense>
      <div className='h-32 w-full'></div>
    </div>
      <div className='flex justify-center items-center fixed z-100 bottom-1 md:w-3/6 w-80 border-gray-700 border-2 rounded-2xl bg-white'>
      
     <textarea
      ref={textareaRef}
      value={text || transcript}
      placeholder="Type Here..."
      className="w-full p-2 rounded-2xl resize-none outline-none overflow-auto text-black max-h-32 w-1/2"
      onChange={((e)=>{
        setetext(e.target.value);
      })}
    ></textarea>
    <div className="flex flex-row ">
   

    <MicButton
          onStartListening={startListening}
          onStopListening={stopListening}
        />      

    <button className='bg-white w-14 h-10 text-black' onClick={async (event)=>{
    
      //getting the chatid that needed to be updated
      const subjectname=id;
      const chaptername=chapter;
      var k:any=[];
      var chat_res;
     
      try {
        chat_res = await axios.get(`http://localhost:3002/chatid/${id}/${chapter}`, {
          headers: {
            Authorization: localStorage.getItem('token'),
          }
        });
        k=[...(chat_res).data.chat];
        console.log('-----------------------------');
      } catch (error:any) {
        console.error('There was an error!', error.response ? error.response.data : error.message);
      }

      setcoversation(k);

      resetTranscript();
      // call the api endpoint
      const message=text||transcript;
      
      // #############################################################################################
      // #############################################################################################
      // #############################################################################################
      // #############################################################################################
      // #############################################################################################
      // #############################################################################################
      // #############################################################################################
     
      const resdata=await axios.post('http://localhost:8000/chatbot',{
        "message": message,
        "previous_conversation": localStorage.getItem('previous_conversation'),
        "subject":id,
        "chapter": chapter,
      });

      localStorage.removeItem('previous_converstion');

      localStorage.setItem('previous_conversation',resdata.data.output.new_summary);



      if(resdata.data.personalisation.length!=0){
        if(resdata.data.personalisation[0].core_instruction && resdata.data.personalisation[0].core_instruction.length!=0){
          if(resdata.data.personalisation[0].core_instruction[0].Added?.length!=0){
            console.log('1');
            callalert(resdata.data.personalisation[0].core_instruction[0].Added[0]);
          }
          if(resdata.data.personalisation[0].core_instruction[1].Updated?.length!=0){
            console.log('2');
            callalert(resdata.data.personalisation[0].core_instruction[1].Updated[0]);
          }
        }
        

     if(resdata.data.personalisation[0].information && resdata.data.personalisation[0].information.length!=0){
      if(resdata.data.personalisation[0].information[0]?.Added?.length!=0){
        console.log('3');
        callalert(resdata.data.personalisation[0].information[0].Added[0]);
      }
      if(resdata.data.personalisation[0].information[1]?.Updated?.length!=0){
        console.log('4');
        callalert(resdata.data.personalisation[0].information[1].Updated[0]);
      }
     }
  

      }
     
      // localStorage.setItem()
      // #############################################################################################
      // #############################################################################################
      // #############################################################################################
      // #############################################################################################
      // #############################################################################################
      // #############################################################################################
      // #############################################################################################
 
        console.log("Fetching data.....");
  
      // then setstate of conversation
      var arr=[...conversation];
      arr.push(text || transcript);
      setetext("");
      //put resdata.data.output.reply instead of resdata
      // 
      arr.push(resdata.data.output.reply);
      settts((t)=>t+=2);
      var tospeak="";
      tospeak=text || transcript;
        //put resdata.data.output.reply instead of resdata
    // 
      tospeak+="! "+resdata.data.output.reply;
      setSpeak(tospeak);
     const issend=await axios.post(`http://localhost:3002/${chat_res?.data.id}`,{
      array:arr
    },
    {
        headers: {
          Authorization: localStorage.getItem('token'),
        }
      });
      setcoversation(arr);
      await scroll();

     
    }}><img src="/assets/send-message.png" className="h-10 w-10 mr-2"></img></button>
  </div>
      </div>
     </div>
   </div>
    </>
   
  );
};






export default function Fun({params}:{
   params: {id:string}
}) {
  
const id=params.id;
  useEffect(()=>{
    if(id!='science' && id!='computer'){
      redirect('/chat');
    }
  },[]);

  return (
    <>
    <div>
    <DynamicTextarea id={id}/>
    </div>
   
    </>
  );
}