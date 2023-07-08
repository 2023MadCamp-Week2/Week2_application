import React from "react";
import { Text, View, Image, StyleSheet } from "react-native";

function Tab4Screen({ userInfo }) {
  let gender = "none";

  if (userInfo.kakao_account.gender == "male") gender = "남자";
  else gender = "여자";

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: userInfo.properties.profile_image }}
        style={styles.image}
      />
      <Text style={styles.text}>ID: {userInfo.id}</Text>
      <Text style={styles.text}>이메일: {userInfo.kakao_account.email}</Text>
      <Text style={styles.text}>성별: {gender}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  text: {
    textAlign: "center",
    marginBottom: 10,
  },
});

export default Tab4Screen;
