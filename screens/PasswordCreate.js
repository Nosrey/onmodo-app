// creo un nuevo componente
import React, { useState, useEffect } from 'react';
// importo de react native el view, text, image, stylesheets, touchableOpacity
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Keyboard, Dimensions } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import logo from '../assets/on-modo-grande.png';
import Icon from 'react-native-vector-icons/FontAwesome'; // Importa el ícono de ojo
import Header from '../components/Header';
import { useSelector } from 'react-redux';

export default function PasswordCreate({ navigation }) {
    const logoImported = useSelector((state) => state.logo);

    const screenWidth = Dimensions.get("window").width;

    const [showPassword, setShowPassword] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    const [passwordInput, setPasswordInput] = useState(''); // Estado para guardar el valor del input de contraseña
    const [passwordInput2, setPasswordInput2] = useState(''); // Estado para guardar el valor del input de contraseña
    const [inputError, setInputError] = useState(false); // Estado para mostrar/ocultar el error de input [true/false]
    const [loginError, setLoginError] = useState(false); // Estado para mostrar/ocultar el error de login [true/false]
    const [fontsLoaded] = useFonts({
        "GothamRoundedMedium": require('../assets/fonts/GothamRoundedMedium_21022.ttf'),
    });
    const [keyboardShow, setKeyboardShow] = useState();

    useEffect(() => {
        if ((!passwordInput.length) || (!passwordInput2.length) || (passwordInput != passwordInput2)) {
            setInputError(true);
        } else {
            setInputError(false);
        }
    }, [passwordInput, passwordInput2]);

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


    function handlePasswordChange(value) {
        setPasswordInput(value);
        setLoginError(false);
    }

    function handlePasswordChange2(value) {
        setPasswordInput2(value);
        setLoginError(false);
    }

    function handleLogin() {
        if (!inputError) {
            // elimino el stack de navegacion
            navigation.reset({
                index: 0,
                routes: [{ name: 'Inicio' }],
            });
        } else {
            setLoginError(true);
        }
    }


    const buttonFooterStyle = {
        width: '100%',
        height: 50,
        backgroundColor: '#7BC100',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    };

    const footerContainer = {
        // hago que el elemento este al fondo de la pagina o pantalla
        position: 'absolute',
        bottom: keyboardShow ? -40 : 15,
        // lo centro
        width: '100%',
        alignSelf: 'center',
    }

    const passwordError = {
        color: '#FF2E11',
        fontSize: 12,
        // hago que no se muestre
        display: (loginError) ? 'flex' : 'none',
        fontFamily: "GothamRoundedMedium",
    }

    let cajaText = [
        { title: "Crear contraseña e ingresar", style: 'titleCreate' }
    ]

    return (
        <View style={styles.container}>

            <Image source={logoImported ? { uri: logoImported } : logo} style={[styles.logoHeader, { width: screenWidth * 1, height: 80, marginTop: 20 }]} />

            <View style={{ marginTop: 40 }}>
                <Text style={{
                    // pongo la fuente gotham rounded  (LA NO BOLD)
                    fontFamily: "GothamRoundedMedium",
                    // pongo el color de texto en #636371
                    color: '#636371',
                    fontSize: 26,
                    alignSelf: 'center',
                    textAlign: 'center',
                }}>Revisá tu correo</Text>
                <Text style={{
                    // pongo la fuente gotham rounded  (LA NO BOLD)
                    fontFamily: "GothamRoundedBold",
                    // pongo el color de texto en #636371
                    fontSize: 16,
                    alignSelf: 'center',
                    textAlign: 'center',
                }}>Te hemos enviado un correo para restablecer la contraseña de tu cuenta</Text>
            </View>

            <View style={footerContainer} >
                <TouchableOpacity style={buttonFooterStyle} onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.buttonText}>Regresar</Text>
                </TouchableOpacity>

            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    logoHeader: {
        resizeMode: 'contain',
        // width: 160,
        // height: 40,
        // centro de manera horizontal la imagen
        alignSelf: 'center',
    },
    title: {
        marginTop: 4,
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
        padding: 12,
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
        color: '#fff',
        fontSize: 18,
        fontFamily: "GothamRoundedMedium"
    },
    footerText: {
        // centro el texto
        textAlign: 'center',
        // pongo color de texto #000000;
        color: '#000000',
        marginTop: 10,
    },
});