import React from 'react';
import {View, StyleSheet,Text} from 'react-native';
import { Button } from 'react-native-paper';


//navigation
import { useNavigation } from '@react-navigation/core'
//Auth firebase
import { auth } from "../firebase";


const SettingsScreen = () => {
    
    const navigation = useNavigation()

    const handleSignOut = () => {
      auth
        .signOut()
        .then(() => {
          navigation.replace("Login")
        })
        .catch(error => alert(error.message))
    }
    return (
        <View>
            <Text>ajustes</Text>
            <Button  mode="contained"   onPress={handleSignOut}>Finalizar Sesion</Button>
        </View>
    );
}

const styles = StyleSheet.create({})

export default SettingsScreen;
