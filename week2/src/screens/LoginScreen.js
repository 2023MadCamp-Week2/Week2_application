import React, { useState } from "react";
import axios from "axios";
import {
  Image,
  StyleSheet,
  TextInput,
  View,
  Text,
  TouchableOpacity,
  Button,
} from "react-native";

let imagePath = require("../../assets/finance.png");
let buttonImagePath = require("../../assets/kakao_login.png"); // 로그인 버튼 이미지 경로
const IPv4 = "143.248.195.179";

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin2 = async () => {
    try {
      const response = await axios({
        method: "post",
        url: `http://${IPv4}:3000/api/login`, // 로그인 요청을 보낼 서버의 URL을 넣으세요.
        data: {
          userid: username,
          pw: password,
        },
      });

      const userInfo = response.data; // 서버에서 응답으로 보낸 사용자 정보를 가져옵니다.

      // 로그인이 성공하면 메인 화면으로 이동하고 사용자 정보를 전달합니다.
      navigation.reset({
        index: 0,
        routes: [{ name: "TabScreen", params: { userInfo: userInfo } }],
      });
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleLogin = () => {
    navigation.navigate("KakaoLogin"); // 카카오 로그인 페이지로 이동
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image style={styles.image} source={imagePath} />
        <Text style={styles.text}>가계부!</Text>
      </View>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        placeholder={"아이디"}
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder={"비밀번호"}
        secureTextEntry // 텍스트가 가려짐
      />
      <View style={styles.buttonContainer}>
        <Button title={"로그인"} onPress={handleLogin2} />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleLogin}>
          <Image source={buttonImagePath} style={styles.buttonImage} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  imageContainer: {
    alignItems: "center",
  },
  image: {
    height: 100,
    width: 100,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginTop: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  buttonContainer: {
    marginTop: 30,
    alignItems: "center",
  },
  buttonImage: {
    width: 300, // 버튼 이미지 크기 조절 필요
    height: 45,
  },
  text: {
    marginTop: 10,
    fontSize: 20,
  },
});

export default LoginScreen;
