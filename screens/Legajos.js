// creo un nuevo componente
import React, { useState, useEffect } from 'react';
// importo de react native el view, text, image, stylesheets, touchableOpacity
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Keyboard, ScrollView, Button, FlatList } from 'react-native';
import Buscador from '../components/Buscador';
import FiltradorLegajos from '../components/FiltradorLegajos';
import { Picker } from '@react-native-picker/picker';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import logo from '../assets/on-modo-grande.png';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import { Feather } from '@expo/vector-icons';
// traigo useDispatch de react-redux
import { useDispatch, useSelector } from 'react-redux';
import ButtonBar from '../components/ButtonBar';
import Header from '../components/Header';
// importo confirmScreen
import ConfirmScreen from '../components/ConfirmScreen';
import BlackWindow from '../components/BlackWIndow';
import notImg from '../assets/notImg.png'
import * as ImagePicker from 'expo-image-picker';
import { PUESTOS_N1, PUESTOS_N2, API_URL } from '../functions/globalFunctions';
import Notification from '../components/Notification';
import { FontAwesome5 } from '@expo/vector-icons';
import loading from '../assets/loading.png';

export default function Legajos({ navigation }) {
    // traigo el dispatch
    const dispatch = useDispatch();
    // traigo businesId del store
    const business = useSelector(state => state.business);
    const rol = useSelector(state => state.rol);

    const [inputValue, setInputValue] = useState('');
    const [legajosLista, setLegajosLista] = useState([]);
    const [legajosListaOriginal, setLegajosListaOriginal] = useState([]);
    const [update, setUpdate] = useState(false);
    const [viewDeleteLegajo, setViewDeleteLegajo] = useState(false);
    const [legajoSelected, setLegajoSelected] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    const [paginaActual, setPaginaActual] = useState(1);
    const [paginaTotal, setPaginaTotal] = useState(1);

    const elementsPerPage = 6

    useEffect(() => {
        // hago un fetch a la url API_URL + rol + :business
        fetch(API_URL + '/api' + (rol === 2 ? '/rol1' : rol === 3 ? '/rol1-2' : '/rol1-2-3') + `/${business}`, {
        // fetch(API_URL + '/api' + '/rol1-2-3' + `/${business}`, {
            // tipo get
            method: 'GET',
        })
            .then((response) => response.json())
            .then((json) => {
                // guardo la respuesta en el estado
                // mapeo json y a cada elemento le agrego la propiedad activado en false
                let listaLegajosTemp = json.map((item) => {
                    item.activado = false;
                    return item;
                });
                // reviso listaLegajosTemp y si el elemento tiene un legajo de mas de 7 digitos entonces lo convierto en un string que diga "legajo invalido"
                listaLegajosTemp = listaLegajosTemp.map((item) => {
                    if (item.legajo > Number.MAX_SAFE_INTEGER || isNaN(item.legajo)) {
                        item.legajoOriginal = item.legajo;
                        item.legajo = "Legajo invalido";
                    } else {
                        item.legajoOriginal = item.legajo;
                    }
                    return item;
                });
                setLegajosLista(listaLegajosTemp);
                setLegajosListaOriginal(listaLegajosTemp);

                //   setPaginaTotal(Math.ceil(arrayFinal.length / elementsPerPage));
                setPaginaTotal(Math.ceil(listaLegajosTemp.length / elementsPerPage));
            })
            .then(() => {
                // seteo el update en false
                setUpdate(false);
                setIsLoading(false)
            })
            .catch((error) => {
                setUpdate(false);
                console.error(error);
            });
    }, [update]);

    const handleInputChange = (value) => {
        // guardo el valor del input en el estado inputValue
        setInputValue(value);
        let inputLocal = value;
        // convierto el inputLocal en minusculas
        inputLocal = inputLocal.toLowerCase();
        // actualizo la lista en base al input
    }

    function handleViewButton(id) {
        // ubico el elemento
        let elemento = legajosLista.find((element) => element._id === id);
        // le cambio el estado a activado
        elemento.activado = !elemento.activado;
        // creo una lista temporal
        let listaLegajosTemp = [...legajosLista];
        // busco el indice del elemento
        let indice = listaLegajosTemp.findIndex((element) => element._id === id);
        // lo reemplazo
        listaLegajosTemp[indice] = elemento;
        // actualizo el estado
        setLegajosLista(listaLegajosTemp);
    }

    function handleDeleteLegajo(item) {
        // hago un delete a API_URL + "/api/" + item.legajoOriginal + "/" + item.business
        fetch(API_URL + "/api/users/" + item.legajoOriginal + "/" + item.business, {
            method: 'DELETE',
        })
            .then((response) => response.json())
            .then((json) => {
                console.log('json', json);
                // seteo el update en true
                setUpdate(true);
            })
            .catch((error) => {
                setUpdate(true)
                console.error(error);
            });

    }

    function modalDelete(item) {
        // seteo el viewDeleteLegajo en true
        setViewDeleteLegajo(true);
        // seteo el legajoSelected en item
        setLegajoSelected(item);
    }

    function handleViewForms(item) {
        let formulariosLegajos = { entries: [], title: "Formularios cargados de Legajo" };
        // recordamos que json2.response[0] es un objeto y ahora debo identificar que propiedades de dicho objeto es un array y guardarlas en formularios
        for (const [key, value] of Object.entries(item)) {
            if (Array.isArray(value) && key !== 'recordatorio') {

                let arrayEdited = value.map((item) => {
                    return ({ ...item, tituloForm: key })
                })

                formulariosLegajos.entries = [...formulariosLegajos.entries, ...arrayEdited]
            }
        }

        // console.log('formulariosLegajos', formulariosLegajos);

        dispatch({ type: 'counter/setFormulariosLegajo', payload: formulariosLegajos });

        navigation.navigate('FormDetailsLegajos');
    }

    function handleViewLegajo(item) {
        // seteo el legajoProfile en item
        let perfil = {
            fullName: item.fullName,
            imgProfile: item.imgProfile,
            legajo: item.legajoOriginal,
            number: item.number,
            puesto: item.puesto,
            rol: item.rol,
            provincia: item.provincia,
            localidad: item.localidad,
            contratoComedor: item.contratoComedor,
        }
        // dispatch({ type: 'counter/setFormularios', payload: formularios });
        dispatch({ type: 'counter/setLegajoProfile', payload: perfil });
        navigation.navigate('ProfileLegajos');
    }

    const renderItem = ({ item }) => (
        <View>
            <View style={[styles.itemListContainer]}>
                {/* en la propiedad item.createdAt hay una fecha en formato 2023-08-01T19:37:43.071Z y yo creare de ahi un texto en formato 12/04/24 sacado de esa informacion y otro en formato 14:54 hs sacado de esa informacion tambien*/}
                <Text style={{ fontFamily: "GothamRoundedMedium", color: "#000000", fontSize: 12, textAlign: 'left', width: "25%" }}>{item.legajo}</Text>
                <Text style={{ fontFamily: "GothamRoundedMedium", color: "#000000", fontSize: 12, textAlign: 'left', width: "25%" }}>{item.fullName}</Text>
                <Text style={{ fontFamily: "GothamRoundedMedium", color: "#000000", fontSize: 12, textAlign: 'left', width: "25%" }}>{item.rol}</Text>
                {/* agrego un boton para desplegar mas opciones, el que es como una V hacia abajo de icons */}
                <TouchableOpacity onPress={() => { handleViewButton(item._id) }} style={{ display: 'flex', alignContent: 'flex-end', justifyContent: 'center', width: "25%", position: 'relative' }}>
                    <Icon name="arrow-down" size={15} color="black" style={{ position: 'absolute', right: 25 }} />
                </TouchableOpacity>

            </View>
            {/* si el estado de la propiedad activado es true entonces muestro el contenido */}
            {legajosLista.find((element) => element._id === item._id)?.activado
                ? <View style={[styles.itemListContainer]}>
                    <TouchableOpacity style={{ display: 'flex', alignContent: 'center', justifyContent: 'flex-start', width: "25%", }}>
                        <Feather name="eye" size={20} color="black" onPress={() => { handleViewLegajo(item) }} />
                    </TouchableOpacity>

                    <TouchableOpacity style={{ display: 'flex', alignContent: 'center', justifyContent: 'flex-start', width: "25%", }}>
                        <Feather name="file" size={20} color="black" onPress={() => { handleViewForms(item) }} />
                    </TouchableOpacity>

                    <TouchableOpacity style={{ display: 'flex', alignContent: 'center', justifyContent: 'flex-start', width: "25%", }}>
                        <Feather name="trash-2" size={20} color="black" onPress={() => { modalDelete(item) }} />
                    </TouchableOpacity>

                    <Text style={{ width: "25%" }}></Text>

                </View>
                : null}
            <View style={{ borderBottomColor: '#C3C3C3', borderBottomWidth: 1 }} />
        </View>
    );

    let cajaTextoHeader = [
        { title: "| Legajos", style: "title" },
    ];

    let params = {
        title: '¿Estás seguro que deseas eliminar este legajo?',
        message: 'Si así lo decides, se eliminará de manera permanante y no lo podrás recuperar.',
        viewWindow: viewDeleteLegajo,
        setViewWindow: setViewDeleteLegajo,
        action: handleDeleteLegajo,
        data: legajoSelected,
        botonNo: "Cancelar",
        botonYes: "Eliminar",
    }

    return (
        <View style={styles.container}>
            <BlackWindow visible={viewDeleteLegajo} setVisible={setViewDeleteLegajo} />
            <ConfirmScreen navigation={navigation} params={params} />
            <View>
                <Header cajaText={cajaTextoHeader} />
            </View>

            <View style={{ marginVertical: 5 }}>
                <FiltradorLegajos states={legajosListaOriginal} setStates={setLegajosLista} params={
                    {
                        paginaActual: paginaActual,
                        setPaginaActual: setPaginaActual,
                        paginaTotal: paginaTotal,
                        setPaginaTotal: setPaginaTotal,
                        elementsPerPage: elementsPerPage,
                    }
                } />
            </View>

            <View style={{ display: 'flex', flexDirection: 'row', alignContent: 'center', justifyContent: 'space-between', marginTop: 15 }}>
                <Text style={{ textAlign: 'left', color: "#636363", fontSize: 12, width: "25%", fontFamily: "GothamRoundedBold" }}>Legajo</Text>
                <Text style={{ textAlign: 'left', color: "#636363", fontSize: 12, width: "25%", fontFamily: "GothamRoundedBold" }}>Nombre</Text>
                <Text style={{ textAlign: 'left', color: "#636363", fontSize: 12, width: "25%", fontFamily: "GothamRoundedBold" }}>Nivel</Text>
                <Text style={{ textAlign: 'left', color: "#636363", fontSize: 12, width: "25%", fontFamily: "GothamRoundedBold" }}></Text>
            </View>
            <View style={{ borderBottomColor: '#C3C3C3', borderBottomWidth: 1, marginTop: 10 }} />

            <Image source={loading} style={{ width: 150, height: 150, marginTop: 50, alignSelf: 'center', display: (isLoading ? 'flex' : 'none') }} />

            <FlatList
                data={legajosLista.slice((paginaActual - 1) * elementsPerPage, paginaActual * elementsPerPage)}
                renderItem={renderItem}
                keyExtractor={(item) => item._id}
            />

            <View style={{
                // los alineo horitozanlmente a cada extremo pero el tercero en el centro
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 10,
                marginBottom: 10,

            }}>
                <TouchableOpacity style={[styles.buttonForm, {
                    backgroundColor: (
                        "#7BC100"
                    ), marginTop: 5
                }]} onPress={() => {
                    paginaActual > 1 ? setPaginaActual(paginaActual - 1) : null
                }
                }>
                    <FontAwesome5 name="arrow-left" size={24} color="white" />
                </TouchableOpacity>

                <Text style={{
                    alignSelf: 'center',
                    // lo alieno verticalmente
                    textAlign: 'center',
                    fontSize: 16,
                }}>PAG {paginaActual}/{paginaTotal}</Text>

                <TouchableOpacity style={[styles.buttonForm, {
                    backgroundColor: (
                        "#7BC100"
                    ), marginTop: 5
                }]} onPress={() => {
                    paginaActual < paginaTotal ? setPaginaActual(paginaActual + 1) : null
                }
                }>
                    {/* // pongo arrow-circle-right */}
                    <FontAwesome5 name="arrow-right" size={24} color="white" />
                </TouchableOpacity>
            </View>

            <ButtonBar navigation={navigation} />
        </View>
    );
}


const styles = StyleSheet.create({
    itemListContainer: {
        display: "flex",
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
    },
    buttonForm: {
        marginVertical: 20,
        backgroundColor: '#7BC100',
        width: '20%',
        marginHorizontal: '1%',
        height: 50,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        // lo alineo a la derecha
        alignSelf: 'flex-end',
    },
    textEditables: {
        // los hago centrarse
        alignSelf: 'center',
        // centro el texto si hay
        textAlign: 'center',
        fontSize: 12,
        fontFamily: "GothamRoundedBold",
    },
    container: {
        flex: 1,
        padding: 16,
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

});