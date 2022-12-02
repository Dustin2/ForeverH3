import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { Button } from "react-native-paper";
import { Colors } from "../colors";

//navigation
import { useNavigation } from "@react-navigation/core";
//Auth firebase
import { auth } from "../firebase";

const SettingsScreen = () => {
  const navigation = useNavigation();

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.replace("Login");
      })
      .catch((error) => alert(error.message));
  };
  return (
    <View style={{alignItems:"flex-end"}}>
      {/* <Text>ajustes</Text> */}
      <Button
        mode="contained"
        buttonColor={Colors.error}
        styles={styles.button}
        onPress={handleSignOut}
      >
        Finalizar Sesion
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  button:{
    marginBottom:20,
    marginTop:20,
    alignContent:"center"
  },
});

export default SettingsScreen;
