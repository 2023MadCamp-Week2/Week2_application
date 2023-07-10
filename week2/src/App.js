import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./screens/LoginScreen";
import TabScreen from "./screens/TabScreen";
import KaKaoLogin from "./screens/KakaoLogin";
import RecordScreen from "./screens/Tabs/RecordScreen";

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="RecordScreen" component={RecordScreen} />
        {/* <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="TabScreen" component={TabScreen} />
        <Stack.Screen name="KakaoLogin" component={KaKaoLogin} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default App;
