import React, { useState } from "react";
import { useRouter } from "expo-router";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <Container>
      <Title>
        Welcome
      </Title>
      <Title>
         <Highlight>Back</Highlight>
      </Title>

      <Subtitle>
        Log in to play your favorite music on MelodyVibes App
      </Subtitle>

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

      <ForgotPassword onPress={() => {}}>
        Forgot password?
      </ForgotPassword>

      <LoginButton onPress={() => router.replace("/(tabs)")}>
        <LoginText>Login</LoginText>
      </LoginButton>

      <DividerContainer>
        <Divider />
        <OrText>Or</OrText>
        <Divider />
      </DividerContainer>

      <GoogleButton>
        <Ionicons name="logo-google" size={18} color="#000" />
        <GoogleText>Login with google</GoogleText>
      </GoogleButton>

      <BottomText>
        Don’t have an account?{" "}
        <LinkText onPress={() => router.push("/(auth)/register")}>
          Register
        </LinkText>
      </BottomText>
    </Container>
  );
}

const Container = styled.ScrollView`
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

const ForgotPassword = styled.Text`
  color: #1b5e47;
  text-align: right;
  font-size: 13px;
  margin-bottom: 20px;
`;

const LoginButton = styled.TouchableOpacity`
  background-color: #1b5e47;
  padding: 14px;
  border-radius: 8px;
  align-items: center;
`;

const LoginText = styled.Text`
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

const BottomText = styled.Text`
  color: #444;
  text-align: center;
  margin-top: 25px;
`;

const LinkText = styled.Text`
  color: #1b5e47;
  font-weight: 600;
`;