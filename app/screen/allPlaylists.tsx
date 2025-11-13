import React, { useEffect, useState } from "react";
import { ScrollView, ActivityIndicator, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getTopPlaylists } from "../core/api";

export default function AllPlaylistsScreen() {
  const router = useRouter();
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getTopPlaylists(50);
      setPlaylists(data);
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
    <Container>
      <Header>
        <BackButton onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={26} color="#000" />
        </BackButton>
        <HeaderTitle>All Playlists</HeaderTitle>
        <Spacer />
      </Header>

      <ScrollView showsVerticalScrollIndicator={false}>
        {playlists.map((p) => (
          <ItemRow
            key={p.id}
            onPress={() =>
              router.push({
                pathname: "/playlist/[id]",
                params: { id: p.id, title: p.title },
              })
            }
          >
            <ItemImage source={{ uri: p.picture }} />
            <ItemInfo>
              <ItemTitle numberOfLines={1}>{p.title}</ItemTitle>
              <ItemSubtitle>Playlist</ItemSubtitle>
            </ItemInfo>
          </ItemRow>
        ))}
      </ScrollView>
    </Container>
  );
}

/* Styled Components */
const Container = styled.View`
  flex: 1;
  background-color: #fff;
  padding: 25px;
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 15px;
  margin-bottom: 25px;
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

const ItemRow = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  margin-bottom: 18px;
`;

const ItemImage = styled.Image`
  width: 80px;
  height: 80px;
  border-radius: 12px;
  margin-right: 15px;
`;

const ItemInfo = styled.View`
  flex: 1;
`;

const ItemTitle = styled.Text`
  font-size: 15px;
  font-weight: 600;
  color: #000;
`;

const ItemSubtitle = styled.Text`
  font-size: 13px;
  color: #777;
`;

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;