import React, { createContext, useContext, useState } from "react";
import { Audio } from "expo-av";

const PlayerContext = createContext<any>(null);

export function PlayerProvider({ children }: any) {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<any>(null);

  const playTrack = async (track: any) => {
    try {
      if (sound) {
        await sound.unloadAsync();
      }
      const { sound: newSound } = await Audio.Sound.createAsync({ uri: track.audio });
      setSound(newSound);
      setCurrentTrack(track);
      await newSound.playAsync();
      setIsPlaying(true);
    } catch (error) {
      console.error("Error playing track:", error);
    }
  };

  const pauseTrack = async () => {
    if (sound) {
      await sound.pauseAsync();
      setIsPlaying(false);
    }
  };

  return (
    <PlayerContext.Provider value={{ playTrack, pauseTrack, isPlaying, currentTrack }}>
      {children}
    </PlayerContext.Provider>
  );
}

export const usePlayer = () => useContext(PlayerContext);