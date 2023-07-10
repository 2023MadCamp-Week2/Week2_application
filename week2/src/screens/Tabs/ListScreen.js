import React, { useState, useEffect } from "react";
import { FlatList, Text, View, StyleSheet, Image } from "react-native";

const IPv4 = "143.248.195.207";

function ListScreen() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`http://${IPv4}:3000/api/user`);
      const users = await response.json();

      const promises = users.map(async (user) => {
        const expenseResponse = await fetch(
          `http://${IPv4}:3000/api/get_expense?id=${user.id}`
        );
        const expenseData = await expenseResponse.json();

        const totalExpense = expenseData.totalExpense || 0;

        return {
          ...user,
          expense: totalExpense,
        };
      });

      let usersWithExpense = await Promise.all(promises);

      usersWithExpense = usersWithExpense.sort((a, b) => b.expense - a.expense);

      setUsers(usersWithExpense);
    } catch (error) {
      console.error("Error:", error);
    }
  };

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
              <Text style={styles.text}>Nickname: {item.nickname}</Text>
              <Text style={styles.text}>Expense: {item.expense}</Text>
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
    height: 1,
    width: "100%",
    color: "#000",
  },
  viewstyle: {
    flexDirection: "row",
    margin: 10,
    alignItems: "center",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 10,
  },
  left: {
    marginLeft: 40,
  },
});

export default ListScreen;
