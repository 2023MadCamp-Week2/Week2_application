import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import Icon2 from "react-native-vector-icons/Ionicons";
import ListScreen from "./Tabs/ListScreen";
import RecordScreen from "./Tabs/RecordScreen";
import StatsScreen from "./Tabs/StatsScreen";
import Tab4Screen from "./Tabs/Tab4Screen";

const Tab = createBottomTabNavigator();

function BottomTabNavigationApp() {
  return (
    <Tab.Navigator initialRouteName="Home">
      <Tab.Screen
        name="목록"
        component={ListScreen}
        options={{
          headerShown: false,
          title: "목록",
          tabBarIcon: ({ color, size }) => (
            <Icon name="list" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="통계"
        component={StatsScreen}
        options={{
          headerShown: false,
          title: "통계",
          tabBarIcon: ({ color, size }) => (
            <Icon name="pie-chart" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="기록"
        component={RecordScreen}
        options={{
          headerShown: false,
          title: "기록",
          tabBarIcon: ({ color, size }) => (
            <Icon name="book" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="더 보기"
        component={Tab4Screen}
        options={{
          headerShown: false,
          title: "더 보기",
          tabBarIcon: ({ color, size }) => (
            <Icon name="more-vert" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default BottomTabNavigationApp;
