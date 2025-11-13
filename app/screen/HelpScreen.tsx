import React from "react";
import { ScrollView } from "react-native";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function HelpScreen() {
  const router = useRouter();

  return (
    <Container>
      <Header>
        <BackButton onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={26} color="#000" />
        </BackButton>
        <HeaderTitle>Help Desk</HeaderTitle>
        <GearButton>
          <Ionicons name="settings-outline" size={22} color="#000" onPress={() => router.push("screen/settings")}/>
        </GearButton>
      </Header>

      <Content>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <Title>We’re here to help you with anything</Title>
          <SearchBar>
            <Ionicons name="search-outline" size={18} color="#888" />
            <SearchInput placeholder="Search Help" placeholderTextColor="#999" />
          </SearchBar>

          <FAQTitle>FAQ</FAQTitle>
          {[
            "Audio name display tips?",
            "How to use audio filtering?",
            "How to set son replay?",
            "How to add a timer?",
            "Auto pause audio during music playback?",
            "How to download and use music?",
            "Why can’t I install the music player?",
            "What should I do if I forgot my password?",
          ].map((question, index) => (
            <FAQItem key={index}>
              <FAQText>{question}</FAQText>
              <Ionicons name="add" size={18} color="#000" />
            </FAQItem>
          ))}
        </ScrollView>
      </Content>

      <BottomBox>
        <HelpText>Still stuck? Help us a mail away</HelpText>
        <SendButton>
          <SendButtonText>Send a message</SendButtonText>
        </SendButton>
      </BottomBox>
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  background-color: #fff;
`;

const Header = styled.View`
  background-color: #fff;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  padding-top: 55px;
  border-bottom-width: 0.5px;
  border-bottom-color: #ddd;
`;

const BackButton = styled.TouchableOpacity`
  padding: 5px;
`;

const GearButton = styled.TouchableOpacity`
  padding: 5px;
`;

const HeaderTitle = styled.Text`
  font-size: 17px;
  font-weight: 600;
  color: #000;
`;

const Content = styled.View`
  flex: 1;
  background-color: #f7f8f8;
  padding: 20px;
`;

const Title = styled.Text`
  font-size: 20px;
  font-weight: 700;
  color: #000;
  margin-bottom: 20px;
`;

const SearchBar = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #fff;
  border-radius: 20px;
  padding: 10px 15px;
  margin-bottom: 30px;
  shadow-color: #000;
  shadow-opacity: 0.05;
  shadow-radius: 2px;
  elevation: 1;
`;

const SearchInput = styled.TextInput`
  flex: 1;
  margin-left: 10px;
  color: #000;
`;

const FAQTitle = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: #000;
  margin-bottom: 15px;
`;

const FAQItem = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  padding: 18px 15px;
  border-radius: 10px;
  margin-bottom: 8px;
`;

const FAQText = styled.Text`
  font-size: 14px;
  color: #000;
`;

const BottomBox = styled.View`
  background-color: #fff;
  align-items: center;
  padding: 20px;
  border-top-width: 0.5px;
  border-top-color: #ddd;
`;

const HelpText = styled.Text`
  font-size: 14px;
  color: #000;
  margin-bottom: 10px;
`;

const SendButton = styled.TouchableOpacity`
  background-color: #1b5e47;
  padding-vertical: 14px;
  padding-horizontal: 50px;
  border-radius: 25px;
`;

const SendButtonText = styled.Text`
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  text-align: center;
`;