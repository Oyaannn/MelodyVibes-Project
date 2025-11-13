import React, { useState } from "react";
import { ScrollView, Switch, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function PlaybackDataScreen() {
  const router = useRouter();

  // semua state
  const [continueMusic, setContinueMusic] = useState(true);
  const [autoplayWifi, setAutoplayWifi] = useState(true);
  const [backgroundListen, setBackgroundListen] = useState(true);
  const [showVideoHistory, setShowVideoHistory] = useState(true);
  const [crossfade, setCrossfade] = useState(true);
  const [downloadWifi, setDownloadWifi] = useState(true);

  // 🔹 tambahan: state untuk teks “enable/disable”
  const [lyricsEnabled, setLyricsEnabled] = useState(false);
  const [lockscreenEnabled, setLockscreenEnabled] = useState(true);

  return (
    <MainContainer>
      <HeaderContainer>
        <BackButton onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </BackButton>
        <HeaderTitle>Playback & Data</HeaderTitle>
        <GearButton>
          <Ionicons
            name="settings-outline"
            size={22}
            color="#000"
            onPress={() => router.push("screen/settings")}
          />
        </GearButton>
      </HeaderContainer>

      <ContentArea>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Section>
            <SectionTitle>Turn Music</SectionTitle>

            <SettingItem>
              <SettingText>Continue Music Playback</SettingText>
              <StyledSwitch
                value={continueMusic}
                onValueChange={setContinueMusic}
              />
            </SettingItem>

            <SettingItem>
              <SettingText>Autoplay Music with WiFi</SettingText>
              <StyledSwitch
                value={autoplayWifi}
                onValueChange={setAutoplayWifi}
              />
            </SettingItem>

            <SettingItem>
              <SettingTextGroup>
                <SettingText>Background Listen Activation</SettingText>
                <SubText>
                  When Listen is enable, background playback will be enabled
                  automatically.
                </SubText>
              </SettingTextGroup>
              <StyledSwitch
                value={backgroundListen}
                onValueChange={setBackgroundListen}
              />
            </SettingItem>

            <SettingItem>
              <SettingText>Show Video Playback History</SettingText>
              <StyledSwitch
                value={showVideoHistory}
                onValueChange={setShowVideoHistory}
              />
            </SettingItem>

            <Divider />

            <SectionTitle>Music</SectionTitle>
            <SettingItem>
              <SettingTextGroup>
                <SettingText>Crossfade</SettingText>
                <SubText>
                  Create Smooth transitions between songs{"\n"}Time : 500ms
                </SubText>
              </SettingTextGroup>
              <StyledSwitch value={crossfade} onValueChange={setCrossfade} />
            </SettingItem>

            {/* 🔹 Toggle enable/disable lyrics */}
            <TouchableOpacity onPress={() => setLyricsEnabled(!lyricsEnabled)}>
              <ListItem>
                <LeftText>Auto Match Lyrics online</LeftText>
                <RightText>
                  {lyricsEnabled ? "enable ›" : "disable ›"}
                </RightText>
              </ListItem>
            </TouchableOpacity>

            {/* 🔹 Toggle enable/disable lockscreen music */}
            <TouchableOpacity
              onPress={() => setLockscreenEnabled(!lockscreenEnabled)}
            >
              <ListItem>
                <LeftText>Music on Lock Screen</LeftText>
                <RightText>
                  {lockscreenEnabled ? "enable ›" : "disable ›"}
                </RightText>
              </ListItem>
            </TouchableOpacity>

            <Divider />

            <SectionTitle>Download</SectionTitle>
            <SettingItem>
              <SettingText>Download with Celluler data</SettingText>
              <StyledSwitch
                value={downloadWifi}
                onValueChange={setDownloadWifi}
              />
            </SettingItem>

            <ListItem>
              <LeftText>Simultaneous download</LeftText>
              <RightText>3 file ›</RightText>
            </ListItem>

            <BottomSpace />
          </Section>
        </ScrollView>
      </ContentArea>
    </MainContainer>
  );
}

/* --- Styled Components --- */
const MainContainer = styled.View`
  flex: 1;
  background-color: #fff;
`;

const HeaderContainer = styled.View`
  background-color: #fff;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-top: 55px;
  padding-bottom: 15px;
  padding-horizontal: 20px;
  border-bottom-width: 0.5px;
  border-bottom-color: #eaeaea;
`;

const BackButton = styled.TouchableOpacity``;
const GearButton = styled.TouchableOpacity``;

const HeaderTitle = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: #000;
  text-align: center;
`;

const ContentArea = styled.View`
  flex: 1;
  background-color: #f7f8f8;
`;

const Section = styled.View`
  padding-horizontal: 20px;
  padding-top: 20px;
`;

const SectionTitle = styled.Text`
  font-size: 15px;
  font-weight: 700;
  color: #000;
  margin-bottom: 10px;
`;

const SettingItem = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-vertical: 12px;
  border-bottom-width: 0.5px;
  border-color: #e0e0e0;
`;

const SettingTextGroup = styled.View`
  flex: 1;
  padding-right: 10px;
`;

const SettingText = styled.Text`
  font-size: 15px;
  color: #000;
  font-weight: 500;
`;

const SubText = styled.Text`
  font-size: 12px;
  color: #6b6b6b;
  margin-top: 2px;
  line-height: 16px;
`;

const StyledSwitch = styled(Switch).attrs({
  trackColor: { false: "#ccc", true: "#B6E0D1" },
  thumbColor: "#346D5D",
})``;

const Divider = styled.View`
  height: 1px;
  background-color: #e6e6e6;
  margin-vertical: 20px;
`;

const ListItem = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-vertical: 14px;
  border-bottom-width: 0.5px;
  border-color: #e0e0e0;
`;

const LeftText = styled.Text`
  font-size: 15px;
  color: #000;
`;

const RightText = styled.Text`
  font-size: 14px;
  color: #6b6b6b;
`;

const BottomSpace = styled.View`
  height: 70px;
`;