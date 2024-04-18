// creo un componente para formularios cargados
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, TextInput, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useSelector, useDispatch } from 'react-redux';
import Header from '../components/Header';
import Buscador from '../components/Buscador';
import Filtrador from '../components/FiltradorFormularios';
// importo getTitle de globalFunctions
import { getTitle } from '../functions/globalFunctions';
import ButtonBar from '../components/ButtonBar';
import { API_URL, formulariosData } from '../functions/globalFunctions'

export default function Formularios({ navigation }) {
    const dispatch = useDispatch();
    // traigo rol del redux
    const rol = useSelector((state) => state.rol);

    const [fontsLoaded] = useFonts({
        "GothamRoundedMedium": require('../assets/fonts/GothamRoundedMedium_21022.ttf'),
        "GothamRoundedBold": require('../assets/fonts/GothamRoundedBold_21016.ttf')
    });

    const formularios = formulariosData

    let cards = formularios.map((item) => {
        return {
            title: item.title,
            rolNeeded: item.rolNeeded,
            title2: item.title2,
            inputs: item.inputs,
            formType: item.formType,
            url: item.url,
            verMas: item.verMas,
            exception1: item.exception1,
            exceptionR1: item.exceptionR1,
            exception2: item.exception2,
            exceptionP1: item.exceptionP1,
            onPress: () => {
                // creo un useDispatch para establecer cardToCheck    
                dispatch({ type: 'counter/setCardToCheck', payload: item });
                dispatch({ type: 'counter/setEditMode', payload: false });
                navigation.navigate('FormCreate');
            },
        }
    })

    const [cardsFound, setCardsFound] = useState(cards);
    const [inputValue, setInputValue] = useState('');
    let cajaText = [
        { title: '| Formularios', style: 'titleProfile' },
    ]

    const handleInputChange = (value) => {
        // guardo el valor del input en el estado inputValue
        setInputValue(value);
        let inputLocal = value;
        // convierto el inputLocal en minusculas
        inputLocal = inputLocal.toLowerCase();
        // elimino los acentos de inputLocal
        inputLocal = inputLocal.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
        // creo un array donde guardaré los buttons que coincidan con el valor del input al filtrar
        setCardsFound(cards.filter((item) => {
            let itemTitle = item.title.toLowerCase();
            // elimino los acentos de itemTitle
            itemTitle = itemTitle.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
            if (itemTitle.includes(inputLocal)) return item
        }))
    }

    return (
        <View style={styles.container}>
            <Header cajaText={cajaText} unElemento={true} />
            <View style={{ marginBottom: 5 }}>

                <Buscador inputValue={inputValue} handleInputChange={handleInputChange} />
                <Filtrador states={cardsFound} setStates={setCardsFound} />
            </View>

            <ScrollView>
                <View style={styles.containerBox}>
                    {/* si cardFound.length es 0, muestro un mensaje de que no hay resultados */}
                    {cardsFound.length == 0 ? <Text style={[styles.title, styles.notFoundMsg]}>No hay resultados</Text>
                        : (
                            cardsFound.filter((card) => (card.rolNeeded) <= rol).map((card, i) => {
                                return (
                                    <TouchableOpacity key={i} style={styles.box} onPress={card.onPress}>
                                        <Text style={styles.boxTitle}>
                                            {card.title}
                                        </Text>
                                    </TouchableOpacity>
                                )
                            }
                            )
                        )}
                </View>
            </ScrollView>
            <ButtonBar navigation={navigation} />
        </View>
    )
}


const styles = StyleSheet.create({
    boxTitle: {
        textAlign: 'center',
        justifyContent: 'center',
        fontFamily: "GothamRoundedMedium",
        fontSize: 12,

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
    containerBox: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: "100%",
        paddingBottom: 10,
    },
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
        width: "48%",
        marginHorizontal: "1%",
        height: 100,
        borderRadius: 10,
        marginTop: 15,
        backgroundColor: '#E7E7E7',
        justifyContent: 'center',
        padding: 1.5,
    },
    boxTitle: {
        textAlign: 'center',
        justifyContent: 'center',
        // hago que el texto no  se  corten las palabras
        flexWrap: 'wrap',
        fontFamily: "GothamRoundedMedium",
        fontSize: 12,
        paddingHorizontal: 10,

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
    notFoundMsg: {
        textAlign: 'center',
        alignSelf: 'center',
    },
});