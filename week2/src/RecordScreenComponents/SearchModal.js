import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Platform,
  FlatList,
} from "react-native";
import Icon4 from "react-native-vector-icons/AntDesign";
import Icon5 from "react-native-vector-icons/Feather";
import Icon6 from "react-native-vector-icons/FontAwesome";
import RecordItemList from "./RecordItemList";
import RecordItem from "./RecordItem";
import colors from "../../assets/colors.js";
import AssetModal from "./AssetModal";
import CategoryModal from "./CategoryModal";
import moment from "moment";
import DateTimePicker from "@react-native-community/datetimepicker";
import { StatusBar } from "react-native";

const SearchModal = ({ onClose, listItems }) => {
  const handleClose = () => {
    onClose(); // 모달을 닫기 위해 onClose 함수 호출
  };

  const [searchText, setSearchText] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);

  useEffect(() => {
    if (searchText.trim() !== "") {
      // Filter the listItems based on the searchText (case-insensitive)
      const filtered = listItems.filter((item) =>
        item.content.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredItems(filtered);
    } else {
      setFilteredItems(listItems);
    }
  }, [searchText, listItems]);

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
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerbutton} onPress={handleClose}>
            <Icon4 name="arrowleft" size={20} color="black" />
            <Text style={styles.headerbuttontext}>{" 닫기"}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.searchInputContainer}>
          <Icon6 name="search" size={20} color="black" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
        <View style={styles.headerseparator} />
      </View>
      <View style={styles.container}>
        <FlatList
          data={filteredItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: "white",
  },
  headerContainer: {
    flexDirection: "column",
    backgroundColor: "white",
    // shadowColor: 'black',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.8,
    // shadowRadius: 2,
    // elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    paddingTop: 15,
    paddingLeft: 10,
    paddingBottom: 5,
  },
  headerbutton: {
    flexDirection: "row",
    fontSize: 20,
    fontWeight: "bold",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  headerbuttontext: {
    color: "black",
    fontWeight: "bold",
    fontSize: 20,
    // marginLeft: 5,
  },
  searchInputContainer: {
    flexDirection: "row",
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#E1E1E1",
    marginTop: 10,
    marginBottom: 15,
    marginHorizontal: 15,
  },
  headerseparator: {
    width: "100%",
    height: 1,
    backgroundColor: "lightgray",
  },
  searchInput: {
    flex: 7,
    fontSize: 16,
    color: "black",
    paddingHorizontal: 10,
    backgroundColor: "#E1E1E1",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end", // Align vertically to the bottom of the text
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    marginHorizontal: -10, // Adjusted margin to account for the negative margin on buttons
  },
  button: {
    flex: 1, // Added flex property to make the buttons expand and fill the row
    marginHorizontal: 10, // Added horizontal margin to create spacing between buttons
    borderWidth: 1,
    borderColor: "gray",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    justifyContent: "center", // Align button content vertically
    alignItems: "center", // Align button content horizontally
  },
  buttonText: {
    color: "gray",
    fontWeight: "bold",
    alignItems: "center",
  },
  activeIncomeButton: {
    borderColor: colors.plusGreen,
  },
  activeIncomeButtonText: {
    color: colors.plusGreen,
  },
  activeExpenseButton: {
    borderColor: "red",
  },
  activeExpenseButtonText: {
    color: "red",
  },
  scrollView: {
    flex: 1,
  },
  disabledButton: {
    opacity: 0.2, // Reduce the opacity to make it appear grayed out
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "lightgray",
    borderRadius: 5,
    flex: 1,
  },
  itemTitle: {
    flex: 1,
    fontSize: 16,
    alignItems: "center",
  },
  itemInput: {
    flex: 7,
    marginLeft: 10, // Add left margin for spacing
    paddingHorizontal: 10,
    fontSize: 16,
    alignItems: "center",
  },
  itemButton: {
    backgroundColor: "lightblue",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 3,
  },
  itemButtonText: {
    color: "white",
    fontSize: 14,
  },
  closeButton: {
    backgroundColor: "red",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  datePicker: {
    flex: 7,
    marginLeft: 10, // Add left margin for spacing
    fontSize: 20,
    alignItems: "center",
  },
  ToastContainer: {
    backgroundColor: "gray",
    color: "white",
  },
});

export default SearchModal;
