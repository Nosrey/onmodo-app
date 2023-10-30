// creo un componente para que se muestre un popup donde confirmare una accion con dos botones de si o no
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

export default function ConfirmScreen({ navigation, params }) {
    // obtengo y creo los valores title, message, action, data de params
    const { title, message, message2, action, data, viewWindow, setViewWindow, botonYes, botonNo, typeable, internalInput, setInternalInput, textField} = params;

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
        // reviso data, si es un solo valor ejecuto la accion con ese valor, si es un array ejecuto la accion con el array es decir [prop1, prop2, prop3] => action(prop1, prop2, prop3)
        if (data) {
            if (Array.isArray(data)) {
                action(...data)
            } else {
                action(data)
            }
        } else {
            action()
        }
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
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        alignItems: 'center',
        alignSelf: 'center',
        // lo pongo en absolute y centrado
        position: 'absolute',
        bottom: (typeable) ? "40%" : "50%",
        zIndex: 1,
    }

    const handleInternalInput = (value) => {
        // reviso si la longitud de value es menor a 1000, si es menor entonces seteo el valor de internalInput con value y si es mayor a 1000 entonces elimino el ultimo caracter de value y seteo el valor de internalInput con value
        if (value.length <= 1000) {
            setInternalInput(value);
        } else {
            setInternalInput(value.slice(0, -1));
        }
        setInputCounter(value.length);
    }
    


    return (
        <View style={[container, visible]}>
            <Text style={[styles.title, {marginBottom: (message.length) ? 0 : 10}]}>{title}</Text>
            <Text style={[styles.message, {display: (message.length) ? 'flex' : 'none'}]}>{message}</Text>
            <Text style={[styles.message, {display: (message2?.length) ? 'flex' : 'none', marginBottom: 10, marginTop: 0 }]}>{message2}</Text>
            <View style={[styles.inputContainer, {display: (typeable) ? 'flex' : 'none'}]}>
                <View style={styles.passwordInputContainer}>
                    <TextInput
                        style={styles.userInput}
                        placeholder={textField?.length ? textField : " Motivos de la edición"}
                        placeholderTextColor="#C3C3C3"
                        multiline={true}
                        onChangeText={(value) => handleInternalInput(value)}
                        value={internalInput}
                    />
                    <Text style={styles.letterCounter}>{inputCounter+"/1000"}</Text>
                </View>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={handleNoButton}>
                    <Text style={[styles.buttonText, styles.cancel]}>{botonNo}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleYesButton}>
                    <Text style={[styles.buttonText, accept]}>{botonYes}</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
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
        marginVertical: 10
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