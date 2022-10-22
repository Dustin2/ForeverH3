//Dependencies
import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Alert,
  ToastAndroid,
  ListView,
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
  getDoc,
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
    const q = query(collectionRef, orderBy("FechaCreacion"));
    const getRegisteredLocation = [];
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      console.log("querySnapshot unsusbscribe");
      querySnapshot.docs.map((doc) => {
        const {
          Sucursal,
          ClaseTipo,
          EspacioTotal,
          EspaciosDisponibles,
          TipoDeEspacios,
          Etiqueta,
          FechaCreacion,
          UltimaUbicacion,
        } = doc.data();
        getRegisteredLocation.push({
          ID: doc.id,
          Sucursal,
          ClaseTipo,
          EspacioTotal,
          EspaciosDisponibles,
          TipoDeEspacios,
          Etiqueta,
          FechaCreacion,
          UltimaUbicacion,
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
    // handleChangeText("ss", colonySel);
    setSelectedColony(colonySel);
    // setDataScanned(selectedColony);
  };

  /// kindOfSpace
  const [kindofspace, setKindOfSpace] = useState(0);
  ///change value
  const handleChangeText = (data, value) => {
    setDataScanned([{ [data]: value }]);
    // setKindOfSpace({ [data]: value });
    // console.log(kindofspace);
    //recibira un nombre y un valor estableciendo el nombre y valor recibido y actualizando
  };
  /// barcode
  const [hasPermission, setHasPermission] = useState(null);
  const [scannedd, setScannedd] = useState(false);
  const [Data, setData] = useState([]);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getBarCodeScannerPermissions();
  }, []);

  // useEffect(() => {
  //   getDoc(doc(db, "ubicaciones", "LF7fCzuhXfnW3nrkPH7Q ")).then((res) =>
  //     console.log({ id: res.id, ...res.data() })
  //   );
  // }, []);

  const handleSuccess = ({ type, data }) => {
    //setData(dataScannedd);
    // existIn();

    setData([...Data, data]);

    setScannedd(true);
    // setData([...data,data ])
    // console.log(data)
    // const addProducts = {
    //   codeProduct: data,
    // }
    // setData([...data, addProducts])
    // console.log(addProducts)
    // console.log(data);
    // alert(`Bar code with type ${type} and data ${data} has been scanned!`);

    //   if (Data.lengt >= getRegisteredLocation.totalSpace) {
    //     Alert.alert("no es posible escanear de nuevo");
    //   } else {
    //     // Alert.alert("aun puede escanear")
    //   }
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
            console.log(dataScanned),
            ToastAndroid.show(
              "Articulos  registrados con exito!",
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
    await addDoc(collection(db, "articulos"), {
      IDUbicacion: selectedColony.ID,

      Sucursal: selectedColony.Sucursal,
      UbicacionActual: selectedColony.ClaseTipo,
      UltimaUbicacion: selectedColony.ClaseTipo,
      EspacioTotal: selectedColony.EspacioTotal,
      EspaciosDisponibles: selectedColony.EspaciosDisponibles - kindofspace,
      TipoDeEspacios: selectedColony.TipoDeEspacios,
      Etiqueta: selectedColony.Etiqueta,
      Articulos: Data,
      FechaCreacion: new Date(),
    });

    ///use this change screen after save data
    navigation.navigate("Inicio");
  };

  return (
    <ScrollView style={styles.container}>
      <View>
        <List.Section>
          <List.Accordion title=" Datos de la ubicacion seleccionada">
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
              {registeredLocation.map((location, index) => {
                return (
                  <Picker.Item
                    label={location.ClaseTipo + " (" + location.Etiqueta + ")"}
                    value={{
                      ID: location.ID,
                      Sucursal: location.Sucursal,
                      ClaseTipo: location.ClaseTipo,
                      EspacioTotal: location.EspacioTotal,
                      EspaciosDisponibles: location.EspaciosDisponibles,
                      TipoDeEspacios: location.TipoDeEspacios,
                      Etiqueta: location.Etiqueta,
                      FechaCreacion: location.FechaCreacion,
                      UltimaUbicacion: location.UltimaUbicacion,
                    }}
                    key={index}
                  />
                );
              })}
            </Picker>
            <TextInput disabled={true}>{"ID: " + selectedColony.ID}</TextInput>
            <TextInput disabled={true}>
              {"Ubicacion Actual: " +
                selectedColony.ClaseTipo +
                " (" +
                selectedColony.Etiqueta +
                " )"}
            </TextInput>
            <TextInput disabled={true}>
              {"UltimaUbicacion: " + selectedColony.UltimaUbicacion}
            </TextInput>
            <TextInput disabled={true}>
              {"Tipo de Espacio : " + selectedColony.TipoDeEspacios}
            </TextInput>
            <TextInput disabled={true}>
              {"Espacio Total: " + selectedColony.EspacioTotal}
            </TextInput>
            <TextInput disabled={true}>
              {"Espacios Disponibles: " + selectedColony.EspaciosDisponibles}
            </TextInput>

            {/* 
            <TextInput disabled={true}>
              {"Fecha de creacion: " + selectedColony.FechaCreacion}
            </TextInput> */}

            {/* <TextInput disabled={true}>{selectedColony.createdDoc}</TextInput> */}
          </List.Accordion>
          <List.Accordion title=" Datos a escanear">
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
            {console.log(kindofspace)}
            {Data.map((items, index, index2) => {
              return (
                // <List.Item title={"Articulo escaneado :" + items} key={index}>
                <View>
                  <TextInput editable={false} key={index}>
                    {"articulo escaneado " + items}
                  </TextInput>
                  <TextInput
                    label={"espacios que ocupa"}
                    keyboardType="numeric"
                    key={index2}
                    onChangeText={(value) => {
                      setKindOfSpace(value);
                    }}
                  ></TextInput>
                </View>

                // </List.Item>
              );
            })}
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
