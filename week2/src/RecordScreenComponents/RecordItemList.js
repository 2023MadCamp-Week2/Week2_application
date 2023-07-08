import React from 'react';
import { View, SectionList, Text } from 'react-native';
import RecordItem from './RecordItem';

const RecordItemList = ({ data }) => {
  const renderSectionHeader = ({ section: { title } }) => (
    <View>
      <Text>{title}</Text>
    </View>
  );

  const renderItem = ({ item }) => (
    <RecordItem name={item.name} amount={item.amount} />
  );

  return (
    <SectionList
      sections={data}
      keyExtractor={(item, index) => item.id}
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader}
    />
  );
};

export default RecordItemList;
