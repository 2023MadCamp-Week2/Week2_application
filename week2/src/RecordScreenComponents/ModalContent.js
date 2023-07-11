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
} from "react-native";
import Icon4 from "react-native-vector-icons/AntDesign";
import Icon5 from "react-native-vector-icons/Feather";
import RecordItemList from "./RecordItemList";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import colors from "../../assets/colors.js";
import AssetModal from "./AssetModal";
import CategoryModal from "./CategoryModal";
import moment from "moment";
// import { ToastContainer, useToast } from 'react-native-toast-message';

const IPv4 = "143.248.195.179";

const ModalContent = ({ onClose, onAddItem, userInfo }) => {
  const handleClose = () => {
    onClose(); // 모달을 닫기 위해 onClose 함수 호출
  };

  const [date, setDate] = useState(new Date()); // Initialize with current date and time
  const [deviceTime, setDeviceTime] = useState(new Date());
  const [asset, setAsset] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [content, setContent] = useState("");
  const [isIncomeActive, setIsIncomeActive] = useState(isPlus); // Set initial state to false
  const [isExpenseActive, setIsExpenseActive] = useState(!isPlus);
  const [isPlus, setIsPlus] = useState(false);
  const [isAssetModalVisible, setIsAssetModalVisible] = useState(false);
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [isItemContainerPressed, setIsItemContainerPressed] = useState(false);

  const handleItemContainerPress = () => {
    setIsItemContainerPressed(true);
  };

  const handleDateChange = (selectedDate) => {
    const selectedTimestamp = moment(selectedDate).format("YYYY-MM-DD HH:mm");
    setDate(new Date(selectedTimestamp)); // Convert string to Date object
    setIsDatePickerVisible(false); // 날짜 선택이 완료되면 DatePickerModal을 숨깁니다.
    setIsItemContainerPressed(false); // Close the modal after date selection
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setDeviceTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []); // Empty dependency array ensures the effect runs only once

  const handleAssetChange = (text) => {
    setAsset(text);
  };

  const handleCategoryChange = (text) => {
    setCategory(text);
  };

  const handleOpenAssetModal = () => {
    setIsAssetModalVisible(true);
  };

  const handleCloseAssetModal = () => {
    setIsAssetModalVisible(false);
  };

  const handleOpenCategoryModal = () => {
    setIsCategoryModalVisible(true);
  };

  const handleCloseCategoryModal = () => {
    setIsCategoryModalVisible(false);
  };

  const handleAmountChange = (text) => {
    // Remove any non-numeric characters from the input
    const numericValue = text.replace(/[^0-9]/g, "");

    // Remove leading zeros from the numeric value, except when it is exactly "0"
    const trimmedValue = numericValue.replace(/^0+(?=\d)/, "");

    // Format the numeric value with commas every 3 digits
    const formattedValue = trimmedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    // Add the currency symbol "원" at the end of the amount

    // Update the amount state
    setAmount(formattedValue);
  };

  const handleBackspacePress = () => {
    const updatedAmount = amount.slice(0, -1);
    setAmount(updatedAmount);
  };

  const handleContentChange = (text) => {
    setContent(text);
  };

  const handleAddItem = () => {
    if (!date || !asset || !category || !amount || !content) {
      return;
    }

    const newItem = {
      date: date,
      asset: asset,
      category: category,
      amount: amount,
      content: content,
      isPlus: isPlus,
    };
    let date_2;
    let asset_2;
    let category_2;
    let amount_2;
    let content_2;
    let isplus_2;
    var numberString;

    date_2 = `${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

    if (asset == "현금") asset_2 = "cash";
    else if (asset == "은행") asset_2 = "bank";
    else if (asset == "카드") asset_2 = "card";
    else asset_2 = "loan";

    if (category == "식비") category_2 = "food";
    else if (category == "학업") category_2 = "school";
    else if (category == "교통") category_2 = "transport";
    else if (category == "선물") category_2 = "gift";
    else if (category == "금융소득") category_2 = "financial";
    else if (category == "환불") category_2 = "refund";
    else if (category == "장학금") category_2 = "scholar";
    else if (category == "문화생활") category_2 = "culture";
    else if (category == "생활용품") category_2 = "daily";
    else if (category == "기타") category_2 = "etc";
    else if (category == "용돈") category_2 = "pocket";
    else category_2 = "salary";

    content_2 = content;

    if (isPlus == true) isplus_2 = "income";
    else isplus_2 = "expense";

    numberString = amount.replace(/[^0-9]/g, ""); // 입력된 값에서 숫자 부분만 추출
    amount_2 = parseInt(numberString, 10); // 추출된 숫자를 정수형으로 변환
    console.log(userInfo.id);
    console.log(date_2);
    console.log(asset_2);
    console.log(category_2);
    console.log(amount_2);
    console.log(content_2);
    console.log(isplus_2);
    //DB에 올리자

    fetch(`http://${IPv4}:3000/api/push_money`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: userInfo.id,
        date: date_2,
        type: isplus_2,
        amount: amount_2,
        asset: asset_2,
        category: category_2,
        description: content_2,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    onAddItem(newItem); // Call the onAddItem prop with the new item
    handleClose(); // Close the modal
  };

  //수입 버튼이 눌렸을 때
  const handleIncomeButtonPress = () => {
    setIsIncomeActive(true);
    setIsExpenseActive(false);
    setIsPlus(true);
  };

  //지출 버튼이 눌렸을 때
  const handleExpenseButtonPress = () => {
    setIsIncomeActive(false);
    setIsExpenseActive(true);
    setIsPlus(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerbutton} onPress={handleClose}>
          <Icon4 name="arrowleft" size={20} color="black" />
          <Text style={styles.headerbuttontext}>{" 닫기"}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.headerbutton,
            !date || !asset || !category || !amount || !content
              ? styles.disabledButton
              : null,
          ]}
          onPress={handleAddItem}
          disabled={!date || !asset || !category || !amount || !content}
        >
          <Icon5 name="check" size={30} color="black" />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.scrollView}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, isIncomeActive && styles.activeIncomeButton]}
            onPress={handleIncomeButtonPress}
          >
            <Text
              style={[
                styles.buttonText,
                isIncomeActive && styles.activeIncomeButtonText,
              ]}
            >
              수입
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              isExpenseActive && styles.activeExpenseButton,
            ]}
            onPress={handleExpenseButtonPress}
          >
            <Text
              style={[
                styles.buttonText,
                isExpenseActive && styles.activeExpenseButtonText,
              ]}
            >
              지출
            </Text>
          </TouchableOpacity>
        </View>
        {/* 아이템 4개를 나타내는 컴포넌트를 추가 */}
        {/* 각 아이템은 왼쪽에 제목, 오른쪽에 버튼으로 구성됨 */}
        <View style={styles.itemContainer}>
          <Text style={styles.itemTitle}>날짜</Text>
          <TouchableOpacity
            style={styles.datePicker}
            onPress={() => setIsItemContainerPressed(true)}
          >
            <Text>{moment(date).format("YYYY-MM-DD HH:mm")}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.itemContainer}>
          <Text style={styles.itemTitle}>자산</Text>
          <TextInput
            style={styles.itemInput}
            value={asset}
            onChangeText={handleAssetChange}
            placeholder="자산을 입력하세요"
            onTouchStart={handleOpenAssetModal} // Open asset modal on touch
          />
        </View>
        <View style={styles.itemContainer}>
          <Text style={styles.itemTitle}>분류</Text>
          <TextInput
            style={styles.itemInput}
            value={category}
            onChangeText={handleCategoryChange}
            placeholder="카테고리를 입력하세요"
            onTouchStart={handleOpenCategoryModal} // Open category modal on touch
          />
        </View>
        <View style={styles.itemContainer}>
          <Text style={styles.itemTitle}>금액</Text>
          <TextInput
            style={styles.itemInput}
            value={amount}
            onChangeText={handleAmountChange}
            placeholder="금액을 입력하세요"
            keyboardType="numeric" // Specify the keyboard type to numeric
            // caretHidden //커서 안 보이게
            onKeyPress={({ nativeEvent }) => {
              if (nativeEvent.key === "Backspace") {
                handleBackspacePress();
              }
            }}
          />
          <Text style={styles.currency}>원</Text>
        </View>
        <View style={styles.itemContainer}>
          <Text style={styles.itemTitle}>내용</Text>
          <TextInput
            style={styles.itemInput}
            value={content}
            onChangeText={handleContentChange}
            placeholder="내용을 입력하세요"
          />
        </View>
      </ScrollView>
      <AssetModal
        visible={isAssetModalVisible}
        onClose={handleCloseAssetModal}
        onSelectAsset={handleAssetChange}
      />
      <CategoryModal
        visible={isCategoryModalVisible}
        onClose={handleCloseCategoryModal}
        onSelectCategory={handleCategoryChange}
      />
      <DateTimePickerModal
        style={styles.dateTimePickerModal}
        isVisible={isItemContainerPressed}
        mode="datetime"
        onConfirm={handleDateChange}
        onCancel={() => setIsItemContainerPressed(false)}
      />
      {/* <ToastContainer ref={(ref) => Toast.setRef(ref)} /> */}
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  headerbutton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  headerbuttontext: {
    color: "black",
    fontWeight: "bold",
    fontSize: 20,
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
  currency: {
    flex: 1,
    fontSize: 16,
    alignItems: "flex-start",
  },
  dateTimePickerModal: {
    flex: 7,
    alignItems: "flex-start",
    fontSize: 20,
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
    marginLeft: 20, // Add left margin for spacing
    fontSize: 20,
    alignItems: "flex-start",
    marginVertical: 6,
  },
  ToastContainer: {
    backgroundColor: "gray",
    color: "white",
  },
});

export default ModalContent;
