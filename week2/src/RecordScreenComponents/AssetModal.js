import React from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from "react-native";

const AssetModal = ({ visible, onClose, onSelectAsset }) => {
  const handleSelectAsset = (asset) => {
    onSelectAsset(asset);
    onClose();
  };

  const assets = ["현금", "은행", "카드", "대출"];

  const renderAssetButtons = () => {
    return assets.map((asset, index) => (
      <TouchableOpacity
        key={index}
        style={styles.assetButton}
        onPress={() => handleSelectAsset(asset)}
      >
        <Text style={styles.assetButtonText}>{asset}</Text>
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
              {renderAssetButtons()}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "100%",
    height: "50%",
    backgroundColor: "white",
    borderRadius: 0,
    padding: 20,
  },
  closeButton: {
    alignSelf: "flex-end",
    marginBottom: 10,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "gray",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 5,
    paddingTop: 10,
  },
  assetButton: {
    width: "30%",
    height: 76,
    borderRadius: 8,
    backgroundColor: "lightgray",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  assetButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
});

export default AssetModal;
