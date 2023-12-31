import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
// import useFonts
import { useFonts } from 'expo-font';

const FiltradorLegajos = ({ states, setStates }) => {
    const [selectedOption, setSelectedOption] = useState('most-recent');
    const [fontsLoaded] = useFonts({
        "GothamRoundedMedium": require('../assets/fonts/GothamRoundedMedium_21022.ttf'),
        "GothamRoundedBold": require('../assets/fonts/GothamRoundedBold_21016.ttf')
    });

    const handleSort = (option) => {
        setSelectedOption(option);
        switch (option) {
            case 'Nivel 1':
                // cada elemento tendra la propiedad .rol y sera un string numerico, si es nivel 1 traera todos los q sean 1, no los que sean diferentes a 1
                setStates([...states].filter((element) => element.rol == '1'));
                break;
            case 'Nivel 2':
                setStates([...states].filter((element) => element.rol == '2'));
                break;
            case 'Nivel 3':
                setStates([...states].filter((element) => element.rol == '3'));
                break;
            case 'Alfabetico':
                setStates([...states].sort((a, b) => a.fullName.localeCompare(b.fullName)));
                break;
            default:
                break;
        }
    };

    return (
        <View styles={{padding: 12}}>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Ordenar:</Text>
                <View style={styles.passwordInputContainer}>
                    <Picker
                        selectedValue={selectedOption}
                        onValueChange={(value) => handleSort(value)}
                        style={styles.userInput}>

                        <Picker.Item style={{fontSize: 12}}  label="Nivel 1" value="Nivel 1" />
                        <Picker.Item style={{fontSize: 12}} label="Nivel 2" value="Nivel 2" />
                        <Picker.Item style={{fontSize: 12}} label="Nivel 3" value="Nivel 3" />
                        <Picker.Item style={{fontSize: 12}} label="Alfabetico" value="Alfabetico" />
                    </Picker>
                </View>
            </View>
        </View>
    );
};

export default FiltradorLegajos;


const styles = StyleSheet.create({
    label: {
        fontFamily: 'GothamRoundedMedium',
    },
    userInput: {
        flex: 1,
        height: 40,
        color: '#C3C3C3',
        fontSize: 12,
        fontFamily: "GothamRoundedMedium",
    },
    pickerContainer: {
        height: 40,
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