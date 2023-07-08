import React from 'react';
import { Text, View } from 'react-native';

const RecordItem = ({ name, amount }) => {
  return (
    <View>
      <Text>{name}</Text>
      <Text>{amount}</Text>
    </View>
  );
};

export default RecordItem;
