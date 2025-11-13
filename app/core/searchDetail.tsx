import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { searchTracks, Track } from "./api";
import { useRouter } from "expo-router";
import { TouchableOpacity, Alert } from "react-native";

export default function SearchDetail() {
  const [query, setQuery] = useState("");
  const [tracks, setTracks] = useState<Track[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const json = await AsyncStorage.getItem("searchHistory");
    setHistory(json ? JSON.parse(json) : []);
  };

  const saveHistory = async (term: string) => {
    const newHistory = [term, ...history.filter((h) => h !== term)].slice(0, 5);
    setHistory(newHistory);
    await AsyncStorage.setItem("searchHistory", JSON.stringify(newHistory));
  };

  const deleteHistoryItem = async (term: string) => {
    const filtered = history.filter((h) => h !== term);
    setHistory(filtered);
    await AsyncStorage.setItem("searchHistory", JSON.stringify(filtered));
  };

  const clearAllHistory = async () => {
    Alert.alert("Delete All", "Delete all search history?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete All",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.removeItem("searchHistory");
          setHistory([]);
        },
      },
    ]);
  };

  const handleSearch = async (text: string) => {
    setQuery(text);
    if (text.length < 2) {
      setTracks([]);
      return;
    }
    const results = await searchTracks(text);
    setTracks(results);
    saveHistory(text);
  };

  return (
    <Container>
      <Header>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color="#000" />
        </TouchableOpacity>
        <HeaderTitle>Search</HeaderTitle>
      </Header>

      <SearchBox>
        <Ionicons name="search-outline" size={18} color="#777" />
        <SearchInput
          placeholder="Search music, artist, or playlist"
          placeholderTextColor="#777"
          value={query}
          onChangeText={handleSearch}
          autoFocus
        />
      </SearchBox>

      {query === "" ? (
        <HistorySection>
          {history.length === 0 ? (
            <>
              <EmptyText>play what you love</EmptyText>
              <EmptySubText>
                search for artists, songs, podcasts, and more.
              </EmptySubText>
            </>
          ) : (
            <>
              <HistoryHeader>
                <HistoryTitle>Recent Searches</HistoryTitle>
                <TouchableOpacity onPress={clearAllHistory}>
                  <DeleteAllText>Delete all</DeleteAllText>
                </TouchableOpacity>
              </HistoryHeader>
              {history.map((item, idx) => (
                <HistoryRow key={idx}>
                  <TouchableOpacity
                    style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
                    onPress={() => handleSearch(item)}
                  >
                    <Ionicons
                      name="time-outline"
                      size={18}
                      color="#666"
                      style={{ marginRight: 10 }}
                    />
                    <HistoryText>{item}</HistoryText>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => deleteHistoryItem(item)}>
                    <Ionicons name="close-outline" size={20} color="#666" />
                  </TouchableOpacity>
                </HistoryRow>
              ))}
            </>
          )}
        </HistorySection>
      ) : (
        <ResultList
          data={tracks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/player/[id]",
                  params: {
                    id: item.id,
                    title: item.title,
                    artist: item.artist,
                    artwork: item.artwork,
                    audio: item.audio,
                    allTracks: JSON.stringify(tracks),
                  },
                })
              }
            >
              <ResultRow>
                <ResultImage source={{ uri: item.artwork }} />
                <ResultInfo>
                  <ResultTitle>{item.title}</ResultTitle>
                  <ResultArtist>{item.artist}</ResultArtist>
                </ResultInfo>
              </ResultRow>
            </TouchableOpacity>
          )}
        />
      )}
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

const SearchBox = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #f2f2f2;
  border-radius: 20px;
  padding: 7px 15px;
  margin-bottom: 20px;
`;

const SearchInput = styled.TextInput`
  flex: 1;
  font-size: 15px;
  color: #000;
  margin-left: 8px;
`;

const HistorySection = styled.View`
  flex: 1;
  justify-content: flex-start;
  margin-top: 10px;
`;

const EmptyText = styled.Text`
  text-align: center;
  color: #000;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 5px;
`;

const EmptySubText = styled.Text`
  text-align: center;
  color: #777;
  font-size: 13px;
`;

const HistoryHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const HistoryTitle = styled.Text`
  font-weight: 700;
  color: #000;
  font-size: 16px;
`;

const DeleteAllText = styled.Text`
  color: #b00;
  font-size: 13px;
  font-weight: 600;
`;

const HistoryRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const HistoryText = styled.Text`
  color: #444;
  font-size: 14px;
`;

const ResultList = styled.FlatList``;

const ResultRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 14px;
`;

const ResultImage = styled.Image`
  width: 55px;
  height: 55px;
  border-radius: 10px;
  margin-right: 10px;
`;

const ResultInfo = styled.View`
  flex: 1;
`;

const ResultTitle = styled.Text`
  color: #000;
  font-size: 15px;
  font-weight: 600;
`;

const ResultArtist = styled.Text`
  color: #777;
  font-size: 13px;
`;