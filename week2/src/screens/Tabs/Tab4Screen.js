import React from "react";
import { Text, View, Image, StyleSheet, SafeAreaView, ScrollView } from "react-native";

function Tab4Screen({ userInfo }) {
  let gender = "none";

  if (userInfo.kakao_account.gender == "male") gender = "남자";
  else gender = "여자";

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollcontainer}>
      <View style={styles.container}>
      <Image
        source={{ uri: userInfo.properties.profile_image }}
        style={styles.image}
      />
      <Text style={styles.text}>ID: {userInfo.id}</Text>
      <Text style={styles.text}>이메일: {userInfo.kakao_account.email}</Text>
      <Text style={styles.text}>성별: {gender}</Text>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: "30%",
  },
  scrollcontainer: {
    backgroundColor: 'white',
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 100,
    marginBottom: 20,
  },
  text: {
    textAlign: "center",
    marginBottom: 20,
    fontSize: 20,
    color: "gray",
  },
});

export default Tab4Screen;