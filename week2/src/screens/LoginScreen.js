import React, { useState } from "react";
import { Button, StyleSheet, TextInput, View, Text } from "react-native";
import { Image } from "react-native";

let imagePath = require("../../assets/finance.png");

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    navigation.navigate("Main"); // 로그인 성공 후 메인 화면으로 이동
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image style={styles.image} source={imagePath} />
        <Text style={styles.text}>가계ss부!</Text>
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
        <Button title={"로그인"} onPress={handleLogin} />
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
  },
  text: {
    marginTop: 10,
    fontSize: 20,
  },
});

export default LoginScreen;
