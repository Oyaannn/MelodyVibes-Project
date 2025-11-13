import React, { useState, useEffect } from "react";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import { getGenres } from "../core/api";
import { useRouter } from "expo-router";
import { TouchableOpacity} from "react-native";

export default function SearchScreen() {
  const [genres, setGenres] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    getGenres().then(setGenres);
  }, []);

  return (
    <Container>
      <Header>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color="#000" />
        </TouchableOpacity>
        <HeaderTitle>Search</HeaderTitle>
      </Header>

      <TouchableSearch onPress={() => router.push("../core/searchDetail")}>
        <Ionicons name="search-outline" size={18} color="#777" />
        <SearchPlaceholder>Search music</SearchPlaceholder>
      </TouchableSearch>

      <BrowseTitle>Browse All</BrowseTitle>
      <GenreGrid
        data={genres}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        renderItem={({ item }) => (
          <GenreItem>
            <GenreImage source={{ uri: item.picture }} />
            <GenreText numberOfLines={1}>{item.name}</GenreText>
          </GenreItem>
        )}
        showsVerticalScrollIndicator={false}
      />
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  background-color: #fff;
  padding: 60px 20px 20px 20px;
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 15px;
`;

const HeaderTitle = styled.Text`
  font-size: 20px;
  font-weight: 700;
  margin-left: 10px;
  color: #000;
`;

const TouchableSearch = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  background-color: #f2f2f2;
  border-radius: 20px;
  padding: 15px 15px;
  margin-bottom: 20px;
`;

const SearchPlaceholder = styled.Text`
  font-size: 15px;
  color: #777;
  margin-left: 8px;
`;

const BrowseTitle = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: #000;
  margin-bottom: 15px;
`;

const GenreGrid = styled.FlatList``;

const GenreItem = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  background-color: #1b1b1b;
  border-radius: 50px;
  height: 60px;
  margin-bottom: 15px;
  flex: 0.48;
  overflow: hidden;
  padding-left: 5px;
`;

const GenreImage = styled.Image`
  width: 65px;
  height: 65px;
  border-radius: 50px;
  margin-left: -10px;
  margin-right: 8px;
`;

const GenreText = styled.Text`
  color: #fff;
  font-size: 13px;
  font-weight: 500;
`;