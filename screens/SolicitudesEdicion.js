import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getTitle } from '../functions/globalFunctions';
import Header from '../components/Header';
import Buscador from '../components/Buscador';
import FiltradorPorEstado from '../components/FiltradorPorEstadoSolicitudesEdicion';
// importo los iconos de MaterialCommunityIcons
import Icon from 'react-native-vector-icons/SimpleLineIcons';
// importo icons de eye
import ButtonBar from '../components/ButtonBar';
// traigo useFonts
import { useFonts } from 'expo-font';
// importo icons de eye
import { MaterialCommunityIcons } from '@expo/vector-icons';
// importo icons de Feather
import { Feather } from '@expo/vector-icons';
// traigo FontAwesome5
import { FontAwesome5 } from '@expo/vector-icons';
import ConfirmScreen from '../components/ConfirmScreen';
import BlackWindow from '../components/BlackWIndow';
import { API_URL } from '../functions/globalFunctions'
// importo loading.png
import loading from '../assets/loading.png';

export default SolicitudesEdicion = ({ navigation }) => {
    // traigo business de redux
    const business = useSelector(state => state.business);
    const rol = useSelector(state => state.rol);
    const fullName = useSelector(state => state.fullName);

    const [viewEdit, setViewEdit] = useState(false);
    const [viewDelete, setViewDelete] = useState(false);
    
    const [legajos, setLegajos] = useState([]);
    const [legajosFound, setLegajosFound] = useState([]);

    const [internalInput, setInternalInput] = useState('');
    const [indexSelected, setIndexSelected] = useState(0);
    const [paginaActual, setPaginaActual] = useState(1);
    const [paginaTotal, setPaginaTotal] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    
    const elementsPerPage = 8

    const itemListContainer = {
        display: "flex",
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
    }

    function handleViewButton(id) {
        setLegajosFound(legajosFound.map((item) => {
            if (item.value._id === id) {
                // Crear una copia del objeto
                let itemCopy = { ...item };
                // Modificar la copia
                itemCopy.activado = !itemCopy.activado;
                // Devolver la copia
                return itemCopy;
            }
            // Si el item._id no coincide con id, devolver el item sin modificar
            return item;
        }));
    }

    function sendEdit(respuesta) {
        let aprobado = (respuesta === 'yes' ? 'approved' : 'denied');
        let objFinal = {
            status: aprobado,
            motivo: internalInput,
            editEnabled: (aprobado === 'approved' ? true : false),
            whoApproved: fullName,
        }
        let form = legajosFound[indexSelected].name
        let formId = legajosFound[indexSelected].value._id

        if (form === 'controlVidrio') {
            form = 'controlvidrios'
        }

        let url = API_URL + '/api/' + form + '/' + formId;
        console.log('going to edit ', url)

        // un fetch "PUT"
        fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            // envio el objeto final
            body: JSON.stringify(objFinal)
        })
            .then((json) => {
                let legajosFoundCopy = [...legajosFound];
                // busco el item con el id de formId
                let index = legajosFoundCopy.findIndex((item) => item?.value?._id === formId);
                // cambio el item.value.status por el nuevo status en base a aprobado
                legajosFoundCopy[index].value.status = aprobado;
                setLegajosFound(legajosFoundCopy);
            })
            .catch((error) => console.error('algo salio mal: ', error));
    }

    useEffect(() => {
        // http://localhost:8080/api/pendingedition/:businessName
        let url = API_URL + '/api/pendingedition/' + business;
        console.log('url:',  url)
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
            .then((response) => response.json())
            .then((json) => {
                // hago una copia de json y en ella solo guardo las propiedades que NO sean un objeto vacio, solo los objetos que tengan algo, recordamos que json NO es un objeto, es un array
                let json2 = Object.keys(json).reduce((acc, key) => {
                    if (json[key].length > 0) {
                        acc[key] = json[key];
                    }
                    return acc;
                }, {});

                let arrayFinal = [];

                Object.keys(json2).map(key => {
                    for (let i = 0; i < json2[key].length; i++) {
                        arrayFinal.push({ name: key, value: json2[key][i], activado: false })
                    }
                });

                let arrayTemp = arrayFinal.filter((item) => {
                    if (item.value.rol < rol) {
                        return item;
                    }
                })

                // lo ordeno en base a la fecha de creacion de mas nuevo a mas viejo, esta en item.value?.updatedAt
                arrayTemp.sort((a, b) => {
                    if (a.value.updatedAt < b.value.updatedAt) {
                        return 1;
                    }
                    if (a.value.updatedAt > b.value.updatedAt) {
                        return -1;
                    }
                    return 0;
                });

                arrayFinal = arrayTemp;

                // setLegajosFound(arrayFinal);
                // seteo los ultimos 5 elementos de arrayFinal en legajosFound
                setLegajosFound(arrayFinal);
                // en base a que cada pagina tiene elementsPerPage elementos, calculo la cantidad de paginas que tendre en arrayFinal y la asigno a paginaTotal
                setPaginaTotal(Math.ceil(arrayFinal.length / elementsPerPage));
                setLegajos(arrayFinal);
                setIsLoading(false)
            })
            .catch((error) => console.error(error));
    }, []);

    const renderItem = ({ item, index }) => (
        <View>
            <View style={[itemListContainer, {
                backgroundColor: (
                    (item.value.status === 'pending') ? '#FFB82F1A' : ((item.value.status === 'approved') ? '#7BC1001A' : (item.value.status === 'denied' ? '#FF2E111A' : 'white'))
                )
            }]}>
                {/* en la propiedad item.updatedAt hay una fecha en formato 2023-08-01T19:37:43.071Z y yo creare de ahi un texto en formato 12/04/24 sacado de esa informacion y otro en formato 14:54 hs sacado de esa informacion tambien*/}
                <Text style={{ fontFamily: "GothamRoundedMedium", fontSize: 12, textAlign: 'left', width: "25%" }}>{item.value.updatedAt.slice(8, 10) + '/' + item.value.updatedAt.slice(5, 7) + '/' + item.value.updatedAt.slice(2, 4)}</Text>
 
                <Text style={{ fontFamily: "GothamRoundedMedium", fontSize: 12, textAlign: 'left', width: "25%" }}>{new Date(item?.value?.updatedAt).toLocaleTimeString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires', hour12: false })}</Text>
                {/* ahora hago una comparacion, si el id del elemento item.id es igual a la id que traje del redux entonces muestro el nombre que tengo en fullName */}
                <Text style={[styles.textEditables, { width: "25%", textAlign: 'left', color: (item.value.status === 'approved' ? '#7BC100' : ((item.value.status === 'pending') ? '#FFB82F' : (item.value.status === 'denied') ? '#FF2E11' : 'black')) }]}>{(item.value.status === 'approved' ? 'Aprobado' : ((item.value.status === 'pending') ? 'Pendiente' : ((item.value.status === 'denied') ? 'Denegado' : '')))}</Text>
                {/* agrego un boton para desplegar mas opciones, el que es como una V hacia abajo de icons */}

                <TouchableOpacity onPress={() => { handleViewButton(item.value._id) }} style={{ display: 'flex', alignContent: 'flex-end', justifyContent: 'center', width: "25%", position: 'relative' }}>
                    <Icon name="arrow-down" size={15} color="black" style={{ position: 'absolute', right: 25 }} />
                </TouchableOpacity>
            </View>


            <View style={[itemListContainer, {
                backgroundColor: (
                    (item.value.status === 'pending') ? '#FFB82F1A' : ((item.value.status === 'approved') ? '#7BC1001A' : ((item.value.status === 'denied') ? '#FF2E111A' : 'white'))
                ),
                display: (item.activado ? 'flex' : 'none')
            }]}>
                <Text style={{ display: 'flex', alignContent: 'center', justifyContent: 'flex-start', width: "50%", }}>
                    {getTitle(item.name)}
                </Text>

                <Text style={{ display: 'flex', alignContent: 'center', justifyContent: 'flex-start', width: "25%", }}>
                    {item.value.nombre}
                </Text>

                <Text style={{ display: 'flex', alignContent: 'center', justifyContent: 'flex-start', width: "25%", }}>
                    {"Nivel " + item.value.rol}
                </Text>
            </View>


            <View style={[itemListContainer, {
                backgroundColor: (
                    (item.value.status === 'pending') ? '#FFB82F1A' : ((item.value.status === 'approved') ? '#7BC1001A' : ((item.value.status === 'denied') ? '#FF2E111A' : 'white'))
                ),
                display: (item.activado ? 'flex' : 'none')
            }]}>
                <TouchableOpacity style={{ display: 'flex', alignContent: 'center', justifyContent: 'flex-start', width: "25%", }}>
                    <Feather name="eye" size={20} color="black" onPress={() => { console.log('prueba ojo') }} />
                </TouchableOpacity>

                <TouchableOpacity style={{ display: 'flex', alignContent: 'center', justifyContent: 'flex-start', width: "25%", }}>
                    <Feather name="edit-3" size={20} color="black" onPress={() => {
                        setIndexSelected(index);
                        setViewEdit(true);
                    }} />
                </TouchableOpacity>

                <TouchableOpacity style={{ display: 'flex', alignContent: 'center', justifyContent: 'flex-start', width: "25%", }}>
                    <Feather name="trash-2" size={20} color="black" onPress={() => { console.log('pruebaDelete') }} />
                </TouchableOpacity>

                <Text style={[styles.textEditables, { width: "25%", color: (item.value.status === 'approved' ? '#7BC100' : ((item.value.status === 'pending') ? '#FFB82F' : (item.value.status === 'denied') ? '#FF2E11' : 'black')) }]}></Text>
            </View>

            <View style={{ borderBottomColor: '#C3C3C3', borderBottomWidth: 1 }} />

        </View>
    );

    let cajaText = [
        { title: "| Solicitudes de edición", style: "titleProfile" },
    ]

    let paramsEdit = {
        title: 'Aprobar o denegar solicitud de edición',
        message: ((legajosFound[indexSelected]?.value?.motivoPeticion !== undefined) ? 'Comentario del / la solicitante: "' + legajosFound[indexSelected]?.value?.motivoPeticion + '"' : '') ,
        message2: 'Puedes dejar un comentario sobre la decisión que has tomado de esta solicitud.',
        viewWindow: viewEdit,
        textField: ' Motivos de la decisión',
        setViewWindow: setViewEdit,
        action: sendEdit,
        botonSendParams: true,
        data: '',        
        botonNo: "Denegar",
        botonYes: "Aprobar",
        typeable: true,
        internalInput: internalInput,
        setInternalInput: setInternalInput,
    }

    return (
        <View style={styles.container}>
            <BlackWindow visible={viewEdit} setVisible={setViewEdit} />
            <BlackWindow visible={viewDelete} setVisible={setViewDelete} />
            <ConfirmScreen navigation={navigation} params={paramsEdit} />
            {/* <ConfirmScreen navigation={navigation} params={paramsDelete} /> */}

            <View>
                <Header cajaText={cajaText} unElemento={true} />
                {/* <Buscador inputValue={inputValue} handleInputChange={handleInputChange} /> */}
                <FiltradorPorEstado states={legajosFound} setStates={setLegajosFound} statesOriginal={legajos} params={
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
                <Text style={{ textAlign: 'left', fontSize: 12, width: "25%", fontFamily: "GothamRoundedMedium", color: "#636363" }}>Fecha</Text>
                <Text style={{ textAlign: 'left', fontSize: 12, width: "25%", fontFamily: "GothamRoundedMedium", color: "#636363" }}>Hora</Text>
                <Text style={{ textAlign: 'left', fontSize: 12, width: "25%", fontFamily: "GothamRoundedMedium", color: "#636363" }}>Estado</Text>
                <Text style={{ textAlign: 'left', fontSize: 12, width: "25%", fontFamily: "GothamRoundedMedium", color: "#636363" }}></Text>
            </View>

            <Image source={loading} style={{ width: 150, height: 150, marginTop: 50, alignSelf: 'center', display: (isLoading ? 'flex' : 'none') }} />

            <FlatList
                // hago que en data solo se muestre de 10 en elementsPerPage en base a la pagina actual

                data={
                    legajosFound.slice((paginaActual - 1) * elementsPerPage, paginaActual * elementsPerPage)
                }
                renderItem={renderItem}
                keyExtractor={(item) => item.value._id}
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
};

const styles = StyleSheet.create({
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
    buttonFormText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: "GothamRoundedMedium",
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