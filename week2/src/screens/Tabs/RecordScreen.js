import React, { useState, useEffect, useCallback } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  Modal,
  SafeAreaView,
  FlatList,
  TextInput,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
} from "react-native";
import Icon3 from "react-native-vector-icons/Entypo";
import Icon6 from "react-native-vector-icons/FontAwesome";
import { StatusBar } from "react-native";
import RecordItem from "../../RecordScreenComponents/RecordItem";
import ModalContent from "../../RecordScreenComponents/ModalContent";
import { createStackNavigator } from "@react-navigation/stack";
import colors from "../../../assets/colors";
import SearchModal from "../../RecordScreenComponents/SearchModal";
import { v4 as uuidv4 } from "uuid";
import Toast from "react-native-toast-message";
import 'react-native-get-random-values';

const IPv4 = "143.248.195.184";
const Stack = createStackNavigator();

function RecordScreen({ route, navigation, userInfo }) {
  React.useEffect(() => {
    console.log("현재 아이디: ", userInfo.id);
  }, []);

  var Myid = userInfo.id;
  const [isModalVisible, setModalVisible] = useState(false);
  const [listItems, setListItems] = useState([]);
  const [textinput, setInputText] = useState("");
  const [isSearchModalVisible, setSearchModalVisible] = useState(false);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState("0");
  const [totalSum, setTotalSum] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // Calculate the total sum of income and expenses
    let incomeSum = 0;
    let expenseSum = 0;
    let totalSum = 0;
    listItems.forEach((item) => {
      const amount = parseFloat(item.amount.replace(/,/g, ""));
      if (item.isPlus) {
        incomeSum += amount;
        totalSum += amount;
      } else {
        expenseSum += amount;
        totalSum -= amount;
      }
    });
    const formattedIncomeSum = incomeSum.toLocaleString();
    const formattedExpenseSum = expenseSum.toLocaleString();
    const formattedTotalSum = totalSum.toLocaleString();

    // Update the state variables
    setTotalIncome(formattedIncomeSum + "원");
    setTotalExpense(formattedExpenseSum + "원");
    setTotalSum(formattedTotalSum + "원");
  }, [listItems]);

  useEffect(() => {
    fetchDataForUser();
  }, [fetchDataForUser]);

  useEffect(() => {
    const limitmoney = userInfo.limits;
    const expense = parseInt(totalExpense.replace(/,/g, "").replace("원", ""));
    console.log(limitmoney);
    console.log(expense);
    if (expense > limitmoney) {
      Toast.show({
        type: "error",
        text1: "경고",
        text2: "지출이 설정한 한도를 초과하였습니다.",
      });
    }
  }, [totalExpense]);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const toggleSearchModal = () => {
    setSearchModalVisible(!isSearchModalVisible);
  };

  const fetchDataForUser = useCallback(async () => {
    setRefreshing(true);
    try {
      const response = await fetch(
        `http://${IPv4}:3000/api/get_money2?id=${Myid}`
      );
      const data2 = await response.json();

      const userResponse = await fetch(
        `http://${IPv4}:3000/api/get_user_info?id=${Myid}`
      );
      const userInfoData = await userResponse.json();
      userInfo.limits = userInfoData.limits; // Updating userInfo.limits

      const formattedData = data2.map((item) => {
        return {
          ...item,
          key: uuidv4(),
          date: new Date(item.date),

          asset: item.asset.toLocaleString(),
          category: item.category.toLocaleString(),
          content: item.description.toLocaleString(),
          amount: item.amount.toLocaleString() + "원",
          isPlus: item.type !== "expense",
          originalItem: item, // 원본 데이터를 보존
        };
      });
      formattedData.sort((a, b) => b.date - a.date);
      setListItems(formattedData);
    } catch (error) {
      console.error("Error:", error);
    }
    setRefreshing(false);
  }, [Myid]);

  const renderItem = ({ item }) => (
    <RecordItem
      date={item.date}
      asset={item.asset}
      category={item.category}
      amount={item.amount}
      content={item.content}
      isPlus={item.isPlus}
      onItemLongPress={() => onLongPressItem(item)}
    />
  );

  const deleteItem = async (item) => {
    try {
      const response = await fetch(
        `http://${IPv4}:3000/api/delete_money?id=${
          item.id
        }&date=${encodeURIComponent(item.date)}&amount=${item.amount}&asset=${
          item.asset
        }&category=${item.category}&description=${item.description}`,
        { method: "DELETE" }
      );

      if (response.ok) {
        Toast.show({
          type: "success",
          text1: "삭제",
          text2: `기록이 삭제되었습니다.`,
        });
        fetchDataForUser();
      } else {
        console.error("Delete failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const onLongPressItem = (item) => {
    Alert.alert("삭제", "이 항목을 삭제하시겠습니까?", [
      {
        text: "취소",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "확인",
        onPress: () => deleteItem(item.originalItem), // 원본 데이터를 사용
      },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.header}>
        <Text style={styles.title}>가계부</Text>
        <TouchableOpacity
          style={styles.headerbutton}
          onPress={toggleSearchModal}
        >
          <Icon6 name="search" size={25} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.headerseparator}></View>
      <View style={styles.container}>
        <FlatList
          ListHeaderComponent={
            <>
              <View style={styles.resultBox}>
                <View style={styles.resultRow}>
                  <View style={styles.resultIndividualBox}>
                    <Text style={styles.resultText}>수입</Text>
                    <Text
                      style={[styles.amountTextGreen, { flexShrink: 1 }]}
                      numberOfLines={1}
                    >
                      {totalIncome}
                    </Text>
                  </View>
                  <View style={styles.verticalLine} />
                  <View style={styles.resultIndividualBox}>
                    <Text style={styles.resultText}>지출</Text>
                    <Text
                      style={[styles.amountTextRed, { flexShrink: 1 }]}
                      numberOfLines={1}
                    >
                      {totalExpense}
                    </Text>
                  </View>
                </View>
                <View style={styles.resultRow}>
                  <View style={styles.resultIndividualBox}>
                    <Text style={styles.resultText}>합산</Text>
                    <Text
                      style={
                        totalSum === "" || totalSum.includes("-")
                          ? styles.amountTextRed
                          : styles.amountTextGreen
                      }
                    >
                      {totalSum}
                    </Text>
                  </View>
                </View>
              </View>
              <Text style={styles.sectionTitle}>내역</Text>
              <View style={styles.separator} />
            </>
          }
          data={listItems}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={fetchDataForUser}
            />
          }
        />

        <TouchableOpacity style={styles.floatingButton} onPress={toggleModal}>
          <Icon3 name="plus" size={25} color="white" />
        </TouchableOpacity>

        <Modal
          visible={isModalVisible}
          animationType="slide"
          onRequestClose={toggleModal}
        >
          <SafeAreaView style={{ flex: 1 }}>
            <ModalContent
              onClose={toggleModal}
              onAddItem={fetchDataForUser}
              userInfo={userInfo}
            />
          </SafeAreaView>
        </Modal>
        <Modal
          visible={isSearchModalVisible}
          animationType="slide"
          onRequestClose={toggleSearchModal}
        >
          <SafeAreaView style={{ flex: 1 }}>
            <SearchModal onClose={toggleSearchModal} listItems={listItems} />
          </SafeAreaView>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  resultBox: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 15,
    marginTop: 10,
    marginBottom: 30,
    marginHorizontal: 10, // Add margin horizontally
    elevation: 3, // for Android
    shadowColor: "black", // for iOS
    shadowOffset: { width: 0, height: 2 }, // for iOS
    shadowOpacity: 0.2, // for iOS
    shadowRadius: 2, // for iOS
  },
  resultIndividualBox: {
    backgroundColor: "white",
    // padding: 10,
    margin: 10,
    alignItems: "center",
    width: "40%",
  },
  resultSumBox: {
    backgroundColor: "white",
    // padding: 10,
    margin: 10,
    alignItems: "center",
    width: "80%",
  },
  resultRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end", // Align vertically to the bottom of the text
    marginBottom: 5,
  },
  verticalLine: {
    height: "100%",
    width: 1,
    backgroundColor: "lightgray",
    marginHorizontal: 10,
  },
  resultText: {
    fontWeight: "bold",
    fontSize: 18,
    color: "gray",
    alignItems: "center", // Align vertically to the bottom of the text
    flex: 1, // Added flex property to allow text to wrap
    marginBottom: 10,
  },
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  headerContainer: {
    backgroundColor: "skyblue",
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
    paddingTop: StatusBar.currentHeight + 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  separator: {
    width: "100%",
    height: 1,
    backgroundColor: "lightgray",
    marginBottom: 10,
  },
  headerseparator:{
    width: "100%",
    height: 1,
    backgroundColor: "lightgray",
  },
  amountText: {
    fontWeight: "bold",
    fontSize: 20,
    color: "gray",
    alignItems: "flex-end", // Align vertically to the bottom of the text
    marginLeft: -100, // Left margin to create space for long content text
  },
  amountTextGreen: {
    fontWeight: "bold",
    fontSize: 20,
    color: "gray",
    alignItems: "flex-end", // Align vertically to the bottom of the text
    color: colors.plusGreen, // Color when isPlus is true
    alignItems: "center", // Add alignItems property for vertical alignment
  },
  amountTextRed: {
    fontWeight: "bold",
    fontSize: 20,
    color: "gray",
    alignItems: "flex-end", // Align vertically to the bottom of the text
    color: "red", // Color when isPlus is false
    alignItems: "center", // Add alignItems property for vertical alignment
  },
  floatingButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "red",
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "red",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerbutton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 20,
  },
  headerbuttontext: {
    color: "black",
    fontWeight: "bold",
    fontSize: 20,
  },
  modalContent: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    paddingLeft: 20,
  },
  textInput: {
    width: "100%",
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: "lightgray",
    fontSize: 16,
  },
});

export default RecordScreen;
