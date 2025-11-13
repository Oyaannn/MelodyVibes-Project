import React, { useEffect, useState } from "react";
import { ScrollView, ActivityIndicator, Alert, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context"; 
import { getPlaylistTracks, getPlaylistDetails, Track } from "../core/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

export default function PlaylistDetail() {
  const { id } = useLocalSearchParams();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [playlistInfo, setPlaylistInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (id) loadPlaylistData();
  }, [id]);

  const loadPlaylistData = async () => {
    try {
      const [playlistData, songs] = await Promise.all([
        getPlaylistDetails(id as string),
        getPlaylistTracks(id as string),
      ]);

      setPlaylistInfo(playlistData);
      setTracks(songs);
      checkIfFavorite(playlistData);
    } catch (error) {
      console.error("Error loading playlist:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkIfFavorite = async (playlistData: any) => {
    try {
      const json = await AsyncStorage.getItem("liked_playlists");
      const favorites = json ? JSON.parse(json) : [];
      setIsFavorite(favorites.some((p: any) => p.id === playlistData.id));
    } catch (e) {
      console.error("Error checking playlist favorite:", e);
    }
  };

  const toggleFavorite = async () => {
    try {
      const json = await AsyncStorage.getItem("liked_playlists");
      let favorites = json ? JSON.parse(json) : [];

      if (isFavorite) {
        favorites = favorites.filter((p: any) => p.id !== playlistInfo.id);
        setIsFavorite(false);
        Alert.alert("Removed", `"${playlistInfo.title}" removed from your library.`);
      } else {
        const newItem = {
          id: playlistInfo.id,
          title: playlistInfo.title,
          picture: playlistInfo.picture_medium || playlistInfo.picture,
          creator: playlistInfo.creator?.name || "Unknown",
          fans: playlistInfo.fans || 0,
          trackCount: playlistInfo.nb_tracks || tracks.length,
        };
        favorites.push(newItem);
        setIsFavorite(true);
        Alert.alert("Added", `"${playlistInfo.title}" added to your library.`);
      }

      await AsyncStorage.setItem("liked_playlists", JSON.stringify(favorites));
    } catch (e) {
      console.error("Error updating playlist favorites:", e);
    }
  };

  const playAllTracks = () => {
    if (tracks.length === 0) return;
    const firstTrack = tracks[0];
    router.push({
      pathname: "/player/[id]",
      params: {
        id: firstTrack.id,
        title: firstTrack.title,
        artist: firstTrack.artist,
        artwork: firstTrack.artwork,
        audio: firstTrack.preview,
        allTracks: JSON.stringify(tracks),
      },
    });
  };

  if (loading) {
    return (
      <LoadingContainer>
        <ActivityIndicator size="large" color="#1b5e47" />
      </LoadingContainer>
    );
  }

  const totalDuration = tracks.reduce((acc, t) => acc + (t.duration || 0), 0);
  const hours = Math.floor(totalDuration / 3600);
  const minutes = Math.floor((totalDuration % 3600) / 60);

  return (
    <SafeContainer>
    <Container>
      <Header>
        <BackButton onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </BackButton>
        <SearchBar placeholder="Search in Playlist..." placeholderTextColor="#888" />
        <Ionicons name="ellipsis-vertical" size={22} color="#000" />
      </Header>

      <ScrollView showsVerticalScrollIndicator={false}>
        {playlistInfo?.picture_xl && (
          <CoverImage source={{ uri: playlistInfo.picture_xl }} resizeMode="cover" />
        )}

        <PlaylistTitle numberOfLines={1}>
          {playlistInfo?.title || "Unknown Playlist"}
        </PlaylistTitle>
        <PlaylistOwner>@{playlistInfo?.creator?.name || "unknown"}</PlaylistOwner>
        <PlaylistInfo>
          {`${playlistInfo?.fans || 0} likes • ${hours} hours ${minutes} minutes`}
        </PlaylistInfo>

        <ActionRow>
          <TouchableOpacity onPress={toggleFavorite}>
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={26}
              color={isFavorite ? "#FF4E4E" : "#000"}
            />
          </TouchableOpacity>

          <Ionicons name="shuffle" size={24} color="#000" />

          <PlayButton onPress={playAllTracks}>
            <Ionicons name="play" size={26} color="#fff" />
          </PlayButton>
        </ActionRow>

        {tracks.map((track) => (
          <TrackRow
            key={track.id}
            onPress={() =>
              router.push({
                pathname: "/player/[id]",
                params: {
                  id: track.id,
                  title: track.title,
                  artist: track.artist,
                  artwork: track.artwork,
                  audio: track.preview,
                  allTracks: JSON.stringify(tracks),
                },
              })
            }
          >
            <TrackImage source={{ uri: track.artwork }} />
            <TrackInfo>
              <TrackTitle numberOfLines={1}>{track.title}</TrackTitle>
              <TrackArtist numberOfLines={1}>{track.artist}</TrackArtist>
            </TrackInfo>
            <Ionicons name="ellipsis-horizontal" size={20} color="#000" />
          </TrackRow>
        ))}

        {tracks[0] && (
          <NowPlayingBar>
            <NowPlayingImage source={{ uri: tracks[0]?.artwork }} />
            <NowPlayingInfo>
              <NowPlayingTitle>{tracks[0]?.title}</NowPlayingTitle>
              <NowPlayingArtist>{tracks[0]?.artist}</NowPlayingArtist>
            </NowPlayingInfo>
            <Ionicons name="pause" size={22} color="#000" />
          </NowPlayingBar>
        )}
      </ScrollView>
    </Container>
    </SafeContainer>
  );
}

const SafeContainer = styled(SafeAreaView)`
  flex: 1;
  background-color: #fff;
  min-height: 100%;
`;

const Container = styled.View`
  flex: 1;
  background-color: #fff;
  padding: 20px 25px;
`;

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #fff;
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const BackButton = styled.TouchableOpacity`
  padding: 5px;
`;

const SearchBar = styled.TextInput`
  flex: 1;
  background-color: #f5f5f5;
  border-radius: 10px;
  padding: 8px 12px;
  margin: 0 10px;
  font-size: 14px;
  color: #000;
`;

const CoverImage = styled.Image`
  width: 80%;
  aspect-ratio: 1;
  border-radius: 12px;
  align-self: center;
  margin-bottom: 18px;
`;

const PlaylistTitle = styled.Text`
  font-size: 22px;
  font-weight: 700;
  color: #000;
  margin-bottom: 4px;
`;

const PlaylistOwner = styled.Text`
  font-size: 14px;
  color: #555;
  margin-bottom: 3px;
`;

const PlaylistInfo = styled.Text`
  font-size: 13px;
  color: #777;
  margin-bottom: 12px;
`;

const ActionRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 22px;
  margin-bottom: 28px;
`;

const PlayButton = styled.TouchableOpacity`
  margin-left: auto;
  background-color: #1db954;
  width: 50px;
  height: 50px;
  border-radius: 25px;
  align-items: center;
  justify-content: center;
`;

const TrackRow = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  margin-bottom: 16px;
`;

const TrackImage = styled.Image`
  width: 55px;
  height: 55px;
  border-radius: 8px;
  margin-right: 15px;
`;

const TrackInfo = styled.View`
  flex: 1;
`;

const TrackTitle = styled.Text`
  color: #000;
  font-size: 15px;
  font-weight: 600;
`;

const TrackArtist = styled.Text`
  color: #666;
  font-size: 13px;
`;

const NowPlayingBar = styled.View`
  background-color: #dff5e0;
  border-radius: 10px;
  flex-direction: row;
  align-items: center;
  padding: 8px 15px;
  margin-top: 25px;
`;

const NowPlayingImage = styled.Image`
  width: 45px;
  height: 45px;
  border-radius: 8px;
  margin-right: 10px;
`;

const NowPlayingInfo = styled.View`
  flex: 1;
`;

const NowPlayingTitle = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: #000;
`;

const NowPlayingArtist = styled.Text`
  font-size: 12px;
  color: #555;
`;