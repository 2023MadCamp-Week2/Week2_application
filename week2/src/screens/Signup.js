import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Toast from "react-native-toast-message";

const IPv4 = "143.248.195.207";

const Signup = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const { userInfo } = route.params;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userid, setID] = useState("");

  const handleSignup = () => {
    // 서버에 보낼 사용자 데이터
    const userData = {
      id: userInfo.id,
      nickname: username,
      email: userInfo.kakao_account.email,
      profileurl: userInfo.kakao_account.profile.profile_image_url,
      userid: userid,
      pw: password,
    };
    fetch(`http://${IPv4}:3000/api/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        Toast.show({
          type: "success",
          text1: "회원 가입",
          text2: "회원 가입이 완료되었습니다.",
        });
        navigation.navigate("TabScreen", { userInfo: userInfo });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>회원 가입</Text>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        placeholder={"닉네임"}
      />
      <TextInput
        style={styles.input}
        value={userid}
        onChangeText={setID}
        placeholder={"아이디"}
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder={"비밀번호"}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>가입 완료</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    textAlign: "center",
  },
});

export default Signup;
