import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  DocumentData,
  addDoc,
  collection,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { FIRESTORE_DB } from "../../config/FirebaseConfig";
import { useAuth } from "../../context/AuthContext";

const GroupsPage = ({ navigation }: { navigation: any }) => {
  const [groups, setGroups] = useState<DocumentData[]>([]);
  const { user } = useAuth();

  // States for modal and form inputs
  const [groupModalVisible, setGroupModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // Prevents duplicate creation

  useEffect(() => {
    const ref = collection(FIRESTORE_DB, "groups");
    const unsubscribe = onSnapshot(ref, (snapshot) => {
      const groupsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setGroups(groupsData);
    });

    return unsubscribe;
  }, []);

  const startGroup = async () => {
    if (!user) {
      console.error("User is not logged in");
      return;
    }

    if (!groupName.trim() || !groupDescription.trim()) {
      Alert.alert("Error", "Group name and description cannot be empty!");
      return;
    }

    if (loading) return; // Prevents multiple submissions

    try {
      setLoading(true); // Start loading
      const groupsCollectionRef = collection(FIRESTORE_DB, "groups");
      await addDoc(groupsCollectionRef, {
        name: groupName.trim(),
        description: groupDescription.trim(),
        creator: user.uid,
      });

      // Reset input fields and close modal
      setGroupName("");
      setGroupDescription("");
      setGroupModalVisible(false);
      Alert.alert("Success", "Group created successfully!");
    } catch (error) {
      console.error("Error creating group", error);
      Alert.alert("Error", "Failed to create group");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const deleteGroup = async () => {
    if (selectedGroupId) {
      try {
        const groupRef = doc(FIRESTORE_DB, "groups", selectedGroupId);
        await deleteDoc(groupRef);
        setSelectedGroupId(null);
        setDeleteModalVisible(false);
        Alert.alert("Success", "Group deleted successfully");
      } catch (error) {
        console.error("Error deleting group", error);
        Alert.alert("Error", "Failed to delete group");
      }
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {groups.map((group) => (
          <TouchableOpacity
            key={group.id}
            style={styles.groupCard}
            onPress={() => navigation.navigate("ChatPage", { id: group.id })}
            onLongPress={() => {
              setSelectedGroupId(group.id);
              setDeleteModalVisible(true);
            }}
          >
            <Text style={styles.groupName}>{group.name}</Text>
            <Text style={styles.groupDescription}>{group.description}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Floating Action Button to open modal for creating a new group */}
      <Pressable style={styles.fab} onPress={() => setGroupModalVisible(true)}>
        <Ionicons name="add" size={24} color="white" />
      </Pressable>

      {/* Modal for group creation */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={groupModalVisible}
        onRequestClose={() => setGroupModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create a New Group</Text>
            <TextInput
              style={styles.input}
              placeholder="Group Name"
              value={groupName}
              onChangeText={setGroupName}
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Group Description"
              value={groupDescription}
              onChangeText={setGroupDescription}
              multiline
            />
            <View style={styles.modalActions}>
              <Pressable
                style={[styles.button, styles.cancelButton]}
                onPress={() => setGroupModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.createButton]}
                onPress={startGroup}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.buttonText}>Create</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal for delete confirmation */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={deleteModalVisible}
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Deletion</Text>
            <Text style={styles.text}>
              Are you sure you want to delete this group?
            </Text>
            <View style={styles.modalActions}>
              <Pressable
                style={[styles.button, styles.cancelButton]}
                onPress={() => setDeleteModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.deleteButton]}
                onPress={deleteGroup}
              >
                <Text style={styles.buttonText}>Delete</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default GroupsPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fab: {
    position: "absolute",
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    right: 20,
    bottom: 20,
    backgroundColor: "#03A9F4",
    borderRadius: 30,
    elevation: 8,
  },
  groupCard: {
    padding: 15,
    backgroundColor: "#fff",
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
    elevation: 3,
  },
  createButton: {
    backgroundColor: "#4CAF50",
  },

  groupName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  groupDescription: {
    fontSize: 14,
    color: "#777",
  },
  button: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#f44336",
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  text: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: "#e91e63",
  },
});
