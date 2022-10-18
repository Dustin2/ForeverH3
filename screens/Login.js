import {
  Text,
  View,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";

import React, { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { TextInput, Button } from "react-native-paper";
import { unstable_createElement as createElement } from 'react-native-web'; 

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
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>Hola</Text>
        <Text style={styles.subTitle}>Inicia sesión en tu cuenta</Text>
      </View>
      <View>
        <TextInput
          style={styles.TextInput}
          activeOutlineColor={Colors.accent}
          label={"Correo"}
          mode={"outlined"}
          value={email}
          onChangeText={setEmail}
        />
      </View>
      <View>
        <TextInput
          style={styles.TextInput}
          activeOutlineColor={Colors.accent}
          label={"Contraseña"}
          mode={"outlined"}
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />
      </View>
      <View>
        {/* <Text style={styles.text}>¿Olvidaste tu Contraseña?</Text> */}
      </View>
      <View>
        <Button
          style={styles.button}
          mode="contained"
          buttonColor={Colors.primary}
          onPress={login}
        >
          Iniciar Sesion
        </Button>
        <View>
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
        </View>
        <View>
          <Button
            style={styles.button}
            mode="contained"
            buttonColor={Colors.primary}
            dark={true}
            onPress={() => navigation.navigate("ResetPassword")}
          >
            Olvidaste tu contrasena?
          </Button>
        </View>
        {/* <Button title="Login" onPress={login} color="#f7b267" /> */}
      </View>
    </View>

    /* <KeyboardAvoidingView 
        style={AppStyles.backgroundCover} 
        behavior={Platform.OS === "ios" ? "padding" : null}
        keyboardVerticalOffset={60}>
        <Text style={[AppStyles.lightText, AppStyles.header]}>Login</Text>
        <Text style={AppStyles.errorText}>{errorMessage}</Text>
        <TextInput 
          style={[AppStyles.textInput, AppStyles.lightTextInput, AppStyles.lightText]} 
          placeholder='Email' 
          placeholderTextColor="#BEBEBE"
          value={email}
          onChangeText={setEmail} />
        <TextInput 
          style={[AppStyles.textInput, AppStyles.lightTextInput, AppStyles.lightText]} 
          placeholder='Password' 
          placeholderTextColor="#BEBEBE" 
          secureTextEntry={true} 
          value={password} 
          onChangeText={setPassword} />
       
      </KeyboardAvoidingView> */
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
