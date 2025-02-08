import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";
import { useAuth } from "../context/AuthContext"; // Import the useAuth hook
import { useEffect } from "react";

export const Login = ({ navigation }: { navigation: any }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { signIn, loading, user } = useAuth(); // Access signIn, loading, and user from AuthContext
  const [errorMessage, setErrorMessage] = useState<string>("");
  const handleLogin = async () => {
    try {
      await signIn(email, password);
    } catch (error) {
      console.error("Login failed:", error);
      setErrorMessage("Incorrect email or password");
    }
  };

  // Effect to handle navigation once the user is logged in
  useEffect(() => {
    if (user) {
      navigation.navigate("Xyz"); // Navigate to "Xyz" once the user is logged in
    }
  }, [user, navigation]); // Only run when `user` state changes

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Login</Text>

      {/* Input Fields */}
      <TextInput
        placeholder="Email"
        style={styles.input}
        autoCapitalize="none"
        onChangeText={(text) => setEmail(text.toLowerCase())}
        autoCorrect={false}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry={true}
        style={styles.input}
        onChangeText={setPassword}
      />

      {/* Login Button */}
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>
          {loading ? "Logging in..." : "Login"}
        </Text>
      </TouchableOpacity>

      {/* Register Navigation */}
      <TouchableOpacity
        style={styles.registerButton}
        onPress={() => navigation.navigate("Register")}
      >
        <Text style={styles.registerButtonText}>Not registered? Register</Text>
      </TouchableOpacity>
      {errorMessage ? (
        <Text style={styles.errorMessage}>{errorMessage}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "80%",
    height: 40,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingLeft: 10,
    borderRadius: 5,
  },
  loginButton: {
    backgroundColor: "#1e90ff",
    paddingVertical: 10,
    paddingHorizontal: 50,
    borderRadius: 5,
    marginVertical: 10,
  },
  loginButtonText: {
    color: "white",
    fontSize: 16,
  },
  registerButton: {
    backgroundColor: "transparent",
    paddingVertical: 10,
    paddingHorizontal: 50,
  },
  registerButtonText: {
    color: "#1e90ff",
    fontSize: 14,
    textDecorationLine: "underline",
  },
  errorMessage: {
    color: "red",
    fontSize: 14,
    marginTop: 10,
  },
});
