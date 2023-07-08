import React, { useState } from "react";
import { Text, TouchableOpacity, View, Modal, SafeAreaView, FlatList, Button, TextInput } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import styled, { ThemeProvider } from 'styled-components/native';
import Icon3 from "react-native-vector-icons/Entypo";
import Icon4 from "react-native-vector-icons/AntDesign";
import Icon5 from "react-native-vector-icons/Feather";
import { theme } from "../../theme";
import { StatusBar } from "react-native";
import Input from '../../RecordScreenComponents/input';
import RecordItem from "../../RecordScreenComponents/RecordItem";
import RecordItemList from '../../RecordScreenComponents/RecordItemList';
import ModalContent from "../../RecordScreenComponents/ModalContent";

const ButtonText = styled.Text`
  font-size: 20px;
  color: black;
  font-weight: bold;
`;

const ButtonContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`;

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${({ theme }) => theme.background};
  align-items: center;
  justify-content: flex-start;
`;

const Title = styled.Text`
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  width: 100%;
  align-items: center;
  padding: 0 20px;
  margin-top: 20px;
`;

const HeaderContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
`;

function RecordScreen() {
  const [isModalVisible, setModalVisible] = useState(false);
  const [listItems, setListItems] = useState([]);
  const [textinput, setInputText] = useState('');

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleAddItem = () => {
    if (textinput.trim() === '') {
      console.log(textinput)
      return; // 입력된 내용이 없으면 아이템 추가하지 않음
    }
    const newItem = { id: Date.now().toString(), name: textinput };
    setListItems([...listItems, newItem]);
    setInputText(''); // 입력 필드 초기화
    console.log('qwwq')
    toggleModal();
  };

  const logshow = () => {
    console.log(RecordItemList[0])
  }

  const renderItem = ({ item }) => (
    <RecordItem name={item.name} />
  );

  return (
    <View style={{ flex: 1 }}>
      <ThemeProvider theme={theme}>
        <Container>
          <Title>기록</Title>
          <StatusBar
            barStyle={theme.item}
            backgroundColor={theme.background}
          />
          <Input placeholder="검색" />

          <TouchableOpacity
            style={{
              position: "absolute",
              bottom: 16,
              right: 16,
              backgroundColor: "red",
              borderRadius: 30,
              width: 60,
              height: 60,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={toggleModal}
          >
            <Icon3 name="plus" size={25} color="white" />
          </TouchableOpacity>

          <Modal
            visible={isModalVisible}
            animationType="slide"
            onRequestClose={toggleModal}
          >
            <SafeAreaView style={{ flex: 1 }}>
                <ModalContent onClose={toggleModal} onAddItem={handleAddItem} />
                </SafeAreaView>
        </Modal>

          <FlatList
            data={listItems}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />
        </Container>
      </ThemeProvider>
    </View>
  );
}

export default RecordScreen;