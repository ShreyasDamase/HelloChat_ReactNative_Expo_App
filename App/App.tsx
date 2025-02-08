import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "./Home";
import { Login } from "./login";
import { Register } from "./Register";
import Xyz from "../login/xyz";
import { AuthProvider } from "../context/AuthContext"; // Import AuthProvider
import "react-native-gesture-handler";
import ChatPage from "./groups/chatPage";
import GroupsPage from "./groups/groupchat";

const Stack = createStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false, // Hides the header for all screens
          }}
        >
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="Xyz" component={Xyz} />
          <Stack.Screen name="ChatPage" component={ChatPage} />
          <Stack.Screen name="GroupsPage" component={GroupsPage} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
