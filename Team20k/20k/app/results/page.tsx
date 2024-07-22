"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const AllResultPage = () => {
  const [res, setRes] = useState<any[]>([]);
  const router = useRouter();

  async function fetchData() {
    try {
      const response = await axios.get('http://localhost:3002/gettest', {
        headers: {
          Authorization: `${localStorage.getItem('token')}`
        }
      });
      setRes(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push('/login');
      return;
    }
    fetchData();
  }, [router]);

  const handleClick = (testId: number) => {
    console.log(testId);
    router.push(`/results/${testId}`);
  };

  return (
    <div className="flex flex-col justify-center items-center my-10 w-full">
      <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
        All Results
      </h1>
      <div className="flex flex-col justify-center items-center my-10 md:w-3/6 ml-2 mr-2 border-2 rounded-lg p-4 border-gray-800">
        <div className="flex flex-col justify-center items-center mb-10">
          <h2 className="text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-4xl dark:text-white">
            Tests Taken
          </h2>
          <div className="flex flex-col justify-center items-center my-5 mb-5 md:mb-0">
            {res.map((d: any, index: number) => (
              <div key={index} className="flex flex-row justify-center items-center md:mb-0 h-20">
                <button
                  onClick={() => handleClick(d.id)} // Assuming `d.testId` is the unique identifier for the test
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-80 ml-2 mr-2 my-5 mb-10 md:mb-0"
                >
                  {d.testname}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllResultPage;
