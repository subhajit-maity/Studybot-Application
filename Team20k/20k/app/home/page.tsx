'use client';
import Image from "next/image";
import { useState } from "react";
import { useEffect } from "react";
import Header from "@/app/component/header";
import { redirect } from "next/navigation";


export default function Home() {

  useEffect(()=>{
    const token= localStorage.getItem("token");
    console.log(token?.split(' ')[1]);
    if(!token){
      redirect('/login');
    }
  },[]);
  
  const [shownav,setshownav]=useState(false);
  return (
  
      <>
    <Header/>
    <div className="grid grid-rows-4 grid-cols-1 md:mt-4 mt-6 mx-10 gap-y-5">


{/* row one */}


<div className="gap-x-5 md:flex flex-row ">
<div className="bg-contain h-60 md:h-80 md:w-full">


    <img src='/assets/Speech-to-text.jpeg' alt='Speech_Recognition' className="h-full w-full object-cover rounded-lg"></img>




  </div>

<div className="p-6">
    <div className="text-4xl flex justify-center mb-2">Speech Recognition</div>

<div className="text-xl">

Our platform integrates sophisticated speech recognition technology that allows you to interact with the system using voice commands. This hands-free interaction makes the learning process more engaging and accessible, especially for users who have difficulty typing or prefer speaking. You can ask questions, navigate through the platform, and even complete tasks using natural language, making your experience smooth and intuitive.



</div>
  </div>
</div>

{/* row two */}

<div className="gap-x-5 md:flex flex-row-reverse ">
 
  <div className="bg-contain h-60 md:h-80 md:w-full">
  <img src='/assets/Text_to_speech.png' alt='Text-to-speech' className="h-full w-full object-cover rounded-lg bg-blue-500"></img>
  </div>

<div className="p-6">
    <div className="text-4xl flex justify-center mb-2">Text to speech</div>

<div className="text-xl">
Our platform features an advanced text-to-speech function that converts written content into spoken words. This allows users to listen to lessons and study materials, making it convenient for those who prefer auditory learning or want to learn on the go. Whether you're commuting, exercising, or simply relaxing, you can continue your learning journey without needing to read from the screen.
</div>
  </div>

</div>

{/* row three */}

<div className="gap-x-5 md:flex flex-row ">
<div className="bg-contain h-60 md:h-80 md:w-full">
  <img src='/assets/Personalized-learning.jpeg' alt='Personalised-content' className="h-full w-full object-cover rounded-lg"></img>
  </div>

<div className="p-6">
    <div className="text-4xl flex justify-center mb-2">Personalized Learning</div>

<div className="text-xl">
Experience a truly personalized learning journey with our AI-driven platform. Our system analyzes your learning style, pace, and preferences to tailor educational content, quizzes, and tests specifically for you. This customization ensures that you receive the most relevant and effective learning materials, helping you to grasp concepts more quickly and thoroughly.
</div>
  </div>
</div>


{/* row four */}
<div className="gap-x-5 md:flex flex-row-reverse ">
  <div className="bg-contain h-60 md:h-80 md:w-full">
  <img src='/assets/Image-Recognition.jpeg' alt='Personalised-content' className="h-full w-full object-cover rounded-lg"></img>
  </div>

<div className="p-6">
    <div className="text-4xl flex justify-center mb-2">Image Recognition</div>

<div className="text-xl">
Take advantage of our cutting-edge image recognition technology to enhance your learning experience. By uploading images, you can receive detailed answers and relevant information related to the content of those images. This feature is particularly useful for visual learners and for subjects that involve diagrams, photos, or other visual aids. The AI processes the images to provide contextually accurate responses, helping you to understand complex topics through visual inputs.
</div>
  </div>
</div>

    </div>

      </>
  );
}
