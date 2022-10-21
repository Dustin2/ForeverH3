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
import { TextInput, Button, List } from "react-native-paper";
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
  where,
  getDoc,
} from "firebase/firestore";

import { async } from "@firebase/util";
import { LogBox } from "react-native";

//navigation
import { useNavigation } from "@react-navigation/core";

LogBox.ignoreLogs(["Setting a timer"]);

export default function ChangeLocationsScreen() {
  //use for navigate in app
  const navigation = useNavigation();

  //hook for get data (locations registered) before load UI
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const collectionRef = collection(db, "articulos");
    const q = query(collectionRef, orderBy("FechaCreacion"));
    const getProducts = [];
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      console.log("querySnapshot unsusbscribe");
      querySnapshot.docs.map((doc) => {
        const {
          // Sucursal,
          // ClaseTipo,
          // EspacioTotal,
          // EspaciosDisponibles,
          // TipoDeEspacios,
          // Etiqueta,
          FechaCreacion,
          Articulos,
          // Datos,
          IDUbicacion,
        } = doc.data();
        getProducts.push({
          IDArticulo: doc.id,
          // Sucursal,
          // ClaseTipo,
          // EspacioTotal,
          // EspaciosDisponibles,
          // TipoDeEspacios,
          // Etiqueta,
          FechaCreacion,
          Articulos,
          // Datos,
          IDUbicacion,
        });
      });
      setProducts(getProducts);
      console.log(products);
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
  const updatePickerColony = (colonySel, indexColony, name, value) => {
    // handleChangeText("locations", colonySel);
    setSelectedColony(colonySel);
    setDataScanned(selectedColony);
  };

  //data saved in state
  const [dataScanned1, setDataScanned1] = useState([]);
  //update picker data
  const [selectedColony1, setSelectedColony1] = useState([]);
  const updatePickerColony1 = (colonySel1, indexColony1, name, value) => {
    handleChangeText("newlocation", colonySel1);
    setSelectedColony1(colonySel1);
    setDataScanned1(selectedColony1);
  };

  ///change value
  const handleChangeText = (data, value) => {
    setDataScanned([{ [data]: value }]);
    //recibira un nombre y un valor estableciendo el nombre y valor recibido y actualizando
  };
  /// barcode
  const [hasPermission, setHasPermission] = useState(null);
  const [scannedd, setScannedd] = useState(false);
  const [Data, setData] = useState([]);

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
    await addDoc(collection(db, "cambios"), {
      //Sucursal: auth.currentUser?.email,
      // Etiqueta: selectedColony.Etiqueta,
      // ClaseTipo: selectedColony.ClaseTipo,
      // EspacioTotal: selectedColony.EspacioTotal,
      // EspaciosDisponibles: selectedColony.EspacioTotal,
      // TipoDeEspacios: selectedColony.TipoDeEspacios,
      IDUbicacion: selectedColony.IDUbicacion,
      Articulos: Data,
      IDArticulos: selectedColony.ID,
      //  FechaCreacion: new Date(),
      // Articulos: Data,
      FechaCambio: new Date(),
    });
    ///use this change screen after save data
    navigation.navigate("Inicio");
  };
  
  // useEffect(() => {
  //   getDoc(doc(db, "ubicaciones", "LF7fCzuhXfnW3nrkPH7Q "))
  //   .then(res=>console.log({id:res.id, ...res.data()}));
  // }, []);

  return (
    <ScrollView style={styles.container}>
      {/* current location */}
      <View>
        <List.Section title="Articulos">
          <List.Accordion title=" Articulos">
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
              {products.map((location, index) => {
                return (
                  <Picker.Item
                    // label={location.ClaseTipo + " (" + location.Etiqueta + ")"}
                    label={location.Articulos + ""}
                    value={{
                      ID: location.IDArticulo,
                      Sucursal: location.Sucursal,
                      ClaseTipo: location.ClaseTipo,
                      EspacioTotal: location.EspacioTotal,
                      EspaciosDisponibles: location.EspaciosDisponibles,
                      TipoDeEspacios: location.TipoDeEspacios,
                      Etiqueta: location.Etiqueta,
                      FechaCreacion: location.FechaCreacion,
                      Articulo: location.Articulos,
                      IDUbicacion: location.IDUbicacion,
                    }}
                    key={location.ID}
                  />
                );
              })}
            </Picker>
            <TextInput disabled={true}>{"ID: " + selectedColony.ID}</TextInput>
            <TextInput disabled={true}>
              {"IDUbicacion: " + selectedColony.IDUbicacion}
            </TextInput>
            <TextInput disabled={true}>
              {"Producto: " + selectedColony.Articulo}
            </TextInput>
            <TextInput disabled={true}>
              {"ClaseTipo: " +
                selectedColony.ClaseTipo +
                " (" +
                selectedColony.Etiqueta +
                " )"}
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
          <List.Accordion title=" Articulos">
            <Picker
              selectedValue={selectedColony1}
              onValueChange={(colonySel1, indexColony1, name, value) =>
                updatePickerColony1(colonySel1, indexColony1, name, value)
              }
            >
              <Picker.Item
                label="Selecciona la de ubicacion"
                value=""
                enabled={false}
              />
              {products.map((location, index) => {
                return (
                  <Picker.Item
                    // label={location.ClaseTipo + " (" + location.Etiqueta + ")"}
                    label={location.Articulos + ""}
                    value={{
                      ID: location.ID,
                      Sucursal: location.Sucursal,
                      ClaseTipo: location.ClaseTipo,
                      EspacioTotal: location.EspacioTotal,
                      EspaciosDisponibles: location.EspaciosDisponibles,
                      TipoDeEspacios: location.TipoDeEspacios,
                      Etiqueta: location.Etiqueta,
                      FechaCreacion: location.FechaCreacion,
                      Articulo: location.Articulos,
                    }}
                    key={location.ID}
                  />
                );
              })}
            </Picker>
            <TextInput disabled={true}>{"ID: " + selectedColony1.ID}</TextInput>
            <TextInput disabled={true}>
              {"Producto: " + selectedColony1.Articulo}
            </TextInput>
            <TextInput disabled={true}>
              {"ClaseTipo: " +
                selectedColony1.ClaseTipo +
                " (" +
                selectedColony1.Etiqueta +
                " )"}
            </TextInput>
            <TextInput disabled={true}>
              {"Tipo de Espacio : " + selectedColony1.TipoDeEspacios}
            </TextInput>
            <TextInput disabled={true}>
              {"Espacio Total: " + selectedColony1.EspacioTotal}
            </TextInput>
            <TextInput disabled={true}>
              {"Espacios Disponibles: " + selectedColony1.EspaciosDisponibles}
            </TextInput>
          </List.Accordion>
        </List.Section>
      </View>
      {/* new location */}

      {/* send button */}
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
