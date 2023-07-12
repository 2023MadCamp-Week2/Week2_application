import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Toast from "react-native-toast-message";
import LoginScreen from "./screens/LoginScreen";
import TabScreen from "./screens/TabScreen";
import KaKaoLogin from "./screens/KakaoLogin";
import Signup from "./screens/Signup";
import RecordScreen from "./screens/Tabs/RecordScreen";
import StatsScreen from "./screens/Tabs/StatsScreen";

const Stack = createStackNavigator();

function App() {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="TabScreen" component={TabScreen} />
          <Stack.Screen name="KakaoLogin" component={KaKaoLogin} />
          <Stack.Screen name="Signup" component={Signup} />
          <Stack.Screen name="RecordScreen" component={RecordScreen} />
          <Stack.Screen name="StatsScreen" component={StatsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast />
    </>
  );
}

export default App;
