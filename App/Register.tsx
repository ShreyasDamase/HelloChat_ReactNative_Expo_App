import { createUserWithEmailAndPassword, UserCredential } from "@firebase/auth";
import React, { useState } from "react";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../config/FirebaseConfig";
import { setDoc, doc } from "firebase/firestore";

import { Login } from "./login";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

export const Register = ({ navigation }: { navigation: any }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoding] = useState(false);

  const handleRegister = async () => {
    try {
      setLoding(true);
      const userCredential = await createUserWithEmailAndPassword(
        FIREBASE_AUTH,
        email,
        password
      );
      setLoding(false);
      console.log(" here User registered", userCredential);

      console.log("logged in");
      // After successful registration, create user info in Firestore
      await createUserInfo(userCredential);
      navigation.navigate("Login");
    } catch (error) {
      console.log("there was error while logged in", error);
    } finally {
      setLoding(false);
    }
  };

  const createUserInfo = async (user: UserCredential) => {
    try {
      // Add user info to Firestore
      const docRef = await setDoc(doc(FIRESTORE_DB, `users/${user.user.uid}`), {
        username,
        email: user.user.email,
      });
      console.log("User info added to Firestore", docRef);
    } catch (error) {
      console.log("Error while saving user info to Firestore:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Create a new account</Text>

      {/* Input fields */}
      <TextInput
        placeholder="User name"
        style={styles.input}
        onChangeText={setUsername}
        value={username}
      />
      <TextInput
        placeholder="Email"
        style={styles.input}
        onChangeText={setEmail}
        value={email}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry={true}
        style={styles.input}
        onChangeText={setPassword}
        value={password}
      />

      {loading ? (
        <ActivityIndicator />
      ) : (
        <TouchableOpacity style={styles.loginButton}>
          <Text style={styles.loginButtonText} onPress={handleRegister}>
            Create Account
          </Text>
        </TouchableOpacity>
      )}
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
    paddingLeft: 10,
  },
  loginButton: {
    backgroundColor: "#1e90ff",
    paddingVertical: 10,
    paddingHorizontal: 50,
    borderRadius: 5,
    margin: 5,
  },
  loginButtonText: {
    color: "white",
    fontSize: 16,
  },
});
