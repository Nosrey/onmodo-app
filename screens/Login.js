import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Keyboard } from 'react-native';
// importo useFonts
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
// importo on-modo-grande.png de assets
import logo from '../assets/on-modo-grande.png';
import Icon from 'react-native-vector-icons/FontAwesome'; // Importa el ícono de ojo
// traigo useSelector
import { useSelector, useDispatch } from 'react-redux';
import Header from '../components/Header';
import Notification from '../components/Notification';

export default function Login({ navigation }) {
    const [notif, setNotif] = useState({ view: false, message: '', color: 'naranja' }); // notif es un booleano que indica si se muestra o no la notificacion
    const logged = useSelector((state) => state.logged);
    const dispatch = useDispatch();
    const [errorMessage, setErrorMessage] = useState(''); // Estado para mostrar/ocultar el error de input [true/false
    const [keyboardShow, setKeyboardShow] = useState();
    const [inputError, setInputError] = useState(false); // Estado para mostrar/ocultar el error de input [true/false]
    const [loginError, setLoginError] = useState(false); // Estado para mostrar/ocultar el error de login [true/false
    // const [passwordInput, setPasswordInput] = useState(''); // Estado para guardar el valor del input de contraseña2eKgjc19
    // const [legajoInput, setLegajoInput] = useState(''); // Estado para guardar el valor del input de legajo
    const [passwordInput, setPasswordInput] = useState('gXF4JdBi'); // Estado para guardar el valor del input de contraseña
    const [legajoInput, setLegajoInput] = useState('10013'); // Estado para guardar el valor del input de legajo
    const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar la contraseña
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

    // agrego un useEffect que revisa esta condicion y si se cumple alguna, pone el estado de inputError en true ((!passwordInput.length) || (!legajoInput.length) || (isNaN(legajoInput)))
    useEffect(() => {
        if ((!passwordInput.length) || (!legajoInput.length) || (isNaN(legajoInput))) {
            setInputError(true);
        } else {
            setInputError(false);
        }
    }, [passwordInput, legajoInput]);


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
        setLoginError(false)
    }

    function handleLegajoInputChange(value) {
        setLegajoInput(value);
        setLoginError(false);
    }

    // function handleLogin() {
    //     if (!inputError) {
    //     navigation.navigate('PasswordCreate')
    //     } else {
    //         setLoginError(true);
    //     }
    // }
    // hago un fetch a la api https://api.onmodoapp.com/api/login donde en el body envio con metodo post el legajo y la contraseña como strings asi { legajo: string, password:string}
    // si la respuesta es 200, navego a la pantalla Inicio
    function handleLogin() {
        if (!inputError && !logged) {
            dispatch({ type: 'counter/setLogged', payload: true });
            setErrorMessage('')
            fetch('https://api.onmodoapp.com/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    // convierto el legajoInput en string
                    legajo: legajoInput.toString(),
                    password: passwordInput.toString(),
                }),
            })
                .then((response) => response.json())
                .then((json) => {
                    if (json.success == true) {
                        // hago un dispatch que vuelva logged en true

                        // hago unos 3 dispatch que setean token, id y rol de json.response
                        dispatch({ type: 'counter/setToken', payload: json.response.token });
                        dispatch({ type: 'counter/setId', payload: json.response.id });
                        dispatch({ type: 'counter/setRol', payload: json.response.rol });
                        // ahora hago un fetch a https://api.onmodoapp.com/api/business/${idUser} donde idUser es el id del usuario logueado que esta en json.response.id y tras eso hago dispatch para fullName, legajo, number, puesto, rol, provincia, localidad y contratoComedor
                        fetch(`https://api.onmodoapp.com/api/business/${json.response.id}`, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        })
                            .then((response2) => response2.json())
                            .then((json2) => {
                                if (json2.success == true) {
                                    // hago unos dispatch que setean fullName, legajo, number, puesto, rol, provincia, localidad y contratoComedor de json.response
                                    dispatch({ type: 'counter/setFullName', payload: json2.response[0].fullName });
                                    dispatch({ type: 'counter/setLegajo', payload: json2.response[0].legajo });
                                    dispatch({ type: 'counter/setNumber', payload: json2.response[0].number });
                                    dispatch({ type: 'counter/setPuesto', payload: json2.response[0].puesto });
                                    dispatch({ type: 'counter/setProvincia', payload: json2.response[0].provincia });
                                    dispatch({ type: 'counter/setLocalidad', payload: json2.response[0].localidad });
                                    dispatch({ type: 'counter/setContratoComedor', payload: json2.response[0].contratoComedor });
                                    // reviso json2.response[0] y a todos los elementos que sean un array los guardo en otro array llamado formularios que sera un let
                                    let formularios = [];
                                    // recordamos que json2.response[0] es un objeto y ahora debo identificar que propiedades de dicho objeto es un array y guardarlas en formularios
                                    for (const [key, value] of Object.entries(json2.response[0])) {
                                        if (Array.isArray(value)) {
                                            formularios.push({ title: key, entries: value });
                                        }
                                    }
                                    // hago un dispatch que setee formularios con el valor de formularios
                                    dispatch({ type: 'counter/setFormularios', payload: formularios });
                                    // elimino el stack de navegacion
                                    setNotif({ view: true, message: '¡Actualizado correctamente!', color: 'verde' });
                                    navigation.reset({
                                        index: 0,
                                        routes: [{ name: 'Inicio' }],
                                    });
                                }
                            })
                            .catch((error) => {
                                setNotif({ view: true, message: 'Ups, algo salio mal', color: 'naranja' });
                                dispatch({ type: 'counter/setLogged', payload: false });
                                console.error(error);
                            });
                    } else {
                        setErrorMessage("La contraseña o el legajo es incorrecto");
                        setLoginError(true);
                        dispatch({ type: 'counter/setLogged', payload: false });
                    }
                })
                .catch((error) => {
                    setNotif({ view: true, message: 'Ups, algo salio mal', color: 'naranja' });
                    dispatch({ type: 'counter/setLogged', payload: false });
                    console.error(error);
                });
        } else {
            if (isNaN(legajoInput)) setErrorMessage('Los datos ingresados no son validos, el legajo debe ser un número')
            setLoginError(true);
        }
    }

    const buttonFooterStyle = {
        width: '100%',
        height: 50,
        backgroundColor: (inputError || logged) ? '#A0B875' : '#7BC100',
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
        { title: "Ingresa a tu cuenta", style: "titleLogin" },
    ]

    return (
        <View style={styles.container}>
            <Notification params={notif} notif={notif} setNotif={setNotif} />
            {/* Header */}
            <Header cajaText={cajaText} unElemento={true} />

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
                <Text style={passwordError}>{errorMessage}</Text>
            </View>

            {/* Boton para ingresar */}
            <View style={footerContainer}>
                <TouchableOpacity style={buttonFooterStyle} onPress={handleLogin}>
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
        fontFamily: "GothamRoundedMedium",
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
        fontFamily: "GothamRoundedMedium",
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
        fontFamily: 'GothamRoundedMedium',
        color: '#fff',
        fontSize: 16,
    },
    footerText: {
        fontFamily: "GothamRoundedMedium",
        // centro el texto
        textAlign: 'center',
        // pongo color de texto #000000;
        color: '#000000',
        marginTop: 10,
    },
});

