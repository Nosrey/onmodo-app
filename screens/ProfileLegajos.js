// creo un nuevo componente
import React, { useState, useEffect } from 'react';
// importo de react native el view, text, image, stylesheets, touchableOpacity
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Keyboard, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import logo from '../assets/on-modo-grande.png';
import Icon from 'react-native-vector-icons/FontAwesome'; // Importa el ícono de ojo
// importo la imagen profileImg.png
import profileImg from '../assets/pi.jpg';
// traigo useDispatch de react-redux
import { useDispatch, useSelector } from 'react-redux';
import ButtonBar from '../components/ButtonBar';
import Header from '../components/Header';
// importo confirmScreen
import ConfirmScreen from '../components/ConfirmScreen';
import BlackWindow from '../components/BlackWIndow';


export default function ProfileLegajos({ navigation }) {
    const dispatch = useDispatch();
    // preparo las constantes para fullName, legajo, number, puesto, rol, provincia, localidad y contratoComedor del redux
    // const fullName = useSelector(state => state.legajoProfile.fullName);
    // const imgProfile = useSelector(state => state.legajoProfile.imgProfile);
    // const legajo = useSelector(state => state.legajoProfile.legajo);
    // const number = useSelector(state => state.legajoProfile.number);
    // const puesto = useSelector(state => state.legajoProfile.puesto);
    // const rol = useSelector(state => state.legajoProfile.rol);
    // const provincia = useSelector(state => state.legajoProfile.provincia);
    // const localidad = useSelector(state => state.legajoProfile.localidad);
    // const contratoComedor = useSelector(state => state.legajoProfile.contratoComedor);
    const { fullName = '', imgProfile = '', legajo = '', number = '', puesto = '', rol = '', provincia = '', localidad = '', contratoComedor = '' } = useSelector(state => state.legajoProfile);
    const [editable, setEditable] = useState(false); // Estado para habilitar/deshabilitar la edición de los inputs [true/false]

    const [loginError, setLoginError] = useState(false); // Estado para mostrar/ocultar el error de login [true/false]
    const [fontsLoaded] = useFonts({
        "GothamRoundedMedium": require('../assets/fonts/GothamRoundedMedium_21022.ttf'),
    });
    const [keyboardShow, setKeyboardShow] = useState();
    const [viewCloseSesion, setViewCloseSesion] = useState(false);


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
        color: (editable) ? 'black' :'#C3C3C3',
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
        {title: ' ', style: "titleProfile"},
    ]

    return (
        <View style={styles.container}>
            <BlackWindow visible={viewCloseSesion} setVisible={setViewCloseSesion} />
            <ConfirmScreen navigation={navigation} params={params}/>
            <ScrollView style={{marginBottom: 24}}>
                <Header cajaText={cajaText}/>

                {/* <Image source={"imgProfile"} style={styles.profileImg} /> */}
                {/* coloco una imagen asi pero a este link https://perfil-onmodo.s3.us-east-2.amazonaws.com/88dce68cab6d47a9ae330037bbcc732c */}
                {imgProfile?.length ? <Image source={{ uri: imgProfile  }} style={styles.profileImg} />
                : <Image source={ profileImg } style={styles.profileImg} />}
                {/* <Image source={ profileImg } style={styles.profileImg} /> */}

                {/* Formularios */}
                <View style={styles.form}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Nombre y apellido</Text>
                        <View style={styles.passwordInputContainer}>
                            <TextInput
                                enabled={false}
                                style={styles.userInput}
                                placeholder={fullName}
                                placeholderTextColor="#C3C3C3"
                            />
                        </View>
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Número de legajo o DNI</Text>
                        <View style={styles.passwordInputContainer}>
                            <TextInput
                                enabled={false}
                                style={styles.userInput}
                                placeholder={legajo}
                                placeholderTextColor="#C3C3C3"
                            />
                        </View>
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Número de contacto</Text>
                        <View style={styles.passwordInputContainer}>
                            <TextInput
                                editable={(editable) ? true : false}
                                style={tlfInput}
                                placeholder={number}
                                placeholderTextColor={(editable) ? 'black' : "#C3C3C3"}
                            />
                        </View>
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Nivel</Text>
                        <View style={styles.passwordInputContainer}>
                            {/* hago un picker que muestre la palabra "Nivel 1" si el rol equivale a 1, asi del 1 a 4 y que no se pueda editar */}
                            
                            <Picker
                                selectedValue={rol.toString()}
                                enabled={false}
                                style={styles.userInput}>
                                <Picker.Item label="Nivel 1" value="1" />
                                <Picker.Item label="Nivel 2" value="2" />
                                <Picker.Item label="Nivel 3" value="3" />
                                <Picker.Item label="Nivel 4" value="4" />
                            </Picker>
                        </View>
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Puesto</Text>
                        <View style={styles.passwordInputContainer}>          
                        <Picker
                                selectedValue={puesto.toString()}
                                enabled={false}
                                style={styles.userInput}>
                                <Picker.Item label={puesto.toString()} value={puesto.toString()} />
                            </Picker>
                        </View>
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Provincia</Text>
                        <View style={styles.passwordInputContainer}>
                            <Picker
                                selectedValue={provincia.toString()}
                                enabled={false}
                                style={styles.userInput}>
                                <Picker.Item label={provincia.toString()} value={provincia.toString()} />
                            </Picker>
                        </View>
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Localidad</Text>
                        <View style={styles.passwordInputContainer}>
                            <Picker
                                selectedValue={localidad.toString()}
                                enabled={false}
                                style={styles.userInput}>
                                <Picker.Item label={localidad.toString()} value={localidad.toString()} />
                            </Picker>
                        </View>
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Contrato/Comedor</Text>
                        <View style={styles.passwordInputContainer}>
                            <TextInput
                                enabled={false}
                                style={styles.userInput}
                                placeholder={contratoComedor}
                                placeholderTextColor="#C3C3C3"
                            />
                        </View>
                    </View>

                </View>
            </ScrollView>

            <ButtonBar navigation={navigation}/>
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
        color: '#C3C3C3',
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
        marginTop: 0,
        marginBottom: 15,
    },
});