///Dependencies
import react, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  Alert,
  ToastAndroid,
} from "react-native";
//External dependencies
import {
  TextInput,
  Button,
  ProgressBar,
  MD3Colors,
  ActivityIndicator,
  MD2Colors,
} from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { Colors } from "../colors";

//Auth firebase
import { auth, db } from "../firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  querySnapshot,
  doc,
  where,
  getDocs,
} from "firebase/firestore";
/// this delate alert of warning of time firebase

import { LogBox } from "react-native";
// import { async } from "@firebase/util";
//navigation
import { useNavigation } from "@react-navigation/core";

LogBox.ignoreLogs(["Setting a timer"]);

const LocationsScreen = () => {
  const [registeredLocation, setRegisteredLocation] = useState([]);
  useEffect(() => {
    const collectionRef = collection(db, "ubicaciones");
    const q = query(collectionRef, orderBy("createdDoc"));
    const getRegisteredLocation = [];
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      console.log("querySnapshot unsusbscribe");

      querySnapshot.docs.map((doc) => {
        const { createdDoc, locations, totalSpace, customLabel, storeName } =
          doc.data();
        getRegisteredLocation.push({
          id: doc.id,
          locations,
          totalSpace,
          customLabel,
          storeName,
          createdDoc,
        });
      });
      setRegisteredLocation(getRegisteredLocation);
      console.log(getRegisteredLocation.id);
    });
    return unsubscribe;
  }, []);


  //state
  const [store, setStore] = useState({
    locations: "",
    totalSpace: "",
    customLabel: "",
    spacesAvailable: "",
    storeName: auth.currentUser?.email,
    kindOfSpace: "",
  });
  const navigation = useNavigation();

  const handleChangeText = (name, value) => {
    setStore({ ...store, [name]: value });
    //recibira un nombre y un valor estableciendo el nombre y valor recibido y actualizando
  };

  //saveNewUser

  const saveNewLocation = () => {
    // const q = query(
    //   collection(db, "ubicaciones"),
    //   where("Etiqueta", "==", true)
    // );

    // if (q === true) {
    //   console.log("error ya existe");
    // }
    if (
      (store.locations === "" || store.totalSpace === "",
      store.customLabel === "",
      store.locations === "")
    ) {
      Alert.alert(
        "Error Campos invalidos",
        "Porfavor completa todos los campos"
      );
    } else {
      Alert.alert("Confirmar", "Desea guardar los cambios actuales?", [
        {
          text: "Cancelar",
          onPress: () => ToastAndroid.show("cancel!", ToastAndroid.SHORT),
          style: "cancelado",
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
      Sucursal: auth.currentUser?.email,
      ClaseTipo: store.locations,
      EspacioTotal: store.totalSpace,
      EspaciosDisponibles: store.totalSpace,
      TipoDeEspacios: store.kindOfSpace,
      Etiqueta: store.customLabel,
      FechaCreacion: new Date(),
      UltimaUbicacion: store.locations,
    });
    // setState(initialState);

    ///use this change screen after save data

    navigation.navigate("Inicio");
    // startLoading();
    ///serverTimestamp is used for save date to create document with firebase
  };
  /// sendData


  ///Update picker location
  const [selectedColony, setSelectedColony] = useState();
  const updatePickerColony = (colonySel, indexColony, name, value) => {
    handleChangeText("locations", colonySel);

    setSelectedColony(colonySel);
  };

  ///Update picker kind of space
  const [selectedColony1, setSelectedColony1] = useState();
  const updatePickerColony1 = (colonySel1, indexColony1, name, value) => {
    handleChangeText("kindOfSpace", colonySel1);

    setSelectedColony1(colonySel1);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.inputGroup}>
        <Text style={styles.subTitle}>Sucursal: {auth.currentUser?.email}</Text>
      </View>
      {/* picker locations */}
      <View style={styles.inputGroup}>
        <Picker
          selectedValue={selectedColony}
          onValueChange={(colonySel, indexColony, name, value) =>
            updatePickerColony(colonySel, indexColony, name, value)
          }
          value={store.locations}
          mode={"dialog"}
        >
          <Picker.Item
            label="Selecciona el tipo de ubicacion"
            value=""
            enabled={false}
          />
          <Picker.Item label="Anaquel" value="Anaquel" />
          <Picker.Item label="Carrusel" value="Carrusel" />
          <Picker.Item label="Pared" value="Pared" />
          <Picker.Item label="piramide" value="piramide" />
        </Picker>
      </View>
      {/* picker tipo de espacios */}
      <View style={styles.inputGroup}>
        <Picker
          selectedValue={selectedColony1}
          onValueChange={(colonySel1, indexColony1, name, value) =>
            updatePickerColony1(colonySel1, indexColony1, name, value)
          }
          value={store.kindOfSpace}
          mode={"dialog"}
        >
          <Picker.Item
            label="Selecciona el tipo de espacio"
            value=""
            enabled={false}
          />
          <Picker.Item label="Bachoco" value="Bachoco" />
          <Picker.Item label="Gancho" value="Gancho" />
          <Picker.Item label="Area" value="Area" />
        </Picker>
      </View>
      <View style={styles.inputGroup}>
        <TextInput
          style={styles.TextInput}
          activeOutlineColor={Colors.accent}
          label={"Etiqueta"}
          mode={"outlined"}
          value={store.customLabel}
          onChangeText={(value) => {
            handleChangeText("customLabel", value);
          }}
        />
      </View>
      <View style={styles.inputGroup}>
        <TextInput
          style={styles.TextInput}
          activeOutlineColor={Colors.accent}
          label={"Ingresa el total de espacios "}
          mode={"outlined"}
          value={store.totalSpace}
          keyboardType={"numeric"}
          onChangeText={(value) => {
            handleChangeText("totalSpace", value);
          }}
        />
      </View>
      {/* <ActivityIndicator
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        animating={showActivity}
        color={MD2Colors.green600}
        size={"large"}
      /> */}

      <View style={styles.inputGroup}>
        <Button
          mode="contained"
          buttonColor={Colors.success}
          //color={"green"}
          style={styles.button}
          onPress={() => {
            saveNewLocation();
            // startLoading();
          }}
          icon="cloud-upload"
        >
          Guardar
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 35,
    textAlign: "center",
    backgroundColor: "#eaeac2",
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
    marginTop: 15,
    marginBottom: 15,
  },
  textInput: { fontSize: 16 },
  title: {
    fontSize: 30,
    color: "#181818",
    fontWeight: "bold",
  },
  subTitle: {
    fontSize: 20,
    color: "gray",
  },
});

export default LocationsScreen;
