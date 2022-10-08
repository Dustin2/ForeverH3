import Login from "./screens/Login";
import SignUp from "./screens/SignUp";
import ResetPassword from "./screens/ResetPassword";
import HomeScreen from "./screens/HomeScreen";
import LocationsScreen from "./screens/LocationScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ManageAccount from "./screens/ManageAccount";
import { Colors } from "./colors";
import SettingsScreen from "./screens/SettingsScreen";
import ChangeLocations from "./screens/ChangeLocations";
import CaptureScreen from "./screens/CaptureScreen";
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: Colors.primary,
          },
          headerTintColor: Colors.secondary,
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUp}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ResetPassword"
          component={ResetPassword}
          options={{ headerShown: false }}
        />
        {/* <Stack.Screen
          name="ManageAccount"
          component={ManageAccount}
          options={{ headerShown: false }}
        /> */}
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Locations" component={LocationsScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Changes" component={ChangeLocations} />
        <Stack.Screen name="Capture" component={CaptureScreen} />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}
