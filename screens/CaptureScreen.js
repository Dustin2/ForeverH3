//Dependencies
import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Alert,
  ToastAndroid,
} from "react-native";

///external dependencies
import { BarCodeScanner } from "expo-barcode-scanner";
import { TextInput, Button, List } from "react-native-paper";
import { Colors } from "../colors";
import { Picker } from "@react-native-picker/picker";
import moment from "moment";
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
LogBox.ignoreLogs(["Setting a timer"]);

//navigation
import { useNavigation } from "@react-navigation/core";

export default function CaptureScreen() {
  //use for navigate in app
  const navigation = useNavigation();

  //hook for get data (locations registered) before load UI
  const [registeredLocation, setRegisteredLocation] = useState([]);
  useEffect(() => {
    const collectionRef = collection(db, "ubicaciones");
    const q = query(collectionRef, orderBy("createdDoc"));
    const getRegisteredLocation = [];
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      console.log("querySnapshot unsusbscribe");
      querySnapshot.docs.map((doc) => {
        const { locations, customLabel, totalSpace, createdDoc } = doc.data();
        getRegisteredLocation.push({
          id: doc.id,
          customLabel,
          locations,
          totalSpace: totalSpace,
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

  ///use for expanded accordion
  const [expanded, setExpanded] = useState(true);
  const handlePress = () => setExpanded(!expanded);

  //data saved in state
  const [dataScanned, setDataScanned] = useState([]);
  //update picker data
  const [selectedColony, setSelectedColony] = useState([]);
  const DataSelected = [];
  const updatePickerColony = (colonySel, indexColony, name, value) => {
    handleChangeText("locations", colonySel);
    setSelectedColony(colonySel);
    DataSelected.push(selectedColony);
  };

  ///change value
  const handleChangeText = (data, value) => {
    setDataScanned([{ ...dataScanned, [data]: value }]);
    //recibira un nombre y un valor estableciendo el nombre y valor recibido y actualizando
  };
  /// barcode
  const dataScannedd = [];
  const [hasPermission, setHasPermission] = useState(null);
  const [scannedd, setScannedd] = useState(false);
  const [data, setData] = useState(dataScannedd);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleSuccess = ({ type, data }) => {
    dataScannedd.push( "Producto Escaneado :" + " " + data );
     //setData(dataScannedd);
    setScannedd(true);
    // console.log(data);
    // alert(`Bar code with type ${type} and data ${data} has been scanned!`);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

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
      info:dataScanned,
      products:  data ,
      createdDoc: new Date(),
    });
    // setState(initialState);
  // /// use for permission to access camera and await access if granted continue
  // useEffect(() => {
  //   const getBarCodeScannerPermissions = async () => {
  //     const { status } = await BarCodeScanner.requestPermissionsAsync();
  //     setHasPermission(status === "granted");
  //   };

    ///use this change screen after save data
    navigation.navigate("Inicio");
  }
  return (
    <ScrollView style={styles.container}>
      <View style={styles.inputGroup}>
        <Picker
          selectedValue={selectedColony}
          onValueChange={(colonySel, indexColony, name, value) =>
            updatePickerColony(colonySel, indexColony, name, value)
          }
        >
          <Picker.Item
            label="Selecciona la de ubicacion"
            value=""
            enabled={false}
          />
          {registeredLocation.map((location) => {
            return (
              <Picker.Item
                label={location.locations + " (" + location.customLabel + ")"}
                value={{
                  id: location.id,
                  location: location.locations,
                  label: location.customLabel,
                  totalSpace: location.totalSpace,
                  createdDoc: location.createdDoc,
                }}
                key={location.id}
              />
            );
          })}
        </Picker>
      </View>
      <View>
        <List.Section title="Datos de la ubicacion seleccionada">
          <List.Accordion
            title=" Datos"
            left={(props) => <List.Icon {...props} icon="folder" />}
          >
            <TextInput disabled={true}>{"ID: " + selectedColony.id}</TextInput>
            <TextInput disabled={true}>
              {"Ubicacion: " + selectedColony.location}
            </TextInput>
            <TextInput disabled={true}>
              {"Etiqueta: " + selectedColony.label}
            </TextInput>
            <TextInput disabled={true}>
              {"Espacio Disponible: " + selectedColony.totalSpace}
            </TextInput>
            {/* <TextInput disabled={true}>{selectedColony.createdDoc}</TextInput> */}
          </List.Accordion>
        </List.Section>
        <List.Section title="Datos a escanear">
          <List.Accordion title=" Datos">
            {/* <List.Item title="" ></List.Item> */}
            <BarCodeScanner
              onBarCodeScanned={scannedd ? undefined : handleSuccess}
              // style={StyleSheet.absoluteFillObject}
              height={400}
              width={370}
            />
            {scannedd && (
              <Button
                mode="contained"
                buttonColor={Colors.success}
                onPress={() => {
                  setScannedd(false);
                }}
              >
                Escanear de nuevo
              </Button>
            )}
            {/* <TextInput
             // disabled={true}
              mode={"outlined"}
              label={"Productos escaneados:"}
              values={dataScanned}
              multiline={true}
              onChangeText={(value) => {
                handleChangeText("product", value);
              }}
            /> */}
          </List.Accordion>
        </List.Section>
      </View>

      <View style={styles.inputGroup}>
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
    flex: 1,
    padding: 20,

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
  inputGroup: {
    flex: 1,
    padding: 1,
    marginBottom: 10,
    borderBottomColor: "#cccccc",
    fontSize: 17,
    marginBottom: 10,
    marginEnd: 10,
    marginBottom: 30,
    marginTop: 30,
  },
});
