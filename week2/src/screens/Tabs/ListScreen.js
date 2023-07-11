import React, { useState, useEffect } from "react";
import {
  FlatList,
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  Button,
  TextInput,
} from "react-native";

const IPv4 = "143.248.195.179";

function ListScreen() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUserDetails, setSelectedUserDetails] = useState(null);
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const openModal = async (user) => {
    setSelectedUser(user);
    try {
      const response = await fetch(
        `http://${IPv4}:3000/api/get_money?id=${user.id}`
      );
      const userDetails = await response.json();
      setSelectedUserDetails(userDetails);
    } catch (error) {
      console.error("Error:", error);
    }
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setSelectedUserDetails(null);
    setModalVisible(false);
  };

  const openCommentModal = async (expense) => {
    setSelectedExpense(expense);
    try {
      const response = await fetch(
        `http://${IPv4}:3000/api/get_comments?expense_id=${expense.expense_id}`
      );
      const expenseComments = await response.json();
      setComments(expenseComments);
    } catch (error) {
      console.error("Error:", error);
    }
    setCommentModalVisible(true);
  };

  const closeCommentModal = () => {
    setSelectedExpense(null);
    setComments([]);
    setNewComment("");
    setCommentModalVisible(false);
  };

  const addComment = async () => {
    try {
      const response = await fetch(`http://${IPv4}:3000/api/add_comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: newComment,
          post_user_id: selectedExpense.user_id,
          comment_user_id: userInfo.id, // 앱에서 현재 사용자 정보를 가져와야 합니다.
          expense_id: selectedExpense.expense_id,
        }),
      });
      const newComment = await response.json();
      setComments([...comments, newComment]);
      setNewComment("");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);
  useEffect(() => {
    console.log(commentModalVisible);
  }, [commentModalVisible]);

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

        const incomeResponse = await fetch(
          `http://${IPv4}:3000/api/get_income?id=${user.id}`
        );
        const incomeData = await incomeResponse.json();
        const totalIncome = incomeData.totalIncome || 0;

        const total = totalIncome - totalExpense;

        return {
          ...user,
          expense: totalExpense,
          income: totalIncome,
          total,
        };
      });

      let usersWithExpenseIncomeTotal = await Promise.all(promises);

      usersWithExpenseIncomeTotal = usersWithExpenseIncomeTotal.sort(
        (a, b) => b.expense - a.expense
      );

      setUsers(usersWithExpenseIncomeTotal);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (!users.length) {
    return <Text>Loading...</Text>;
  }

  const currencyFormat = (num) => {
    return {
      amount: num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"),
      currency: "원",
    };
  };

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>사용자 정보</Text>
          {selectedUser && (
            <View style={styles.userDetail}>
              <Image
                source={{ uri: selectedUser.profileurl }}
                style={styles.userImage}
              />
              <Text style={styles.userText}>{selectedUser.nickname}</Text>
            </View>
          )}
          {selectedUserDetails && selectedUserDetails.length > 0 && (
            <View>
              <Text style={styles.modalSubTitle}>이 달의 지출</Text>
              {selectedUserDetails
                .filter((detail) => detail.type === "expense") // 지출만 필터링
                .map((detail, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => openCommentModal(detail)}
                  >
                    <View style={styles.detailContainer}>
                      <Text style={styles.detailText}>
                        항목: {detail.description}
                      </Text>
                      <Text style={styles.detailText}>
                        금액: {detail.amount}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
            </View>
          )}
          <Button title="닫기" onPress={closeModal} />
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={false}
        visible={commentModalVisible}
        onRequestClose={closeCommentModal}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>댓글</Text>
          {comments.map((comment, index) => (
            <View key={index} style={styles.commentContainer}>
              <Text style={styles.commentText}>{comment.content}</Text>
              {/* Add more details as needed */}
            </View>
          ))}
          <TextInput
            style={styles.input}
            placeholder="Add a comment..."
            value={newComment}
            onChangeText={setNewComment}
          />
          <Button title="댓글 추가" onPress={addComment} />
          <Button title="닫기" onPress={closeCommentModal} />
        </View>
      </Modal>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => openModal(item)}>
            <View style={styles.viewstyle}>
              <View style={styles.imageContainer}>
                <Image source={{ uri: item.profileurl }} style={styles.image} />
                <Text style={styles.nickname}>{item.nickname}</Text>
              </View>
              <View style={styles.right}>
                <Text style={styles.boldText}>
                  수입:{" "}
                  <Text style={{ color: "green" }}>
                    {currencyFormat(item.income).amount}
                  </Text>
                  <Text style={{ color: "black" }}>
                    {currencyFormat(item.income).currency}
                  </Text>
                </Text>
                <Text style={styles.boldText}>
                  지출:{" "}
                  <Text style={{ color: "red" }}>
                    {currencyFormat(item.expense).amount}
                  </Text>
                  <Text style={{ color: "black" }}>
                    {currencyFormat(item.expense).currency}
                  </Text>
                </Text>
                <Text style={styles.boldText}>
                  합산:{" "}
                  <Text style={{ color: item.total >= 0 ? "green" : "red" }}>
                    {currencyFormat(item.total).amount}
                  </Text>
                  <Text style={{ color: "black" }}>
                    {currencyFormat(item.total).currency}
                  </Text>
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  viewstyle: {
    flexDirection: "row",
    margin: 10,
    alignItems: "center",
  },
  imageContainer: {
    alignItems: "center",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  nickname: {
    fontWeight: "bold",
  },
  right: {
    flex: 1,
    alignItems: "center",
  },
  boldText: {
    fontWeight: "bold",
    marginBottom: 10,
  },
  separator: {
    height: 1,
    width: "100%",
    backgroundColor: "#000",
  },
  modalContent: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  userDetail: {
    alignItems: "center",
    marginBottom: 20,
  },
  userImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  userText: {
    fontSize: 18,
  },
  modalSubTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  detailContainer: {
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  detailText: {
    fontSize: 16,
  },
});

export default ListScreen;
