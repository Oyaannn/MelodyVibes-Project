import React from "react";
import { ScrollView } from "react-native";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function SettingsScreen() {
  const router = useRouter();

  return (
    <Container>
      <Header>
        <BackButton onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={26} color="#000" />
        </BackButton>
        <HeaderTitle>Setting</HeaderTitle>
        <Spacer />
      </Header>

      <ScrollView showsVerticalScrollIndicator={false}>
        <ProfileSection>
          <ProfileRow>
            <ProfileImage source={require("../../assets/images/foto.png")} />
            <ProfileInfo>
              <ProfileName>Irpan Arroyan</ProfileName>
              <ProfileDesc>Don’t panik don’t hariwang, because Allah always nangtayungan.</ProfileDesc>
            </ProfileInfo>
            <EditIcon>
              <Ionicons name="create-outline" size={22} color="#000" />
            </EditIcon>
          </ProfileRow>
        </ProfileSection>

        <MenuItem onPress={() => router.push("/screen/account")}>
          <IconBox>
            <Ionicons name="person-outline" size={26} color="#000" />
          </IconBox>
          <MenuInfo>
            <MenuTitle>Account</MenuTitle>
            <MenuDesc>Privacy, security, change email or number</MenuDesc>
          </MenuInfo>
        </MenuItem>

        <MenuItem onPress={() => router.push("/screen/PlaybackData")}>
          <IconBox>
            <Ionicons name="musical-notes-outline" size={26} color="#000" />
          </IconBox>
          <MenuInfo>
            <MenuTitle>Playback & Data</MenuTitle>
            <MenuDesc>Information, setting app</MenuDesc>
          </MenuInfo>
        </MenuItem>

        <MenuItem onPress={() => router.push("/screen/HelpScreen")}>
          <IconBox>
            <Ionicons name="help-circle-outline" size={26} color="#000" />
          </IconBox>
          <MenuInfo>
            <MenuTitle>Help</MenuTitle>
            <MenuDesc>Help centre, contact us, privacy policy</MenuDesc>
          </MenuInfo>
        </MenuItem>

        <LogoutButton onPress={() => router.push("/(auth)/login")}>
          <LogoutText>Logout</LogoutText>
        </LogoutButton>
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
  margin-top: 15px;
  margin-bottom: 30px;
`;

const BackButton = styled.TouchableOpacity`
  padding: 5px;
`;

const HeaderTitle = styled.Text`
  font-size: 20px;
  font-weight: 700;
  color: #000;
`;

const Spacer = styled.View`
  width: 26px;
`;

const ProfileSection = styled.View`
  margin-top: 20px;
  margin-bottom: 40px;
`;

const ProfileRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

const ProfileImage = styled.Image`
  width: 65px;
  height: 65px;
  border-radius: 35px;
  margin-right: 12px;
`;

const ProfileInfo = styled.View`
  flex: 1;
`;

const ProfileName = styled.Text`
  font-size: 17px;
  font-weight: 700;
  color: #000;
`;

const ProfileDesc = styled.Text`
  font-size: 13px;
  color: #666;
`;

const EditIcon = styled.TouchableOpacity`
  padding: 4px;
`;

const MenuItem = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  margin-bottom: 30px;
`;

const IconBox = styled.View`
  width: 55px;
  align-items: center;
`;

const MenuInfo = styled.View`
  flex: 1;
`;

const MenuTitle = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #000;
`;

const MenuDesc = styled.Text`
  font-size: 13px;
  color: #777;
`;

const LogoutButton = styled.TouchableOpacity`
  margin-top: 20px;
`;

const LogoutText = styled.Text`
  color: red;
  font-size: 16px;
  font-weight: 600;
`;