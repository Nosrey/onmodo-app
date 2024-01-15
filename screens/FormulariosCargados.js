// creo un componente para formularios cargados
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, RefreshControl, Image, TextInput, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useSelector, useDispatch } from 'react-redux';
import Header from '../components/Header';
import Buscador from '../components/Buscador';
import FiltradorFormCargados from '../components/FiltradorFormCargados';
// importo getTitle de globalFunctions
import { getTitle } from '../functions/globalFunctions';
import ButtonBar from '../components/ButtonBar';
import Notification from '../components/Notification';
import { API_URL, formulariosData } from '../functions/globalFunctions'

export default function FormulariosCargados({ navigation }) {
    const dispatch = useDispatch();
    // traigo formularios del redux
    const formularios = useSelector((state) => state.formularios);
    const id = useSelector((state) => state.id);
    const [fontsLoaded] = useFonts({
        "GothamRoundedMedium": require('../assets/fonts/GothamRoundedMedium_21022.ttf'),
        "GothamRoundedBold": require('../assets/fonts/GothamRoundedBold_21016.ttf')
    });
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [notif, setNotif] = useState({ view: false, message: '', color: 'naranja' }); // notif es un booleano que indica si se muestra o no la notificacion

    // estado para el FiltradorFormCargados
    // el estado del filtro elegido
    const [selectedOption, setSelectedOption] = useState('most-recent');
    const [copiaCardsInicial, setCopiaCardsInicial] = useState([])
    const [cardsFiltered, setCardsFiltered] = useState([])



    function update() {
        fetch(`${API_URL}/api/business/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((json) => {
                // reviso json2.response[0] y a todos los elementos que sean un array los guardo en otro array llamado formularios que sera un let
                let formularios = [];
                // recordamos que json2.response[0] es un objeto y ahora debo identificar que propiedades de dicho objeto es un array y guardarlas en formularios
                for (const [key, value] of Object.entries(json.response[0])) {
                    if (Array.isArray(value)) {
                        formularios.push({ title: key, entries: value });
                    }
                }

                // hago un dispatch que setee formularios con el valor de formularios
   
                setNotif({ view: true, message: '¡Actualizado correctamente!', color: 'verde' });
                dispatch({ type: 'counter/setFormularios', payload: formularios });
            })
            .catch((error) => {
                setNotif({ view: true, message: 'Ups, algo salio mal', color: 'naranja' });
                console.error('Error:', error);
            });

        // Lógica para actualizar los datos
        setIsRefreshing(false);
    }

    const onRefresh = useCallback(() => {
        setIsRefreshing(true);
        update();
    }, []);

    // creo una funcion que reciba un array de objetos donde revisara en cada objeto el valor de la propiedad createdAt y tras revisar todos, devolvera la propiedad createdAt del objeto con el valor mas reciente
    const getMostRecent = (array) => {
        let mostRecent = array[0].createdAt;
        // el formato de la fecha es 2021-08-31T18:00:00.000Z asi que hay que compararlas en base a eso
        array.forEach((item) => {
            if (item.createdAt > mostRecent) {
                mostRecent = item.createdAt;
            }
        });
        return mostRecent;
    }

    let entriesTemp = [
        {
            _id: "64c9686e4b778895ae778350",
            inputs: [],
            idUser: [
                "64a0bc8a3de38bb95eb1717d"
            ],
            status: "pending",
            createdAt: "2023-08-01T20:17:51.036Z",
            updatedAt: "2023-08-01T20:17:51.036Z",
            __v: 0
        },
        {
            _id: "64c9686e4b778895ae778351",
            inputs: [],
            idUser: [
                "64a0bc8a3de38bb95eb1717d"
            ],
            status: "pending",
            createdAt: "2023-08-01T20:17:51.036Z",
            updatedAt: "2023-08-01T20:17:51.036Z",
            __v: 0
        },
        {
            _id: "64c9686e4b778895ae778352",
            inputs: [],
            idUser: [
                "64a0bc8a3de38bb95eb1717d"
            ],
            status: "approved",
            createdAt: "2023-08-01T20:17:51.036Z",
            updatedAt: "2023-08-01T20:17:51.036Z",
            __v: 0
        },
        {
            _id: "64c9686e4b778895ae778353",
            inputs: [],
            idUser: [
                "64a0bc8a3de38bb95eb1717d"
            ],
            status: "approved",
            createdAt: "2023-08-01T20:17:51.036Z",
            updatedAt: "2023-08-01T20:17:51.036Z",
            __v: 0
        },
        {
            _id: "64c9686e4b778895ae778354",
            inputs: [],
            idUser: [
                "64a0bc8a3de38bb95eb1717d"
            ],
            status: "denied",
            createdAt: "2023-08-01T20:17:51.036Z",
            updatedAt: "2023-08-01T20:17:51.036Z",
            __v: 0
        },
        {
            _id: "64c9686e4b778895ae778355",
            inputs: [],
            idUser: [
                "64a0bc8a3de38bb95eb1717d"
            ],
            status: "denied",
            createdAt: "2023-08-01T20:17:51.036Z",
            updatedAt: "2023-08-01T20:17:51.036Z",
            __v: 0
        },
    ]

    let cards = []

    const [cardsFound, setCardsFound] = useState(cards);
    const [inputValue, setInputValue] = useState('');
    let cajaText = [
        { title: '| Formularios cargados', style: 'titleProfile' },
    ]

    // funcion para el FiltradorFormCargados
    const handleSort = (option) => {
        let cardFoundCopy = [...copiaCardsInicial];
        let sortedCards;
    
        switch (option) {
            case 'a-z':
                sortedCards = cardFoundCopy.sort((a, b) => {
                    if (a.title > b.title) return 1;
                    if (a.title < b.title) return -1;
                    return 0;
                });
                break;
            case 'z-a':
                sortedCards = cardFoundCopy.sort((a, b) => {
                    if (a.title > b.title) return -1;
                    if (a.title < b.title) return 1;
                    return 0;
                });
                break;
            case 'most-recent':
                sortedCards = cardFoundCopy.sort((a, b) => {
                    let recentA = a.entries && a.entries.length > 0 ? new Date(a.entries[a.entries.length - 1].updatedAt) : new Date(0);
                    let recentB = b.entries && b.entries.length > 0 ? new Date(b.entries[b.entries.length - 1].updatedAt) : new Date(0);
                    return recentB - recentA;
                });
                break;
            case 'most-used':
                sortedCards = cardFoundCopy.sort((a, b) => {
                    return b.entries.length - a.entries.length;
                });
                break;
            default:
                break;
        }
    
        setCardsFound(sortedCards);
    };


    const handleInputChange = (value, array = []) => {
        // guardo el valor del input en el estado inputValue
        setInputValue(value);
        let inputLocal = value;
        // convierto el inputLocal en minusculas
        inputLocal = inputLocal.toLowerCase();
        inputLocal = inputLocal.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
        // creo un array donde guardaré los buttons que coincidan con el valor del input al filtrar
        if (array.length == 0) array = cardsFound
        setCardsFiltered(array.filter((item) => {
            let itemTitle = item.title.toLowerCase();
            itemTitle = itemTitle.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
            if (itemTitle.includes(inputLocal)) return item
        }))
    }

    // // ejecuto un useEffect al cargar la pantalla para que se ejecute una sola vez
    // useEffect(() => {
    //     update()
    // }, []);

    // ejecuto update si retrocedo a esta pantalla
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            update()
        });
        return unsubscribe;
    }, [navigation]);

    useEffect(() => {
        let cards = formularios.map((item) => {
            let formCoincidence = formulariosData.find((element) => element.url?.includes(item.title));

            if (formCoincidence !== undefined) {
                return {
                    title: getTitle(item.title),
                    onPress: () => {
                        // creo un useDispatch para establecer cardToCheck 
                        // hago que payload sea formCoincidence pero con el entries de item   
                        dispatch({
                            type: 'counter/setCardToCheck', payload: {
                                ...formCoincidence,
                                entries: item?.entries
                            }
                        });
                      
                        navigation.navigate('FormDetails');
                    },
                    entries: item.entries,
                    date: (item.entries?.length) ? getMostRecent(item.entries) : null
                }
            } else {
                return undefined
            }
        }).filter((item) => item !== undefined).sort((a, b) => {
            let recentA = a.entries && a.entries.length > 0 ? new Date(a.entries[a.entries.length - 1].updatedAt) : new Date(0);
            let recentB = b.entries && b.entries.length > 0 ? new Date(b.entries[b.entries.length - 1].updatedAt) : new Date(0);
            return recentB - recentA;
        })

        // unifico cards 2 encima de cards
        cards = [...cards];
        setCopiaCardsInicial(cards)
        setCardsFound(cards)
        handleInputChange(inputValue, cards)
    }, [formularios]);

    return (
        <View style={styles.container}>
            <Notification params={notif} notif={notif} setNotif={setNotif} />
            <Header cajaText={cajaText} unElemento={true} />
            <View style={{ marginBottom: 5 }}>
                <Buscador inputValue={inputValue} handleInputChange={handleInputChange} />
                <FiltradorFormCargados states={cardsFound} setStates={setCardsFound} handleSortImported={handleSort} selectedOption={selectedOption} setSelectedOption={setSelectedOption} />
            </View>

            <ScrollView refreshControl={
                <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
            }>
                <View style={styles.containerBox}>
                    {/* si cardFound.length es 0, muestro un mensaje de que no hay resultados */}
                    {(inputValue.length ? cardsFiltered.length == 0 : cardsFound.length == 0) ? <Text style={[styles.title, styles.notFoundMsg]}>No hay resultados</Text>
                        : (
                            (inputValue.length ? cardsFiltered : cardsFound).map((boton, i) => {
                                if (boton.entries?.length) {
                                    return (
                                        <TouchableOpacity key={i} style={styles.box} onPress={boton.onPress}>
                                            <Text style={styles.boxTitle}>
                                                {boton.title}
                                            </Text>
                                        </TouchableOpacity>
                                    )
                                }
                                else return null
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