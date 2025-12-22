import React, { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Scene } from './components/Scene';
import { MUSIC_TRACK_URL } from './constants';

const App: React.FC = () => {
  const [isSpeakerPlaying, setIsSpeakerPlaying] = useState(false);
  const [isTVOn, setIsTVOn] = useState(false);
  const [isLampOn, setIsLampOn] = useState(false);
  const [isPCOn, setIsPCOn] = useState(false);
  const [isCrystalBallOn, setIsCrystalBallOn] = useState(false);
  
  // Bedroom States
  const [isBedroomLampOn, setIsBedroomLampOn] = useState(false);
  const [isChristmasTreeOn, setIsChristmasTreeOn] = useState(false);

  // Bathroom States
  const [isSinkOn, setIsSinkOn] = useState(false);
  const [isShowerOn, setIsShowerOn] = useState(false);
  const [isFlushing, setIsFlushing] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize Speaker Audio
  useEffect(() => {
    audioRef.current = new Audio(MUSIC_TRACK_URL);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.5;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const toggleSpeaker = () => {
    if (!audioRef.current) return;

    if (isSpeakerPlaying) {
      audioRef.current.pause();
      setIsSpeakerPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsSpeakerPlaying(true);
      }).catch((e) => console.error(e));
    }
  };

  const toggleTV = () => {
    setIsTVOn(!isTVOn);
  };

  const toggleLamp = () => {
    setIsLampOn(!isLampOn);
  };
  
  const togglePC = () => {
    setIsPCOn(!isPCOn);
  };

  const toggleCrystalBall = () => {
    setIsCrystalBallOn(!isCrystalBallOn);
  };
  
  const toggleBedroomLamp = () => {
    setIsBedroomLampOn(!isBedroomLampOn);
  };

  const toggleChristmasTree = () => {
    setIsChristmasTreeOn(!isChristmasTreeOn);
  };

  const toggleSink = () => {
    setIsSinkOn(!isSinkOn);
  };

  const toggleShower = () => {
    setIsShowerOn(!isShowerOn);
  };

  const triggerFlush = () => {
    if (isFlushing) return;
    setIsFlushing(true);
    // Auto reset flush state after animation
    setTimeout(() => {
      setIsFlushing(false);
    }, 3000);
  };

  return (
    <div className="relative w-full h-screen bg-[#050505] overflow-hidden">
      {/* 3D Canvas */}
      <div className="absolute inset-0 z-0">
        <Canvas shadows dpr={[1, 2]}>
          <Scene 
            isSpeakerPlaying={isSpeakerPlaying} 
            toggleSpeaker={toggleSpeaker}
            isTVOn={isTVOn}
            toggleTV={toggleTV}
            isLampOn={isLampOn}
            toggleLamp={toggleLamp}
            isPCOn={isPCOn}
            togglePC={togglePC}
            isCrystalBallOn={isCrystalBallOn}
            toggleCrystalBall={toggleCrystalBall}
            isBedroomLampOn={isBedroomLampOn}
            toggleBedroomLamp={toggleBedroomLamp}
            isChristmasTreeOn={isChristmasTreeOn}
            toggleChristmasTree={toggleChristmasTree}
            isSinkOn={isSinkOn}
            toggleSink={toggleSink}
            isShowerOn={isShowerOn}
            toggleShower={toggleShower}
            isFlushing={isFlushing}
            triggerFlush={triggerFlush}
          />
        </Canvas>
      </div>

      {/* Instruction Overlay (Minimal) */}
      <div className="absolute bottom-10 w-full text-center pointer-events-none opacity-50">
        <p className="text-white text-sm font-light tracking-widest uppercase">
          Click & Drag to move • Click items to interact
        </p>
      </div>
    </div>
  );
};

export default App;