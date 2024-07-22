"use client";
import Header from "@/app/component/Header"
import { useEffect,useState } from "react"
import { redirect } from 'next/navigation';
import { usePathname } from 'next/navigation'
import axios from "axios";

export default function fun({params}:{
  params: {id:string}
}){

  const id=params.id;
  const [totalq,Setotalq]=useState(0);
  const [Attempted,setAttempted]=useState(0);
  const [correct,setcorrect]=useState(0);

  
  const pathname = usePathname()
  var str=pathname.split('/');


async function fetchdata(){
 // localStorage.removeItem("testid");
    try {
      const res = await axios.get(`http://localhost:3002/get_test/${id}`, {
        headers: {
          Authorization: `${localStorage.getItem('token')}`
        }
      });
      console.log(res.data);
      Setotalq(res.data.totalq);
      setAttempted(res.data.qattempted);
      setcorrect(res.data.qcorrect);

    } catch (error) {
      console.error('Error fetching data:', error);
    }
}


  useEffect(()=>{
    const token= localStorage.getItem("token");
    console.log(token?.split(' ')[1]);
    if(!token){
      redirect('/login');
    }
    console.log(pathname);
  fetchdata();

  },[]);

    return(

        <>
       <Header/>
        <div className="flex flex-col justify-center items-center my-10 w-full">
        <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
          Results
        </h1>
        <div className="flex flex-col justify-center items-center my-10 md:w-3/6 ml-2 mr-2 border-2 rounded-lg p-4 border-gray-800">
          <div className=" flex flex-col justify-center items-center mb-10 ">
            <h2 className="text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-4xl dark:text-white">
              Your Score: {correct}/{totalq}
            </h2>
          </div>
          <div className="flex flex-row justify-center items-center w-full mb-4">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-2/6 ml-2 mr-2">
              Total Questions: {totalq}
            </button>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-2/6 ml-2 mr-2">
              Attempted Questions: {Attempted}
            </button>
          </div>
          <div className="flex flex-row justify-center items-center w-full">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-2/6 ml-2 mr-2">
              Correct Answers: {correct}
            </button>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-2/6 ml-2 mr-2">
              Wrong Answers: {Attempted-correct}
            </button>
          </div>
        </div>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-40 ml-2 mr-2 ">
          Review Questions
        </button>
      </div>
      </>
    )
}