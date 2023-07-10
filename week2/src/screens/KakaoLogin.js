import React from "react";
import { View, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";

const REST_API_KEY = "a925e5151b3222a586b7773df9205d84";
const REDIRECT_URI = "http://localhost:19006";
const IPv4 = "143.248.195.207";

const KaKaoLogin = () => {
  const navigation = useNavigation();
  const KakaoLoginWebView = (data) => {
    const exp = "code=";
    var condition = data.indexOf(exp);
    if (condition != -1) {
      var authorize_code = data.substring(condition + exp.length);
      requestToken(authorize_code);
      console.log(authorize_code);
      console.log("Authorize_code 완료");
    }
  };

  const getUserNicknameFromDB = async (id) => {
    try {
      const response = await axios({
        method: "post",
        url: `http://${IPv4}:3000/api/get-nickname`,
        data: {
          id: id,
        },
      });

      return response.data.nickname;
    } catch (error) {
      console.log("error", error);
    }
  };

  const checkIfUserExistsInDB = async (id) => {
    try {
      const response = await axios({
        method: "post",
        url: `http://${IPv4}:3000/api/check-user`,
        data: {
          id: id,
        },
      });

      if (response.data.exists) {
        console.log("exist");
        return true;
      } else {
        console.log("not exist");
        return false;
      }
    } catch (error) {
      console.log("error", error);
      return false;
    }
  };

  const requestToken = async (authorize_code) => {
    try {
      const response = await axios({
        method: "post",
        url: "https://kauth.kakao.com/oauth/token",
        params: {
          grant_type: "authorization_code",
          client_id: REST_API_KEY,
          redirect_uri: REDIRECT_URI,
          code: authorize_code,
        },
      });

      const AccessToken = response.data.access_token;
      console.log(AccessToken);
      console.log("토큰 발급 완료");

      const userInfo = await getUserInfo(AccessToken);

      // 토큰이 정상적으로 발급되었으며, 사용자 정보도 정상적으로 불러왔다면 다음 화면으로 이동합니다.
      if (userInfo) {
        const userExists = await checkIfUserExistsInDB(userInfo.id);
        if (userExists) {
          // 유저가 이미 존재
          console.log("이미 등록된 유저입니다.");
          const nickname = await getUserNicknameFromDB(userInfo.id);
          Toast.show({
            type: "success",
            text1: "입장",
            text2: `${nickname}님, 안녕하세요!`,
          });
          navigation.reset({
            index: 0,
            routes: [{ name: "TabScreen", params: { userInfo: userInfo } }],
          });
        } else {
          // 유저 존재 X
          console.log("등록되지 않은 유저입니다.");
          navigation.navigate("Signup", { userInfo: userInfo });
        }
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const getUserInfo = async (access_token) => {
    try {
      const response = await axios({
        method: "get",
        url: "https://kapi.kakao.com/v2/user/me",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <View style={Styles.container}>
      <WebView
        style={{ flex: 1 }}
        originWhitelist={["*"]}
        scalesPageToFit={false}
        source={{
          uri: `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}`,
        }}
        onShouldStartLoadWithRequest={(event) => {
          if (event.url.startsWith(REDIRECT_URI)) {
            KakaoLoginWebView(event.url);
            return false; // prevent WebView continue loading
          }
          return true;
        }}
        javaScriptEnabled
      />
    </View>
  );
};

export default KaKaoLogin;

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 24,
    backgroundColor: "#fff",
  },
});
