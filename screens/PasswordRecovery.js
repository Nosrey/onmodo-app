import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Keyboard } from 'react-native';
import logo from '../assets/on-modo-grande.png';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

export default function PasswordRecovery({ navigation }) {
    const [keyboardShow, setKeyboardShow] = useState();
    const [fontsLoaded] = useFonts({
        "GothamRoundedMedium": require('../assets/fonts/GothamRoundedMedium_21022.ttf'),
        "GothamRoundedBold": require('../assets/fonts/GothamRoundedBold_21016.ttf')
    });
    const [correoInput, setCorreoInput] = useState('');
    const [inputError, setInputError] = useState(false); // Estado para mostrar/ocultar el error de input [true/false]

    function handleCorreoInput(value) {
        setCorreoInput(value);
    }

    useEffect(() => {
        if (correoInput.includes('@') && correoInput.includes('.com')) {
            setInputError(false);
        } else {
            setInputError(true);
        }
    }, [correoInput]);

    useEffect(() => {
        async function prepare() {
            await SplashScreen.preventAutoHideAsync();
        }
        prepare();
    }, []);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                setKeyboardShow(true);
            }
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setKeyboardShow(false);
            }
        );

        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };
    }, []);

    if (!fontsLoaded) return undefined;
    else SplashScreen.hideAsync();

    const footerContainer = {
        // hago que el elemento este al fondo de la pagina o pantalla
        position: 'absolute',
        bottom: keyboardShow ? -40 : 15,
        // lo centro
        width: '100%',
        alignSelf: 'center',
    }

    const buttonFooterStyle = {
        width: '100%',
        height: 50,
        backgroundColor: !inputError ? '#7BC100' : '#A0B875',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    };

    function handleSendButton () {
        if (!inputError) {
            navigation.navigate('PasswordCreate');
        }
    }

    const emailError = {
        color: '#FF2E11',
        fontSize: 12,
        // hago que no se muestre
        display: (inputError && correoInput.length) ? 'flex' : 'none',
        fontFamily: "GothamRoundedMedium",
    }


    return (
        <View style={styles.container}>
            {/* Header */}
            <View>
                {/* creo una imagen para logo */}
                <Image source={logo} style={styles.logoHeader} />
                <Text style={styles.title}>Restablecer contraseña</Text>
                <Text style={styles.message}>Ingresa tu correo para restablecer la contraseña de tu cuenta. Te enviaremos un mail con los nuevos datos.</Text>
            </View>

            {/* formulario */}
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Correo electrónico</Text>
                <TextInput
                    style={styles.input}
                    value={correoInput}
                    onChangeText={handleCorreoInput}
                    placeholder="Correo electrónico"
                    placeholderTextColor="#959595"
                />
            </View>

            {/* Boton para ingresar */}
            <View style={footerContainer}>
                <TouchableOpacity style={buttonFooterStyle} onPress={handleSendButton}>
                    <Text style={styles.buttonText}>Enviar</Text>
                </TouchableOpacity>
            </View>
            <Text style={emailError}>Debes ingresar un Email</Text>

        </View>
    );
}

const styles = StyleSheet.create({
    logoHeader: {
        resizeMode: 'center',
        width: 160,
        height: 40,
        // centro de manera horizontal la imagen
        alignSelf: 'center',
    },
    title: {
        marginTop: 8,
        fontSize: 20,
        // hago que la fuente sea gothan rounded
        fontFamily: 'GothamRoundedBold',
        // establezo el line-height en 24px
        lineHeight: 24,
        // centro el texto
        textAlign: 'center',
        // aplico bold al texto
    },
    container: {
        flex: 1,
        padding: 14,
        // padding top en 24px
        paddingTop: 24,
        backgroundColor: '#fff',
    },
    forms: {
        marginTop: 40,
    },
    inputContainer: {
        marginBottom: 10,
    },
    label: {
        color: '#000000',
        marginBottom: 5,
        marginTop: 25,
        fontSize: 14,
        fontFamily: "GothamRoundedMedium"
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
    passwordInput: {
        flex: 1,
        height: 40,
        color: '#C3C3C3',
        fontSize: 16,
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
        color: '#fff',
        fontSize: 16,
    },
    footerText: {
        // centro el texto
        textAlign: 'center',
        // pongo color de texto #000000;
        color: '#000000',
        marginTop: 10,
    },
    message: {
        fontFamily: "GothamRoundedMedium",
        fontSize: 12,
        textAlign: 'center',
    }
});