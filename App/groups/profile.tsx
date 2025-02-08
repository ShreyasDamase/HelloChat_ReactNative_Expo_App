import { StyleSheet, Text, View, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { FIRESTORE_DB } from "../../config/FirebaseConfig";
import { useAuth } from "../../context/AuthContext";
import { doc, getDoc } from "firebase/firestore";

// Define the UserProfile type
type UserProfile = {
  username: string;
  email: string;

  // Add more fields if needed
};

const Profile = () => {
  const { user } = useAuth(); // Authenticated user
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true); // Track loading state

  const fetchUserData = async () => {
    if (!user?.uid) return; // Ensure user exists before fetching

    setLoading(true);
    try {
      const userDocRef = doc(FIRESTORE_DB, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        setProfileData(userDoc.data() as UserProfile);
      } else {
        console.warn("User document not found in Firestore.");
        setProfileData(null);
      }
    } catch (error) {
      console.error("Error fetching user data: ", error);
    } finally {
      setLoading(false); // Stop loading after fetching
    }
  };

  // Fetch user data on component mount
  useEffect(() => {
    fetchUserData();
  }, [user]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      {loading ? (
        <Text>Loading profile...</Text>
      ) : profileData ? (
        <View>
          <Text>Name: {profileData.username}</Text>
          <Text>Email: {profileData.email}</Text>
        </View>
      ) : (
        <Text>User data not found.</Text>
      )}
      <Pressable onPress={fetchUserData} style={styles.refreshButton}>
        <Text style={styles.refreshText}>Refresh Profile</Text>
      </Pressable>
    </View>
  );
};

export default Profile;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  refreshButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#007BFF",
    borderRadius: 5,
    alignItems: "center",
  },
  refreshText: {
    color: "#fff",
    fontSize: 16,
  },
});
