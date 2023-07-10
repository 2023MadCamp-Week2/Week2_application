import React from "react";
import { Text, View, Image, StyleSheet } from "react-native";

function Tab4Screen({ userInfo }) {
  console.log(userInfo);
  return (
    <View style={styles.container}>
      <Image source={{ uri: userInfo.profileurl }} style={styles.image} />
      <Text style={styles.text}>ID: {userInfo.id}</Text>
      <Text style={styles.text}>닉네임: {userInfo.nickname}</Text>
      <Text style={styles.text}>이메일: {userInfo.email}</Text>
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
