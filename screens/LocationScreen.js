///Dependencies
import react, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Button,
  Text,
  Alert,
  ToastAndroid,
} from "react-native";
//External dependencies
import { TextInput } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import { Colors } from "../colors";
//Auth firebase
import { auth } from "../firebase";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { async } from "@firebase/util";
import { LogBox } from "react-native";

//navigation
import { useNavigation } from "@react-navigation/core";

LogBox.ignoreLogs(["Setting a timer"]);

const LocationsScreen = () => {
  //state
  const initialState = {};
  const [store, setStore] = useState({
    locations: "",
    spacePerLevel: "",
    levels: "",
    storeName: auth.currentUser?.email,
  });
  const navigation = useNavigation();

  //   const pickerRef = useRef();

  //   function open() {
  //     pickerRef.current.focus();
  //   }

  //   function close() {
  //     pickerRef.current.blur();
  //   }

  const handleChangeText = (name, value) => {
    setStore({ ...store, [name]: value });
    //recibira un nombre y un valor estableciendo el nombre y valor recibido y actualizando
  };

  //saveNewUser

  const saveNewLocation = () => {
    if (
      //   store.locations === "" ||
      store.levels === "" ||
      store.spacePerLevel === ""
    ) {
      Alert.alert(
        "Error Campos invalidos",
        "Porfavor copleta todos los campos"
      );
    } else {
      Alert.alert("Confirmar", "Desea guardar los cambios actuales?", [
        {
          text: "Cancelar",
          onPress: () => ToastAndroid.show("cancel!", ToastAndroid.SHORT),
          style: "cancel",
        },
        {
          text: "Guardar",
          onPress: () => (
            sendData(),
            ToastAndroid.show(
              "Ubicacion registrada con exito!",
              ToastAndroid.SHORT
            )
          ),
          style: "success",
        },
      ]);
    }
  }; //end saveNewUser
  ///sendData to firebase
  const sendData = async () => {
    console.log(store);

    await addDoc(collection(db, "ubicaciones"), {
      storeName: auth.currentUser?.email,
      levels: store.levels,
      locations: store.locations,
      spacePerLevel: store.spacePerLevel,
      createdDoc: new Date(),
    });
    // setState(initialState);

    ///use this change screen after save data
    navigation.navigate("Home");

    ///serverTimestamp is used for save date to create document with firebase
  };
  /// sendData

  ///Update Colony
  const [selectedColony, setSelectedColony] = useState();
  const updatePickerColony = (colonySel, indexColony, name, value) => {
    handleChangeText("locations", colonySel);

    setSelectedColony(colonySel);
  };
  return (
    <ScrollView style={styles.container}>
      <View style={styles.inputGroup}>
        <Text style={styles.textInput}>{auth.currentUser?.email}</Text>
      </View>
      <View>
        <TextInput
          style={styles.TextInput}
          activeOutlineColor={Colors.accent}
          label={"Etiqueta"}
          mode={"outlined"}
          //value={{}}
          
        />
      </View>
      <View style={styles.inputGroup}>
        {/* <Text style={styles.textInput}> Ubicaciones Disponibles</Text> */}
        <Picker
          selectedValue={selectedColony}
          onValueChange={(colonySel, indexColony, name, value) =>
            updatePickerColony(colonySel, indexColony, name, value)
          }
          value={store.locations}
        >
          <Picker.Item
            label="Selecciona el tipo de ubicacion"
            value=""
            enabled={false}
          />
          <Picker.Item label="bachoco" value="bachoco" />
          <Picker.Item label="piramide" value="piramide" />
          <Picker.Item label="pared" value="pared" />
          <Picker.Item label="Frente" value="pared" />
        </Picker>
      </View>
      <View style={styles.inputGroup}>
        <TextInput
          label={"Ingresa el total de espacios "}
          //   editable={false}
          mode={"outlined"}
          value={store.spacePerLevel}
          keyboardType={"numeric"}
          onChangeText={(value) => {
            handleChangeText("spacePerLevel", value);
          }}
        />
      </View>

      <View style={styles.inputGroup}>
        <TextInput
          label={" espacios disponibles "}
          //   editable={false}
          mode={"outlined"}
          value={store.levels}
          keyboardType={"numeric"}
          onChangeText={(value) => {
            handleChangeText("levels", value);
          }}
        />
      </View>

      {/* <View style={styles.inputGroup}>
        <Button title="Agregar " style={styles.button} />
      </View> */}
      <View style={styles.inputGroup}>
        <Button
          title="Guardar "
          color={"green"}
          style={styles.button}
          onPress={() => {
            saveNewLocation();
          }}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 35,
    textAlign: "center",

    //  backgroundColor: '#d3d3d3',
  },
  inputGroup: {
    flex: 1,
    padding: 1,
    marginBottom: 10,
    fontSize: 17,
    marginBottom: 10,
    marginEnd: 10,
  },
  button: {
    marginBottom: 10,
  },
  textInput: { fontSize: 16 },
});

export default LocationsScreen;
