import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { useAuth } from "../context/AuthContext";
import { Button } from "@react-navigation/elements";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons for icons

import GroupChat from "App/groups/groupchat"; // Adjust import path as necessary
import Profile from "App/groups/profile"; // Adjust import path as necessary

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const Xyz = ({ navigation }: { navigation: any }) => {
  const { signOutUser } = useAuth();

  const handleLogout = async () => {
    try {
      await signOutUser();
      navigation.navigate("Home");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <Stack.Navigator initialRouteName="Hello Chat">
      <Stack.Screen
        name="Hello Chat"
        options={{
          headerRight: () => (
            <Button
              style={styles.button}
              onPress={handleLogout}
              color="white"
              android_ripple={{
                color: "rgba(221, 221, 221, 0.25)",
                borderless: false,
                radius: 47,
              }}
            >
              Logout
            </Button>
          ),
        }}
      >
        {() => (
          <Tab.Navigator
            screenOptions={({ route }) => ({
              headerShown: false,
              tabBarIcon: ({ color, size }) => {
                // Set icons based on route name
                let iconName: keyof typeof Ionicons.glyphMap = "home"; // Default icon name

                if (route.name === "Groupchat") {
                  iconName = "chatbubbles"; // Valid Ionicons icon name for chat
                } else if (route.name === "Profile") {
                  iconName = "person"; // Valid Ionicons icon name for profile
                }

                // Return the icon
                return <Ionicons name={iconName} size={size} color={color} />;
              },
              tabBarActiveTintColor: "#1e90ff", // Active tab color
              tabBarInactiveTintColor: "gray", // Inactive tab color
            })}
          >
            <Tab.Screen name="Groupchat" component={GroupChat} />
            <Tab.Screen name="Profile" component={Profile} />
          </Tab.Navigator>
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default Xyz;

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#1e90ff",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    overflow: "hidden",
  },
});
