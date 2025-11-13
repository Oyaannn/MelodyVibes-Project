import React, { useEffect, useState } from "react";
import { ScrollView, ActivityIndicator, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getTrendingTracks } from "../core/api";

export default function AllTracksScreen() {
  const router = useRouter();
  const [tracks, setTracks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTracks = async () => {
      const data = await getTrendingTracks(30);
      setTracks(data);
      setLoading(false);
    };
    fetchTracks();
  }, []);

  if (loading) {
    return (
      <LoadingContainer>
        <ActivityIndicator size="large" color="#1b5e47" />
      </LoadingContainer>
    );
  }

  return (
    <Container>
      <Header>
        <BackButton onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={26} color="#000" />
        </BackButton>
        <HeaderTitle>Recommended Songs</HeaderTitle>
        <Spacer />
      </Header>

      <ScrollView showsVerticalScrollIndicator={false}>
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
                  audio: track.audio,
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
          </TrackRow>
        ))}
      </ScrollView>
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  background-color: #fff;
  padding: 25px;
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 25px;
  margin-top: 15px;
`;

const BackButton = styled.TouchableOpacity``;

const HeaderTitle = styled.Text`
  font-size: 20px;
  font-weight: 700;
  color: #000;
`;

const Spacer = styled.View`
  width: 26px;
`;

const TrackRow = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  margin-bottom: 18px;
`;

const TrackImage = styled.Image`
  width: 80px;
  height: 80px;
  border-radius: 12px;
  margin-right: 15px;
`;

const TrackInfo = styled.View`
  flex: 1;
`;

const TrackTitle = styled.Text`
  font-size: 15px;
  font-weight: 600;
  color: #000;
`;

const TrackArtist = styled.Text`
  font-size: 13px;
  color: #777;
`;

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;