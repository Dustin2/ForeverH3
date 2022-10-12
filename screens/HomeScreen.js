//Dependencies
import React, { useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import { TextInput, Button } from "react-native-paper";

///Navigation
import { useNavigation } from "@react-navigation/core";

<<<<<<< HEAD
=======

>>>>>>> 8299afbdeedb88061cf7933e5e3e88859e78f875
//Auth firebase
import { auth } from "../firebase";

const HomeScreen = () => {
  const navigation = useNavigation();

  const initialState = {};
  const [store, setStore] = useState();
  const [user, setUser] = useState(initialState);
  const pickerRef = useRef();

  function open() {
    pickerRef.current.focus();
  }

  function close() {
    pickerRef.current.blur();
  }
  return (
    <ScrollView style={styles.container}>
      <View>
        <Text style={styles.textInput}>
          Bienvenido: {auth.currentUser?.email}
        </Text>
      </View>
      <View style={styles.inputGroup}>
<<<<<<< HEAD
        <Button
          styles={{ marginBottom: 10 }}
          mode="contained"
          onPress={() => navigation.navigate("Locations")}
        >
=======
        <Button styles={{ marginBottom: 10 }} mode="contained"
        onPress={()=>navigation.navigate("Locations")}>
>>>>>>> 8299afbdeedb88061cf7933e5e3e88859e78f875
          Ubicaciones
        </Button>
      </View>
      <View style={styles.inputGroup}>
<<<<<<< HEAD
        <Button
          styles={{ marginBottom: 10 }}
          mode="contained"
          onPress={() => navigation.navigate("Capture")}
        >
=======
        <Button styles={{ marginBottom: 10 }} mode="contained"
        onPress={()=>navigation.navigate("Capture")}>
>>>>>>> 8299afbdeedb88061cf7933e5e3e88859e78f875
          Captura
        </Button>
      </View>
      <View style={styles.inputGroup}>
<<<<<<< HEAD
        <Button
          styles={styles.button}
          mode="contained"
          onPress={() => navigation.navigate("Changes")}
        >
          Cambios
        </Button>
      </View>
      {/* <View style={styles.inputGroup}>
        <Button
          styles={styles.button}
          mode="contained"
          onPress={() => navigation.navigate("")}
        >
          Historial de cambios
        </Button>
        </View> */}

=======
        <Button styles={styles.button} mode="contained"
         onPress={() => navigation.navigate("Changes")}>
          Cambios
        </Button>
      </View>
>>>>>>> 8299afbdeedb88061cf7933e5e3e88859e78f875
      <View style={styles.inputGroup}>
        <Button
          styles={styles.button}
          mode="contained"
          onPress={() => navigation.navigate("Settings")}
        >
<<<<<<< HEAD
          Configuracion
        </Button>
      </View>
      <View style={styles.inputGroup}>
        <Button
          styles={styles.button}
          mode="contained"
          onPress={() => navigation.navigate("Historial")}
        >
          Historial
        </Button>
        </View>
=======
          Historial de cambios
        </Button>
        </View>
        <View style={styles.inputGroup}>
        <Button
          styles={styles.button}
          mode="contained"
          onPress={() => navigation.navigate("Change")}
        >
          Configuracion
        </Button>
      </View>
>>>>>>> 8299afbdeedb88061cf7933e5e3e88859e78f875
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 35,

    //  backgroundColor: '#d3d3d3',
  },
  inputGroup: {
    flex: 1,
    padding: 1,
    marginBottom: 10,
    borderBottomColor: "#cccccc",
    fontSize: 17,
    marginBottom: 10,
    marginEnd: 10,
  },
  button: {
    marginBottom: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 18,
    textAlign: "center",
    marginBottom: 50,
  },
});
