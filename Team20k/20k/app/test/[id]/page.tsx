"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/component/Header";
import { useEffect } from "react";
import { redirect } from 'next/navigation';
import axios from "axios";


const TestComponent = ({params}:{
  params: {id:string}
}) => {


  
  
  const router = useRouter();
  const handleClick = () => {
    console.log(id);
    router.push("/test/"+id+"/result");
  };
  const markedoption:any=[];


  const [Question,setQuestion]=useState<any>([]);
  const [markoption,setmarkoption]=useState([-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]);
  const id=params.id;

  // var Question:any=[];

  var value:number= Math.random() * (3 - 1) + 1;
  var randomnumber=Math.floor(value);


   var question:Array<any>=[];
  async function fetchdata(){
    var subjectname='computer';
    if(id=='1'){
      subjectname='science';
    }

  const question=await axios.get(`http://localhost:3002/get_questions/${subjectname}`,{
    headers:{
      Authorization:localStorage.getItem('token'),
    }
    //                 index         0,1,2,3
  }).then(data=>{       
    // console.log(data.data[0].options[0].text);
    var x=[...data.data]
    setQuestion(x);
    
  })
  }


  // for(var i=randomnumber*10;i<(randomnumber*10)+10;i++){
  //   Question.push(question);
  // }
  // console.log("-----------------------------------");
  // console.log(Question.length);
  // console.log("-----------------------------------");


  var k_id:string=id;
  useEffect(()=>{
    const token= localStorage.getItem("token");
    console.log(token?.split(' ')[1]);
    if(!token){
      redirect('/login');
    }

    fetchdata();

    for(var i=0;i<Question.length;i++){
      markedoption.push(-1);
    }
    
  },[]);



 
  const mcqclick = (index:number,value:number) => {
    setmarkoption((prevMarkoption:any) => {
      const newMarkoption = [...prevMarkoption];
    
      newMarkoption[index] = value;
      return newMarkoption;
    });
  };



                // q.question
  // console.log(Question[0].question);
  //             // q.question.options[0,1,2,3].text
  // console.log(Question[0].options[0].text);

  
 
 

  console.log(markoption);
  console.log('0-i90i039u4032u4893y895y4389y54389y58943y58943y689y5968y54986y4589y68');

  return (
    
    <>
    <Header/>
    <div className="flex flex-col justify-center items-center my-10 w-full">
      <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
        MCQ Test
      </h1>
      {Question.length > 0 ? Question.map((q:any, index:number) => (
          <div key={index} className="flex flex-col justify-center items-center my-10 md:w-3/6 ml-2 mr-2 border-2 rounded-lg p-4 border-gray-800">
            <div className="flex flex-col justify-center items-center mb-10">
              {q.question}
            </div>
            <div className="flex flex-row justify-center items-center w-full mb-4">
              <button style={markoption[index] === 0 ? { backgroundColor: "green" } : { backgroundColor: "#406ce8" }}  className="text-white font-bold py-2 px-4 rounded w-3/6 ml-2 mr-2 h-4/6" onClick={()=>{
              mcqclick(index,0);
              }}>
                {q.options[0].text}
              </button>

              
              <button style={markoption[index] === 1 ? { backgroundColor: "green" } : { backgroundColor: "#406ce8" }}  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-3/6 ml-2 mr-2 h-4/6" onClick={()=>{
               mcqclick(index,1);      
              }}>
                {q.options[1].text}
              </button>
            </div>
            <div className="flex flex-row justify-center items-center w-full mb-4">
              <button style={markoption[index] === 2 ? { backgroundColor: "green" } : { backgroundColor: "#406ce8" }}  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-3/6 ml-2 mr-2 h-4/6" onClick={()=>{
               mcqclick(index,2);
              }}>
                {q.options[2].text}
              </button>
              <button style={markoption[index] === 3 ? { backgroundColor: "green" } : { backgroundColor: "#406ce8" }}  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-3/6 ml-2 mr-2 h-4/6" onClick={()=>{
               mcqclick(index,3);
              
              console.log(markoption);       
              }}>
                {q.options[3].text}
              </button>
            </div>
          </div>
        )) : <div className="h-40 w-full flex flex-row items-center justify-center">
        <p>Loading......</p>
      </div>}


      <button
        onClick={async () =>{
        
            //science
            const obj={
              subjectname:"science"
            }
           const res=await axios.get('http://localhost:3002/user', {
              headers: {
                Authorization: `${localStorage.getItem('token')}`
              },
              data: obj
            });
           
            // two variabel to work on
            var qattempted=0;
            var qcorrect=0;
            for(var i=0;i<Question.length;i++){
              if(markoption[i]!=-1){
                qattempted++;
              }
            }

            console.log(qattempted);
          
            for(var i=0;i<Question.length;i++){
              console.log('----------------');
              console.log(markoption[i]);
              if(markoption[i]!=-1){
                console.log('---------------------213123213-----');
                console.log(Question[i].correctOption);
                console.log
                console.log('---------------------3213213-----');
                if(Question[i].correctOption==markoption[i]+1)
                
                qcorrect++;
              }
            }
            
 // two variabel to work on

            const totalq=Question.length;
            const qwrong=qattempted-qcorrect
            console.log(res.data[0]);
          const body={
            subjectname:obj.subjectname,
            subjectId:res.data[0].subjects[0].id,
            usename:res.data[0].usename,
            email:res.data[0].email,
            qattempted:qattempted,
            qcorrect:qcorrect,
            totalq:totalq,
            qwrong:qwrong
          }
         
          const res1 = await axios.post('http://localhost:3002/upload_test/10000', 
          body, 
          {
            headers: {
              Authorization: `${localStorage.getItem('token')}`
            }
          }
        );
        console.log(res1.data.id);
        localStorage.setItem('testid',res1.data.id);
          handleClick();
    
        } }
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-40 ml-2 mr-2 "
      >
        Submission
      </button>
    </div>
    </>
  );
};
export default TestComponent;
