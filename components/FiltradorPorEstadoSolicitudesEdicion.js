import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
// import useFonts
import { useFonts } from 'expo-font';

const FiltradorPorEstadoSolicitudesEdicion = ({ states, setStates, statesOriginal, params }) => {
    const [selectedOption, setSelectedOption] = useState('most-recent');
    const {paginaActual, paginaTotal, setPaginaTotal, setPaginaActual, elementsPerPage } = params;
    const [fontsLoaded] = useFonts({
        "GothamRoundedMedium": require('../assets/fonts/GothamRoundedMedium_21022.ttf'),
        "GothamRoundedBold": require('../assets/fonts/GothamRoundedBold_21016.ttf')
    });

    const handleSort = (option) => {
        setSelectedOption(option);
        // hago un switch para filtrar el array que recibo, si es "Todos" entonces muestro todos los elementos, si es "Pendientes de Edición" entonces muestro los elementos que tengan la propiedad  "status" en "pending y si es "Editados" entonces muestro los elementos que tengan "status" en approved, si la propiedad "status" no existe entonces lo tomo como que esta en false y solo se mostraran en Todos
        let array = [...statesOriginal]
        switch (option) {
            case 'Todos':
                setStates(statesOriginal);
                return array
            case 'Pendientes de Edición':
                setStates(statesOriginal.filter((item) => item.value.status === "pending"));
                return array.filter((item) => item.value.status === "pending")
            case 'Editados':
                setStates(statesOriginal.filter((item) => item.value.status === "approved"));
                return array.filter((item) => item.value.status === "approved")
            case 'Denegados':
                setStates(statesOriginal.filter((item) => item.value.status === "denied"));
                return array.filter((item) => item.value.status === "denied")
            default:
                break;
        }
    };

    return (
        <View styles={{padding: 12}}>
            <View style={[styles.inputContainer, {marginTop: 10}]}>
                <Text style={styles.label}>Ordenar:</Text>
                <View style={styles.passwordInputContainer}>
                    <Picker
                        selectedValue={selectedOption}
                        onValueChange={(value) => {
                            let arrayFinal = handleSort(value)
                            setPaginaActual(1)
                            setPaginaTotal(Math.ceil(arrayFinal.length / elementsPerPage))
                            return
                        }}
                        style={styles.userInput}>

                        <Picker.Item style={{fontSize: 12}} label="Todos" value="Todos" />
                        <Picker.Item style={{fontSize: 12}} label="Pendientes de Edición" value="Pendientes de Edición" />
                        <Picker.Item style={{fontSize: 12}} label="Editados" value="Editados" />
                        <Picker.Item style={{fontSize: 12}} label="Denegados" value="Denegados" />
                    </Picker>
                </View>
            </View>
        </View>
    );
};

export default FiltradorPorEstadoSolicitudesEdicion;


const styles = StyleSheet.create({
    label: {
        fontFamily: 'GothamRoundedMedium',
    },
    userInput: {
        flex: 1,
        height: 10,
        color: '#C3C3C3',
        fontSize: 12,
        fontFamily: "GothamRoundedMedium",
    },
    pickerContainer: {
        height: 30,
        borderWidth: 2,
        borderColor: '#C3C3C3',
    },
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        alignContent: 'center',
        marginRight: 15,
    },
    label: {
        color: '#000000',
        fontFamily: "GothamRoundedMedium",
        marginRight: 15,
        fontSize: 12,
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
        width: "60%",

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
        marginTop: 20,
        marginBottom: 10,
    },
    editarBtn: {
        backgroundColor: 'white',
        // borde de 2px color #7BC100
        borderWidth: 2,
        borderColor: '#7BC100',
    },
    editarTextBtn: {
        color: '#A0B875',
    }
});