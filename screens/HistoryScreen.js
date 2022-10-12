import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { List, TextInput } from "react-native-paper";
//firebase
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  querySnapshot,
  doc,
} from "firebase/firestore";
import { auth, db } from "../firebase";

//external dependencies
import { Colors } from "../colors";
const HistoryScreen = () => {
  const [updates, setUpdates] = useState([]);
  useEffect(() => {
    const collectionRef = collection(db, "Productos Escaneados");
    const q = query(collectionRef, orderBy("createdDoc", "desc"));
    const getData = [];
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      console.log("querySnapshot unsusbscribe");

      querySnapshot.docs.map((doc) => {
        const { storeName, products, createdDoc } = doc.data();
        getData.push({
          id: doc.id,
          storeName,
          products,
          createdDoc,
        });
        // id: doc.id,
        // storeName: doc.storeName,
        // products: doc.products,
        // createdDoc: doc.createdDoc,
      });
      setUpdates(getData);
    });
    return unsubscribe;
  }, []);

  ///acordion
  const [expanded, setExpanded] = useState(true);

  const handlePress = () => setExpanded(!expanded);
  return (
    <View styles={styles.container}>
      <SafeAreaView>
        <ScrollView>
          {updates.map((lastUpdates, index) => {
            return (
              <List.Section title={"Nombre de tienda"} key={lastUpdates.id}>
                
                <List.Accordion title={lastUpdates.storeName}>
                  <List.Item title="Productos Escaneados"/>
                  <Text>{lastUpdates.products + "\n"}</Text>
                  <Text>{lastUpdates.createdDoc + "\n"}</Text>
                </List.Accordion>
                {console.log(lastUpdates)}
              </List.Section>
            );
          })}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 35,
    // justifyContent: "center",
    backgroundColor: "#f1f1f1",
    marginTop: 200,
  },

  title: {
    fontSize: 30,
    color: "#181818",
    fontWeight: "bold",
  },
  subTitle: {
    fontSize: 20,
    color: "gray",
  },

  TextInput: {
    marginBottom: 15,
    marginTop: 22,
  },
  text: { fontSize: 15, color: "gray" },
  button: {
    marginTop: 15,
    marginBottom: 15,
  },
});

export default HistoryScreen;
{
  /* <List.Accordion>
{lastUpdates.products.map((item) => {
  return <List.Item>{item.products}</List.Item>;
})}
</List.Accordion> */
}
