import React, { useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { useAuth } from "../context/AuthContext"; // Adjust import based on the location of your AuthProvider
import { Login } from "./login";

const Home = ({ navigation }: { navigation: any }) => {
  const { user, loading } = useAuth();

  useEffect(() => {
    // Redirect user to home or dashboard if already signed in
    if (user) {
      navigation.navigate("Xyz"); // Or your main screen
    }
  }, [user, loading, navigation]);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <Image style={styles.Imagestyle} source={require("../assets/home.png")} />

      {!user ? (
        <>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.buttonText}>Go to Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Register")}
          >
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.buttonText}>
            Welcome, {user.email ? user.email.split("@")[0] : "Guest"}
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.buttonText}>Go to login</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#1e90ff",
    width: "60%",
    height: 50,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    margin: 20,
  },
  buttonText: {
    color: "Black",
    fontSize: 18,
    fontWeight: "bold",
  },
  Imagestyle: {
    flex: 1,
    width: "60%", // Set width relative to the screen width
    aspectRatio: 1, // Maintain the aspect ratio of the image
    resizeMode: "contain", // Ensures the image scales proportionally
    marginBottom: 20,
    padding: 10,
  },
});
