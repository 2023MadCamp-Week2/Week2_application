import React from 'react';
import { View, ScrollView, SectionList, Text } from 'react-native';
import RecordItem from './RecordItem';

const RecordItemList = ({ data }) => {
  const renderSectionHeader = ({ section: { title } }) => (
    <View>
      <Text>{title}</Text>
    </View>
  );

  const renderItem = ({ item }) => (
    <RecordItem
      date={item.date}
      asset={item.asset}
      category={item.category}
      amount={item.amount}
      content={item.content}
      isPlus={item.isPlus} // Pass the isPlus value to the RecordItem component
    />
  );

  return (
    <ScrollView>
      <SectionList
        sections={data}
        keyExtractor={(item, index) => item.id}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
      />
    </ScrollView>
  );
};

export default RecordItemList;
