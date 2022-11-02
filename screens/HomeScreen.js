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

//Auth firebase
import { auth } from "../firebase";
import { Colors } from "../colors";

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
        <Button
          styles={{ marginBottom: 10 }}
          mode="contained"
          onPress={() => navigation.navigate("Ubicaciones")}
          icon="map-marker-plus"
          buttonColor={Colors.secondary}
        >
          Agregar Ubicacion
        </Button>
      </View>
      <View style={styles.inputGroup}>
        <Button
          styles={{ marginBottom: 10 }}
          mode="contained"
          onPress={() => navigation.navigate("Escaneo de productos")}
          icon="barcode-scan"
          buttonColor={Colors.secondary}
        >
          Escaneo de Productos
        </Button>
      </View>
      <View style={styles.inputGroup}>
        <Button
          styles={styles.button}
          mode="contained"
          onPress={() => navigation.navigate("Cambio de ubicacion")}
          icon="map-marker-right"
          buttonColor={Colors.secondary}
        >
          Cambio de Ubicacion
        </Button>
      </View>

      <View style={styles.inputGroup}>
        <Button
          styles={styles.button}
          mode="contained"
          onPress={() => navigation.navigate("Historial")}
          icon="clock"
          buttonColor={Colors.secondary}
        >
          Historial
        </Button>
      </View>
      <View style={styles.inputGroup}>
        <Button
          styles={styles.button}
          mode="contained"
          onPress={() => navigation.navigate("Settings")}
          icon="cog"
          buttonColor={Colors.secondary}
        >
          Configuracion
        </Button>
      </View>
      {/* 
      <View style={styles.inputGroup}>
        <Button
          styles={styles.button}
          mode="contained"
          onPress={() => navigation.navigate("ManageAccount")}
        >
          ManageAccount
        </Button>
      </View> */}
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 35,

    // backgroundColor: Colors.secondary,
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
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
});
