import React from 'react';
import { Text, View } from 'react-native';

const RecordItem = ({ date, asset, category, amount, content }) => {
  return (
    <View>
      <Text>날짜&시각: {date}</Text>
      <Text>자산: {asset}</Text>
      <Text>분류: {category}</Text>
      <Text>금액: {amount}</Text>
      <Text>내용: {content}</Text>
    </View>
  );
};

export default RecordItem;