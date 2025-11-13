import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  Animated,
  Easing,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Slider from "@react-native-community/slider";
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio } from "expo-av";
import { getLyrics } from "../core/api";

export default function PlayerScreen() {
  const router = useRouter();
  const {
    id,
    title: initialTitle,
    artist: initialArtist,
    artwork: initialArtwork,
    audio: initialAudio,
    allTracks,
  } = useLocalSearchParams();

  const [track, setTrack] = useState({
    id,
    title: initialTitle,
    artist: initialArtist,
    artwork: initialArtwork,
    audio: initialAudio,
  });

  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [lyrics, setLyrics] = useState<string>("Loading lyrics...");
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const formatTime = (millis: number) => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const loadAndPlay = async (uri: string) => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: true, volume: 1 },
        (status) => {
          if (status.isLoaded) {
            setIsPlaying(status.isPlaying);
            setPosition(status.positionMillis);
            setDuration(status.durationMillis || 1);
            if (status.didJustFinish) handleSkip("next", true);
          }
        }
      );
      setSound(sound);
    } catch (e) {
      console.log("Error loading sound:", e);
    }
  };

  const fadeTransition = async (nextTrack: any) => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 60,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start(async () => {
      // Fade out audio
      if (sound) {
        for (let v = 1; v >= 0; v -= 0.1) {
          await sound.setVolumeAsync(v);
          await new Promise((res) => setTimeout(res, 40));
        }
        await sound.stopAsync();
        await sound.unloadAsync();
      }

      setSound(null);
      clearInterval(intervalRef.current as any);
      setPosition(0);
      setDuration(1);
      setIsPlaying(false);
      setTrack(nextTrack);
      setLyrics("Loading lyrics...");

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start();
    });
  };

  useEffect(() => {
    if (!track.audio) return;
    loadAndPlay(track.audio as string);
  }, [track.audio]);

  useEffect(() => {
    if (!sound) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(async () => {
      const status = await sound.getStatusAsync();
      if (status.isLoaded) {
        setIsPlaying(status.isPlaying);
        setPosition(status.positionMillis);
        setDuration(status.durationMillis || 1);
      }
    }, 500);
    return () => clearInterval(intervalRef.current as any);
  }, [sound]);

  const togglePlayPause = async () => {
    if (!sound) return;
    const status = await sound.getStatusAsync();
    if (status.isPlaying) {
      await sound.pauseAsync();
      setIsPlaying(false);
    } else {
      await sound.playAsync();
      setIsPlaying(true);
    }
  };

  const onSeek = async (value: number) => {
    if (sound && duration) {
      const newPos = value * duration;
      await sound.setPositionAsync(newPos);
    }
  };

  useEffect(() => {
    const checkFavorite = async () => {
      const json = await AsyncStorage.getItem("favorites");
      const favorites = json ? JSON.parse(json) : [];
      setIsFavorite(favorites.some((item: any) => item.id === track.id));
    };
    checkFavorite();
  }, [track.id]);

  useEffect(() => {
    const loadLyrics = async () => {
      try {
        const text = await getLyrics(track.title, track.artist);
        setLyrics(text);
      } catch {
        setLyrics("Lyrics not available.");
      }
    };
    loadLyrics();
  }, [track.title, track.artist]);

  const toggleFavorite = async () => {
    const json = await AsyncStorage.getItem("favorites");
    let favorites = json ? JSON.parse(json) : [];

    if (isFavorite) {
      favorites = favorites.filter((item: any) => item.id !== track.id);
      setIsFavorite(false);
      Alert.alert("Removed", `"${track.title}" removed from your library.`);
    } else {
      const newItem = { ...track };
      favorites.push(newItem);
      setIsFavorite(true);
      Alert.alert("Added", `"${track.title}" added to your library.`);
    }

    await AsyncStorage.setItem("favorites", JSON.stringify(favorites));
  };

  const handleSkip = async (direction: "next" | "prev", auto = false) => {
    if (!allTracks) return;
    const tracks = JSON.parse(allTracks as string);
    const currentIndex = tracks.findIndex((t: any) => t.id === track.id);
    const nextIndex =
      direction === "next"
        ? (currentIndex + 1) % tracks.length
        : (currentIndex - 1 + tracks.length) % tracks.length;
    const nextTrack = tracks[nextIndex];
    if (nextTrack) fadeTransition(nextTrack);
  };

  return (
    <LinearGradient
      colors={["#346D5D", "#0B1E19"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1, paddingHorizontal: 24, paddingTop: 40 }}
    >
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 20,
          }}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ position: "absolute", left: 0, top: 0 }}
          >
            <Ionicons name="chevron-back" size={24} color="#08110f" />
          </TouchableOpacity>
          <Text
            style={{
              color: "#08110f",
              fontSize: 18,
              fontWeight: "700",
            }}
          >
            Now Playing
          </Text>
        </View>

        <View style={{ alignItems: "center", marginBottom: 22 }}>
          <Image
            source={{ uri: track.artwork }}
            style={{ width: 320, height: 320, borderRadius: 20 }}
          />
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <View style={{ flex: 1, paddingRight: 10 }}>
            <Text
              style={{
                color: "#fff",
                fontSize: 20,
                fontWeight: "700",
                textTransform: "capitalize",
              }}
            >
              {track.title}
            </Text>
            <Text
              style={{
                color: "#d6e7df",
                fontSize: 14,
                marginTop: 4,
              }}
            >
              {typeof track.artist === "object" ? track.artist.name : track.artist}
            </Text>

          </View>
          <TouchableOpacity onPress={toggleFavorite}>
            <Feather
              name="heart"
              size={26}
              color={isFavorite ? "#FF4E4E" : "#fff"}
              style={{ opacity: isFavorite ? 1 : 0.8 }}
            />
          </TouchableOpacity>
        </View>

        <View style={{ marginBottom: 4 }}>
          <Slider
            style={{ width: "110%", alignSelf: "center", height: 40 }}
            value={position / duration || 0}
            onSlidingComplete={onSeek}
            minimumValue={0}
            maximumValue={1}
            minimumTrackTintColor="#ffffff"
            maximumTrackTintColor="#ffffff40"
            thumbTintColor="#fff"
          />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: -8,
            }}
          >
            <Text style={{ color: "#cfe3da", fontSize: 12 }}>
              {formatTime(position)}
            </Text>
            <Text style={{ color: "#cfe3da", fontSize: 12 }}>
              {formatTime(duration)}
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 12,
            paddingHorizontal: 10,
          }}
        >
          <Ionicons name="shuffle" size={22} color="#fff" />
          <TouchableOpacity onPress={() => handleSkip("prev")}>
            <Ionicons name="play-skip-back" size={30} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={togglePlayPause}
            style={{
              width: 90,
              height: 90,
              borderRadius: 45,
              backgroundColor: "rgba(255,255,255,0.1)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Ionicons
              name={isPlaying ? "pause" : "play"}
              size={38}
              color="#fff"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleSkip("next")}>
            <Ionicons name="play-skip-forward" size={30} color="#fff" />
          </TouchableOpacity>
          <Ionicons name="repeat" size={22} color="#fff" />
        </View>
        <View style={{ marginTop: 30 }}>
          <View
            style={{
              width: 36,
              height: 4,
              backgroundColor: "rgba(255,255,255,0.2)",
              borderRadius: 2,
              alignSelf: "center",
              marginBottom: 8,
            }}
          />
          <Text
            style={{
              textAlign: "center",
              color: "#fff",
              fontSize: 13,
              fontWeight: "600",
              marginBottom: 8,
            }}
          >
            Lyrics
          </Text>

          <View
            style={{
              backgroundColor: "rgba(26,58,50,0.9)",
              borderRadius: 14,
              padding: 14,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 6,
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontWeight: "700",
                  fontSize: 14,
                }}
              >
                Lirik
              </Text>
              <TouchableOpacity
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  backgroundColor: "rgba(255,255,255,0.08)",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Feather name="maximize-2" size={14} color="#fff" />
              </TouchableOpacity>
            </View>

            <Text style={{ color: "#fff", lineHeight: 22, fontSize: 13 }}>
              {lyrics}
            </Text>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                alignSelf: "flex-end",
                marginTop: 8,
              }}
            >
              <Feather name="share" size={14} color="#fff" />
              <Text
                style={{
                  color: "#fff",
                  marginLeft: 6,
                  fontSize: 12,
                }}
              >
                Share
              </Text>
            </View>
          </View>
        </View>
      </Animated.View>
    </LinearGradient>
  );
}