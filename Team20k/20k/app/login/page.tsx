"use client";
import Link from "@/node_modules/next/link";
import { useEffect, useState } from "react";
import Login_button from "../component/Login_button";



type User={
  email:String,
  password:String
}

export default function Home() {

  const [formdata,setformdata]=useState({
    email:'',
    password:''
  });



  function fun(e:any):any{
    const {name,value}=e.target;
   setformdata({
    ...formdata,
    [name]:value
   }); 

  }


  return (
    <>
    <div className="flex justify-center justify-items-center ml-auto mr-auto h-screen w-screen items-center justify-center justify-items-center">
    <div className="flex flex-col h-1/2 border border-white w-120 bg-black rounded-md pl-4 pr-4 pt-4">
      <label htmlFor="username" className="ml-6" >Email id</label>
    <input  onChange={fun} type="text" className="text-black flex rounded-sm w-80 h-8 ml-auto mr-auto mb-4 mt-2 pl-2" name="email" value={formdata.email}></input>
    <label htmlFor="password" className="ml-6">Password</label>
    <input  onChange={fun} type="text" className="text-black flex pl-2 rounded-sm w-80 h-8 ml-auto mr-auto mb-4 mt-2" name='password' value={formdata.password}></input>

    <Login_button {...formdata}/>

    <div className="flex flex-row justify-center justify-items-center p-auto mb-4 my-auto">
      <p className="m-auto text-sm">New User ?</p>
    <Link  className="underline-offset-0 mr-10"  href='/signup'>Signup</Link>


    </div>
    </div>
    </div>
    </>
    
  );
}
