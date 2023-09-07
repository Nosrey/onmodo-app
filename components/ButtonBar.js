import React, {useEffect} from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import IconIon from 'react-native-vector-icons/Ionicons';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

export default function ButtonBar() {
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
    return (
        <View style={styles.button}>
            <View style={styles.iconHome}>
                <Icon name="home" size={20} color="white" style={styles.searchIcon} />
                <Text style={styles.buttonText}>Inicio</Text>
            </View>
            <View>
                <Text style={styles.separator}>|</Text>
            </View>
            <View style={styles.iconHome}>
                <IconIon name="person" size={20} color="white" style={styles.searchIcon} />
                <Text style={styles.buttonText}>Mi cuenta</Text>
            </View>
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
        flexDirection: 'row',
        alignItems: 'center'
    }
});
