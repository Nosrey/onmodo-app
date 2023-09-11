// creo un componente para que se muestre un popup donde confirmare una accion con dos botones de si o no
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

export default function ConfirmScreen({ navigation, params }) {
    // obtengo y creo los valores title, message, action, data de params
    const { title, message, action, data, viewWindow, setViewWindow } = params;

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
        setViewWindow(false)
    }

    const handleNoButton = () => {
        // vuelvo a la pantalla anterior
        setViewWindow(false)
    }

    const visible = {
        display: viewWindow ? "flex" : "none",
    }

    return (
        <View style={[styles.container, visible]}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={handleNoButton}>
                    <Text style={[styles.buttonText, styles.cancel]}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleYesButton}>
                    <Text style={[styles.buttonText, styles.accept]}>Cerrar sesión</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
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
    accept: {
        color: '#fff',
        backgroundColor: "#7BC100",

        borderRadius: 10,
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
        // aplico bold al texto
    },
    container: {
        flex: 1,
        padding: 6,
        // padding top en 24px
        paddingTop: 24,
        backgroundColor: '#fff',
        // ventana sin borde redondeada
        borderRadius: 30,
        // ligera sombra alrededor color negro
        padding: 20,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        alignItems: 'center',
        alignSelf: 'center',
        // lo pongo en absolute y centrado
        position: 'absolute',
        bottom: "50%",
        zIndex: 1,
        

    },
    inputContainer: {
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
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#C3C3C3',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
    },
    userInput: {
        flex: 1,
        height: 40,
        color: '#C3C3C3',
        fontSize: 16,
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
        paddingHorizontal: 15,
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