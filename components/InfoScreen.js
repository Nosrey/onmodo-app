// creo un componente para que se muestre un popup donde confirmare una accion con dos botones de si o no
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';

export default function InfoScreen({ navigation, params }) {
    // obtengo y creo los valores title, message, action, data de params
    const { title1, title2, message1, message1p2, message2, message2p2, message2p3, action, data, viewWindow, setViewWindow, botonYes, botonNo, typeable, internalInput, setInternalInput } = params;

    const [inputCounter, setInputCounter] = useState(0);

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

    const handleYesButton = () => {
        // ejecuto la accion recibida
        action(data);
        if (setInternalInput) setInternalInput('')
        setViewWindow(false)
    }

    const handleNoButton = () => {
        // vuelvo a la pantalla anterior
        if (setInternalInput) setInternalInput('')
        setViewWindow(false)
    }

    const visible = {
        display: viewWindow ? "flex" : "none",
    }

    const accept = {
        color: '#fff',
        backgroundColor: (typeable) ? "#A0B875" : "#7BC100",
        borderRadius: 10,
    }

    const container = {
        flex: 1,
        padding: 6,
        // padding top en 24px
        paddingTop: 15,
        backgroundColor: '#fff',
        // ventana sin borde redondeada
        borderRadius: 30,
        // ligera sombra alrededor color negro
        padding: 20,
        paddingTop: 50,
        paddingHorizontal: 35,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        alignItems: 'center',
        alignSelf: 'center',
        // lo pongo en absolute y centrado
        position: 'absolute',
        bottom: "20%",
        zIndex: 2,
    }




    return (
        <View style={[container, visible]}>
            <View style={{ width: "100%", display: "flex" }}>
                <TouchableOpacity>
                    <AntDesign name="closecircle" size={30} color="black" style={styles.closeBtn} onPress={() => { setViewWindow(false) }} />
                </TouchableOpacity>
            </View>

            <Text style={[styles.title, { borderBottomColor: 'black', borderBottomWidth: 1, marginTop: 5, width: "100%", textAlign: "center", paddingBottom: 10, marginBottom: 10 }]}>{title1}</Text>    
            <Text style={[styles.message]}>{message1}</Text>
            <Text style={[styles.message]}>{message1p2}</Text>
            <Text style={[styles.title, { borderBottomColor: 'black', borderBottomWidth: 1, marginTop: 25, width: "100%", textAlign: "center", paddingBottom: 10, marginBottom: 10 }]}>{title2}</Text>
            <Text style={[styles.message]}>{message2}</Text>
            <Text style={[styles.message]}>{message2p2}</Text>
            <Text style={[styles.message,{marginBottom: 20}]}>{message2p3}</Text>
        </View>
    )
}


const styles = StyleSheet.create({
    closeBtn: {
        position: 'absolute',
        top: -40,
        right: -25,
    },
    letterCounter: {
        color: '#C3C3C3',
        fontFamily: 'GothamRoundedMedium',
        fontSize: 12,
        alignSelf: 'flex-end',
        marginRight: 10,

    },
    message: {
        fontSize: 12,
        fontFamily: "GothamRoundedMedium",
        textAlign: 'center',
        marginVertical: 5
    },
    form: {

    },
    button: {
        marginHorizontal: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5,
    },
    cancel: {
        color: '#7BC100',
    },
    logoHeader: {
        resizeMode: 'center',
        width: 160,
        height: 40,
        // centro de manera horizontal la imagen
        alignSelf: 'center',
    },
    title: {
        fontSize: 14,
        // hago que la fuente sea gothan rounded
        fontFamily: 'GothamRoundedBold',
        // establezo el line-height en 24px
        lineHeight: 24,
        // centro el texto
        textAlign: 'left',
        marginTop: 10,
        // aplico bold al texto
    },
    inputContainer: {
        width: '100%',
        marginBottom: 10,
    },
    label: {
        color: '#00000080',
        marginBottom: 5,
        fontSize: 14,
        fontFamily: "GothamRoundedMedium",
        marginTop: 5,
    },
    input: {
        width: '100%',
        height: 40,
        color: '#959595',
        borderColor: '#C3C3C3',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        fontSize: 14,
        fontFamily: "GothamRoundedMedium"
    },
    passwordInputContainer: {
        paddingVertical: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        borderColor: '#C3C3C3',
        width: "100%",
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 1,
        marginTop: 5,

    },
    userInput: {
        textAlignVertical: 'top',
        padding: 10,
        paddingVertical: 0,
        height: 50,
        width: "100%",
        maxWidth: "100%",
        // hago que si alcanza el limite de la palabra se corte hacia abajo
        overflow: 'scroll',
        color: '#C3C3C3',
        fontSize: 12,
        fontFamily: "GothamRoundedMedium"
    },
    passwordToggleIcon: {
        padding: 10,
    },
    buttonFooter: {
        width: '100%',
        height: 50,
        backgroundColor: '#A0B875',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        paddingHorizontal: 25,
        paddingVertical: 10,
        fontSize: 12,
        fontFamily: "GothamRoundedMedium",
    },
    footerText: {
        // centro el texto
        textAlign: 'center',
        // pongo color de texto #000000;
        color: '#7BC100',
        marginTop: 10,
        fontSize: 16,
        marginBottom: 20,
    },
    profileImg: {
        width: 115,
        height: 115,
        resizeMode: "cover",
        alignSelf: 'center',
        borderRadius: 75,
        borderWidth: 2,
        marginTop: 20,
        marginBottom: 10,
    },
    editarBtn: {
        backgroundColor: 'white',
        // borde de 2px color #7BC100
        borderWidth: 2,
        borderColor: '#7BC100',
    },
    editarTextBtn: {
        color: '#A0B875',
    }
});