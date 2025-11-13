import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import styled from "styled-components/native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function RegisterScreen() {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          showsVerticalScrollIndicator={false}
        >
          <Container>
            <Title>Hello</Title>
            <Title>
              <Highlight>Welcome</Highlight>
            </Title>

            <Subtitle>
              Create an account to play your favorite music in the MelodyVibes App
            </Subtitle>

            <InputLabel>Nickname:</InputLabel>
            <InputWrapper>
              <Ionicons name="person-outline" size={18} color="#444" />
              <Input
                placeholder="Enter Your Nickname"
                placeholderTextColor="#777"
                value={nickname}
                onChangeText={setNickname}
              />
            </InputWrapper>

            <InputLabel>Email:</InputLabel>
            <InputWrapper>
              <Ionicons name="mail-outline" size={18} color="#444" />
              <Input
                placeholder="Enter Your Email"
                placeholderTextColor="#777"
                value={email}
                onChangeText={setEmail}
              />
            </InputWrapper>

            <InputLabel>Password:</InputLabel>
            <InputWrapper>
              <Ionicons name="lock-closed-outline" size={18} color="#444" />
              <Input
                placeholder="Enter Your Password"
                placeholderTextColor="#777"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </InputWrapper>

            <InputLabel>Confirm Password:</InputLabel>
            <InputWrapper>
              <Ionicons name="lock-closed-outline" size={18} color="#444" />
              <Input
                placeholder="Enter Your Confirmation Password"
                placeholderTextColor="#777"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </InputWrapper>

            <CreateButton onPress={() => router.replace("/(tabs)")}>
              <CreateText>Create Account</CreateText>
            </CreateButton>

            <DividerContainer>
              <Divider />
              <OrText>Or</OrText>
              <Divider />
            </DividerContainer>

            <GoogleButton>
              <Ionicons name="logo-google" size={18} color="#000" />
              <GoogleText>Login with Google</GoogleText>
            </GoogleButton>
          </Container>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

/* 🎨 STYLED COMPONENTS */
const Container = styled.View`
  flex: 1;
  background-color: #fff;
  padding: 60px 25px;
`;

const Title = styled.Text`
  font-size: 32px;
  font-weight: bold;
  color: #000;
`;

const Highlight = styled.Text`
  color: #1b5e47;
`;

const Subtitle = styled.Text`
  color: #444;
  margin-top: 10px;
  margin-bottom: 40px;
  font-size: 15px;
`;

const InputLabel = styled.Text`
  color: #000;
  margin-bottom: 6px;
  font-weight: 500;
`;

const InputWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 10px 12px;
  margin-bottom: 16px;
`;

const Input = styled.TextInput`
  flex: 1;
  font-size: 14px;
  color: #000;
  margin-left: 8px;
`;

const CreateButton = styled.TouchableOpacity`
  background-color: #1b5e47;
  padding: 14px;
  border-radius: 8px;
  align-items: center;
  margin-top: 10px;
`;

const CreateText = styled.Text`
  color: #fff;
  font-weight: bold;
  font-size: 16px;
`;

const DividerContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-vertical: 25px;
`;

const Divider = styled.View`
  flex: 1;
  height: 1px;
  background-color: #ccc;
`;

const OrText = styled.Text`
  margin-horizontal: 10px;
  color: #444;
`;

const GoogleButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 12px;
`;

const GoogleText = styled.Text`
  color: #000;
  margin-left: 10px;
  font-weight: 500;
`;
