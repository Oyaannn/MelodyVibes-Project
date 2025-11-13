import React, { useEffect, useState } from "react";
import { ScrollView, ActivityIndicator, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import {
  getTrendingTracks,
  getTopArtists,
  getTopPlaylists,
  Track,
} from "../core/api";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [artists, setArtists] = useState<any[]>([]);
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const [t, a, p] = await Promise.all([
        getTrendingTracks(),
        getTopArtists(),
        getTopPlaylists(),
      ]);
      setTracks(t);
      setArtists(a);
      setPlaylists(p);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <LoadingContainer>
        <ActivityIndicator size="large" color="#1b5e47" />
      </LoadingContainer>
    );
  }

  return (
    <SafeContainer>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80 }}>
        <Header>
          <ProfileRow>
            <TouchableOpacity onPress={() => router.push("/screen/profile")}>
              <ProfileLeft>
                <ProfileImage
                  source={require("../../assets/images/foto.png")}
                  resizeMode="cover"
                />
                <ProfileInfo>
                  <ProfileName>Irpan Arroyan</ProfileName>
                  <ProfileSub>MelodyVibes</ProfileSub>
                </ProfileInfo>
              </ProfileLeft>
            </TouchableOpacity>

            <Ionicons
              name="settings-outline"
              size={24}
              color="#000"
              onPress={() => router.push("screen/settings")}
            />
          </ProfileRow>
        </Header>

        <SectionHeader>
          <SectionTitle>Top Playlist</SectionTitle>
          <TouchableOpacity onPress={() => router.push("/screen/allPlaylists")}>
            <SeeAllText>See All</SeeAllText>
          </TouchableOpacity>
        </SectionHeader>
        <HorizontalScroll horizontal showsHorizontalScrollIndicator={false}>
          {playlists.slice(0, 6).map((p) => (
            <PlaylistCard
              key={p.id}
              onPress={() =>
                router.push({
                  pathname: "/playlist/[id]",
                  params: { id: p.id, title: p.title },
                })
              }
            >
              <PlaylistImage source={{ uri: p.picture }} resizeMode="cover" />
              <PlaylistTitle numberOfLines={1}>{p.title}</PlaylistTitle>
            </PlaylistCard>
          ))}
        </HorizontalScroll>

        <SectionHeader>
          <SectionTitle>Artis Populer</SectionTitle>
          <TouchableOpacity onPress={() => router.push("/screen/allArtists")}>
            <SeeAllText>See All</SeeAllText>
          </TouchableOpacity>
        </SectionHeader>
        <HorizontalScroll horizontal showsHorizontalScrollIndicator={false}>
          {artists.slice(0, 6).map((artist) => (
            <TouchableOpacity
              key={artist.id}
              onPress={() =>
                router.push({
                  pathname: "/artist/[id]",
                  params: { id: artist.id },
                })
              }
            >
              <ArtistCard>
                <ArtistImage
                  source={{ uri: artist.picture }}
                  resizeMode="cover"
                />
                <ArtistLabel numberOfLines={1}>{artist.name}</ArtistLabel>
              </ArtistCard>
            </TouchableOpacity>
          ))}
        </HorizontalScroll>

        <SectionHeader>
          <SectionTitle>Recommend for You</SectionTitle>
          <TouchableOpacity onPress={() => router.push("/screen/allTracks")}>
            <SeeAllText>See All</SeeAllText>
          </TouchableOpacity>
        </SectionHeader>

        {tracks.slice(0, 6).map((track) => (
          <RecommendRow
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
            <RecImage source={{ uri: track.artwork }} resizeMode="cover" />
            <RecInfo>
              <RecTitle numberOfLines={1}>{track.title}</RecTitle>
              <RecArtist numberOfLines={1}>{track.artist}</RecArtist>
              <RecDetail>114k streams</RecDetail>
            </RecInfo>
          </RecommendRow>
        ))}
      </ScrollView>

    </SafeContainer>
  );
}

const SafeContainer = styled(SafeAreaView).attrs({
  edges: ["top", "left", "right"],
})`
  flex: 1;
  background-color: #fff;
  min-height: 100%;
`;

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #fff;
`;

const Header = styled.View`
  margin: 20px;
`;

const ProfileRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const ProfileLeft = styled.View`
  flex-direction: row;
  align-items: center;
`;

const ProfileImage = styled.Image`
  width: 55px;
  height: 55px;
  border-radius: 30px;
  margin-right: 10px;
`;

const ProfileInfo = styled.View``;

const ProfileName = styled.Text`
  font-weight: 700;
  font-size: 16px;
  color: #000;
`;

const ProfileSub = styled.Text`
  color: #888;
  font-size: 13px;
`;

const SectionHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 0 20px 10px 20px;
`;

const SectionTitle = styled.Text`
  color: #000;
  font-size: 18px;
  font-weight: 700;
`;

const SeeAllText = styled.Text`
  color: #1b5e47;
  font-size: 13px;
`;

const HorizontalScroll = styled.ScrollView`
  padding-left: 20px;
  margin-bottom: 15px;
`;

const PlaylistCard = styled.TouchableOpacity`
  margin-right: 15px;
  width: 140px;
`;

const PlaylistImage = styled.Image`
  width: 140px;
  height: 140px;
  border-radius: 15px;
`;

const PlaylistTitle = styled.Text`
  color: #000;
  font-size: 14px;
  font-weight: 600;
  margin-top: 6px;
`;

const ArtistCard = styled.View`
  align-items: center;
  margin-right: 20px;
`;

const ArtistImage = styled.Image`
  width: 90px;
  height: 90px;
  border-radius: 45px;
  margin-bottom: 8px;
`;

const ArtistLabel = styled.Text`
  color: #000;
  font-size: 14px;
  text-align: center;
  width: 90px;
`;

const RecommendRow = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  margin: 0 20px 20px 20px;
`;

const RecImage = styled.Image`
  width: 80px;
  height: 80px;
  border-radius: 12px;
  margin-right: 15px;
`;

const RecInfo = styled.View`
  flex: 1;
`;

const RecTitle = styled.Text`
  font-size: 15px;
  font-weight: 600;
  color: #000;
`;

const RecArtist = styled.Text`
  color: #666;
  font-size: 13px;
`;

const RecDetail = styled.Text`
  color: #888;
  font-size: 12px;
`;