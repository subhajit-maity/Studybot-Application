"use client";
import { useState } from "react";
import Link from "@/node_modules/next/link";
import { useRouter } from 'next/navigation'
import axios from 'axios';
import { toast } from "react-toastify";

type User={
  username:string,
  email:string,
  password:string
}

export default function Home() {
  const router=useRouter();
  const [formdata,setformdata]=useState({
    username:'',
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
      <label htmlFor="username" className="ml-6" >Username</label>
    <input  onChange={fun} type="text" className="text-black flex rounded-sm w-80 h-8 ml-auto mr-auto mb-4 mt-2" name="username" value={formdata.username}></input>
    <label htmlFor="password" className="ml-6">Password</label>
    <input  onChange={fun} type="text" className="text-black flex rounded-sm w-80 h-8 ml-auto mr-auto mb-4 mt-2" name='password' value={formdata.password}></input>
    <label htmlFor="email" className="ml-6">Email id</label>
    <input  onChange={fun} type="text" className="text-black flex rounded-sm w-80 h-8 ml-auto mr-auto mb-4 mt-2" name='email' value={formdata.email}></input>
   


         <button className="w-2/5 bg-white rounded-md border rounded h-12 m-auto text-black hover:bg-black hover:text-white" onClick={async ()=>{
          console.log(formdata);
         
      
          try {
            toast('Please wait Signing up....',{
              position: "top-right",
              autoClose: 6000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: false,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
            const response=await axios.post('http://localhost:3002/signup',{
              ...formdata
             });
             
             router.push('/login');

          } catch (error) {
            console.log("Some error occurred");
          }
       
        }
        
          }>Sign Up</button>
        
    <div className="flex flex-row justify-center justify-items-center p-auto mb-4 mt-6">
      <p className="m-auto text-sm">Already a user ?</p>
      <Link  className="underline-offset-0 mr-10"  href='/login'>Login</Link>
    </div>
    </div>
    </div>
    </>
    
  );
}
