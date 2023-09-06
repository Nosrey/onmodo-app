import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Keyboard } from 'react-native';
// importo useFonts
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
// importo on-modo-grande.png de assets
import logo from '../assets/on-modo-grande.png';
import Icon from 'react-native-vector-icons/FontAwesome'; // Importa el ícono de ojo

export default function Login({ navigation }) {
    const [keyboardShow, setKeyboardShow] = useState();
    const [passwordInput, setPasswordInput] = useState(''); // Estado para guardar el valor del input de contraseña
    const [legajoInput, setLegajoInput] = useState(''); // Estado para guardar el valor del input de legajo
    const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar la contraseña
    const [fontsLoaded] = useFonts({
        "GothamRoundedMedium": require('../assets/fonts/GothamRoundedMedium_21022.ttf'),
    });

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

    function handlePasswordInputChange(value) {
        setPasswordInput(value);
    }

    function handleLegajoInputChange(value) {
        setLegajoInput(value);
    }




    const buttonFooterStyle = {
        width: '100%',
        height: 50,
        backgroundColor: ((passwordInput === '') || (isNaN(legajoInput) && legajoInput.length)) ? '#A0B875' : '#7BC100',
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


    return (
        <View style={styles.container}>
            {/* Header */}
            <View>
                {/* creo una imagen para logo */}
                <Image source={logo} style={styles.logoHeader} />
                <Text style={styles.title}>Ingresa a tu cuenta</Text>
            </View>

            {/* Formularios */}
            <View style={styles.forms}>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Legajo o DNI</Text>
                    <TextInput
                        style={styles.input}
                        value={legajoInput}
                        onChangeText={handleLegajoInputChange}
                        placeholder="Ingresa tu legajo o DNI"
                        placeholderTextColor="#959595"
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Contraseña</Text>
                    <View style={styles.passwordInputContainer}>
                        <TextInput
                            style={styles.passwordInput}
                            placeholder="Ingresa tu contraseña"
                            value={passwordInput}
                            onChangeText={handlePasswordInputChange}
                            placeholderTextColor="#959595"
                            secureTextEntry={!showPassword}
                        />
                        <TouchableOpacity
                            onPress={() => setShowPassword(!showPassword)}
                            style={styles.passwordToggleIcon}
                        >
                            <Icon
                                name={showPassword ? 'eye' : 'eye-slash'}
                                size={20}
                                color="#555"
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* Boton para ingresar */}
            <View style={footerContainer}>
                <TouchableOpacity style={buttonFooterStyle}>
                    <Text style={styles.buttonText}>Ingresar</Text>
                </TouchableOpacity>
                <Text style={styles.footerText} onPress={() => navigation.navigate('PasswordRecovery')}>Olvidé mi contraseña</Text>
            </View>
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
        marginTop: 4,
        fontSize: 20,
        // hago que la fuente sea gothan rounded
        fontFamily: 'GothamRoundedMedium',
        // establezo el line-height en 24px
        lineHeight: 24,
        // centro el texto
        textAlign: 'center',
        // aplico bold al texto
        fontWeight: 'bold',
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
});