import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Button, Image, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import logo from '../assets/on-modo-grande.png';
import ButtonBar from '../components/ButtonBar';
// importo useSelector, useDispatch
import { useSelector, useDispatch } from 'react-redux';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import Header from '../components/Header';
import Buscador from '../components/Buscador';

export default function Inicio({ navigation }) {
    const [fontsLoaded] = useFonts({
        "GothamRoundedMedium": require('../assets/fonts/GothamRoundedMedium_21022.ttf'),
        "GothamRoundedBold": require('../assets/fonts/GothamRoundedBold_21016.ttf')
    });
    const logged = useSelector((state) => state.logged);

    if (logged == false) {
        navigation.replace('Login');
    }
    // traigo igualmente token, id y rol
    const fullName = useSelector((state) => state.fullName);
    const rol = useSelector((state) => state.rol);

    // creo un estado para guardar el valor del input
    const [inputValue, setInputValue] = useState('');

    // Definir las opciones del menú según el rol del usuario
    let cards = [];

    if (rol == '1') {
        cards = [
            {
                title: 'Formularios',
                onPress: () => navigation.navigate('Formularios')
            },
            {
                title: 'Formularios cargados',
                onPress: () => navigation.navigate('FormulariosCargados')
            },
            {
                title: 'Documentación',
                onPress: () => console.log('cambiando de pagina')
            },
        ];
    } else if (rol == '2') {
        cards = [
            {
                title: 'Formularios',
                onPress: () => navigation.navigate('Formularios')
            },
            {
                title: 'Formularios cargados',
                onPress: () => navigation.navigate('FormulariosCargados')
            },
            {
                title: 'Documentación',
                onPress: () => console.log('cambiando de pagina')
            },
            {
                title: 'Recordatorios',
                onPress: () => console.log('cambiando de pagina')
            },
            {
                title: 'Solicitudes de Edición',
                onPress: () => console.log('cambiando de pagina')
            },
            {
                title: 'Legajos',
                onPress: () => navigation.navigate('Legajos')
            },
            {
                title: 'Cuentas',
                onPress: () => navigation.navigate('CreateAccount')
            },
        ];
    } else if (rol == '3') {
        cards = [
            {
                title: 'Estadísticas',
                onPress: () => console.log('cambiando de pagina')
            },
            {
                title: 'Formularios',
                onPress: () => navigation.navigate('Formularios')
            },
            {
                title: 'Formularios cargados',
                onPress: () => navigation.navigate('FormulariosCargados')
            },
            {
                title: 'Documentación',
                onPress: () => console.log('cambiando de pagina')
            },
            {
                title: 'Solicitudes de Edición',
                onPress: () => console.log('cambiando de pagina')
            },
            {
                title: 'Legajos',
                onPress: () => navigation.navigate('Legajos')
            },
            {
                title: 'Cuentas',
                onPress: () => navigation.navigate('CreateAccount')
            },
        ];
    } else if (rol == '4') {
        cards = [
            {
                title: 'Estadísticas',
                onPress: () => console.log('cambiando de pagina')
            },
            {
                title: 'Solicitudes de Edición',
                onPress: () => console.log('cambiando de pagina')
            },
            {
                title: 'Legajos',
                onPress: () => navigation.navigate('Legajos')
            },
            {
                title: 'Cuentas',
                onPress: () => navigation.navigate('CreateAccount')
            },
        ];
    }


    // creo un estado llamadon buttonsFoundos para guardar los buttons que coincidan con el valor del input
    const [cardsFound, setCardsFound] = useState(cards);

    useEffect(() => {
        async function prepare() {
            await SplashScreen.preventAutoHideAsync();
        }
        prepare();
    }, []);

    if (!fontsLoaded) return undefined;
    else SplashScreen.hideAsync();

    // creo una función que se ejecutará cada vez que cambie el valor del input
    const handleInputChange = (value) => {
        // guardo el valor del input en el estado inputValue
        setInputValue(value);
        let inputLocal = value;
        // convierto el inputLocal en minusculas
        inputLocal = inputLocal.toLowerCase();
        // creo un array donde guardaré los buttons que coincidan con el valor del input al filtrar
        setCardsFound(cards.filter((item) => {
            let itemTitle = item.title.toLowerCase();
            if (itemTitle.includes(inputLocal)) return item
        }))
    }

    let cajaTextoHeader = [
        { title: "| Inicio", style: "title" },
        { title: "Nivel " + rol, style: "title" }
    ];

    return (
        <View style={styles.container}>
            <View>
                <Header cajaText={cajaTextoHeader} />
            </View>

            <ScrollView>
                <View style={styles.containerBox}>
                    {/* creo estos buttons en base a los que tengo en el array cardsFound */}
                    {cardsFound.map((boton, i) => (
                        <TouchableOpacity key={i} style={styles.box} onPress={boton.onPress}>
                            <Text style={styles.boxTitle}>
                                {boton.title}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>

            <ButtonBar navigation={navigation} />

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 12,
        paddingTop: 16,
        backgroundColor: '#fff',
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    headerTextContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    logoHeader: {
        resizeMode: 'center',
        width: 160,
        height: 40,
        // centro de manera horizontal la imagen
        alignSelf: 'center',
    },
    containerBox: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: "100%",
        paddingBottom: 10,

        // justifyContent: 'space-around',
        // marginTop: 20,
    },
    box: {
        // width: 150,
        width: "45%",
        marginHorizontal: "2.5%",
        height: 100,
        borderRadius: 10,
        marginTop: 15,
        backgroundColor: '#E7E7E7',
        justifyContent: 'center',
        padding: 5,
    },
    boxTitle: {
        textAlign: 'center',
        justifyContent: 'center',
        fontFamily: "GothamRoundedMedium",
        fontSize: 12,

    },
    title: {
        fontSize: 24,
        paddingLeft: 16,
        paddingRight: 16,
        marginTop: 30,
        fontSize: 20,
        textAlign: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        fontFamily: "GothamRoundedBold"
    },
    titleRol: {
        fontSize: 24,
        paddingLeft: 16,
        paddingRight: 16,
        marginTop: 30,
        fontSize: 20,
        textAlign: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        fontFamily: "GothamRoundedMedium"
    },

    label: {
        color: '#555',
        marginBottom: 5,
        fontSize: 16,
    },
    inputContainer: {
        marginBottom: 10,
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#C3C3C3',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        marginLeft: 16,
        marginRight: 16,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#C3C3C3',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
    },
    input: {
        fontFamily: "GothamRoundedMedium",
        flex: 1,
        height: 40,
        color: '#C3C3C3',
        fontSize: 14,
    },
    searchIcon: {
        padding: 15,
    },

});