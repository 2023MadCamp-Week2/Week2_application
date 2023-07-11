import React from "react";
import { Text, View, Button, StyleSheet, TouchableOpacity } from "react-native";
import colors from "../../assets/colors.js";

const RecordItem = ({
  date,
  asset,
  category,
  amount,
  content,
  isPlus,
  onItemLongPress,
}) => {
  const formattedDate = formatDate(date);

  return (
    <TouchableOpacity onLongPress={onItemLongPress}>
      <View style={styles.itemBox}>
        <View style={styles.daterow}>
          <Text style={styles.dateText}>{formattedDate}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.labelText} numberOfLines={1} ellipsizeMode="tail">
            {content}
          </Text>
          <Text
            style={[
              styles.amountText,
              isPlus ? styles.amountTextGreen : styles.amountTextRed,
            ]}
          >
            {isPlus ? "+" + amount : "-" + amount}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const formatDate = (date) => {
  const year = date.getFullYear().toString().substr(-2);
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);
  const hours = ("0" + date.getHours()).slice(-2);
  const minutes = ("0" + date.getMinutes()).slice(-2);

  return `${year}-${month}-${day}  ${hours}:${minutes}`;
};

const styles = StyleSheet.create({
  itemBox: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 15,
    marginVertical: 5,
    marginHorizontal: 10, // Add margin horizontally
    elevation: 3, // for Android
    shadowColor: "black", // for iOS
    shadowOffset: { width: 0, height: 2 }, // for iOS
    shadowOpacity: 0.2, // for iOS
    shadowRadius: 2, // for iOS
  },
  daterow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end", // Align vertically to the bottom of the text
    marginBottom: 5,
  },
  labelText: {
    fontWeight: "bold",
    fontSize: 18,
    color: "gray",
    alignItems: "flex-end", // Align vertically to the bottom of the text
    flex: 1, // Added flex property to allow text to wrap
    paddingRight: 110, // Added right padding to create space for amount text
  },
  amountText: {
    fontWeight: "bold",
    fontSize: 20,
    color: "gray",
    alignItems: "flex-end", // Align vertically to the bottom of the text
    marginLeft: -100, // Left margin to create space for long content text
  },
  amountTextGreen: {
    color: colors.plusGreen, // Color when isPlus is true
    alignItems: "center", // Add alignItems property for vertical alignment
  },
  amountTextRed: {
    color: "red", // Color when isPlus is false
    alignItems: "center", // Add alignItems property for vertical alignment
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  dateText: {
    fontSize: 15,
    color: "gray",
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
  },
  headerbuttontext: {
    color: "gray",
    fontWeight: "bold",
    alignItems: "center",
    fontSize: 25,
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

export default RecordItem;
