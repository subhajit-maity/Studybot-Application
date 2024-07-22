"use client";
import { useEffect, useRef } from 'react';
import React from 'react'
import {createRoot} from 'react-dom/client'
import { Suspense } from 'react'
import dynamic from 'next/dynamic';
import { useState } from 'react';
 
const ReactMarkdown = dynamic(() => import('react-markdown'), {
  ssr: false,
})

const markdown = `# Recipe App

Welcome to the Recipe App! This application allows users to create, share, and organize their favorite recipes into categories. Whether you're a seasoned chef or a cooking enthusiast, this app will help you keep your recipes organized and accessible.

## Features

1. **Create Recipes**: Users can create their own recipes by providing a recipe name, ingredients list, cooking instructions, and optional details like cooking time, serving size, and dietary notes.

2. **Categorize Recipes**: Users can organize their recipes into different categories such as breakfast, lunch, dinner, desserts, etc.

3. **Responsive Design**: The app is designed to be responsive, ensuring a seamless experience across various devices, including desktops, tablets, and smartphones.


![WhatsApp Image 2023-08-24 at 16 23 41](https://github.com/Yuv1810/recipe-app/assets/119923256/e61fb2d3-f0aa-49a4-ae8e-09a5043aaa86)
![WhatsApp Image 2023-08-24 at 16 24 21](https://github.com/Yuv1810/recipe-app/assets/119923256/12f8c86a-08b3-4941-9e1b-bf9c93114dca)
![WhatsApp Image 2023-08-24 at 16 28 13](https://github.com/Yuv1810![WhatsApp Image 2023-08-24 at 16 30 02](https://github.com/Yuv1810/recipe-app/assets/119923256/0bbd06ab-a2b7-4bea-8601-35e7d693969f)
/recipe-app/assets/119923256/6714da1b-b144-4664-87cd-7bff3f62d6ea)
![WhatsApp Image 2023-08-24 at 16 29 16](https://github.com/Yuv1810/recipe-app/assets/119923256/26f6cf9d-f436-49fb-9976-3b3275673ddd)
![WhatsApp Image 2023-08-24 at 16 46 32](https://github.com/Yuv1810/recipe-app/assets/119923256/7aa30870-26d3-47d9-a95f-fd5d0ccf1d1d)
![WhatsApp Image 2023-08-24 at 16 46 33 (1)](https://github.com/Yuv1810/recipe-app/assets/119923256/c9b95f2b-83b0-4809-af36-8f75056044bc)
![WhatsApp Image 2023-08-24 at 16 46 33 (2)](https://github.com/Yuv1810/recipe-app/assets/119923256/ae200c1c-9530-4aa7-b90a-28e548045738)
![WhatsApp Image 2023-08-24 at 16 46 33](https://github.com/Yuv1810/recipe-app/assets/119923256/ac9d9c63-0732-45ba-b9a4-678c305ad2f8)
`

export const DynamicTextarea = () => {
  const [text,setetext]=useState('');
  const [visible,setvisible]=useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [user,setuser]=useState(['']);
  const [conversation,setcoversation]=useState<string[]>([]);

  useEffect(() => {
    const textarea = textareaRef.current;

    const resizeTextarea = () => {
      textarea!.style.height = 'auto';
      textarea!.style.height = `${textarea!.scrollHeight}px`;
    };

    textarea!.addEventListener('input', resizeTextarea);

    return () => {
      textarea!.removeEventListener('input', resizeTextarea);
    };
  }, []);

  return (
    <>
    <div className='flex h-screen w-screen justify-center'>
      {(visible) ? <div className='bg-white text-blue md:w-1/6 h-full fixed z-10 start-0 w-60 overflow-scroll'> 
      <button className='bg-black w-20' onClick={(visible)=>{
        setvisible(!visible);
      }}>stj</button>

      <div className='bg-black h-20'>hey</div>
      <div className='bg-black h-20'>hey</div>
      <div className='bg-black h-20'>hey</div>
      <div className='bg-black h-20'>hey</div>
      <div className='bg-black h-20'>hey</div>
      <div className='bg-black h-20'>hey</div>
      <div className='bg-black h-20'>hey</div>
      <div className='bg-black h-20'>hey</div> 
      <div className='bg-black h-20'>hey</div>
      <div className='bg-black h-20'>hey</div>
      <div className='bg-black h-20'>hey</div>
      <div className='bg-black h-20'>hey</div>
      <div className='bg-black h-20'>hey</div>
      <div className='bg-black h-20'>hey</div>
      </div>
      :
      <button className='bg-black w-20 fixed z-100 start-0' onClick={(visible)=>{
        setvisible(true);
      }}>stj</button>
      }
       
    <div className='flex flex-col items-center w-5/6 md:ml-52 h-full'>   
    <div className='h-5/6 w-5/6 mt-10 overflow-x-none'>
      
    <Suspense fallback={<p>Loading feed...</p>}>
       
    {conversation.map((d)=>{
  return <>
  <ReactMarkdown>{d}</ReactMarkdown>
  <div className='w-full h-px bg-gray-300 rounded-md mt-4 mb-4'></div>
  </>
})}
      </Suspense>
      <div className='h-32 w-full'></div>
    </div>
      <div className='flex justify-around fixed z-100 bottom-1 md:w-3/6 w-80'>
     <textarea
      ref={textareaRef}
      value={text}
      placeholder="Type Here..."
      className="w-full p-2 border border-gray-300 rounded-2xl resize-none outline-none overflow:auto text-black max-h-32 w-1/2 border-2"
      onChange={((e)=>{
        setetext(e.target.value);
      })}
    ></textarea>
    <button className='bg-white w-20 h-10 text-black rounded-lg border-2 border-gray-300 ml-4 mt-4 mr-4' onClick={async ()=>{
      // call the api
       setTimeout(() => {
        console.log("Fetching data");
      }, 2000);
      // then setstate of conversation
      var arr=[...conversation];
      arr.push(text);
      arr.push(markdown);
      setcoversation(arr);
     
    }}>send</button>
      </div>
     </div>
   </div>
    </>
   
  );
};



