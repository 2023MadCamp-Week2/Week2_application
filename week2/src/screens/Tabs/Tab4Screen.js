import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  Image,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  Button,
  Modal,
  TouchableOpacity,
} from "react-native";
const IPv4 = "143.248.195.184";

function Tab4Screen({ userInfo }) {
  const [nickname, setNickname] = useState("");
  const [newNickname, setNewNickname] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    async function fetchNickname() {
      const response = await fetch(
        `http://${IPv4}:3000/api/get_user?id=${userInfo.id}`
      );
      const userData = await response.json();
      setNickname(userData.nickname);
    }

    fetchNickname();
  }, []);

  async function updateNickname() {
    const response = await fetch(`http://${IPv4}:3000/api/update_nickname`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: userInfo.id,
        nickname: newNickname,
      }),
    });

    const data = await response.json();
    if (data.success) {
      setNickname(newNickname);
      setModalVisible(false);
    } else {
      alert("Failed to update nickname");
    }
  }

  let gender = userInfo.kakao_account.gender === "male" ? "남자" : "여자";

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollcontainer}>
        <Text style={styles.profile_title}>내 프로필</Text>
        <View style={styles.separator} />
        <View style={styles.container}>
          <View style={styles.centercontainer}>
            <Image
              source={{ uri: userInfo.properties.profile_image }}
              style={styles.image}
            />
          </View>
          <View style={styles.information_row}>
            <Text style={styles.text2}>{"닉네임"}</Text>
            <Text style={styles.text3}>{nickname}</Text>
          </View>
          <View style={styles.information_row}>
            <Text style={styles.text2}>{"이메일"}</Text>
            <Text style={styles.text3}>{userInfo.kakao_account.email}</Text>
          </View>

          <Button title="닉네임 변경" onPress={() => setModalVisible(true)} />
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <TextInput
                  style={styles.textinputView}
                  value={newNickname}
                  placeholder="새 닉네임 입력"
                  onChangeText={(text) => setNewNickname(text)}
                />
                <View
                  style={[styles.buttonContainer, { flexDirection: "row" }]}
                >
                  <TouchableOpacity
                    style={styles.button}
                    onPress={updateNickname}
                  >
                    <Text style={styles.buttonText}>확인</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.buttonText}>취소</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
  },
  centercontainer: {
    backgroundColor: "white",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: "7%",
  },
  scrollcontainer: {
    backgroundColor: "white",
    flex: 1,
  },
  profile_title: {
    padding: 20,
    alignItems: "flex-start",
    fontSize: 25,
    fontWeight: "bold",
  },
  information_row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 20,
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
  text2: {
    textAlign: "center",
    marginBottom: 20,
    fontSize: 20,
    color: "gray",
  },
  text3: {
    textAlign: "center",
    marginBottom: 20,
    fontSize: 20,
    color: "black",
  },
  separator: {
    width: "100%",
    height: 1,
    backgroundColor: "lightgray",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    // padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 10,
    borderRadius: 10,
    backgroundColor: "#2196F3",
    paddingVertical: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
  textinputView: {
    fontSize: 20,
  },
});

export default Tab4Screen;
