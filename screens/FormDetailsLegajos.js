import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getTitle } from '../functions/globalFunctions';
import Header from '../components/Header';
import Buscador from '../components/Buscador';
import FiltradorPorEstado from '../components/FiltradorPorEstado';
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
import ConfirmScreen from '../components/ConfirmScreen';
import BlackWindow from '../components/BlackWIndow';
import { API_URL, formulariosData } from '../functions/globalFunctions'
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import { FontAwesome5 } from '@expo/vector-icons';

export default FormDetailsLegajos = ({ navigation }) => {
    const dispatch = useDispatch();
    const [fontsLoaded] = useFonts({
        "GothamRoundedMedium": require('../assets/fonts/GothamRoundedMedium_21022.ttf'),
        "GothamRoundedBold": require('../assets/fonts/GothamRoundedBold_21016.ttf')
    });
    const [viewEdit, setViewEdit] = useState(false);
    const [viewDelete, setViewDelete] = useState(false);
    const formulariosLegajo = useSelector((state) => state.formulariosLegajo);
    const [internalInput, setInternalInput] = useState('');
    // obtengo id y fullName
    const id = useSelector((state) => state.id);
    const fullName = useSelector((state) => state.fullName);
    const rol = useSelector((state) => state.rol);
    const [targetId, setTargetId] = useState(0);
    const [statusPicked, setStatusPicked] = useState('');



    const { title, entries } = formulariosLegajo;

    const [listaEstados, setListaEstados] = useState(entries?.map((item) => {
        return { id: item._id, activado: false }
    }));
    let entriesCopy = [...entries];

    const [entriesFound, setEntriesFound] = useState(entriesCopy ? entriesCopy.reverse() : []);

    const [paginaActual, setPaginaActual] = useState(1);
    const elementsPerPage = 7
    const [paginaTotal, setPaginaTotal] = useState(Math.ceil(entriesFound.length / elementsPerPage));

    const [inputValue, setInputValue] = useState('');

    const itemListContainer = {
        display: "flex",
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: "1%",
    }

    function handleViewButton(id) {
        let listaEstadosTemp = listaEstados.map((item) => {
            if (item.id === id) {
                item.activado = !item.activado;
            }
            return item;
        });
        setListaEstados(listaEstadosTemp);
    }

    function getUrl(id) {
        // if (formulariosLegajo?.title === 'controlvidrio') return API_URL + "/api/" + formulariosLegajo?.title + "s/" + id;
        // else if (formulariosLegajo?.title === 'controlproceso') return API_URL + "/api/" + formulariosLegajo?.title + "s/" + id;
        // else return API_URL + "/api/" + formulariosLegajo.title + "/" + id;
        let item = formulariosLegajo?.entries?.find((element) => element._id === id);
        let formulario = formulariosData.find((element) => element.title === getTitle(item?.tituloForm));
        console.log('url: ', formulario.url + "/" + id)
        let url = formulario.url + "/" + id;
        return url
    }

    function handleSpectButton(id) {
        let item = formulariosLegajo?.entries?.find((element) => element._id === id);
        let formulario = formulariosData.find((element) => element.title === getTitle(item?.tituloForm));        
        // hago dispactch a objectToCheck con item
        dispatch({ type: 'counter/setCardToCheck', payload: formulario });
        dispatch({ type: 'counter/setObjectToCheck', payload: item });
        dispatch({ type: 'counter/setEditMode', payload: false });
        // hago navigate a FormView
        navigation.navigate('FormView');
    }

    function handleDelete(id) {
        let url = getUrl(id)
        fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => {
                if (response.status === 200) {
                    // si la respuesta es 200 entonces lo elimino de la lista
                    let listaEstadosTemp = listaEstados.filter((item) => {
                        if (item.id !== id) {
                            return item;
                        }
                    });
                    setListaEstados(listaEstadosTemp);
                    // ahora elimino de la lista de entriesFound
                    let entriesFoundTemp = entriesFound.filter((item) => {
                        if (item._id !== id) {
                            return item;
                        }
                    });
                    setEntriesFound(entriesFoundTemp);
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    function goToEdit(id) {
        url = getUrl(id)        
        let item = entries?.find((element) => element._id === id);
        // hago dispactch a objectToCheck con item
        dispatch({ type: 'counter/setObjectToCheck', payload: item });

        let formulario = formulariosData.find((element) => element.title === getTitle(item?.tituloForm));
        dispatch({ type: 'counter/setCardToCheck', payload: formulario });
        
        if (formulario.title !== "Uso y Cambio de Aceite en Freidora" && formulario.title !== "Chequeo de uso de EPP") {
            if (item?.editEnabled) {
                dispatch({ type: 'counter/setEditMode', payload: true });
                navigation.navigate('FormCreate');
            } else {
                dispatch({ type: 'counter/setEditMode', payload: false })
                navigation.navigate('FormView');
            }
        } else if (formulario.title === "Uso y Cambio de Aceite en Freidora" || formulario.title === "Chequeo de uso de EPP") {
            if (formulario.title === "Uso y Cambio de Aceite en Freidora") {
                dispatch({ type: 'counter/setEditMode', payload: true });
                navigation.navigate('FormView');
            }
            else {
                if (item?.editEnabled) {
                    dispatch({ type: 'counter/setEditMode', payload: true });
                    navigation.navigate('FormView');
                } else {
                    dispatch({ type: 'counter/setEditMode', payload: false });
                    navigation.navigate('FormView');
                }
            }

        }
    }


    function handleEdit(id, reason) {
        let url = getUrl(id)
        fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: "pending", motivoPeticion: reason, rol: rol }),
        })
            .then((response) => {
                if (response.status === 200) {
                    // seteo el entriesFound que es un array al cambiar el estado del objeto con esa id a pending
                    setEntriesFound(entriesFound.map((item) => {
                        if (item._id === id) {
                            // Crear una copia del objeto
                            let itemCopy = { ...item };
                            // Modificar la copia
                            itemCopy.status = "pending";
                            // Devolver la copia
                            return itemCopy;
                        }
                        // Si el item._id no coincide con id, devolver el item sin modificar
                        return item;
                    }));
                }
            })
            .then(() => {
                // refresco la pagina
                navigation.navigate('FormDetails');
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    let paramsEdit = {
        title: 'Solicitud de edición',
        message: 'Para editar tienes que estar autorizado. Puedes enviar una solicitud de edición junto con un mensaje explicando el motivo. Cuando se encuentre aprobado, aparecerá en verde.',
        viewWindow: viewEdit,
        setViewWindow: setViewEdit,
        action: handleEdit,
        data: [targetId, internalInput],
        botonNo: "Cancelar",
        botonYes: "Enviar",
        typeable: true,
        internalInput: internalInput,
        setInternalInput: setInternalInput,
    }

    let paramsDelete = {
        title: '¿Desea eliminar este formulario?',
        message: 'Si así lo decides, se eliminará de manera permanante y no lo podrás recuperar.',
        viewWindow: viewDelete,
        setViewWindow: setViewDelete,
        action: handleDelete,
        data: targetId,
        botonNo: "Cancelar",
        botonYes: "Eliminar",
    }

    function editHandler(id) {
        let item = entries?.find((element) => element?._id === id);
        (item?.status === 'free' || item?.status === 'approved' ? goToEdit(id) : handleEditButton(id))
    }

    function handleEditButton(id) {
        setTargetId(id)
        setViewEdit(true)
    }

    function handleDeleteButton(id) {
        setTargetId(id)
        setViewDelete(true)
    }

    useEffect(() => {
        navigation?.setOptions({
            title: getTitle(formulariosLegajo?.title),
        });
    }, []);

    const renderItem = ({ item }) => {
        // console.log('item: ', item)
        return (
        <View>
            <View style={[itemListContainer, {
                backgroundColor: (
                    (item.status === 'pending') ? '#FFB82F1A' : ((item.status === 'approved') ? '#7BC1001A' : (item.status === 'denied' ? '#FF2E111A' : 'white'))
                )
            }]}>
                {/* en la propiedad item.createdAt hay una fecha en formato 2023-08-01T19:37:43.071Z y yo creare de ahi un texto en formato 12/04/24 sacado de esa informacion y otro en formato 14:54 hs sacado de esa informacion tambien*/}
                <Text style={{ fontFamily: "GothamRoundedMedium", fontSize: 12, textAlign: 'left', width: "29%", paddingRight: "1%" }}>{getTitle(item?.tituloForm)}</Text>                
                <Text style={{ fontFamily: "GothamRoundedMedium", fontSize: 12, textAlign: 'left', width: "20%" }}>{item?.createdAt.slice(8, 10) + '/' + item?.createdAt.slice(5, 7) + '/' + item?.createdAt.slice(2, 4)}</Text>                
                <Text style={{ fontFamily: "GothamRoundedMedium", fontSize: 12, textAlign: 'left', width: "20%" }}>{new Date(item?.createdAt).toLocaleTimeString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires', hour12: false })}</Text>
                {/* ahora hago una comparacion, si el id del elemento item?.id es igual a la id que traje del redux entonces muestro el nombre que tengo en fullName */}
                <Text style={{ fontFamily: "GothamRoundedMedium", fontSize: 12, textAlign: 'left', width: "20%" }}>{item?.nombre}</Text>
                {/* agrego un boton para desplegar mas opciones, el que es como una V hacia abajo de icons */}
                <TouchableOpacity onPress={() => { handleViewButton(item?._id) }} style={{ display: 'flex', alignContent: 'flex-end', justifyContent: 'center', width: "10%", position: 'relative' }}>
                    <Icon name="arrow-down" size={15} color="black" style={{ position: 'absolute', right: 25 }} />
                </TouchableOpacity>

            </View>
            {/* si el estado de la propiedad activado es true entonces muestro el contenido */}
            {listaEstados.find((element) => element.id === item?._id)?.activado
                ? <View style={[itemListContainer, {
                    backgroundColor: (
                        (item?.status === 'pending') ? '#FFB82F1A' : ((item?.status === 'approved') ? '#7BC1001A' : ((item?.status === 'denied') ? '#FF2E111A' : 'white'))
                    ),

                }]}>
                    <TouchableOpacity style={{ display: 'flex', alignContent: 'center', justifyContent: 'flex-start', width: "25%", paddingHorizontal: "2.5%", }}>
                        <Feather name="eye" size={20} color="black" onPress={() => { handleSpectButton(item?._id) }} />
                    </TouchableOpacity>

                    <TouchableOpacity style={{ display: 'flex', alignContent: 'center', justifyContent: 'flex-start', width: "25%", paddingHorizontal: "2.5%", }}>
                        {/* <Feather name="edit-3" size={20} color="black" onPress={() => { editHandler(item?._id)}} /> */}
                    </TouchableOpacity>

                    <TouchableOpacity style={{ display: 'flex', alignContent: 'center', justifyContent: 'flex-start', width: "25%", paddingHorizontal: "2.5%", }}>
                        {/* <Feather name="trash-2" size={20} color="black" onPress={() => { handleDeleteButton(item?._id) }} /> */}
                    </TouchableOpacity>

                    <Text style={[styles.textEditables, { width: "25%", color: (item?.status === 'approved' ? '#7BC100' : ((item?.status === 'pending') ? '#FFB82F' : (item?.status === 'denied') ? '#FF2E11' : 'black')) }]}>{(item?.status === 'approved' ? 'Aprobado' : ((item?.status === 'pending') ? 'Pendiente' : ((item?.status === 'denied') ? 'Denegado' : '')))}</Text>
                </View>
                : null}
            <View style={{ borderBottomColor: '#C3C3C3', borderBottomWidth: 1 }} />
        </View>
    )};

    let cajaText = [
        { title: '| ' + getTitle(title), style: "titleProfile" },
    ]


    return (
        <View style={styles.container}>
            <BlackWindow visible={viewEdit} setVisible={setViewEdit} />
            <BlackWindow visible={viewDelete} setVisible={setViewDelete} />
            <ConfirmScreen navigation={navigation} params={paramsEdit} />
            <ConfirmScreen navigation={navigation} params={paramsDelete} />
            <View>
                <Header cajaText={cajaText} unElemento={true} />
                {/* <Buscador inputValue={inputValue} handleInputChange={handleInputChange} /> */}
                <FiltradorPorEstado states={entriesFound} setStates={setEntriesFound} statesOriginal={entries} />
            </View>

            <View style={{ display: 'flex', flexDirection: 'row', alignContent: 'center', justifyContent: 'space-between', marginTop: 15 }}>
                <Text style={{ textAlign: 'left', fontSize: 12, width: "30%", fontFamily: "GothamRoundedMedium", color: "#636363" }}>Formulario</Text>
                <Text style={{ textAlign: 'left', fontSize: 12, width: "20%", fontFamily: "GothamRoundedMedium", color: "#636363" }}>Fecha</Text>
                <Text style={{ textAlign: 'left', fontSize: 12, width: "20%", fontFamily: "GothamRoundedMedium", color: "#636363" }}>Hora</Text>
                <Text style={{ textAlign: 'left', fontSize: 12, width: "20%", fontFamily: "GothamRoundedMedium", color: "#636363" }}>Usuario</Text>
                <Text style={{ textAlign: 'left', fontSize: 12, width: "10%", fontFamily: "GothamRoundedMedium", color: "#636363" }}></Text>
            </View>
            {/* creo una linea horizontal */}
            <View style={{ borderBottomColor: '#C3C3C3', borderBottomWidth: 1, marginTop: 10 }} />


            <FlatList
                data={entriesFound.slice((paginaActual - 1) * elementsPerPage, paginaActual * elementsPerPage)}
                renderItem={renderItem}
                keyExtractor={(item) => item?._id}
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

});