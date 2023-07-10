import React, { useState, useEffect } from "react";
import { FlatList, Text, View, StyleSheet, Image } from "react-native";

const IPv4 = "143.248.195.207";

function ListScreen() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch(`http://${IPv4}:3000/api/user`)
      .then((response) => response.json())
      .then((data) => setUsers(data));
  }, []);

  if (!users.length) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.viewstyle}>
            <Image source={{ uri: item.profileurl }} style={styles.image} />
            <View style={styles.left}>
              <Text style={styles.text}>ID: {item.id}</Text>
              <Text style={styles.text}>Nickname: {item.nickname}</Text>
              <Text style={styles.text}>Email: {item.email}</Text>
            </View>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />} // 구분선 컴포넌트를 정의합니다.
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  text: {
    textAlign: "center",
    marginBottom: 10,
  },
  separator: {
    height: 1, // 구분선의 높이를 정의합니다.
    width: "100%", // 구분선의 너비를 정의합니다.
    color: "#000", // 구분선의 색상을 정의합니다.
  },
  viewstyle: {
    flexDirection: "row", // 수평 방향으로 배치합니다.
    margin: 10,
    alignItems: "center", // 아이템들을 가운데 정렬합니다.
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 10, // 이미지와 텍스트 사이에 간격을 추가합니다.
  },
  left: {
    marginLeft: 40,
  },
});

export default ListScreen;
