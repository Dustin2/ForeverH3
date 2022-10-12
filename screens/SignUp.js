<<<<<<< HEAD
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
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";

///externals dependences
import { Colors } from "../colors";
import symbolicateStackTrace from "react-native/Libraries/Core/Devtools/symbolicateStackTrace";

export default function SignUp({ navigation }) {
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [confirmPassword, setConfirmPassword] = useState("");
  let [validationMessage, setValidationMessage] = useState("");

  let validateAndSet = (value, valueToCompare, setValue) => {
    if (value !== valueToCompare) {
      setValidationMessage("Contrasena no coinciden");
=======
import { Text, View, TextInput, ImageBackground, Button, KeyboardAvoidingView, Platform } from 'react-native';
import AppStyles from '../styles/AppStyles';
import InlineTextButton from '../components/InlineTextButton';
import React from 'react';
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";

export default function SignUp({ navigation }) {
  const background = require("../assets/background.jpg");

  let [email, setEmail] = React.useState("");
  let [password, setPassword] = React.useState("");
  let [confirmPassword, setConfirmPassword] = React.useState("");
  let [validationMessage, setValidationMessage] = React.useState("");

  let validateAndSet = (value, valueToCompare, setValue) => {
    if (value !== valueToCompare) {
      setValidationMessage("Passwords do not match.");
>>>>>>> 8299afbdeedb88061cf7933e5e3e88859e78f875
    } else {
      setValidationMessage("");
    }

    setValue(value);
  };

  let signUp = () => {
    if (password === confirmPassword) {
      createUserWithEmailAndPassword(auth, email, password)
<<<<<<< HEAD
        .then((userCredential) => {
          sendEmailVerification(auth.currentUser);
          navigation.navigate("Home", { user: userCredential.user });
        })
        .catch((error) => {
          setValidationMessage(error.message);
        });
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : null}
        keyboardVerticalOffset={60}
      >
        <Text style={styles.title}>Sign Up</Text>
        <Text>{validationMessage}</Text>
        <TextInput
          label={"Correo"}
          style={styles.TextInput}
          activeOutlineColor={Colors.accent}
          mode={"outlined"}
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          label={"Contraseña"}
          style={styles.TextInput}
          activeOutlineColor={Colors.accent}
          mode={"outlined"}
          secureTextEntry={true}
          value={password}
          onChangeText={(value) =>
            validateAndSet(value, confirmPassword, setPassword)
          }
        />
        <TextInput
          label="Confirmar Contraseña"
          secureTextEntry={true}
          value={confirmPassword}
          style={styles.TextInput}
          activeOutlineColor={Colors.accent}
          mode={"outlined"}
          onChangeText={(value) =>
            validateAndSet(value, password, setConfirmPassword)
          }
        />

        <Button
          style={styles.button}
          buttonColor={Colors.secondary}
          mode="contained"
          title="Sign Up"
          onPress={signUp}
        >
          Registrarse
        </Button>
        <View>
          <Text>Ya tienes cuenta? </Text>
          <Button
            style={styles.button}
            mode="contained"
            buttonColor={Colors.primary}
            onPress={() => navigation.popToTop()}
          >
            Iniciar
          </Button>
        </View>
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
    marginBottom: 12,
    marginTop: 20,
  },
  text: { fontSize: 15, color: "gray" },
  button: {
    marginTop: 15,
    marginBottom: 15,
  },
});
=======
      .then((userCredential) => {
        sendEmailVerification(auth.currentUser);
        navigation.navigate("ToDo", { user: userCredential.user });
      })
      .catch((error) => {
        setValidationMessage(error.message);
      });
    }
  }

  return (
    <ImageBackground style={AppStyles.imageContainer} source={background}>
      <KeyboardAvoidingView 
        style={AppStyles.backgroundCover} 
        behavior={Platform.OS === "ios" ? "padding" : null}
        keyboardVerticalOffset={60}>
        <Text style={[AppStyles.lightText, AppStyles.header]}>Sign Up</Text>
        <Text style={[AppStyles.errorText]}>{validationMessage}</Text>
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
          onChangeText={(value) => validateAndSet(value, confirmPassword, setPassword)} />
        <TextInput 
          style={[AppStyles.textInput, AppStyles.lightTextInput, AppStyles.lightText]} 
          placeholder='Confirm Password' 
          placeholderTextColor="#BEBEBE" 
          secureTextEntry={true} 
          value={confirmPassword} 
          onChangeText={(value) => validateAndSet(value, password, setConfirmPassword)} />
        <View style={[AppStyles.rowContainer, AppStyles.topMargin]}>
          <Text style={AppStyles.lightText}>Already have an account? </Text>
          <InlineTextButton text="Login" onPress={() => navigation.popToTop()} />
        </View>
        <Button title="Sign Up" onPress={signUp} color="#f7b267" />
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}


>>>>>>> 8299afbdeedb88061cf7933e5e3e88859e78f875
