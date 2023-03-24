import {
  Text,
  View,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";

import React, { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { TextInput, Button } from "react-native-paper";
import { unstable_createElement as createElement } from "react-native-web";

///externals dependences
import { Colors } from "../colors";
export default function Login({ navigation }) {
  if (auth.currentUser) {
    navigation.navigate("Inicio");
  } else {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        navigation.navigate("Inicio");
      }
    });
  }

  let [errorMessage, setErrorMessage] = useState("");
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");

  let login = () => {
    if (email !== "" && password !== "") {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          navigation.navigate("Inicio", { user: userCredential.user });
          setErrorMessage("");
          setEmail("");
          setPassword("");
        })
        .catch((error) => {
          setErrorMessage(error.message);
        });
    } else {
      setErrorMessage("Please enter an email and password");
    }
  };

  return (
    <KeyboardAvoidingView behavior={"position"} style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.title}>Hola</Text>
        <Text style={styles.subTitle}>Inicia sesión en tu cuenta</Text>
        <TextInput
          style={styles.TextInput}
          activeOutlineColor={Colors.accent}
          label={"Correo"}
          mode={"outlined"}
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.TextInput}
          activeOutlineColor={Colors.accent}
          label={"Contraseña"}
          mode={"outlined"}
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />

        <Button
          style={styles.button}
          mode="contained"
          buttonColor={Colors.primary}
          onPress={login}
        >
          Iniciar Sesion
        </Button>
        <Text style={styles.text}>¿No tienes cuenta? </Text>

        <Button
          style={styles.button}
          mode="contained"
          buttonColor={Colors.primary}
          dark={true}
          onPress={() => navigation.navigate("SignUp")}
        >
          Registarse
        </Button>
        <Button
          style={styles.button}
          mode="contained"
          buttonColor={Colors.primary}
          dark={true}
          onPress={() => navigation.navigate("ResetPassword")}
        >
          ¿ Olvidaste tu contraseña?
        </Button>
      </View>

      {/* <Button title="Login" onPress={login} color="#f7b267" /> */}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    // justifyContent: "center",
    backgroundColor: "#f1f1f1",
    marginTop: 318,
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
    marginTop: 10,
  },
  text: { fontSize: 15, color: "gray" },
  button: {
    marginTop: 15,
    marginBottom: 15,
  },
});
