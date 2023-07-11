import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Dimensions } from 'react-native';

const CategoryModal = ({ visible, onClose, onSelectCategory }) => {
  const handleSelectCategory = (category) => {
    onSelectCategory(category);
    onClose();
  };
  
  // const categories = ["월급", "용돈", "장학금", "환불", "금융소득", "선물", "식비", "교통", "문화생활", "학업", "생활용품", "기타"];
  const categories = ["월급", "용돈", "장학금", "환불", "금융소득", "선물"];
  const categories2 = ["식비", "교통", "문화생활", "학업", "생활용품", "기타"];

  const renderCategoryButtons = () => {
    return categories.map((category, index) => (
      <TouchableOpacity
        key={index}
        style={styles.categoryButton}
        onPress={() => handleSelectCategory(category)}
      >
        <Text style={styles.categoryButtonText}>{category}</Text>
      </TouchableOpacity>
    ));
  };

  return (
    <SafeAreaView>
      <Modal visible={visible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.header}>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeButtonText}>닫기</Text>
              </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.gridContainer}>
              {renderCategoryButtons()}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const { width } = Dimensions.get('window');
const buttonWidth = (width - 40 - 20 * 2) / 3;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    // marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '100%',
    height: '50%',
    backgroundColor: 'white',
    borderRadius: 0,
    padding: 20,
  },
  closeButton: {
    alignSelf: 'flex-end',
    // marginBottom: 10,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'gray',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 20,
  },
  categoryButton: {
    width: buttonWidth,
    height: 76,
    borderRadius: 8,
    backgroundColor: 'lightblue',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  categoryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default CategoryModal;
