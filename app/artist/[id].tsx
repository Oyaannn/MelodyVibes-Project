import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, ActivityIndicator } from "react-native";
import styled from "styled-components/native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons, Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getArtistDetails, getArtistTracks } from "../core/api";

export default function ArtistDetail() {
  const { id } = useLocalSearchParams();
  const [artist, setArtist] = useState<any>(null);
  const [tracks, setTracks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkFollowStatus = async () => {
      try {
        const json = await AsyncStorage.getItem("followed_artists");
        const followed = json ? JSON.parse(json) : [];
        setIsFollowing(followed.some((a: any) => a.id === id));
      } catch (err) {
        console.error("Error checking follow status:", err);
      }
    };
    checkFollowStatus();
  }, [id]);

  useEffect(() => {
    const loadArtist = async () => {
      try {
        const [artistData, trackData] = await Promise.all([
          getArtistDetails(id as string),
          getArtistTracks(id as string),
        ]);
        setArtist(artistData);
        setTracks(trackData);
      } catch (error) {
        console.log("Error loading artist:", error);
      } finally {
        setLoading(false);
      }
    };
    loadArtist();
  }, [id]);

  const toggleFollow = async () => {
    try {
      const json = await AsyncStorage.getItem("followed_artists");
      const followed = json ? JSON.parse(json) : [];

      let updated;
      if (isFollowing) {
        updated = followed.filter((a: any) => a.id !== id);
      } else {
        const newArtist = {
          id,
          name: artist.name,
          picture: artist.picture_medium,
        };
        updated = [...followed, newArtist];
      }

      await AsyncStorage.setItem("followed_artists", JSON.stringify(updated));
      setIsFollowing(!isFollowing);
    } catch (err) {
      console.error("Error updating follow:", err);
    }
  };

  const playAllTracks = () => {
    if (tracks.length === 0) return;

    const cleanedTracks = tracks.map((t) => ({
      id: t.id,
      title: t.title,
      artist: t.artist?.name || artist.name,
      artwork: t.album?.cover_xl,
      audio: t.preview,
    }));

    const firstTrack = cleanedTracks[0];

    router.push({
      pathname: "/player/[id]",
      params: {
        id: firstTrack.id,
        title: firstTrack.title,
        artist: firstTrack.artist,
        artwork: firstTrack.artwork,
        audio: firstTrack.audio,
        allTracks: JSON.stringify(cleanedTracks),
      },
    });
  };


  if (loading) {
    return (
      <LoadingView>
        <ActivityIndicator size="large" color="#1b5e47" />
      </LoadingView>
    );
  }

  return (
    <Container>
      <HeaderContainer>
        <ArtistImage source={{ uri: artist?.picture_xl }} resizeMode="cover" />
        <Overlay />
        <BackButton onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </BackButton>

        <HeaderContent>
          <ArtistName>{artist?.name}</ArtistName>
        </HeaderContent>
      </HeaderContainer>

      <InfoSection>
        <Text style={{ color: "#888", marginBottom: 10 }}>
          {`${artist?.nb_fan ? artist.nb_fan.toLocaleString() : "0"} Monthly listeners`}
        </Text>

        <ButtonRow>
          <FollowButton onPress={toggleFollow} active={isFollowing}>
            <FollowText active={isFollowing}>
              {isFollowing ? "Following" : "Follow"}
            </FollowText>
          </FollowButton>

          <RightButtons>
            <TouchableOpacity
              style={{
                backgroundColor: "#1b5e47",
                width: 50,
                height: 50,
                borderRadius: 25,
                justifyContent: "center",
                alignItems: "center",
                marginRight: 10,
              }}
            >
              <Ionicons name="shuffle" size={22} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                backgroundColor: "#1b5e47",
                width: 50,
                height: 50,
                borderRadius: 25,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={playAllTracks}
            >
              <Ionicons name="play" size={26} color="#fff" />
            </TouchableOpacity>
          </RightButtons>
        </ButtonRow>
      </InfoSection>

      <SectionTitle>Popular Songs</SectionTitle>
      <SongList
        data={tracks}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/player/[id]",
                params: {
                  id: item.id,
                  title: item.title,
                  artist: item.artist?.name || artist.name,
                  artwork: item.album.cover_xl,
                  audio: item.preview,
                  allTracks: JSON.stringify(
                    tracks.map((t) => ({
                      id: t.id,
                      title: t.title,
                      artist: t.artist?.name || artist.name,
                      artwork: t.album?.cover_xl,
                      audio: t.preview,
                    }))
                  ),
                },
              })
            }
          >
            <SongRow>
              <SongIndex>{index + 1}.</SongIndex>
              <SongImage source={{ uri: item.album.cover_medium }} />
              <SongInfo>
                <SongTitle numberOfLines={1}>{item.title}</SongTitle>
                <SongSub>{artist.name}</SongSub>
              </SongInfo>
              <Feather name="more-vertical" size={18} color="#444" />
            </SongRow>
          </TouchableOpacity>
        )}
      />
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  background-color: #fff;
`;

const HeaderContainer = styled.View`
  position: relative;
  width: 100%;
  height: 320px;
`;

const ArtistImage = styled.Image`
  width: 100%;
  height: 100%;
`;

const Overlay = styled.View`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.45);
`;

const BackButton = styled.TouchableOpacity`
  position: absolute;
  top: 50px;
  left: 20px;
  z-index: 10;
`;

const HeaderContent = styled.View`
  position: absolute;
  bottom: 30px;
  left: 20px;
`;

const ArtistName = styled.Text`
  color: #fff;
  font-size: 36px;
  font-weight: 800;
`;

const InfoSection = styled.View`
  padding: 20px;
  border-bottom-width: 0.4px;
  border-bottom-color: #ccc;
`;

const ButtonRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const RightButtons = styled.View`
  flex-direction: row;
  align-items: center;
`;

const FollowButton = styled.TouchableOpacity<{ active?: boolean }>`
  border-width: 1px;
  border-color: ${({ active }) => (active ? "#1b5e47" : "#000")};
  background-color: ${({ active }) => (active ? "#1b5e47" : "transparent")};
  border-radius: 25px;
  padding: 10px 22px;
`;

const FollowText = styled.Text<{ active?: boolean }>`
  color: ${({ active }) => (active ? "#fff" : "#000")};
  font-weight: 600;
`;

const SectionTitle = styled.Text`
  color: #000;
  font-size: 18px;
  font-weight: 700;
  margin: 20px 20px 10px 20px;
`;

const SongList = styled.FlatList`
  padding: 0 20px 40px 20px;
`;

const SongRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 16px;
`;

const SongIndex = styled.Text`
  color: #000;
  font-size: 15px;
  width: 20px;
`;

const SongImage = styled.Image`
  width: 50px;
  height: 50px;
  border-radius: 6px;
  margin: 0 10px;
`;

const SongInfo = styled.View`
  flex: 1;
`;

const SongTitle = styled.Text`
  color: #000;
  font-size: 15px;
  font-weight: 600;
`;

const SongSub = styled.Text`
  color: #666;
  font-size: 13px;
`;

const LoadingView = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;