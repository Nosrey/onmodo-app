// creo un nuevo componente
import React, { useState, useEffect } from 'react';
// importo de react native el view, text, image, stylesheets, touchableOpacity
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Keyboard, ScrollView, Button, FlatList } from 'react-native';
import Buscador from '../components/Buscador';
import Filtrador from '../components/Filtrador';
import { Picker } from '@react-native-picker/picker';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import logo from '../assets/on-modo-grande.png';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import { Feather } from '@expo/vector-icons';
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
import { PUESTOS_N1, PUESTOS_N2, API_URL } from '../functions/globalFunctions';
import Notification from '../components/Notification';


export default function Legajos({ navigation }) {
    const [inputValue, setInputValue] = useState('');
    const [legajosLista, setLegajosLista] = useState([
        {legajo: 1234, nombre: "Juan Perez", nivel: "1", activado: false, id: 1},
        {legajo: 1235, nombre: "Jose andres", nivel: "2", activado: false, id: 2},
        {legajo: 1236, nombre: "Martina Ramona", nivel: "4", activado: false, id: 3},
        {legajo: 1237, nombre: "Miguel Angel", nivel: "3", activado: false, id: 4},
        {legajo: 1238, nombre: "Lucia Perez", nivel: "1", activado: false, id: 5},
    ]);

    const handleInputChange = (value) => {
        // guardo el valor del input en el estado inputValue
        setInputValue(value);
        let inputLocal = value;
        // convierto el inputLocal en minusculas
        inputLocal = inputLocal.toLowerCase();
        // actualizo la lista en base al input
    }

    function handleViewButton(id) {
        console.log('entro esta id: ', id)
        let listaLegajosTemp = legajosLista.map((item) => {
            if (item.id === id) {
                item.activado = !item.activado;
            }
            return item;
        });
        setLegajosLista(listaLegajosTemp);
    }

    const renderItem = ({ item }) => (
        <View>
            <View style={[styles.itemListContainer]}>
                {/* en la propiedad item.createdAt hay una fecha en formato 2023-08-01T19:37:43.071Z y yo creare de ahi un texto en formato 12/04/24 sacado de esa informacion y otro en formato 14:54 hs sacado de esa informacion tambien*/}
                <Text style={{ fontFamily: "GothamRoundedMedium", color: "#000000", fontSize: 12, textAlign: 'left', width: "25%" }}>{item.legajo}</Text>
                <Text style={{ fontFamily: "GothamRoundedMedium", color: "#000000", fontSize: 12, textAlign: 'left', width: "25%" }}>{item.nombre}</Text>
                <Text style={{ fontFamily: "GothamRoundedMedium", color: "#000000", fontSize: 12, textAlign: 'left', width: "25%" }}>{item.nivel}</Text>
                {/* agrego un boton para desplegar mas opciones, el que es como una V hacia abajo de icons */}
                <TouchableOpacity onPress={() => { handleViewButton(item.id) }} style={{ display: 'flex', alignContent: 'flex-end', justifyContent: 'center', width: "25%", position: 'relative' }}>
                    <Icon name="arrow-down" size={15} color="black" style={{ position: 'absolute', right: 25 }} />
                </TouchableOpacity>

            </View>
            {/* si el estado de la propiedad activado es true entonces muestro el contenido */}
            {legajosLista.find((element) => element.id === item.id)?.activado
                ? <View style={[styles.itemListContainer]}>
                    <TouchableOpacity style={{ display: 'flex', alignContent: 'center', justifyContent: 'flex-start', width: "25%", }}>
                        <Feather name="eye" size={20} color="black" onPress={() => { console.log('pruebaView') }} />
                    </TouchableOpacity>

                    <TouchableOpacity style={{ display: 'flex', alignContent: 'center', justifyContent: 'flex-start', width: "25%", }}>
                        <Feather name="file" size={20} color="black" onPress={() => { console.log('pruebaEdit') }} />
                    </TouchableOpacity>

                    <TouchableOpacity style={{ display: 'flex', alignContent: 'center', justifyContent: 'flex-start', width: "25%", }}>
                        <Feather name="trash-2" size={20} color="black" oonPress={() => { console.log('pruebaDelete') }} />
                    </TouchableOpacity>

                    <Text style={{width: "25%"}}></Text>
                
                </View>
                : null}
            <View style={{ borderBottomColor: '#C3C3C3', borderBottomWidth: 1 }} />
        </View>
    );

    let cajaTextoHeader = [
        { title: "| Legajos", style: "title" },
    ];

    return (
        <View style={styles.container}>
            <View>
                <Header cajaText={cajaTextoHeader} />
            </View>

            <View style={{ marginVertical: 5 }}>
                <Buscador inputValue={inputValue} handleInputChange={handleInputChange} />
                <Filtrador states={legajosLista} setStates={setLegajosLista} />
            </View>

            <View style={{ display: 'flex', flexDirection: 'row', alignContent: 'center', justifyContent: 'space-between', marginTop: 15 }}>
                <Text style={{ textAlign: 'left', color: "#636363", fontSize: 12, width: "25%", fontFamily: "GothamRoundedBold" }}>Legajo</Text>
                <Text style={{ textAlign: 'left', color: "#636363", fontSize: 12, width: "25%", fontFamily: "GothamRoundedBold" }}>Nombre</Text>
                <Text style={{ textAlign: 'left', color: "#636363", fontSize: 12, width: "25%", fontFamily: "GothamRoundedBold" }}>Nivel</Text>
                <Text style={{ textAlign: 'left', color: "#636363", fontSize: 12, width: "25%", fontFamily: "GothamRoundedBold" }}></Text>
            </View>
            <View style={{ borderBottomColor: '#C3C3C3', borderBottomWidth: 1, marginTop: 10 }} />

            <FlatList
                data={legajosLista}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
            />

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