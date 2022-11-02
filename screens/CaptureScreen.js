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
  /// barcode
  const [hasPermission, setHasPermission] = useState(null);
  const [scannedd, setScannedd] = useState(false);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getBarCodeScannerPermissions();
  }, []);

  // if (hasPermission === null) {
  //   return <Text>Requesting for camera permission</Text>;
  // }
  // if (hasPermission === false) {
  //   return <Text>No access to camera</Text>;
  // }

  //update picker data
  const [selectedColony, setSelectedColony] = useState([]);
  const updatePickerColony = (colonySel, indexColony, name, value) => {
    // handleChangeText("ss", colonySel);
    setSelectedColony(colonySel);
    // setDataScanned(selectedColony);
  };

  // ///change value
  // const handleChangeText = (data, value) => {
  //   setDataScanned([([data] = value)]);
  //   console.log(dataScanned);
  //   //recibira un nombre y un valor estableciendo el nombre y valor recibido y actualizando
  // };

  const [counter, setCounter] = useState(1);
  ///change value
  const handleChangeText = (name, value, data) => {
    // setScannedd(true);
    // const newProduct = {
    //   Producto: data,
    //   EspacioOcupado: usedSpaces,
    //   UbicacionActual: selectedColony.ClaseTipo,
    //   UltimaUbicacion: selectedColony.UltimaUbicacion,
    //   FechaCreacion: new Date(),
    //   TipoDeEspacios: selectedColony.TipoDeEspacios,
    // };
    setUsedSpaces({ ...usedSpaces, [name]: value });
    // setProducts([...products, newProduct]);

    //recibira un nombre y un valor estableciendo el nombre y valor recibido y actualizando
  };
  const handleSuccess = ({ data }) => {
    setScannedd(true);

    const newProduct = {
      Producto: data,
      EspacioOcupado: usedSpaces.usedspace,
      UbicacionActual: selectedColony.ClaseTipo,
      UltimaUbicacion: selectedColony.UltimaUbicacion,
      FechaCreacion: new Date(),
      TipoDeEspacios: selectedColony.TipoDeEspacios,
      Sucursal: selectedColony.Sucursal
    };
    setProducts([...products, newProduct]);
    // console.log(products);

    // (selectedColony.EspacioTotal)
    setCounter(counter+1)
    if(counter>=selectedColony.EspacioTotal){
      alert("alert","espacios llenos")
    }
    console.log(counter);
  };

  //data saved in state
  const [products, setProducts] = useState([]);
  const [usedSpaces, setUsedSpaces] = useState({
    usedspace: "",
  });

  const saveNewProductScan = () => {
    if (
      //   store.locations === "" ||
      //  dataScanned === ""
      products === ""
    ) {
      Alert.alert("Error Campos vacios", "No se ha escaneado aun");
    } else {
      Alert.alert("Confirmar", "Desea guardar los cambios actuales?", [
        {
          text: "Cancelar",
          onPress: () => ToastAndroid.show("cancelado!", ToastAndroid.SHORT),
          style: "cancel",
        },
        {
          text: "Guardar",
          onPress: () => (
            sendData(),
            // console.log(dataScanned),
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
  //sendData to firebase
  const sendData = async () => {
    await addDoc(collection(db, "articulos"), {
      // IDUbicacion: selectedColony.ID,
      // Sucursal: selectedColony.Sucursal,
      products,
      
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
          </List.Accordion>
          <List.Accordion title=" Datos a escanear">
            <BarCodeScanner
              onBarCodeScanned={scannedd ? undefined : handleSuccess}
              // style={StyleSheet.absoluteFillObject}
              height={400}
              width={370}
            />
            {scannedd && (
              <View>
                <Button
                  mode="contained"
                  buttonColor={Colors.success}
                  onPress={() => {
                    setScannedd(false);
                  }}
                >
                  Escanear de nuevo
                </Button>
                {/* 
                <TextInput
                  label={"valor que ocupa"}
                  keyboardType="numeric"
                  onChangeText={(number) => {
                    handleChangeText("usedspace" + number);
                  }}
                  value={usedSpaces.usedspace}
                ></TextInput> */}
              </View>
            )}
          </List.Accordion>
          {products.map((products, index) => {
            return <List.Item key={index}>{products.Producto}</List.Item>;
          })}
        </List.Section>
      </View>

      <View style={styles.inputGroup}>
        <Button
          mode="contained"
          buttonColor={Colors.success}
          onPress={() => {
            saveNewProductScan();
          }}
          icon="cloud-upload"
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
