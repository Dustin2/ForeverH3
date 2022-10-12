//Dependecies
import React, { useState } from "react";
import {
  Text,
  View,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { TextInput, Button } from "react-native-paper";
//firebase
import { auth } from "../firebase";
import { sendPasswordResetEmail } from "firebase/auth";

///externals dependences
import { Colors } from "../colors";

export default function ResetPassword({ navigation }) {
  let [email, setEmail] = useState("");
  let [errorMessage, setErrorMessage] = useState("");

  let resetPassword = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        navigation.popToTop();
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : null}
        keyboardVerticalOffset={60}
      >
        <Text style={styles.title}>Reset Password</Text>
        <Text>{errorMessage}</Text>
        <TextInput
          style={styles.TextInput}
          activeOutlineColor={Colors.accent}
          label={"correo"}
          mode={"outlined"}
          value={email}
          onChangeText={setEmail}
        />
        <View>
          <Text>No tienes cuenta? </Text>
          <Button
            style={styles.button}
            mode="contained"
            buttonColor={Colors.primary}
            onPress={() => navigation.navigate("SignUp")}
          >
            Registarse
          </Button>
        </View>
        <Button
          style={styles.button}
          mode="contained"
          buttonColor={Colors.secondary}
          onPress={resetPassword}
        >
          Recuperar Contraseña
        </Button>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 35,
    // justifyContent: "center",
    backgroundColor: "#f1f1f1",
    marginTop: 200,
  },

  title: {
    fontSize: 30,
    color: "#181818",
    fontWeight: "bold",
  },
  subTitle: {
    fontSize: 20,
    color: "gray",
  },

  TextInput: {
    marginBottom: 15,
    marginTop: 22,
  },
  text: { fontSize: 15, color: "gray" },
  button: {
    marginTop: 15,
    marginBottom: 15,
  },
});
