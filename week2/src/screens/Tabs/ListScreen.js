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

function ListScreen({ userInfo }) {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUserDetails, setSelectedUserDetails] = useState(null);
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [closingUserModal, setClosingUserModal] = useState(false);
  const [openingCommentModal, setOpeningCommentModal] = useState(false);

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
    console.log("opening comment modal with expense", expense);
    setSelectedExpense(expense);
    setModalVisible(false); // 사용자 정보 모달을 닫습니다.
  };

  useEffect(() => {
    console.log(
      "closingUserModal or selectedExpense changed:",
      closingUserModal
    );
    if (closingUserModal && selectedExpense) {
      setClosingUserModal(false);
    }
    if (!closingUserModal && selectedExpense) {
      console.log("calling fetchComments");
      fetchComments(selectedExpense);
    }
  }, [closingUserModal, selectedExpense]);

  const fetchComments = async (expense) => {
    try {
      const response = await fetch(
        `http://${IPv4}:3000/api/get_comments?expense_id=${expense.expense_id}`
      );
      const expenseComments = await response.json();

      // 사용자 정보를 가져오기 위해 API 호출
      const userPromises = expenseComments.map(async (comment) => {
        const userResponse = await fetch(
          `http://${IPv4}:3000/api/user?id=${comment.comment_user_id}`
        );
        const userData = await userResponse.json();

        // comment_user_id와 일치하는 사용자 정보를 찾기
        const user = userData.find(
          (user) => user.id === comment.comment_user_id
        );

        if (user) {
          let timeString = new Date(comment.writetime).toLocaleString("ko-KR", {
            timeZone: "Asia/Seoul",
            hour12: false,
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          });
          return {
            ...comment,
            nickname: user.nickname,
            writetime: timeString,
          }; // 닉네임과 작성 시간 추가
        } else {
          // 사용자 정보를 찾을 수 없는 경우 처리
          console.warn(
            `User not found for comment_user_id: ${comment.comment_user_id}`
          );
          return comment;
        }
      });

      const commentsWithUserInfo = await Promise.all(userPromises);
      setComments(commentsWithUserInfo);
      setCommentModalVisible(true);
    } catch (error) {
      console.error("Error in fetchComments:", error);
    }
  };

  const closeCommentModal = () => {
    setSelectedExpense(null);
    setComments([]);
    setNewComment("");
    setCommentModalVisible(false);
    setModalVisible(true); // 사용자 정보 모달을 다시 엽니다.
  };

  const addComment = async () => {
    if (selectedExpense) {
      try {
        const response = await fetch(`http://${IPv4}:3000/api/add_comment`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: newComment,
            post_user_id: selectedExpense.id,
            comment_user_id: userInfo.id,
            expense_id: selectedExpense.expense_id,
          }),
        });
        const newCommentResponse = await response.json();

        // 사용자의 닉네임 가져오기
        const commentUserResponse = await fetch(
          `http://${IPv4}:3000/api/user?id=${userInfo.id}`
        );
        const commentUserData = await commentUserResponse.json();

        // 댓글 객체에 닉네임 추가
        const commentWithUserInfo = {
          ...newCommentResponse,
          nickname: commentUserData.nickname,
        };

        setComments([...comments, commentWithUserInfo]);
        setNewComment("");
        fetchComments(selectedExpense);
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      console.error("Cannot add a comment: No expense selected");
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
                    onPress={() => openCommentModal(detail)}
                    key={detail.expense_id}
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
          <Text style={styles.modalTitle}>한줄 코멘트</Text>
          {comments.map((comment, index) => (
            <View key={index} style={styles.commentContainer}>
              <Text style={styles.commentDate}>{comment.writetime}</Text>
              <Text style={styles.commentText}>
                {comment.nickname} : {comment.content}
              </Text>
              <View style={styles.commentSeparator} />
            </View>
          ))}

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="여기에 댓글을 입력하세요!"
              value={newComment}
              onChangeText={setNewComment}
            />
          </View>
          <TouchableOpacity
            style={{
              backgroundColor: "#007BFF",
              padding: 10,
              borderRadius: 5,
              marginTop: 20,
            }}
            onPress={addComment}
          >
            <Text style={{ color: "white", textAlign: "center" }}>
              댓글 추가
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: "#6c757d",
              padding: 10,
              borderRadius: 5,
              marginTop: 20,
            }}
            onPress={closeCommentModal}
          >
            <Text style={{ color: "white", textAlign: "center" }}>닫기</Text>
          </TouchableOpacity>
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
    padding: 20,
    marginTop: 50,
    backgroundColor: "#f8f9fa",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
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
  commentContainer: {
    backgroundColor: "#f8f8f8",
    borderRadius: 5,
    padding: 10,
    margin: 10,
    flexDirection: "row",
    justifyContent: "space-between", // 이 속성을 추가해서 시간과 댓글 텍스트 사이의 간격을 늘릴 수 있습니다.
    alignItems: "center",
  },
  commentText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
  },
  commentDate: {
    fontSize: 12,
    color: "#888",
  },
  commentSeparator: {
    height: 1,
    backgroundColor: "#eee",
    marginTop: 10,
    marginBottom: 10,
  },
  input: {
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 5,
    fontSize: 18,
  },
  inputContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
});

export default ListScreen;