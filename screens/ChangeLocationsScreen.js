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
  updateDoc,
} from "firebase/firestore";

import { async } from "@firebase/util";
import { LogBox } from "react-native";

//navigation
import { useNavigation } from "@react-navigation/core";

LogBox.ignoreLogs(["Setting a timer"]);

export default function ChangeLocationsScreen() {
  //use for navigate in app
  const navigation = useNavigation();

  //hook for get data (products registered) before load UI
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const collectionRef = collection(db, "articulos");
    const q = query(collectionRef, orderBy("products", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      console.log("querySnapshot unsusbscribe");
      const datos = [];
      setProducts(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          // EspacioOcupado: doc.data().EspacioOcupado,
          // FechaCreacion: doc.data().FechaCreacion,
          // Producto: doc.data().Producto,
          // TipoDeEspacios: doc.data().TipoDeEspacios,
          // UbicacionActual: doc.data().UbicacionActual,
          // UltimaUbicacion: doc.data().UltimaUbicacion,
          // Sucursal: doc.data().Sucursal,
        }))
      );
    });
    return unsubscribe;
  }, []);
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
          ID,
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
      {
        //   console.log(getRegisteredLocation.ID);
      }
    });
    return unsubscribe;
  }, []);

  ///use for expanded accordion
  const [expanded, setExpanded] = useState(true);
  const handlePress = () => setExpanded(!expanded);

  // //data saved in state
  // const [dataScanned, setDataScanned] = useState([]);
  //update picker data
  const [selectedColony, setSelectedColony] = useState([]);
  const updatePickerColony = (colonySel, indexColony, name, value) => {
    // handleChangeText("locations", colonySel);
    setSelectedColony(colonySel);
  };

  // //data saved in state
  // const [dataScanned1, setDataScanned1] = useState([]);
  //update picker data
  const [selectedColony1, setSelectedColony1] = useState([]);
  const updatePickerColony1 = (colonySel1, indexColony1, name, value) => {
    // handleChangeText("ss", colonySel);
    setSelectedColony1(colonySel1);
    // setDataScanned(selectedColony);
  };

  const saveNewProductScan = () => {
    // if (
    //   selectedColony1.EspaciosDisponibles <= selectedColony.EspaciosDisponibles
    // ) {
    //   Alert.alert(
    //     "no es posible el cambio de ubicacion",
    //     "ubicacion con espacios insuficientes"
    //   );
    // }
    if (
      //   store.locations === "" ||
      products === ""
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
            // onEdit(),
            ToastAndroid.show(
              "Articulos  registrados con exito!",
              ToastAndroid.SHORT
            )
          ),
          style: "success",
        },
      ]);
    }
  };

  ///sendData to firebase
  const sendData = async () => {
    // console.log(dataScanned);
    await addDoc(collection(db, "cambios"), {
      //Sucursal: auth.currentUser?.email,
      //   Etiqueta: selectedColony.Etiqueta,
      //  UbicacionActual: selectedColony1.UbicacionActual,
      //     UbicacionAnterior: selectedColony.UbicacionActual,
      // EspacioTotal: selectedColony.EspacioTotal,
      // EspaciosDisponibles: selectedColony1.EspacioTotal,
      // TipoDeEspacios: selectedColony1.TipoDeEspacios,
      //  IDUbicacion: selectedColony.ID,
      // Articulos: Data,
      //  IDArticulos: selectedColony.ID,
      // FechaCambio: new Date(),
    });
    // db.collection("articulos").doc(doc.selectedColony.ID).update({
    //   Etiqueta: selectedColony1.Etiqueta,
    //   UbicacionActual: selectedColony1.ClaseTipo,
    //   UbicacionAnterior: selectedColony1.ClaseTipo,
    //   EspaciosDisponibles: selectedColony1.EspacioTotal,
    // });
    ///use this change screen after save data
    navigation.navigate("Inicio");
  };

  const [updateLocation, setUpdateLocation] = useState();
  return (
    <ScrollView style={styles.container}>
      {/* current location */}
      <View>
        <List.Section title="Articulos escaneados">
          <List.Accordion title=" Articulos">
            {products.map((product, index) => {
              // console.log(product);
              return (
                <View key={product.id}>
                  {product.products.map((newProduct, index) => {
                    return (
                      <ScrollView
                        key={index}
                        style={{ backgroundColor: "#ffff" }}
                      >
                        <TextInput disabled={true}>{product.id}</TextInput>
                        <TextInput disabled={true}>
                          {"Producto: " + newProduct.Producto}
                        </TextInput>
                        <TextInput disabled={true}>
                          {"EspacioOcupado: " + newProduct.EspacioOcupado}
                        </TextInput>
                        <TextInput disabled={true}>
                          {"TipoDeEspacios: " + newProduct.TipoDeEspacios}
                        </TextInput>
                        <TextInput disabled={true}>
                          {"UbicacionActual: " + newProduct.UbicacionActual}
                        </TextInput>
                        <TextInput disabled={true}>
                          {"UltimaUbicacion: " + newProduct.UltimaUbicacion}
                        </TextInput>
                        <List.Accordion title=" Proxima Ubicacion">
                          <Picker
                            selectedValue={selectedColony1}
                            onValueChange={(
                              colonySel1,
                              indexColony,
                              name,
                              value
                            ) =>
                              updatePickerColony1(
                                colonySel1,
                                indexColony,
                                name,
                                value
                              )
                            }
                          >
                            <Picker.Item
                              label="Selecciona la nueva ubicacion"
                              value=""
                              enabled={false}
                            />
                            {registeredLocation.map((location, index) => {
                              return (
                                <Picker.Item
                                  label={
                                    location.ClaseTipo +
                                    " (" +
                                    location.Etiqueta +
                                    ")"
                                  }
                                  value={{
                                    UbicacionActual: location.ClaseTipo,
                                    EspacioTotal: location.EspacioTotal,
                                    EspaciosDisponibles:
                                      location.EspaciosDisponibles,
                                    TipoDeEspacios: location.TipoDeEspacios,
                                    Etiqueta: location.Etiqueta,
                                    // FechaCreacion: location.FechaCreacion,
                                    UltimaUbicacion: location.UltimaUbicacion,
                                  }}
                                  key={index}
                                />
                              );
                            })}
                          </Picker>
                          <TextInput disabled={true}>
                            {"Ubicacion: " + selectedColony1.UltimaUbicacion}
                          </TextInput>
                          <TextInput disabled={true}>
                            {"Tipo de Espacio : " +
                              selectedColony1.TipoDeEspacios}
                          </TextInput>
                          <TextInput disabled={true}>
                            {"Espacio Total: " + selectedColony1.EspacioTotal}
                          </TextInput>
                          <TextInput disabled={true}>
                            {"Espacios Disponibles: " +
                              selectedColony1.EspaciosDisponibles}
                          </TextInput>
                        </List.Accordion>
                        <Button
                          style={styles.button}
                          mode="contained"
                          buttonColor={Colors.success}
                          onPress={() => {
                            const product = "";
                            const location = "";
                            setUpdateLocation(
                              {
                                id: product.id,
                                Etiqueta: selectedColony1.Etiqueta,
                                product:
                                  "datos del articulo:" + newProduct.Producto,
                              }
                              // "datos del articulo:"+newProduct.Producto
                            );
                            // console.log(selectedColony1)
                            // console.log("datos del articulo:"+newProduct.Producto)

                            console.log(updateLocation);
                          }}
                        >
                          cambiar ubicacion
                        </Button>
                      </ScrollView>
                    );
                  })}
                </View>
              );
            })}
          </List.Accordion>
        </List.Section>
      </View>
      {/* new location */}

      {/* send button */}
      {/* <View style={styles.inputGroup}>
        <Button
          mode="contained"
          buttonColor={Colors.success}
          onPress={() => {
            saveNewProductScan();
          }}
        >
          Guardar Productos
        </Button>
      </View> */}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#eaeac2",

    // flexDirection: "column",
    // justifyContent: "center",
  },
  containerScanner: {
    backgroundColor: "#000",
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
    marginTop: 20,
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
