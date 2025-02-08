import React, { useLayoutEffect, useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Button,
  TextInput,
  Text,
  KeyboardAvoidingView,
  Platform,
  ToastAndroid,
  SafeAreaView,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import {
  DocumentData,
  addDoc,
  collection,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  getDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { FIRESTORE_DB } from "../../config/FirebaseConfig";
import { useAuth } from "../../context/AuthContext";

const ChatPage = () => {
  const route = useRoute();
  const { id } = route.params as { id: string };
  const { user } = useAuth();
  const [messages, setMessages] = useState<DocumentData[]>([]);
  const [message, setMessage] = useState<string>("");
  const [userNames, setUserNames] = useState<{ [key: string]: string }>({});

  useLayoutEffect(() => {
    const msgCollectionRef = collection(FIRESTORE_DB, `groups/${id}/messages`);
    const q = query(msgCollectionRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return unsubscribe;
  }, [id]);

  const fetchUserName = async (userId: string) => {
    if (userNames[userId]) return userNames[userId];

    const userDocRef = doc(FIRESTORE_DB, "users", userId);
    const userDoc = await getDoc(userDocRef);

    const username = userDoc.exists()
      ? userDoc.data()?.username || "Unknown"
      : "Unknown";
    setUserNames((prev) => ({ ...prev, [userId]: username }));
    return username;
  };

  const sendMessage = async () => {
    const msg = message.trim();
    if (!msg || !user) return;
    try {
      await addDoc(collection(FIRESTORE_DB, `groups/${id}/messages`), {
        message: msg,
        sender: user.uid,
        createdAt: serverTimestamp(),
      });
      setMessage("");
    } catch (error) {
      ToastAndroid.show("Error sending message", ToastAndroid.SHORT);
    }
  };

  const deleteMessage = (messageId: string) => {
    Alert.alert(
      "Delete Message",
      "Are you sure you want to delete this message?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const msgRef = doc(
                FIRESTORE_DB,
                `groups/${id}/messages`,
                messageId
              );
              await updateDoc(msgRef, {
                message: "Message deleted",
                isDeleted: true,
              });
            } catch (error) {
              ToastAndroid.show("Failed to delete message", ToastAndroid.SHORT);
            }
          },
        },
      ]
    );
  };

  const renderMessage = ({ item }: { item: DocumentData }) => {
    if (!user) return null;
    const myMessage = item.sender === user.uid;
    const senderName = myMessage
      ? "Me"
      : userNames[item.sender] || "Loading...";

    return (
      <TouchableOpacity
        onLongPress={() => myMessage && deleteMessage(item.id)}
        style={[
          styles.messageContainer,
          myMessage
            ? styles.userMessageContainer
            : styles.otherMessageContainer,
        ]}
      >
        <Text
          style={[styles.messageText, item.isDeleted && styles.deletedText]}
        >
          {item.isDeleted ? "Message deleted" : item.message}
        </Text>
        <Text style={styles.senderName}>{senderName}</Text>
        {item.createdAt && (
          <Text style={styles.time}>
            {new Date(item.createdAt.toDate()).toLocaleTimeString()}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  useLayoutEffect(() => {
    const fetchNames = async () => {
      const names = { ...userNames };
      await Promise.all(
        messages.map(async (msg) => {
          if (!names[msg.sender]) {
            names[msg.sender] = await fetchUserName(msg.sender);
          }
        })
      );
      setUserNames(names);
    };
    fetchNames();
  }, [messages]);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={100}
      >
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
        />
        <View style={styles.inputContainer}>
          <TextInput
            multiline
            value={message}
            onChangeText={setMessage}
            placeholder="Type a message"
            style={styles.messageInput}
          />
          <Button
            disabled={message === ""}
            title="Send"
            onPress={sendMessage}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, marginTop: 20 },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    gap: 10,
    backgroundColor: "#fff",
  },
  messageInput: {
    flex: 1,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
  messageContainer: {
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 10,
    maxWidth: "80%",
  },
  userMessageContainer: { backgroundColor: "#dcf8c6", alignSelf: "flex-end" },
  otherMessageContainer: { backgroundColor: "#fff" },
  messageText: { fontSize: 16 },
  deletedText: { fontStyle: "italic", color: "gray" },
  senderName: { fontSize: 12, color: "#777", textAlign: "right", marginTop: 5 },
  time: { fontSize: 12, color: "#777", alignSelf: "flex-end" },
});

export default ChatPage;
