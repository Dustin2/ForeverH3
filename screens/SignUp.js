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
    } else {
      setValidationMessage("");
    }

    setValue(value);
  };

  let signUp = () => {
    if (password === confirmPassword) {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          sendEmailVerification(auth.currentUser);
          navigation.navigate("Inicio", { user: userCredential.user });
        })
        .catch((error) => {
          setValidationMessage(error.message);
        });
    }
  };

  return (
    <KeyboardAvoidingView behavior={"position"} style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.title}>Registarse</Text>
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
      </View>
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
