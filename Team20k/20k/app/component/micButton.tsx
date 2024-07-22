"use client";
import { useState } from "react";

interface MicButtonProps {
  onStartListening: () => void;
  onStopListening: () => void;
}

const MicButton = ({ onStartListening, onStopListening }: MicButtonProps) => {
  const [isListening, setIsListening] = useState(false);

  const handleClick = () => {
    if (isListening) {
      onStopListening();
    } else {
      onStartListening();
    }
    setIsListening(!isListening);
  };

  return (
    <button
      onClick={handleClick}
      className={`rounded-lg mr-2 w-10 h-10 ${
        isListening ? "bg-red-500" : "bg-blue-600"
      } text-white`}
    >
      <img
        className="rounded-full h-full w-full"
        src={
          "https://cdn0.iconfinder.com/data/icons/music-and-media-player-ui-s94/96/Music_Icon_Pack_-_Outline_ab_microphone-512.png"
        }
      />
    </button>
  );
};

export default MicButton;
