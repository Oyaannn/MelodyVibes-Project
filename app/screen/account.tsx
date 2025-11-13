import React from "react";
import { ScrollView, Image } from "react-native";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function AccountScreen() {
  const router = useRouter();

  return (
    <MainContainer>
      <Header>
        <HeaderLeft>
          <BackButton onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="#000" />
          </BackButton>
        </HeaderLeft>
        <HeaderTitle>Account</HeaderTitle>
        <HeaderRight>
          <Ionicons name="settings-outline" size={24} color="#000" onPress={() => router.push("screen/settings")} />
        </HeaderRight>
      </Header>

      <Content>
        <ScrollView showsVerticalScrollIndicator={false}>
          <SectionTitle>Detail Account</SectionTitle>

          <FieldGroup>
            <Label>Nickname</Label>
            <Field editable={false} value="@oyaannn_" placeholderTextColor="#999" />
          </FieldGroup>

          <FieldGroup>
            <Label>Username</Label>
            <Field editable={false} value="Irpan Arroyan" placeholderTextColor="#999" />
          </FieldGroup>

          <FieldGroup>
            <Label>Email</Label>
            <Field editable={false} value="nusaputra@nusaputra.ac.id" placeholderTextColor="#999" />
          </FieldGroup>

          <Divider />

          <PremiumRow>
            <Logo
              source={require("../../assets/images/logo.png")}
              resizeMode="contain"
            />
            <PremiumInfo>
              <PremiumText>Premium Account</PremiumText>
              <SeeText>See</SeeText>
            </PremiumInfo>
          </PremiumRow>
        </ScrollView>
      </Content>
    </MainContainer>
  );
}

const MainContainer = styled.View`
  flex: 1;
  background-color: #ffffff;
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 50px 20px 15px 20px;
  background-color: #ffffff;
`;

const HeaderLeft = styled.View``;
const HeaderRight = styled.View``;

const HeaderTitle = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: #000;
`;

const BackButton = styled.TouchableOpacity``;

const Content = styled.View`
  flex: 1;
  background-color: #f7f8f8;
  padding: 20px;
`;

const SectionTitle = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: #000;
  margin-bottom: 20px;
`;

const FieldGroup = styled.View`
  margin-bottom: 18px;
`;

const Label = styled.Text`
  font-size: 14px;
  color: #444;
  margin-bottom: 6px;
`;

const Field = styled.TextInput`
  background-color: #ededed;
  border-radius: 8px;
  padding: 12px 15px;
  font-size: 15px;
  color: #000;
`;

const Divider = styled.View`
  height: 1px;
  background-color: #ddd;
  margin-vertical: 25px;
`;

const PremiumRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

const Logo = styled.Image`
  width: 42px;
  height: 42px;
  border-radius: 21px;
  background-color: #ffffff;
  margin-right: 10px;
`;

const PremiumInfo = styled.View`
  flex-direction: column;
  justify-content: center;
`;

const PremiumText = styled.Text`
  font-size: 15px;
  font-weight: 600;
  color: #000;
`;

const SeeText = styled.Text`
  font-size: 13px;
  color: #888;
  margin-top: 2px;
`;