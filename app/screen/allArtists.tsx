import React, { useEffect, useState } from "react";
import { ScrollView, ActivityIndicator } from "react-native";
import styled from "styled-components/native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getTopArtists } from "../core/api";

export default function AllArtistsScreen() {
  const router = useRouter();
  const [artists, setArtists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  const fetchData = async () => {
    const data = await getTopArtists(50);
    setArtists(data);
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
        <HeaderTitle>All Artists</HeaderTitle>
        <Spacer />
      </Header>

      <ScrollView showsVerticalScrollIndicator={false}>
        {artists.map((artist) => (
          <ItemRow
            key={artist.id}
            onPress={() =>
              router.push({
                pathname: "/artist/[id]",
                params: { id: artist.id },
              })
            }
          >
            <ItemImage source={{ uri: artist.picture }} />
            <ItemInfo>
              <ItemTitle numberOfLines={1}>{artist.name}</ItemTitle>
              <ItemSubtitle>Popular Artist</ItemSubtitle>
            </ItemInfo>
          </ItemRow>
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
