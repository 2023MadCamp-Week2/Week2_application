import React, { useState, useEffect, useCallback } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Modal,
  Dimensions,
  Button,
} from "react-native";
import Icon7 from "react-native-vector-icons/MaterialCommunityIcons";
import { StatusBar } from "react-native";
import RecordItem from "../../RecordScreenComponents/RecordItem";
import { createStackNavigator } from "@react-navigation/stack";
import colors from "../../../assets/colors";
import { PieChart, BarChart } from "react-native-chart-kit";
import { v4 as uuidv4 } from "uuid";
import { Picker } from "@react-native-picker/picker";

const IPv4 = "143.248.195.184";

const Stack = createStackNavigator();

function StatsScreen({ userInfo }) {
  var Myid = userInfo.id;

  const [isModalVisible, setModalVisible] = useState(false);
  const [listItems, setListItems] = useState([]);
  const [isSearchModalVisible, setSearchModalVisible] = useState(false);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalSum, setTotalSum] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const datenow = new Date();
  const currentMonth = datenow.getMonth() + 1;
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  useEffect(() => {
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

    setTotalIncome(formattedIncomeSum + "원");
    setTotalExpense(formattedExpenseSum + "원");
    setTotalSum(formattedTotalSum + "원");
  }, [listItems]);

  useEffect(() => {
    fetchDataForUser();
  }, [selectedMonth]);

  const fetchDataForUser = useCallback(async () => {
    setRefreshing(true);
    try {
      const response = await fetch(
        `http://${IPv4}:3000/api/get_money?id=${Myid}&month=${selectedMonth}`
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
    } catch (error) {
      console.error("Error:", error);
    }
    setRefreshing(false);
  }, [Myid, selectedMonth]);

  const colors = ["#FF7922", "#FFAB55", "#FFBD77", "#FFDF99", "white"];
  const colors2 = ["#2279FF", "#55ABFF", "#77BDFF", "#99DFFF", "white"];

  const handleMonthSelect = (month) => {
    setSelectedMonth(month);
  };

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

    // Sort the categories by expense amount in descending order
    const sortedCategories = Object.entries(categoryTotals).sort(
      (a, b) => b[1] - a[1]
    );

    const totalExpense = sortedCategories.reduce(
      (total, [, amount]) => total + amount,
      0
    );

    // Calculate the percentage of total expense for each category
    const expensePercentages = sortedCategories.map(([category, amount]) => ({
      name: category,
      amount,
      percentage: parseFloat(((amount / totalExpense) * 100).toFixed(2)),
    }));

    const data_expense = sortedCategories.map(([category, amount], index) => {
      let categoryName = category;
      if (category === "school") {
        categoryName = "학업";
      } else if (category === "food") {
        categoryName = "식비";
      } else if (category === "transport") {
        categoryName = "교통";
      } else if (category === "daily") {
        categoryName = "생활용품";
      } else if (category === "culture") {
        categoryName = "문화생활";
      } else if (category === "etc") {
        categoryName = "기타";
      }

      return {
        name: categoryName,
        amount,
        color: colors[index % colors.length],
        legendFontColor: "gray",
        legendFontSize: 15,
        backgroundColor: "white",
      };
    });

    return data_expense;
  };

  const calculateIncomePercentage = () => {
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
      if (item.isPlus) {
        categoryTotals[item.category] += item.amount;
      }
    });

    // Sort the categories by expense amount in descending order
    const sortedCategories = Object.entries(categoryTotals).sort(
      (a, b) => b[1] - a[1]
    );

    const totalExpense = sortedCategories.reduce(
      (total, [, amount]) => total + amount,
      0
    );

    // Calculate the percentage of total expense for each category
    const incomePercentages = sortedCategories.map(([category, amount]) => ({
      name: category,
      amount,
      percentage: parseFloat(((amount / totalIncome) * 100).toFixed(2)),
    }));

    const data_income = sortedCategories.map(([category, amount], index) => {
      let categoryName = category;
      if (category === "salary") {
        categoryName = "월급";
      } else if (category === "pocket") {
        categoryName = "용돈";
      } else if (category === "scholar") {
        categoryName = "장학금";
      } else if (category === "refund") {
        categoryName = "환불";
      } else if (category === "financial") {
        categoryName = "금융소득";
      } else if (category === "gift") {
        categoryName = "선물";
      }
      return {
        name: categoryName,
        amount,
        color: colors2[index % colors.length],
        legendFontColor: "gray",
        legendFontSize: 15,
        backgroundColor: "white",
      };
    });

    return data_income;
  };

  const barExpensePercentage = () => {
    const monthTotals = {};

    // Initialize all months with 0
    for (let month = 1; month <= 12; month++) {
      // const monthKey = month < 10 ? `0${month}` : `${month}`;
      const monthName = getMonthName(month);
      monthTotals[monthName] = 0;
      // monthTotals[monthKey + "_label"] = monthName;
    }

    // Calculate the total expense for each month
    listItems.forEach((item) => {
      if (!item.isPlus) {
        const date = new Date(item.date);
        const month = date.getMonth() + 1; // Months are zero-indexed, so add 1
        const monthKey = month < 10 ? `0${month}` : `${month}`; // Format month as "MM"

        monthTotals[getMonthName(month)] += item.amount;
      }
    });

    const data_bar = {
      labels: Object.keys(monthTotals),
      // .filter((key) => !key.endsWith("_label")) // Filter out label keys
      // .sort(), // Sort the months in ascending order
      datasets: [
        {
          data: Object.values(monthTotals),
          // .filter((value, index) => index % 2 === 0) // Filter out label values
          // .sort(), // Sort the expense totals in ascending order
        },
      ],
    };

    return data_bar;
  };

  const barIncomePercentage = () => {
    const monthTotals = {};

    // Initialize all months with 0
    for (let month = 1; month <= 12; month++) {
      // const monthKey = month < 10 ? `0${month}` : `${month}`;
      const monthName = getMonthName(month);
      monthTotals[monthName] = 0;
      // monthTotals[monthKey + "_label"] = monthName;
    }

    // Calculate the total expense for each month
    listItems.forEach((item) => {
      if (item.isPlus) {
        const date = new Date(item.date);
        const month = date.getMonth() + 1; // Months are zero-indexed, so add 1
        const monthKey = month < 10 ? `0${month}` : `${month}`; // Format month as "MM"

        monthTotals[getMonthName(month)] += item.amount;
      }
    });

    const data_bar = {
      labels: Object.keys(monthTotals),
      // .filter((key) => !key.endsWith("_label")) // Filter out label keys
      // .sort(), // Sort the months in ascending order
      datasets: [
        {
          data: Object.values(monthTotals),
          // .filter((value, index) => index % 2 === 0) // Filter out label values
          // .sort(), // Sort the expense totals in ascending order
        },
      ],
    };

    return data_bar;
  };

  const getMonthName = (monthIndex) => {
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return monthNames[monthIndex - 1].toString();
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleAddItem = (newItem) => {
    setListItems((prevItems) => [newItem, ...prevItems]);
  };
  useEffect(() => {}, [isSearchModalVisible]);

  const toggleSearchModal = () => {
    setSearchModalVisible(!isSearchModalVisible);
    setModalVisible(!isModalVisible);
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

  const chartconfig = {
    backgroundGradientFrom: "white",
    backgroundGradientTo: "white",
    color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
    backgroundGradientFromOpacity: 0.4,
    backgroundGradientToOpacity: 0.4,
    fillShadowGradientOpacity: 0.7,
    fillShadowGradientTo: "orange",
    decimalPlaces: 0,
    style: {
      borderRadius: 16,
    },
    barPercentage: 0.5, // Adjust the bar width here
    barRadius: 7, // Adjust the bar corner radius here
    withHorizontalLabels: "false",
  };

  const chartconfig2 = {
    backgroundGradientFrom: "white",
    backgroundGradientTo: "white",
    color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
    backgroundGradientFromOpacity: 0.4,
    backgroundGradientToOpacity: 0.4,
    fillShadowGradientOpacity: 0.7,
    fillShadowGradientTo: "skyblue",
    decimalPlaces: 0,
    style: {
      borderRadius: 16,
    },
    barPercentage: 0.5, // Adjust the bar width here
    barRadius: 7, // Adjust the bar corner radius here
    withHorizontalLabels: "false",
  };

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
      <View style={styles.headerseparator}></View>
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
            <Text style={styles.chartTitleText}>{"소득"}</Text>
            <PieChart
              style={styles.piechartlayout}
              data={calculateIncomePercentage()}
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
          <Text style={styles.sectionTitle}>월별 지출</Text>
          <View style={styles.separator} />
          <View style={styles.chartcontainer}>
            <Text style={styles.barTitleText}>{"지출"}</Text>
            <BarChart
              data={barExpensePercentage()}
              width={Dimensions.get("window").width * 0.9}
              height={220}
              // yAxisLabel="W"
              yAxisInterval={1}
              yAxisSuffix=""
              backgroundColor={"transparent"}
              chartConfig={chartconfig}
              // horizontalLabelRotation={30}
              // verticalLabelRotation={30}
              showBarTops={false} // Hide the values on top of bars
              showValuesOnTopOfBars={({ values }) =>
                values.map((value) =>
                  value !== 0 ? value.toLocaleString() : ""
                )
              }
              withHorizontalLabels={false}
            />
          </View>
          <View style={styles.chartcontainer}>
            <Text style={styles.barTitleText}>{"소득"}</Text>
            <BarChart
              data={barIncomePercentage()}
              width={Dimensions.get("window").width * 0.9}
              height={220}
              yAxisInterval={1}
              yAxisSuffix=""
              backgroundColor={"transparent"}
              chartConfig={chartconfig2}
              showBarTops={false} // Hide the values on top of bars
              showValuesOnTopOfBars={({ values }) =>
                values.map((value) =>
                  value !== 0 ? value.toLocaleString() : ""
                )
              }
              withHorizontalLabels={false}
            />
          </View>
        </ScrollView>
        <Modal
          animationType="slide"
          visible={isSearchModalVisible}
          onRequestClose={toggleSearchModal}
        >
          <View style={styles.monthPicker}>
            <Picker
              selectedValue={selectedMonth}
              onValueChange={(itemValue) => handleMonthSelect(itemValue)}
            >
              <Picker.Item label="1월" value="1" />
              <Picker.Item label="2월" value="2" />
              <Picker.Item label="3월" value="3" />
              <Picker.Item label="4월" value="4" />
              <Picker.Item label="5월" value="5" />
              <Picker.Item label="6월" value="6" />
              <Picker.Item label="7월" value="7" />
              <Picker.Item label="8월" value="8" />
              <Picker.Item label="9월" value="9" />
              <Picker.Item label="10월" value="10" />
              <Picker.Item label="11월" value="11" />
              <Picker.Item label="12월" value="12" />
            </Picker>
            <Button title="확인" onPress={toggleSearchModal} />
          </View>
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
  chartTitleText: {
    fontWeight: "bold",
    fontSize: 18,
    color: "gray",
    alignItems: "center", // Align vertically to the bottom of the text
    flex: 1, // Added flex property to allow text to wrap
    marginTop: 10,
  },
  barTitleText: {
    fontWeight: "bold",
    fontSize: 18,
    color: "gray",
    alignItems: "center", // Align vertically to the bottom of the text
    flex: 1, // Added flex property to allow text to wrap
    marginVertical: 10,
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
  headerseparator: {
    width: "100%",
    height: 1,
    backgroundColor: "lightgray",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
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
    marginBottom: 20,
  },
  chartcontainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
});

export default StatsScreen;
