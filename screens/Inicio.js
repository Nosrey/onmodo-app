import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Button, Image, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import logo from '../assets/on-modo-grande.png';
import ButtonBar from '../components/ButtonBar';
// importo useSelector, useDispatch
import { useSelector, useDispatch } from 'react-redux';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

export default function Inicio({ navigation }) {
    const [fontsLoaded] = useFonts({
        "GothamRoundedMedium": require('../assets/fonts/GothamRoundedMedium_21022.ttf'),
        "GothamRoundedBold": require('../assets/fonts/GothamRoundedBold_21016.ttf')
    });
    const logged = useSelector((state) => state.logged);
    // traigo igualmente token, id y rol
    const fullName = useSelector((state) => state.fullName);
    const rol = useSelector((state) => state.rol);

    // const counter = useSelector((state) => state.counter);
    // const dispatch = useDispatch(); para usar el dispatch
    // <View>
    //     <View>
    //         <Text>{counter}</Text>
    //     </View>
    //     <View>
    //         <Button title="Incrementar" onPress={() => dispatch({ type: 'counter/increment' })} />
    //         <Button title="Decrementar" onPress={() => dispatch({ type: 'counter/decrement' })} />
    //     </View>
    // </View>

    // creo un estado para guardar el valor del input
    const [inputValue, setInputValue] = useState('');

    // Definir las opciones del menú según el rol del usuario
    let cards = [];

    if (rol == '1') {
        cards = [
            {
                title: 'Formularios',
                onPress: () => console.log('cambiando de pagina')

            },
            {
                title: 'Formularios cargados',
                onPress: () => console.log('cambiando de pagina')
            },
            {
                title: 'Documentación',
                onPress: () => console.log('cambiando de pagina')
            },
            {
                title: 'Mi cuenta',
                onPress: () => navigation.navigate('Profile')
            },
        ];
    } else if (rol == '2') {
        cards = [
            {
                title: 'Formularios',
                onPress: () => console.log('cambiando de pagina')
            },
            {
                title: 'Formularios cargados',
                onPress: () => console.log('cambiando de pagina')
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
                onPress: () => console.log('cambiando de pagina')
            },
            {
                title: 'Cuentas',
                onPress: () => console.log('cambiando de pagina')
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
                onPress: () => console.log('cambiando de pagina')
            },
            {
                title: 'Formularios cargados',
                onPress: () => console.log('cambiando de pagina')
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
                onPress: () => console.log('cambiando de pagina')
            },
            {
                title: 'Cuentas',
                onPress: () => console.log('cambiando de pagina')
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
                onPress: () => console.log('cambiando de pagina')
            },
            {
                title: 'Crear Cuenta',
                onPress: () => console.log('cambiando de pagina')
            },
            {
                title: 'Mi cuenta',
                onPress: () => navigation.navigate('Profile')
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

    return (
        <View style={styles.container}>
            <View>
                <View>
                    <Image source={logo} style={styles.logoHeader} />
                    <View style={styles.headerTextContainer}>
                        <Text style={styles.title}>| Inicio</Text>
                        <Text style={styles.titleRol}>{"Nivel " + rol}</Text>
                    </View>
                </View>

                {/* <View style={styles.inputContainer}> */}
                {/* <Icon name="search" size={20} color="#C3C3C3" style={styles.searchIcon} /> */}
                {/* creo un textinput pero con un input controlado usando el estado */}
                {/* <TextInput */}
                {/* style={styles.input} */}
                {/* placeholder="¿Qué estás buscando?" */}
                {/* placeholderTextColor="#555" */}
                {/* value={inputValue} */}
                {/* onChangeText={(value) => handleInputChange(value)} */}
                {/* /> */}
                {/* </View> */}
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

            <ButtonBar />

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