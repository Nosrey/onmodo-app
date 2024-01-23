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
import { API_URL } from '../functions/globalFunctions';

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
    const [legajoInput, setLegajoInput] = useState('333'); // 3986722 -- Estado para guardar el valor del input de legajo
    const [passwordInput, setPasswordInput] = useState('123'); // Estado para guardar el valor del input de contraseña
    const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar la contraseña
    const [fontsLoaded] = useFonts({
        "GothamRoundedMedium": require('../assets/fonts/GothamRoundedMedium_21022.ttf'),
        "GothamRoundedBold": require('../assets/fonts/GothamRoundedBold_21016.ttf')
    });

    // hago un dispatch a setLogo y lo vacio ''
    useEffect(() => {
        dispatch({ type: 'counter/setLogo', payload: '' });
    }, []);

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
    // hago un fetch a la api ${API_URL}/api/login donde en el body envio con metodo post el legajo y la contraseña como strings asi { legajo: string, password:string}
    // si la respuesta es 200, navego a la pantalla Inicio
    function handleLogin() {
        if (!inputError && !logged) {
            dispatch({ type: 'counter/setLogged', payload: true });
            setErrorMessage('')

            fetch(`${API_URL}/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    // convierto el legajoInput en string
                    legajo: legajoInput.toString(),
                    password: passwordInput.toString(),
                })
            })
                .then((response) => response.json())
                .then((json) => {
                    if (json?.success == true) {
                        // hago un dispatch que vuelva logged en true

                        // hago unos 3 dispatch que setean token, id y rol de json.response
                        dispatch({ type: 'counter/setToken', payload: json.response.token });
                        dispatch({ type: 'counter/setId', payload: json.response.id });
                        dispatch({ type: 'counter/setRol', payload: json.response.rol });
                        // ahora hago un fetch a ${API_URL}/api/business/${idUser} donde idUser es el id del usuario logueado que esta en json.response.id y tras eso hago dispatch para fullName, legajo, number, puesto, rol, provincia, localidad y contratoComedor
                        fetch(`${API_URL}/api/business/${json.response.id}`, {
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
                                    dispatch({ type: 'counter/setImgProfile', payload: json2.response[0].imgProfile })
                                    dispatch({ type: 'counter/setLegajo', payload: json2.response[0].legajo });
                                    dispatch({ type: 'counter/setNumber', payload: json2.response[0].number });
                                    dispatch({ type: 'counter/setPuesto', payload: json2.response[0].puesto });
                                    dispatch({ type: 'counter/setProvincia', payload: json2.response[0].provincia });
                                    dispatch({ type: 'counter/setLocalidad', payload: json2.response[0].localidad });
                                    dispatch({ type: 'counter/setContratoComedor', payload: json2.response[0].contratoComedor });
                                    dispatch({ type: 'counter/setBusiness', payload: json2.response[0].business });

                                    // hago un fetch GET a la url de la api + /api/recordatorio/${business}
                                    let url = API_URL + '/api/recordatorio/' + json2.response[0].business;
                                    fetch(url)
                                        // convierto la respuesta a json
                                        .then((response) => response.json())
                                        // seteo el estado de listaTareas con la respuesta
                                        .then((json) => {
                                            let array = []
                                            for (let i = 0; i < json.recordatorios?.length; i++) {
                                                let item = json.recordatorios[i];
                                                // dentro de item.fechas es un array, busco el que tenga la fecha mas proxima sin estar en true el valor ejecutado

                                                let proxFecha = item?.fechas.find((fecha) => fecha.ejecutado === false);
                                                if (!proxFecha) {
                                                    proxFecha = {
                                                        fecha: ''
                                                    }
                                                }

                                                const FrecuenciaToDias = {
                                                    Mensual: 7,
                                                    Bimestral: 7,
                                                    Trimestral: 30,
                                                    Semestral: 30,
                                                    Anual: 60,
                                                    'Cada 2 años': 60,
                                                };

                                                const parseFecha = (fechaString) => {
                                                    const parts = fechaString.split('/');
                                                    if (parts?.length === 3) {
                                                        const dia = parseInt(parts[0], 10);
                                                        const mes = parseInt(parts[1], 10);
                                                        const año = parseInt(parts[2], 10);
                                                        if (!isNaN(dia) && !isNaN(mes) && !isNaN(año)) {
                                                            return new Date(año, mes - 1, dia); // Resta 1 al mes, ya que los meses en JavaScript van de 0 a 11.
                                                        }
                                                    }
                                                    return null;
                                                };

                                                const evaluarFechaYFrecuencia = (fechaString, frecuencia) => {
                                                    const fechaActual = new Date();
                                                    const fechaLimite = parseFecha(fechaString);

                                                    // Comprueba si la fecha ya pasó
                                                    if (fechaLimite === null) {
                                                        return 'verde'
                                                    }
                                                    else if (fechaActual > fechaLimite) {
                                                        return 'invalido';
                                                    }


                                                    // Comprueba si la fecha está próxima según la frecuencia
                                                    const umbralDias = FrecuenciaToDias[frecuencia];
                                                    // creo una nueva fecha en let fechaUmbral que es igual a fechaLimite menos los dias de umbralDias
                                                    let fechaUmbral = new Date(fechaLimite);
                                                    fechaUmbral.setDate(fechaUmbral.getDate() - umbralDias);

                                                    if (fechaActual > fechaLimite) {
                                                        return 'invalido';
                                                    } else if (fechaActual > fechaUmbral && fechaActual < fechaLimite) {
                                                        return 'pendiente';
                                                    } else {
                                                        return 'verde';
                                                    }

                                                    return 'verde ';
                                                };

                                                function gestionarFechas(item) {
                                                    if (!item.fechas?.length && !item.fechaInicio) {
                                                        let fecha = item.createdAt.split('T')[0].split('-');
                                                        fecha = fecha[2] + '/' + fecha[1] + '/' + fecha[0];
                                                        return fecha
                                                    } else if (!item.fechas?.length && item.fechaInicio) {

                                                        return item.fechaInicio
                                                    } else {
                                                        // obtnego la fecha mas proxima con la propiedad ejecutado en false
                                                        let proxFecha = item.fechas.find((fecha) => fecha.ejecutado === false);
                                                        if (!proxFecha && !item.fechaInicio) {
                                                            let fecha = item.createdAt.split('T')[0].split('-');
                                                            fecha = fecha[2] + '/' + fecha[1] + '/' + fecha[0];
                                                            return fecha
                                                        } else if (!proxFecha && item.fechaInicio) {

                                                            return item.fechaInicio
                                                        } else {
                                                            // paso la fecha de formato string a formato 2023-11-17T20:36:42.088Z a 11/17/2023
                                                            return proxFecha?.fecha
                                                        }
                                                    }
                                                }

                                                function gestionarRealizado(item, fecha) {
                                                    // reviso si tiene length en fechas
                                                    if (!item.fechas?.length) {
                                                        return null
                                                    } else {
                                                        // en base a fecha, ubico dentro de item.fechas el elemento que tenga esa fecha
                                                        let index = item.fechas.findIndex((fechaItem) => fechaItem.fecha === fecha);
                                                        // si no lo encuentra, retorno null
                                                        if (index === -1) {
                                                            return null
                                                        } else {
                                                            // si lo encuentra, retorno el valor de ejecutado
                                                            return item.fechas[index].ejecutado
                                                        }
                                                    }
                                                }

                                                let itemFinal = {}

                                                if (!item?.fechas?.length || item?.status !== 'En curso') {
                                                    itemFinal = {
                                                        _id: item._id,
                                                        // status: evaluarFechaYFrecuencia(proxFecha?.fecha, item.frecuencia),
                                                        status: "verde",
                                                        tarea: item.tarea,
                                                        descripcion: item.descripcion,
                                                        link: item.link,
                                                        linkTitle: item.linkTitle,
                                                        statusRecordatorio: item.status,
                                                        realizado: gestionarRealizado(item, gestionarFechas(item)),
                                                        frecuencia: item.frecuencia,
                                                        fechaInicio: item.fechaInicio,
                                                        fechas: item.fechas,
                                                        fechaDeCard: gestionarFechas(item)
                                                    }
                                                    array.push(itemFinal);
                                                }
                                                else {
                                                    // obtengo el indice del elemento en item.fechas que tenga la fecha mas proxima y que tenga la propiedad ejecutado en false
                                                    let index = item.fechas.findIndex((fecha) => fecha.ejecutado === false);
                                                    // si no hay ninguno que tenga la propiedad ejecutado en false, obtengo el ultimo elemento del array
                                                    if (index === -1) {
                                                        index = item?.fechas?.length - 1;
                                                    }
                                                    // ahora pusheo en array todos los elementos hasta el indice que obtuve
                                                    for (let j = 0; j < index + 1; j++) {
                                                        let itemFinalInterno = {
                                                            _id: item._id,
                                                            status: evaluarFechaYFrecuencia(item.fechas[j].fecha, item.frecuencia),
                                                            tarea: item.tarea,
                                                            descripcion: item.descripcion,
                                                            link: item.link,
                                                            linkTitle: item.linkTitle,
                                                            statusRecordatorio: item.status,
                                                            realizado: gestionarRealizado(item, item?.fechas[j]?.fecha),
                                                            frecuencia: item.frecuencia,
                                                            fechaInicio: item?.fechas[j]?.fecha,
                                                            fechas: item.fechas,
                                                            fechaDeCard: item?.fechas[j]?.fecha
                                                        }
                                                        array.push(itemFinalInterno);
                                                    }
                                                }
                                            }
                                            // ordeno el array en base a su fechaDeCard colocando primero los que tengan fecha mas proxima

                                            array.sort((a, b) => {
                                                const dateA = new Date(a.fechaDeCard.split('/').reverse().join('-'));
                                                const dateB = new Date(b.fechaDeCard.split('/').reverse().join('-'));

                                                if (dateA > dateB) {
                                                    return 1;
                                                }
                                                if (dateA < dateB) {
                                                    return -1;
                                                }
                                                return 0;
                                            })
                                            dispatch({ type: 'counter/setListaRecordatorios', payload: array });
                                        })
                                        // si hay un error lo muestro en consola
                                        .catch((error) => {
                                            console.error('error en recordatorios: ', error)
                                        })
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
                                    url = API_URL + "/api/newbusiness/" + json2.response[0].business;
                                    fetch(url)
                                        .then((response) => response.json())
                                        // setLogo(state, action) {
                                        //     state.logo = action.payload;
                                        //   },
                                        .then((json) => {
                                            if (json.success == true) {
                                                dispatch({ type: 'counter/setLogo', payload: json.response.logo });
                                                dispatch({ type: 'counter/setDocumento', payload: json.response.linkDocumentacion });
                                            }
                                        })
                                        .catch((error) => {
                                            console.error('error en newBusiness: ', error)
                                        })


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
                    console.error('algo fallo: ', error);
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

