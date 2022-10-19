//Dependencies


//Navigation
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
//Screens
import Login from "./screens/Login";
import SignUp from "./screens/SignUp";
import ResetPassword from "./screens/ResetPassword";
import HomeScreen from "./screens/HomeScreen";
import LocationsScreen from "./screens/LocationScreen";
import SettingsScreen from "./screens/SettingsScreen";
import ChangeLocationsScreen from "./screens/ChangeLocationsScreen";
import CaptureScreen from "./screens/CaptureScreen";
import HistoryScreen from "./screens/HistoryScreen";
import ManageAccount from "./screens/ManageAccount";

//External Dependencies
import { Colors } from "./colors";

///create function for navigate in the middle of screens
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
        <Stack.Screen
          name="ManageAccount"
          component={ManageAccount}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Inicio"
          component={HomeScreen}
          options={{
            /// this use for don't show back button in initial screen
            headerBackVisible: false,
          }}
        />
        <Stack.Screen name="Ubicaciones" component={LocationsScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Cambio de ubicacion" component={ChangeLocationsScreen} />
        <Stack.Screen name="Escaneo de productos" component={CaptureScreen} />
        <Stack.Screen name="Historial" component={HistoryScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
