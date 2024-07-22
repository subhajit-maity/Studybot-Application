"use client";

import { useEffect, useState } from "react";
import Link from "@/node_modules/next/link";
import Signup_button from "../component/Signup_button";

import Header from "@/app/component/Header";
import { useRouter } from "next/navigation";

export default function fun(){
  const router=useRouter();


  useEffect(()=>{
    const token= localStorage.getItem("token");
    console.log(token?.split(' ')[1]);
    if(!token){
      router.push('/login');
    }
  },[]);


 return(
    <>
    <Header/>
    <div className="flex flex-col md:flex-row justify-center items-center h-full md:mt-32 mt-10">
      <div
        className="cursor-pointer p-4 max-w-md mx-auto bg-blue-500 text-white text-center text-lg font-semibold rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-opacity-50 w-100 ml-4 mr-4 mb-10 md:mb-0"
        onClick={()=>{
          router.push('/chat/science')
        }}
      >
        <img
          src={
            "https://blogassets.leverageedu.com/blog/wp-content/uploads/2019/11/23172615/Degree-Courses-after-12th-Science.jpg"
          }
          alt="Landscape picture"
          width={800}
          height={500}
        />
        <h1 className="text-2xl">Science</h1>
      </div>
      <div
        className="cursor-pointer p-4 max-w-md mx-auto bg-blue-500 text-white text-center text-lg font-semibold rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-opacity-50 w-100 ml-4 mr-4 "
        onClick={()=>{
          router.push('/chat/computer')
        }}
      >
        <img
          src={
            "https://blogassets.leverageedu.com/blog/wp-content/uploads/2020/02/11193820/Computer-Courses.png"
          }
          alt="Landscape picture"
          width={800}
          height={500}
        />
        <h1 className="text-2xl">Computer</h1>
      </div>
    </div>
    </>
 )
    
}