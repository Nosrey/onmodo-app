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
import { API_URL } from '../functions/globalFunctions'

export default FormDetails = ({ navigation }) => {
    const dispatch = useDispatch();
    const [fontsLoaded] = useFonts({
        "GothamRoundedMedium": require('../assets/fonts/GothamRoundedMedium_21022.ttf'),
        "GothamRoundedBold": require('../assets/fonts/GothamRoundedBold_21016.ttf')
    });
    const [viewEdit, setViewEdit] = useState(false);
    const [viewDelete, setViewDelete] = useState(false);
    const cardToCheck = useSelector((state) => state.cardToCheck);
    const [internalInput, setInternalInput] = useState('');
    // obtengo id y fullName
    const id = useSelector((state) => state.id);
    const fullName = useSelector((state) => state.fullName);
    const [targetId, setTargetId] = useState(0);

    const { title, entries } = cardToCheck;

    const [listaEstados, setListaEstados] = useState(entries?.map((item) => {
        return { id: item._id, activado: false }
    }));
    let entriesCopy = [...entries];

    const [entriesFound, setEntriesFound] = useState(entriesCopy ? entriesCopy.reverse() : []);
    const [inputValue, setInputValue] = useState('');

    const itemListContainer = {
        display: "flex",
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
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
        if (cardToCheck.title === 'controlvidrio') return API_URL + "/api/" + cardToCheck.title + "s/" + id;
        else if (cardToCheck.title === 'controlproceso') return API_URL + "/api/" + cardToCheck.title + "s/" + id;
        else return API_URL + "/api/" + cardToCheck.title + "/" + id;
    }

    function handleSpectButton(id) {
        let item = cardToCheck.entries?.find((element) => element._id === id);
        // hago dispactch a objectToCheck con item
        dispatch({ type: 'counter/setObjectToCheck', payload: item });
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
                console.log('response: ', response)
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
        console.log('listo ', id)
    }

    let paramsEdit = {
        title: 'Solicitud de edición',
        message: 'Para editar tienes que estar autorizado. Puedes enviar una solicitud de edición junto con un mensaje explicando el motivo. Cuando se encuentre aprobado, aparecerá en verde.',
        viewWindow: viewEdit,
        setViewWindow: setViewEdit,
        action: handleDelete,
        data: '',
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

    function handleEditButton () {
        
        setViewEdit(true)
    }

    function handleDeleteButton (id) {
        setTargetId(id)
        setViewDelete(true)
    }
    
    useEffect(() => {
        navigation?.setOptions({
          title: getTitle(cardToCheck.title),
        });
      }, []);

    const renderItem = ({ item }) => (
        <View>
            <View style={[itemListContainer, {
                backgroundColor: (
                    (item.status === 'pending') ? '#FFB82F1A' : ((item.status === 'approved') ? '#7BC1001A' : (item.status === 'denied' ? '#FF2E111A' : 'white'))
                )
            }]}>
                {/* en la propiedad item.createdAt hay una fecha en formato 2023-08-01T19:37:43.071Z y yo creare de ahi un texto en formato 12/04/24 sacado de esa informacion y otro en formato 14:54 hs sacado de esa informacion tambien*/}
                <Text style={{ fontFamily: "GothamRoundedMedium", fontSize: 12, textAlign: 'left', width: "25%" }}>{item.createdAt.slice(8, 10) + '/' + item.createdAt.slice(5, 7) + '/' + item.createdAt.slice(2, 4)}</Text>
                <Text style={{ fontFamily: "GothamRoundedMedium", fontSize: 12, textAlign: 'left', width: "25%" }}>{item.createdAt.slice(11, 13) + ':' + item.createdAt.slice(14, 16) + ' hs'}</Text>
                {/* ahora hago una comparacion, si el id del elemento item.id es igual a la id que traje del redux entonces muestro el nombre que tengo en fullName */}
                {item.idUser[0] === id ? <Text style={{ fontFamily: "GothamRoundedMedium", fontSize: 12, textAlign: 'left', width: "30%" }}>{fullName}</Text> : <Text style={{ fontFamily: "GothamRoundedMedium", fontSize: 12, textAlign: 'left', width: "25%" }}>{"No encontrado"}</Text>}
                {/* agrego un boton para desplegar mas opciones, el que es como una V hacia abajo de icons */}
                <TouchableOpacity onPress={() => { handleViewButton(item._id) }} style={{ display: 'flex', alignContent: 'flex-end', justifyContent: 'center', width: "25%", position: 'relative' }}>
                    <Icon name="arrow-down" size={15} color="black" style={{ position: 'absolute', right: 25 }} />
                </TouchableOpacity>

            </View>
            {/* si el estado de la propiedad activado es true entonces muestro el contenido */}
            {listaEstados.find((element) => element.id === item._id)?.activado
                ? <View style={[itemListContainer, {
                    backgroundColor: (
                        (item.status === 'pending') ? '#FFB82F1A' : ((item.status === 'approved') ? '#7BC1001A' : ((item.status === 'denied') ? '#FF2E111A' : 'white'))
                    ),

                }]}>
                    <TouchableOpacity  style={{ display: 'flex', alignContent: 'center', justifyContent: 'flex-start', width: "25%", }}>
                        <Feather name="eye" size={20} color="black" onPress={() => { handleSpectButton(item._id) }} />
                    </TouchableOpacity>

                    <TouchableOpacity  style={{ display: 'flex', alignContent: 'center', justifyContent: 'flex-start', width: "25%", }}>
                        <Feather name="edit-3" size={20} color="black" onPress={() => { handleEditButton() }} />
                    </TouchableOpacity>

                    <TouchableOpacity style={{ display: 'flex', alignContent: 'center', justifyContent: 'flex-start', width: "25%", }}>
                        <Feather name="trash-2" size={20} color="black" onPress={() => { handleDeleteButton(item._id) }}/>
                    </TouchableOpacity>

                    <Text style={[styles.textEditables, { width: "25%", color: (item.status === 'approved' ? '#7BC100' : ((item.status === 'pending') ? '#FFB82F' : (item.status === 'denied') ? '#FF2E11' : 'black')) }]}>{(item.status === 'approved' ? 'Aprobado' : ((item.status === 'pending') ? 'Pendiente' : ((item.status === 'denied') ? 'Denegado' : '')))}</Text>
                </View>
                : null}
            <View style={{ borderBottomColor: '#C3C3C3', borderBottomWidth: 1 }} />
        </View>
    );

    let cajaText = [
        { title: '| ' + getTitle(title), style: "titleProfile" },
    ]

    return (
        <View style={styles.container}>
            <BlackWindow visible={viewEdit} setVisible={setViewEdit} />
            <BlackWindow visible={viewDelete} setVisible={setViewDelete} />
            <ConfirmScreen navigation={navigation} params={paramsEdit}/>
            <ConfirmScreen navigation={navigation} params={paramsDelete}/>
            <View>
                <Header cajaText={cajaText} unElemento={true} />
                {/* <Buscador inputValue={inputValue} handleInputChange={handleInputChange} /> */}
                <FiltradorPorEstado states={entriesFound} setStates={setEntriesFound} statesOriginal={entries} />
            </View>

            <View style={{ display: 'flex', flexDirection: 'row', alignContent: 'center', justifyContent: 'space-between', marginTop: 15 }}>
                <Text style={{ textAlign: 'left', fontSize: 12, width: "25%", fontFamily: "GothamRoundedMedium", color: "#636363" }}>Fecha</Text>
                <Text style={{ textAlign: 'left', fontSize: 12, width: "25%", fontFamily: "GothamRoundedMedium", color: "#636363" }}>Hora</Text>
                <Text style={{ textAlign: 'left', fontSize: 12, width: "25%", fontFamily: "GothamRoundedMedium", color: "#636363" }}>Usuario</Text>
                <Text style={{ textAlign: 'left', fontSize: 12, width: "25%", fontFamily: "GothamRoundedMedium", color: "#636363" }}></Text>
            </View>
            {/* creo una linea horizontal */}
            <View style={{ borderBottomColor: '#C3C3C3', borderBottomWidth: 1, marginTop: 10 }} />
            <FlatList
                data={entriesFound}
                renderItem={renderItem}
                keyExtractor={(item) => item._id}
            />

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