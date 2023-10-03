// creo un nuevo componente
import React, { useState, useEffect } from 'react';
// importo de react native el view, text, image, stylesheets, touchableOpacity
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Keyboard, ScrollView, Button } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import logo from '../assets/on-modo-grande.png';
import Icon from 'react-native-vector-icons/FontAwesome'; // Importa el ícono de ojo
// importo la imagen profileImg.png
import profileImg from '../assets/profileImg.jpeg';
// traigo useDispatch de react-redux
import { useDispatch, useSelector } from 'react-redux';
import ButtonBar from '../components/ButtonBar';
import Header from '../components/Header';
// importo confirmScreen
import ConfirmScreen from '../components/ConfirmScreen';
import BlackWindow from '../components/BlackWIndow';
import notImg from '../assets/notImg.png'
import * as ImagePicker from 'expo-image-picker';
import { PUESTOS_N1, PUESTOS_N2 } from '../functions/globalFunctions';


export default function CreateAccount({ navigation }) {
    const dispatch = useDispatch();
    // preparo las constantes para fullName, legajo, number, puesto, rol, provincia, localidad y contratoComedor del redux
    const fullName = useSelector(state => state.fullName);
    const legajo = useSelector(state => state.legajo);
    const number = useSelector(state => state.number);
    const puesto = useSelector(state => state.puesto);
    const rol = useSelector(state => state.rol);
    const provincia = useSelector(state => state.provincia);
    const localidad = useSelector(state => state.localidad);
    const contratoComedor = useSelector(state => state.contratoComedor);
    const [editable, setEditable] = useState(false); // Estado para habilitar/deshabilitar la edición de los inputs [true/false]

    const [loginError, setLoginError] = useState(false); // Estado para mostrar/ocultar el error de login [true/false]
    const [fontsLoaded] = useFonts({
        "GothamRoundedMedium": require('../assets/fonts/GothamRoundedMedium_21022.ttf'),
    });
    const [keyboardShow, setKeyboardShow] = useState();
    const [viewCloseSesion, setViewCloseSesion] = useState(false);

    const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
    const [image, setImage] = useState(null);

    const [profileInputs, setProfileInputs] = useState({
        imagen: null,
        nombre: '',
        legajo: '',
        telefono: '',
        email: '',
        nivel: 1,
        puesto: '',
        provincia: '',
        localidad: '',
        contratoComedor: '',
    });
    const [provincias, setProvincias] = useState([]);
    const [localidades, setLocalidades] = useState([]);


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

    useEffect(() => {
        (async () => {
            const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
            setHasGalleryPermission(galleryStatus.status === 'granted');
        })();
    }, []);

    // use effecto que se ejecuta solo una vez
    useEffect(() => {
        const getProvincias = async () => {
            try {
                const resp = await fetch("https://apis.datos.gob.ar/georef/api/provincias?campos=id,nombre");
                const data = await resp.json();
                let provincias = data.provincias.sort((a, b) => a.nombre.localeCompare(b.nombre));
                setProvincias(provincias);
                return provincias;
            } catch (error) {
                console.error('Error:', error);
                throw new Error('No se pudo obtener los datos del usuario.');
           }
        };
        getProvincias()
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

    function handleCloseSesion() {
        // elimino el stack de navegacion
        dispatch({ type: 'counter/setLogged', payload: false });
        dispatch({ type: 'counter/setToken', payload: '' });
        dispatch({ type: 'counter/setId', payload: '' });
        dispatch({ type: 'counter/setRol', payload: '' });

        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
        });
    }

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images, // Solo imágenes
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1,
        });

        if (!result.canceled) {
            setProfileInputs({ ...profileInputs, imagen: result.assets[0].uri });

        }
    }

    function handleEditButton() {
        setEditable(!editable);
    }
    const buttonFooterStyle = {
        width: '48%',
        marginHorizontal: '1%',
        height: 50,
        backgroundColor: '#7BC100',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    };

    const getLocalidades = async (idProv) => {
        try {
          const resp = await fetch(`https://apis.datos.gob.ar/georef/api/municipios?provincia=${idProv}&campos=id,nombre&max=500`);
          const data = await resp.json();
          let final = data.municipios.sort((a, b) => a.nombre.localeCompare(b.nombre));
          return final

        } catch (error) {
          console.error('Error:', error);
          throw new Error('No se pudo obtener los datos del usuario.');
        }
      };

    const footerContainer = {
        // hago que el elemento este al fondo de la pagina o pantalla
        // position: 'absolute',
        // bottom: keyboardShow ? -40 : 15,
        // lo centro
        marginVertical: 40,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        flex: 1,
        alignSelf: 'center',
    }

    const editarTextBtn = {
        color: (editable) ? 'white' : '#A0B875',
    }

    const editarBtn = {
        backgroundColor: (editable) ? '#7BC100' : 'white',
        // borde de 2px color #7BC100
        borderWidth: 2,
        borderColor: '#7BC100',
    }

    const tlfInput = {
        flex: 1,
        height: 40,
        color: "black",
        fontSize: 16,
        fontFamily: "GothamRoundedMedium"
        // cambio el color del placeholder de este textInput a #C3C3C3
    }

    let params = {
        title: '¿Quieres cerrar sesión?',
        message: '',
        viewWindow: viewCloseSesion,
        setViewWindow: setViewCloseSesion,
        action: handleCloseSesion,
        data: '',
        botonNo: "Cancelar",
        botonYes: "Cerrar sesión",
    }


    let cajaText = [
        { title: '| Crear cuenta', style: "titleProfile" },
    ]



    if (hasGalleryPermission === false) {
        return <Text style={{textAlign: 'center', fontFamily: 'GothamRoundedBold', fontSize: 25, paddingHorizontal: "20%", marginTop: 60}}>Acceso denegado a la galería</Text>;
    }


    return (
        <View style={styles.container}>
            <BlackWindow visible={viewCloseSesion} setVisible={setViewCloseSesion} />
            <ConfirmScreen navigation={navigation} params={params} />
            <ScrollView>
                <Header cajaText={cajaText} />

                <TouchableOpacity onPress={pickImage} style={{display: "flex", justifyContent: "center", alignItems: "center", marginBottom: 20}}>
                    <Image source={(profileInputs.imagen) ? { uri: profileInputs.imagen } : notImg} style={styles.profileImg} />
                    <TouchableOpacity onPress={pickImage} style={[buttonFooterStyle, {width: "40%"}]}>
                        <Text style={[styles.buttonText]}>Cambiar imagen</Text>
                    </TouchableOpacity>

                </TouchableOpacity>
                
                {/* Formularios */}
                <View style={styles.form}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Nombre y apellido</Text>
                        <View style={styles.passwordInputContainer}>
                            <TextInput
                                value={profileInputs.nombre}
                                onChange={(e) => setProfileInputs({ ...profileInputs, nombre: e.nativeEvent.text })}
                                style={styles.userInput}
                                placeholder={"Nombre y apellido"}
                                placeholderTextColor="#C3C3C3"
                            />
                        </View>
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Número de legajo o DNI</Text>
                        <View style={styles.passwordInputContainer}>
                            <TextInput
                                value={profileInputs.legajo}
                                onChange={(e) => setProfileInputs({ ...profileInputs, legajo: e.nativeEvent.text })}
                                style={styles.userInput}
                                placeholder={"Número de legajo o DNI"}
                                placeholderTextColor="#C3C3C3"
                            />
                        </View>
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Número de contacto</Text>
                        <View style={styles.passwordInputContainer}>
                            <TextInput
                                value={profileInputs.telefono}
                                onChange={(e) => setProfileInputs({ ...profileInputs, telefono: e.nativeEvent.text })}
                                style={tlfInput}
                                placeholder={"Número de contacto"} 
                            />
                        </View>
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Correo electrónico</Text>
                        <View style={styles.passwordInputContainer}>
                            <TextInput
                                value={profileInputs.email}
                                onChange={(e) => setProfileInputs({ ...profileInputs, email: e.nativeEvent.text })}
                                style={tlfInput}
                                placeholder={"Correo electrónico"} 
                            />
                        </View>
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Nivel</Text>
                        <View style={styles.passwordInputContainer}>
                            {/* hago un picker que muestre la palabra "Nivel 1" si el rol equivale a 1, asi del 1 a 4 y que no se pueda editar */}

                            <Picker
                                selectedValue={profileInputs.nivel}
                                onValueChange={(itemValue, itemIndex) => {
                                    setProfileInputs({ ...profileInputs, nivel: itemValue })
                                    if (itemValue == 1) setProfileInputs({ ...profileInputs, nivel: itemValue, puesto: PUESTOS_N1[0] })
                                    else if (itemValue == 2) setProfileInputs({ ...profileInputs, nivel: itemValue, puesto: PUESTOS_N2[0] })
                                    else setProfileInputs({ ...profileInputs, nivel: itemValue, puesto: '' })
                                }}
                                style={styles.userInput}>
                                <Picker.Item label="Nivel 1" value="1" />
                                { }
                                {(rol > 2) ? <Picker.Item label="Nivel 2" value="2" /> : null}
                                {(rol > 3) ? <Picker.Item label="Nivel 3" value="3" /> : null}
                            </Picker>
                        </View>
                    </View>
                    <View style={[styles.inputContainer, { display: (profileInputs.nivel > 2) ? 'none' : 'flex' }]}>
                        <Text style={styles.label}>Puesto</Text>
                        <View style={styles.passwordInputContainer}>
                            <Picker
                                selectedValue={profileInputs.puesto}
                                onValueChange={(itemValue, itemIndex) => setProfileInputs({ ...profileInputs, puesto: itemValue })}
                                style={styles.userInput}>

                                {(profileInputs.nivel == 1) ? PUESTOS_N1.map((puesto, index) => {
                                    return <Picker.Item key={index} label={puesto} value={puesto} />
                                }) : PUESTOS_N2.map((puesto, index) => {
                                    return <Picker.Item key={index} label={puesto} value={puesto} />
                                })}
                            </Picker>
                        </View>
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Provincia</Text>
                        <View style={styles.passwordInputContainer}>
                            <Picker
                                selectedValue={profileInputs.provincia}
                                onValueChange={(itemValue, itemIndex) => {
                                    setProfileInputs({ ...profileInputs, provincia: itemValue });
                                    let objetoItemValue = provincias.find((provincia) => provincia.nombre == itemValue);
                                    getLocalidades(objetoItemValue.id).then((localidades) => {
                                        setLocalidades(localidades)
                                        setProfileInputs({ ...profileInputs, provincia: itemValue, localidad: localidades[0].nombre });
                                    });
                                }}
                                style={styles.userInput}>
                                {provincias?.map((provincia, index) => {
                                    return <Picker.Item key={index} label={provincia.nombre} value={provincia.nombre} />                                        
                                })}
                            </Picker>
                        </View>                        
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Localidad</Text>
                        <View style={styles.passwordInputContainer}>
                            <Picker
                                selectedValue={profileInputs.localidad}
                                onValueChange={(itemValue, itemIndex) => setProfileInputs({ ...profileInputs, localidad: itemValue })}
                                style={styles.userInput}>
                                {localidades?.map((localidad, index) => {
                                    return <Picker.Item key={index} label={localidad.nombre} value={localidad.nombre} />
                                })}
                            </Picker>
                        </View>
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Contrato/Comedor</Text>
                        <View style={styles.passwordInputContainer}>
                            <TextInput
                                value={profileInputs.contratoComedor}
                                onChange={(e) => setProfileInputs({ ...profileInputs, contratoComedor: e.nativeEvent.text })}
                                style={styles.userInput}
                                placeholder={"Contrato/Comedor"}
                            />
                        </View>
                    </View>

                </View>


                <View style={[footerContainer, {display: "flex", alignItems: "center", justifyContent: "center"}]}>
                    <TouchableOpacity style={[buttonFooterStyle,{backgroundColor: "#A0B875", width: "95%"}]}>
                        <Text style={[styles.buttonText]}>Crear cuenta</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>

            <ButtonBar navigation={navigation} />
        </View>
    );
}

const styles = StyleSheet.create({
    form: {

    },
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
        textAlign: 'left',
        // aplico bold al texto
    },
    container: {
        flex: 1,
        padding: 12,
        // padding top en 24px
        paddingTop: 24,
        backgroundColor: '#fff',
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
        color: 'black',
        fontSize: 16,
        fontFamily: "GothamRoundedMedium"
        // cambio el color del placeholder de este textInput a #C3C3C3

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
        fontFamily: "GothamRoundedMedium"
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
});