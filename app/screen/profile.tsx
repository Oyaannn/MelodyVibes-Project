import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function ProfileDetail() {
  const router = useRouter();
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [artists, setArtists] = useState<any[]>([]);

  useEffect(() => {
    const loadLibraryData = async () => {
      try {
        const likedPlaylists = JSON.parse(
          (await AsyncStorage.getItem("liked_playlists")) || "[]"
        );
        const followedArtists = JSON.parse(
          (await AsyncStorage.getItem("followed_artists")) || "[]"
        );
        setPlaylists(likedPlaylists);
        setArtists(followedArtists);
      } catch (error) {
        console.error("Failed to load profile data:", error);
      }
    };
    loadLibraryData();
  }, []);

  return (
    <Container>
      <ScrollView showsVerticalScrollIndicator={false}>
        <HeaderBackground
          source={require("../../assets/images/bg-1.png")}
          resizeMode="cover"
        >
          <HeaderContent>
            <BackButton onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={28} color="#000" />
            </BackButton>

            <HeaderTitle>Profile</HeaderTitle>
            <SettingsButton >
              <Ionicons name="settings-outline" size={24} color="#000" onPress={() => router.push("screen/settings")} />
            </SettingsButton>

            <ProfileRow>
              <ProfileImage
                source={require("../../assets/images/foto.png")}
                resizeMode="cover"
              />
              <ProfileInfo>
                <ProfileName>Irpan Arroyan</ProfileName>
                <ProfileUsername>@oyaannn_</ProfileUsername>
                <PremiumBadge>Premium Account</PremiumBadge>
              </ProfileInfo>
            </ProfileRow>
          </HeaderContent>
        </HeaderBackground>

        <StatsRow>
          <StatBox>
            <StatNumber>{playlists.length}</StatNumber>
            <StatLabel>Playlist</StatLabel>
          </StatBox>
          <StatBox>
            <StatNumber>10</StatNumber>
            <StatLabel>Following</StatLabel>
          </StatBox>
          <StatBox>
            <StatNumber>999</StatNumber>
            <StatLabel>Followers</StatLabel>
          </StatBox>
        </StatsRow>

        <SectionHeader>
          <SectionTitle>Playlist</SectionTitle>
          <SeeAll onPress={() => router.push({ pathname: "/(tabs)/library", params: { tab: "Playlist" } })}>
            See all
          </SeeAll>
        </SectionHeader>

        {playlists.length > 0 ? (
          <Row>
            {playlists.slice(0, 3).map((p, index) => (
              <TouchableItem
                key={index}
                onPress={() =>
                  router.push({
                    pathname: "/playlist/[id]",
                    params: { id: p.id },
                  })
                }
              >
                <PlaylistImage source={{ uri: p.picture }} />
                <ItemLabel numberOfLines={1}>{p.title}</ItemLabel>
              </TouchableItem>
            ))}
          </Row>
        ) : (
          <EmptyContainer>
            <EmptyText>No favorite playlist yet.</EmptyText>
          </EmptyContainer>
        )}

        <SectionHeader>
          <SectionTitle>Favorite Artist</SectionTitle>
          <SeeAll onPress={() => router.push({ pathname: "/(tabs)/library", params: { tab: "Artists" } })}>
            See all
          </SeeAll>
        </SectionHeader>

        {artists.length > 0 ? (
          <Row>
            {artists.slice(0, 3).map((a, index) => (
              <TouchableItem
                key={index}
                onPress={() =>
                  router.push({
                    pathname: "/artist/[id]",
                    params: { id: a.id },
                  })
                }
              >
                <ArtistImage source={{ uri: a.picture }} />
                <ItemLabel numberOfLines={1}>{a.name}</ItemLabel>
              </TouchableItem>
            ))}
          </Row>
        ) : (
          <EmptyContainer>
            <EmptyText>No favorite artist yet.</EmptyText>
          </EmptyContainer>
        )}
      </ScrollView>
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  background-color: #fff;
`;

const HeaderBackground = styled.ImageBackground`
  width: 100%;
  height: 230px;
  border-bottom-left-radius: 40px;
  border-bottom-right-radius: 40px;
  overflow: hidden;
`;

const HeaderContent = styled.View`
  flex: 1;
  padding-top: 55px;
  padding-horizontal: 25px;
`;

const BackButton = styled.TouchableOpacity`
  position: absolute;
  top: 55px;
  left: 20px;
`;

const SettingsButton = styled.TouchableOpacity`
  position: absolute;
  top: 55px;
  right: 20px;
`;

const HeaderTitle = styled.Text`
  text-align: center;
  font-size: 20px;
  font-weight: 700;
  color: #000;
`;

const ProfileRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 35px;
`;

const ProfileImage = styled.Image`
  width: 85px;
  height: 85px;
  border-radius: 42px;
  margin-right: 18px;
`;

const ProfileInfo = styled.View`
  flex-direction: column;
`;

const ProfileName = styled.Text`
  font-size: 19px;
  font-weight: 700;
  color: #000;
`;

const ProfileUsername = styled.Text`
  font-size: 14px;
  color: #333;
  opacity: 0.8;
  margin-top: 2px;
`;

const PremiumBadge = styled.Text`
  color: #222;
  font-size: 13px;
  margin-top: 3px;
  opacity: 0.7;
`;

const StatsRow = styled.View`
  flex-direction: row;
  justify-content: space-around;
  margin-top: 18px;
`;

const StatBox = styled.View`
  align-items: center;
`;

const StatNumber = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: #000;
`;

const StatLabel = styled.Text`
  font-size: 13px;
  color: #555;
`;

const SectionHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 35px 20px 10px 20px;
`;

const SectionTitle = styled.Text`
  font-size: 17px;
  font-weight: 700;
  color: #000;
`;

const SeeAll = styled.Text`
  font-size: 13px;
  color: #1b5e47;
`;

const Row = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  padding: 0 20px;
  margin-bottom: 15px;
  gap: 16px; /* tambahkan jarak antar item */
`;


const TouchableItem = styled.TouchableOpacity`
  width: 30%;
  align-items: center;
`;

const PlaylistImage = styled.Image`
  width: 100%;
  height: 100px;
  border-radius: 12px;
  margin-bottom: 8px;
`;

const ArtistImage = styled.Image`
  width: 100px;
  height: 100px;
  border-radius: 50px;
  margin-bottom: 8px;
`;

const ItemLabel = styled.Text`
  color: #000;
  font-size: 13px;
  text-align: center;
`;

const EmptyContainer = styled.View`
  align-items: center;
  justify-content: center;
  margin-top: 10px;
  margin-bottom: 25px;
`;

const EmptyText = styled.Text`
  color: #888;
  font-size: 14px;
  text-align: center;
`;