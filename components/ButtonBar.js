import React, { useEffect } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Button } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import IconIon from 'react-native-vector-icons/Ionicons';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

export default function ButtonBar({ navigation }) {
    const [fontsLoaded] = useFonts({
        "GothamRoundedMedium": require('../assets/fonts/GothamRoundedMedium_21022.ttf'),
        "GothamRoundedBold": require('../assets/fonts/GothamRoundedBold_21016.ttf')
    });

    useEffect(() => {
        async function prepare() {
            await SplashScreen.preventAutoHideAsync();
        }
        prepare();
    }, []);

    if (!fontsLoaded) return undefined;
    else SplashScreen.hideAsync();

    const handleInicioButton = () => {
        // reviso si estoy en la pagina Inicio, si es asi no hago nada, de lo contrario navego a Inicio
        let rutaActual = navigation.getState().routes.length - 1;
        let route = navigation.getState().routes[rutaActual].name;
        if (route != 'Inicio') {
            navigation.navigate('Inicio');
        }
    }

    const handleProfileButton = () => {
        // reviso si estoy en la pagina Profile, si es asi no hago nada, de lo contrario navego a Profile
        let rutaActual = navigation.getState().routes.length - 1;
        let route = navigation.getState().routes[rutaActual].name;
        if (route != 'Mi Cuenta') {
            navigation.navigate('Profile');
        }
    }

    return (
        <View style={styles.button}>
            <TouchableOpacity title='Inicio' style={styles.iconHome} onPress={handleInicioButton}>
                <Icon name="home" size={20} color="white" style={styles.searchIcon} />
                <Text style={styles.buttonText}>Inicio</Text>
            </TouchableOpacity>
            <View>
                <Text style={styles.separator}>|</Text>
            </View>
            <TouchableOpacity title='Mi Cuenta' style={styles.iconHome} onPress={handleProfileButton}>
                <IconIon name="person" size={20} color="white" style={styles.searchIcon} />
                <Text style={styles.buttonText}>Mi cuenta</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    separator: {
        color: 'white'
    },


    searchIcon: {
        padding: 10,
    },
    button: {
        width: '100%',
        height: 50,
        backgroundColor: '#7BC100',
        justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection: 'row'
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontFamily: 'GothamRoundedMedium'
    },
    iconHome: {
        backgroundColor: '7BC100',
        flexDirection: 'row',
        alignItems: 'center'
    }
});
