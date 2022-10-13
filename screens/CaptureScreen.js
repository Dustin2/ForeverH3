import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Alert,
  ToastAndroid,
} from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { TextInput, Button } from "react-native-paper";
import { Colors } from "../colors";
import { Picker } from "@react-native-picker/picker";

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
} from "firebase/firestore";

import { async } from "@firebase/util";
import { LogBox } from "react-native";

//navigation
import { useNavigation } from "@react-navigation/core";

LogBox.ignoreLogs(["Setting a timer"]);

export default function CaptureScreen() {
  const navigation = useNavigation();
  const [registeredLocation, setRegisteredLocation] = useState([]);
  useEffect(() => {
    const collectionRef = collection(db, "ubicaciones");
    const q = query(collectionRef, orderBy("createdDoc"));
    const getRegisteredLocation = [];
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      console.log("querySnapshot unsusbscribe");

      querySnapshot.docs.map((doc) => {
        const { levels, locations, spacePerLevel, createdDoc } = doc.data();
        getRegisteredLocation.push({
          id: doc.id,
          levels,
          locations,
          spacePerLevel,
          createdDoc,
        });
        // id: doc.id,
        // storeName: doc.storeName,
        // products: doc.products,
        // createdDoc: doc.createdDoc,
      });
      setRegisteredLocation(getRegisteredLocation);
    });
    return unsubscribe;
  }, []);

  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const Data = [];
  const [dataScanned, setDataScanned] = useState(Data);
  ///Update Colony
  const [selectedColony, setSelectedColony] = useState();
  const updatePickerColony = (colonySel, indexColony, name, value) => {
    handleChangeText("locations", colonySel);
    setSelectedColony(colonySel);
  };

  /// use for permission to access camera and await access if granted continue
  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getBarCodeScannerPermissions();
  }, []);
  ///change value
  const handleChangeText = (data, value) => {
    setDataScanned([...dataScanned, ([data] = value)]);
    //recibira un nombre y un valor estableciendo el nombre y valor recibido y actualizando
  };
  /// save data Scanned in state
  const handleSuccess = ({ type, data }) => {
    // setScanned(true);
    //  console.log(`  data: ${data}`);
    // dataScanned.push({ data });
    Data.push("Producto Escaneado :" + " " + data);
    //  setDataScanned();

    console.log(dataScanned);
  };
  //saveNewUser
  const saveNewProductScan = () => {
    if (
      //   store.locations === "" ||
      dataScanned === ""
    ) {
      Alert.alert("Error Campos vacios", "No se ha escaneado aun");
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
    console.log(dataScanned);
    await addDoc(collection(db, "Productos Escaneados"), {
      storeName: auth.currentUser?.email,
      products: Data,
      createdDoc: new Date(),
    });
    // setState(initialState);

    ///use this change screen after save data
    navigation.navigate("Home");

    ///serverTimestamp is used for save date to create document with firebase
  };
  /// sendData

  return (
    <ScrollView style={styles.container}>
      <View >
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleSuccess}
          // style={StyleSheet.absoluteFillObject}
          height={400}
          width={400}
        />
      </View>
      <View style={{ marginBottom: 15 }}>
        <TextInput
          disabled={true}
          mode={"outlined"}
          placeholder={"Productos escaneados:" + dataScanned}
          values={dataScanned}
          multiline={true}
          onChangeText={(value) => {
            handleChangeText("product", value);
          }}
        />
      </View>

      <View style={{ marginBottom: 30, marginTop: 30 }}>
        <Picker
          selectedValue={selectedColony}
          onValueChange={(colonySel, indexColony, name, value) =>
            updatePickerColony(colonySel, indexColony, name, value)
          }
          //value={store.locations}
        >
          <Picker.Item
            label="Selecciona el tipo de ubicacion"
            value=""
            enabled={false}
          />
          {registeredLocation.map((location) => {
            return (
              <Picker.Item
                label={location.locations}
                value={location.locations}
                key={location.id}
              />
            );
          })}
        </Picker>
        <Button
          mode="contained"
          buttonColor={Colors.success}
          onPress={() => {
            saveNewProductScan();
          }}
        >
          Guardar Productos
        </Button>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,

    // flexDirection: "column",
    // justifyContent: "center",
  },
  containerScanner: {
    backgroundColor: "#fff",
    // flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
  maintext: {
    fontSize: 16,
    margin: 20,
    marginBottom: 20,
  },
  barcodebox: {
    alignItems: "center",
    justifyContent: "center",
    height: 300,
    width: 500,
    overflow: "hidden",
    // borderRadius: 30,
    // backgroundColor: "tomato",
  },
  textInput: {
    flex: 1,
    fontSize: 20,
    color: "black",
    textAlign: "center",
    padding: 35,
    marginTop: 20,
  },
  button: {
    marginBottom: 10,
  },
});
