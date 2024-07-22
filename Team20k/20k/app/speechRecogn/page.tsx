"use client";
import "regenerator-runtime/runtime";
import React from "react";

import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";



import MicButton from "../component/micButton";

const SpeechReconPage = () => {

  const startListening = () =>
    SpeechRecognition.startListening({ continuous: true, language: "en-IN" });

  const stopListening = () => SpeechRecognition.stopListening();

  const { transcript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();
    
  if (!browserSupportsSpeechRecognition) {
    return null;
  }

  
  return (
    <>
      <div className="flex items-center justify-center h-screen">
        <div className="flex items-center justify-center bg-gray-100">
          <div className="bg-white p-4 rounded-lg shadow-lg w-80">
            <label
              htmlFor="textInput"
              className="block text-sm font-medium text-black"
            >
              Enter your text:
            </label>
            <textarea
              id="textInput"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black"
              rows={5}
              value={transcript}
            ></textarea>
          </div>
        </div>
       
      </div>
    </>
  );
};
export default SpeechReconPage;
