import React, { useState } from 'react';
import styled, { ThemeProvider } from 'styled-components/native';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, TextInput } from 'react-native';
import Icon4 from "react-native-vector-icons/AntDesign";
import Icon5 from "react-native-vector-icons/Feather";
import RecordItemList from './RecordItemList';

const ModalContent = ({ onClose, onAddItem }) => {
  const handleClose = () => {
    onClose(); // 모달을 닫기 위해 onClose 함수 호출
  };

  const [date, setDate] = useState('');
  const [asset, setAsset] = useState('');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [content, setContent] = useState('');

  const handleDateChange = (text) => {
    setDate(text);
  };

  const handleAssetChange = (text) => {
    setAsset(text);
  };

  const handleCategoryChange = (text) => {
    setCategory(text);
  };

  const handleAmountChange = (text) => {
    setAmount(text);
  };

  const handleContentChange = (text) => {
    setContent(text);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerbutton} onPress={handleClose}>
          <Icon4 name="arrowleft" size={20} color="black" />
          <Text style={styles.headerbuttontext}>{" 닫기"}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerbutton} onPress={onAddItem}>
          <Icon5 name="check" size={30} color="black" />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.scrollView}>
        {/* 아이템 4개를 나타내는 컴포넌트를 추가 */}
        {/* 각 아이템은 왼쪽에 제목, 오른쪽에 버튼으로 구성됨 */}
        <View style={styles.itemContainer}>
          <Text style={styles.itemTitle}>날짜</Text>
          <TextInput
            style={styles.itemInput}
            value={date}
            onChangeText={handleDateChange}
            placeholder="날짜를 입력하세요"
          />
        </View>
        <View style={styles.itemContainer}>
          <Text style={styles.itemTitle}>자산</Text>
          <TextInput
            style={styles.itemInput}
            value={asset}
            onChangeText={handleAssetChange}
            placeholder="자산을 입력하세요"
          />
        </View>
        <View style={styles.itemContainer}>
          <Text style={styles.itemTitle}>분류</Text>
          <TextInput
            style={styles.itemInput}
            value={category}
            onChangeText={handleCategoryChange}
            placeholder="분류를 입력하세요"
          />
        </View>
        <View style={styles.itemContainer}>
          <Text style={styles.itemTitle}>금액</Text>
          <TextInput
            style={styles.itemInput}
            value={amount}
            onChangeText={handleAmountChange}
            placeholder="금액을 입력하세요"
          />
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
    </SafeAreaView>
  );
};

const HeaderContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
`;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: 'lightblue',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  headerbutton:{
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start"
  },
  headerbuttontext:{
    color: 'black',
    fontWeight: 'bold',
    fontSize: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 5,
  },
  itemTitle: {
    fontSize: 16,
  },
  itemButton: {
    backgroundColor: 'lightblue',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 3,
  },
  itemButtonText: {
    color: 'white',
    fontSize: 14,
  },
  closeButton: {
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ModalContent;
