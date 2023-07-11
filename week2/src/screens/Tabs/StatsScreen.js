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
  Dimensions,
} from "react-native";
import Icon3 from "react-native-vector-icons/Entypo";
import Icon4 from "react-native-vector-icons/AntDesign";
import Icon5 from "react-native-vector-icons/Feather";
import Icon6 from "react-native-vector-icons/FontAwesome";
import Icon7 from "react-native-vector-icons/MaterialCommunityIcons";
import { theme } from "../../theme";
import { StatusBar } from "react-native";
import Input from "../../RecordScreenComponents/input";
import RecordItem from "../../RecordScreenComponents/RecordItem";
import RecordItemList from "../../RecordScreenComponents/RecordItemList";
import ModalContent from "../../RecordScreenComponents/ModalContent";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import colors from "../../../assets/colors";
import SearchModal from "../../RecordScreenComponents/SearchModal";
import { PieChart } from "react-native-chart-kit";
const IPv4 = "143.248.195.179";

// import ExpensePieChart from '../../RecordScreenComponents/ExpensePieChart';

const Stack = createStackNavigator();

function StatsScreen({ userInfo }) {
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
      const amount = item.amount;
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
  }, []);

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
          amount: item.amount,
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

  const colors = ["#2279FF", "#55ABFF", "#77BDFF", "#99DFFF", "white"];

  const calculateExpensePercentage = () => {
    const uniqueCategories = Array.from(
      new Set(listItems.map((item) => item.category))
    );

    // Initialize categories with 0 amount
    const categoryTotals = {};
    uniqueCategories.forEach((category) => {
      categoryTotals[category] = 0;
    });

    // Calculate the total expense for each category
    listItems.forEach((item) => {
      if (!item.isPlus) {
        categoryTotals[item.category] += item.amount;
      }
    });

    console.log("amount values:", categoryTotals);

    const totalExpense = Object.values(categoryTotals).reduce(
      (a, b) => a + b,
      0
    );

    // Calculate the percentage of total expense for each category
    const expensePercentages = Object.entries(categoryTotals).map(
      ([category, amount]) => ({
        name: category,
        amount,
        percentage: parseFloat(((amount / totalExpense) * 100).toFixed(2)),
      })
    );

    const data = Object.entries(categoryTotals).map(
      ([category, amount], index) => {
        let categoryName = category;
        if (category === "school") {
          categoryName = "학업";
        } else if (category === "food") {
          categoryName = "식비";
        } else if (category === "transport") {
          categoryName = "교통";
        } else if (category === "gift") {
          categoryName = "선물";
        }

        return {
          name: categoryName,
          amount,
          color: colors[index % colors.length],
          legendFontColor: "black",
          legendFontSize: 15,
          backgroundColor: "white",
        };
      }
    );

    console.log("categorytotals:", categoryTotals);

    console.log("percentages:", expensePercentages);

    return data;
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleAddItem = (newItem) => {
    setListItems((prevItems) => [newItem, ...prevItems]);
  };

  const toggleSearchModal = () => {
    setSearchModalVisible(!isSearchModalVisible);
  };

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

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.header}>
        <Text style={styles.title}>가계부</Text>
        <TouchableOpacity
          style={styles.headerbutton}
          onPress={toggleSearchModal}
        >
          <Icon7 name="list-status" size={25} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={fetchDataForUser}
            />
          }
        >
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
              <View style={styles.resultSumBox}>
                <Text style={styles.resultText}>합산</Text>
                <Text
                  style={
                    totalSum === "" || totalSum.includes("-")
                      ? styles.amountTextRed
                      : styles.amountTextGreen
                  }
                  numberOfLines={1}
                >
                  {totalSum}
                </Text>
              </View>
            </View>
          </View>
          <Text style={styles.sectionTitle}>통계</Text>
          <View style={styles.separator} />
          <View style={styles.chartcontainer}>
            <Text style={styles.chartTitleText}>{"지출"}</Text>
            <PieChart
              style={styles.piechartlayout}
              data={calculateExpensePercentage()}
              width={Dimensions.get("window").width * 0.9}
              height={Dimensions.get("window").height * 0.25}
              chartConfig={{
                // backgroundColor: '#ffffff',
                // backgroundGradientFrom: "gray",
                // decimalPlaces: 2,
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              }}
              alignItems={"center"}
              justifyContent={"center"}
              backgroundColor={"transparent"}
              accessor="amount"
              paddingLeft="20"
              // style={styles.piechartlayout}
              avoidFalseZero
            />
          </View>
        </ScrollView>
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
  chartTitleText: {
    fontWeight: "bold",
    fontSize: 18,
    color: "gray",
    alignItems: "center", // Align vertically to the bottom of the text
    flex: 1, // Added flex property to allow text to wrap
    marginTop: 10,
  },
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  headerContainer: {
    backgroundColor: "#77BDFF",
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
    backgroundColor: "#77BDFF",
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
  piechartlayout: {
    flex: 1,
    fontSize: 16,
    backgroundColor: "white",
    // padding: 20,
  },
  chartcontainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
});

export default StatsScreen;
