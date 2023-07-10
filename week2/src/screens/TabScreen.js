import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/MaterialIcons";
import ListScreen from "./Tabs/ListScreen";
import RecordScreen from "./Tabs/RecordScreen";
import StatsScreen from "./Tabs/StatsScreen";
import Tab4Screen from "./Tabs/Tab4Screen";

const Tab = createBottomTabNavigator();

function BottomTabNavigationApp({ route }) {
  const { userInfo } = route.params;
  console.log(userInfo);
  return (
    <Tab.Navigator initialRouteName="Home">
      <Tab.Screen
        name="목록"
        options={{
          headerShown: false,
          title: "목록",
          tabBarIcon: ({ color, size }) => (
            <Icon name="list" color={color} size={size} />
          ),
        }}
      >
        {(props) => <ListScreen {...props} userInfo={userInfo} />}
      </Tab.Screen>
      <Tab.Screen
        name="통계"
        options={{
          headerShown: false,
          title: "통계",
          tabBarIcon: ({ color, size }) => (
            <Icon name="pie-chart" color={color} size={size} />
          ),
        }}
      >
        {(props) => <StatsScreen {...props} userInfo={userInfo} />}
      </Tab.Screen>
      <Tab.Screen
        name="기록"
        options={{
          headerShown: false,
          title: "기록",
          tabBarIcon: ({ color, size }) => (
            <Icon name="book" color={color} size={size} />
          ),
        }}
      >
        {(props) => <RecordScreen {...props} userInfo={userInfo} />}
      </Tab.Screen>
      <Tab.Screen
        name="더 보기"
        options={{
          headerShown: false,
          title: "더 보기",
          tabBarIcon: ({ color, size }) => (
            <Icon name="more-vert" color={color} size={size} />
          ),
        }}
      >
        {(props) => <Tab4Screen {...props} userInfo={userInfo} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export default BottomTabNavigationApp;
