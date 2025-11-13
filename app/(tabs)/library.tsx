import React, { useState, useCallback, useEffect } from "react";
import { ScrollView, TouchableOpacity, Modal, TouchableWithoutFeedback, View, Text } from "react-native";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";

export default function LibraryScreen() {
  const [activeTab, setActiveTab] = useState<"Playlist" | "Artists" | "Tracks" | "Albums">("Playlist");
  const [tracks, setTracks] = useState<any[]>([]);
  const [artists, setArtists] = useState<any[]>([]);
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [currentTrack, setCurrentTrack] = useState<any>(null);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      const loadLibrary = async () => {
        try {
          const favTracks = JSON.parse((await AsyncStorage.getItem("favorites")) || "[]");
          const followedArtists = JSON.parse((await AsyncStorage.getItem("followed_artists")) || "[]");
          const likedPlaylists = JSON.parse((await AsyncStorage.getItem("liked_playlists")) || "[]");
          const playing = JSON.parse((await AsyncStorage.getItem("now_playing")) || "null");

          setTracks(favTracks);
          setArtists(followedArtists);
          setPlaylists(likedPlaylists);
          setCurrentTrack(playing);
        } catch (error) {
          console.error("Failed to load library:", error);
        }
      };
      loadLibrary();
    }, [])
  );

  useEffect(() => {
    const listener = async () => {
      const playing = JSON.parse((await AsyncStorage.getItem("now_playing")) || "null");
      setCurrentTrack(playing);
    };
    const interval = setInterval(listener, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <SafeContainer>
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

      <TitleRow>
        <Title>Your Library</Title>
        <TouchableOpacity onPress={() => setShowAddMenu(true)}>
          <Ionicons name="add" size={22} color="#000" />
        </TouchableOpacity>

      </TitleRow>

      <TabWrapper>
        <TabRow horizontal showsHorizontalScrollIndicator={false}>
          {["Playlist", "Artists", "Tracks", "Albums"].map((tab) => (
            <TabButton
              key={tab}
              active={activeTab === tab}
              onPress={() => setActiveTab(tab as any)}
            >
              <TabText active={activeTab === tab}>{tab}</TabText>
            </TabButton>
          ))}
        </TabRow>
      </TabWrapper>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: currentTrack ? 140 : 80 }}
      >
        {activeTab === "Playlist" && (
          <PlaylistGrid>
            {playlists.length === 0 ? (
              <EmptyText>No playlist saved yet.</EmptyText>
            ) : (
              playlists.map((p, i) => (
                <PlaylistCard
                  key={i}
                  onPress={() =>
                    router.push({
                      pathname: "/playlist/[id]",
                      params: { id: p.id, title: p.title },
                    })
                  }
                >
                  <PlaylistInner>
                    <PlaylistImage source={{ uri: p.picture }} />
                    <PlaylistTitle numberOfLines={1}>{p.title}</PlaylistTitle>
                    <PlaylistSub>{p.trackCount || "12"} songs</PlaylistSub>
                  </PlaylistInner>
                </PlaylistCard>
              ))
            )}
          </PlaylistGrid>
        )}

        {activeTab === "Artists" && (
          <ArtistGrid>
            {artists.length === 0 ? (
              <EmptyText>No followed artists yet.</EmptyText>
            ) : (
              artists.map((a, i) => (
                <ArtistCard
                  key={i}
                  onPress={() =>
                    router.push({
                      pathname: "/artist/[id]",
                      params: { id: a.id },
                    })
                  }
                >
                  <ArtistImage source={{ uri: a.picture }} />
                  <ArtistName numberOfLines={1}>{a.name}</ArtistName>
                </ArtistCard>
              ))
            )}
          </ArtistGrid>
        )}

        {activeTab === "Tracks" && (
          <AlbumGrid>
            {tracks.length === 0 ? (
              <EmptyText>No favorite tracks yet.</EmptyText>
            ) : (
              tracks.map((item, index) => (
                <AlbumCard
                  key={index}
                  onPress={() =>
                    router.push({
                      pathname: "/player/[id]",
                      params: {
                        id: item.id?.toString(),
                        title: item.title,
                        artist: item.artist,
                        artwork: item.artwork,
                        audio: item.audio || item.preview || "",
                        allTracks: JSON.stringify(
                          tracks.map((t) => ({
                            id: t.id?.toString(),
                            title: t.title,
                            artist: t.artist,
                            artwork: t.artwork,
                            audio: t.audio || t.preview || "",
                          }))
                        ),
                      },
                    })
                  }
                >
                  <AlbumImage source={{ uri: item.artwork }} />
                  <AlbumTitle numberOfLines={1}>{item.title}</AlbumTitle>
                  <AlbumArtist numberOfLines={1}>{item.artist}</AlbumArtist>
                </AlbumCard>
              ))
            )}
          </AlbumGrid>
        )}

        {activeTab === "Albums" && <EmptyText>No favorite album yet.</EmptyText>}
      </ScrollView>
      <Modal
        visible={showAddMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAddMenu(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowAddMenu(false)}>
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.4)",
              justifyContent: "flex-end",
            }}
          >
            <View
              style={{
                backgroundColor: "#fff",
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                padding: 25,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "700",
                  color: "#000",
                  marginBottom: 15,
                  textAlign: "center",
                }}
              >
              </Text>

              {["Playlist", "Artists", "Tracks", "Albums"].map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 12,
                    borderBottomWidth: index === 3 ? 0 : 1,
                    borderColor: "#eee",
                  }}
                  onPress={() => {
                    setShowAddMenu(false);
                    console.log(`Add ${item}`);
                  }}
                >
                  <Ionicons
                    name={
                      item === "Playlist"
                        ? "musical-notes-outline"
                        : item === "Artists"
                          ? "person-outline"
                          : item === "Tracks"
                            ? "disc-outline"
                            : "albums-outline"
                    }
                    size={22}
                    color="#1b5e47"
                    style={{ marginRight: 12 }}
                  />
                  <Text
                    style={{
                      fontSize: 15,
                      color: "#000",
                      fontWeight: "500",
                    }}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

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

const TitleRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 0 20px 16px 20px;
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: 700;
  color: #000;
`;

const TabRow = styled.ScrollView`
  flex-grow: 0;
  height: 35px;
  margin: 0 20px;
`;

const TabWrapper = styled.View`
  z-index: 2;
  background-color: #fff;
  padding-bottom: 20px;
`;

const TabButton = styled.TouchableOpacity<{ active?: boolean }>`
  padding: 8px 20px;
  border-radius: 20px;
  margin-right: 10px;
  background-color: ${({ active }) => (active ? "#1b5e47" : "#f0f0f0")};
`;

const TabText = styled.Text<{ active?: boolean }>`
  font-weight: 600;
  font-size: 14px;
  color: ${({ active }) => (active ? "#fff" : "#333")};
`;

/* === PLAYLIST === */
const PlaylistGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 0 20px 120px 20px;
`;

const PlaylistCard = styled.TouchableOpacity`
  width: 47%;
  margin-bottom: 22px;
`;

const PlaylistInner = styled.View`
  background-color: #f4f4f4;
  border-radius: 14px;
  padding: 10px;
`;

const PlaylistImage = styled.Image`
  width: 100%;
  height: 110px;
  border-radius: 10px;
  margin-bottom: 8px;
`;

const PlaylistTitle = styled.Text`
  font-size: 14px;
  font-weight: 700;
  color: #000;
  text-align: left;
`;

const PlaylistSub = styled.Text`
  font-size: 12px;
  color: #666;
  text-align: left;
`;

const ArtistGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  padding: 10px 20px 120px 20px;
`;

const ArtistCard = styled.TouchableOpacity`
  width: 28%;
  align-items: center;
  margin-right: 14px;
  margin-bottom: 25px;
`;

const ArtistImage = styled.Image`
  width: 85px;
  height: 85px;
  border-radius: 50px;
  margin-bottom: 8px;
`;

const ArtistName = styled.Text`
  font-size: 13px;
  color: #000;
  text-align: center;
  font-weight: 500;
`;

const AlbumGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 0 20px 120px 20px;
`;

const AlbumCard = styled.TouchableOpacity`
  width: 48%;
  margin-bottom: 20px;
`;

const AlbumImage = styled.Image`
  width: 100%;
  height: 110px;
  border-radius: 10px;
  margin-bottom: 6px;
`;

const AlbumTitle = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: #000;
`;

const AlbumArtist = styled.Text`
  font-size: 13px;
  color: #666;
`;

const EmptyText = styled.Text`
  text-align: center;
  color: #888;
  font-size: 14px;
  margin-top: 60px;
  align-self: center;
  width: 100%;
`;