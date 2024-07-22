'use client';
import Image from "next/image";
import { useState } from "react";


export default function Header() {
  const [shownav,setshownav]=useState(false);
  return (
  
    <>
    <nav className="bg-gray-800 fixed z-10 w-full">
     
     <div className="flex justify-between items-center">
     <div className="flex-row justify-start items-around">
     <div className="ml-4 ">Logo</div>
     </div>
     <div className="flex flex-col md:hidden">
        
      {shownav? <button onClick={()=>{
          setshownav(!shownav);
        }}><Image src="/assets/cross-image.png" alt='cross-button' width={60} height={60}/></button>:<button onClick={()=>{
          setshownav(!shownav);
        }} className="bg-gray-800"><Image src="/assets/hamburger-button.png" alt="menu-button" width={60} height={60}/></button>
      }  
     

     </div>       
      <div className="flex justify-center items-center h-full hidden md:flex md:h-20 ">
        <ul className="mr-6"><a href="/chat">Chat</a></ul>
        <ul className="mr-6"><a href="/test">Tests</a></ul>
        <ul className="mr-6"><a href="/results">Results</a></ul>
        <ul className="mr-6"><a href="/">Logout</a></ul>
      </div>
      </div>
      {shownav?  <div className="flex-col justify-between h-screen items-center ml-6 mt-6 md:flex md:h-full md:hidden animate-none ">
      <ul className="mr-6"><a href="/chat">Chat</a></ul>
        <ul className="mr-6"><a href="/test">Tests</a></ul>
        <ul className="mr-6"><a href="/results">Results</a></ul>
        <ul className="mr-6"><a href="/">Logout</a></ul>
      </div> : <></>}
     

    </nav>
    <div className="h-14 md:h-20"></div>
     
    </>
);
}
