import React, { useState, useEffect, useCallback } from "react";
import { Text, TouchableOpacity, View, Modal, SafeAreaView, FlatList, TextInput, StyleSheet, ScrollView, RefreshControl } from "react-native";
import Icon3 from "react-native-vector-icons/Entypo";
import Icon4 from "react-native-vector-icons/AntDesign";
import Icon5 from "react-native-vector-icons/Feather";
import Icon6 from "react-native-vector-icons/FontAwesome";
import { theme } from "../../theme";
import { StatusBar } from "react-native";
import Input from "../../RecordScreenComponents/input";
import RecordItem from "../../RecordScreenComponents/RecordItem";
import RecordItemList from "../../RecordScreenComponents/RecordItemList";
import ModalContent from "../../RecordScreenComponents/ModalContent";
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import colors from "../../../assets/colors";
import SearchModal from '../../RecordScreenComponents/SearchModal';
const IPv4 = "143.248.195.207";
const Stack = createStackNavigator();

function RecordScreen({ route, navigation, userInfo }) {
  React.useEffect(() => {
    console.log(userInfo.id);
  }, []);

  var Myid = userInfo.id;
  const [isModalVisible, setModalVisible] = useState(false);
  const [listItems, setListItems] = useState([]);
  const [textinput, setInputText] = useState("");
  const [isSearchModalVisible, setSearchModalVisible] = useState(false);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
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
        `http://${IPv4}:3000/api/get_money?id=${Myid}`
      );
      const data2 = await response.json();

      const formattedData = data2.map((item) => {
        return {
          ...item,
          date: item.date.toLocaleString(),
          asset: item.asset.toLocaleString(),
          category: item.category.toLocaleString(),
          content: item.description.toLocaleString(),
          amount: item.amount.toLocaleString() + "원",
          isPlus: item.type !== "expense",
        };
      });

      setListItems(formattedData);
      console.log("Data fetched and set:", formattedData);
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
    />
  );
  console.log(listItems); 

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
        <View style={styles.container}>
            <FlatList
              ListHeaderComponent={
                <>
                <View style={styles.resultBox}>
                  <View style={styles.resultRow}>
                    <View style={styles.resultIndividualBox}>
                      <Text style={styles.resultText}>수입</Text>
                      <Text style={[styles.amountTextGreen, { flexShrink: 1 }]} numberOfLines={1}>{totalIncome}</Text>
                    </View>
                    <View style={styles.verticalLine} />
                    <View style={styles.resultIndividualBox}>
                      <Text style={styles.resultText}>지출</Text>
                      <Text style={[styles.amountTextRed, { flexShrink: 1 }]} numberOfLines={1}>{totalExpense}</Text>
                    </View>
                  </View>
                  <View style={styles.resultRow}>
                    <View style={styles.resultIndividualBox}>
                      <Text style={styles.resultText}>합산</Text>
                        <Text style={totalSum === "" || totalSum.includes("-") ? styles.amountTextRed : styles.amountTextGreen}>
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
    backgroundColor: 'white',
    // padding: 10,
    margin: 10,
    alignItems: 'center',
    width: "80%"
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
    backgroundColor: "skyblue",
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