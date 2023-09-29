import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Dimensions } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Picker } from '@react-native-picker/picker';
import { AntDesign } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox';

export default function FormType3({setViewInfo }) {

    const [globalInputs, setGlobalInputs] = useState([]); // este es el array que tendra todos los inputs que se creen en el formulario
    const [inputsValues, setInputsValues] = useState([])

    const [month, setMonth] = useState(
        // asigno el mes actual, por ejemplo si el mes es 9 entonces se asigna Septiembre
        new Date().toLocaleString('default', { month: 'long' })
    ); // aca se guarda el mes seleccionado en el picker
    const [year, setYear] = useState(new Date().getFullYear()); // aca se guarda el año seleccionado en el picker
    const [observacionesInput, setObservacionesInput] = useState(''); // aca se guarda el texto que se ingresa en el input de observaciones

    const { width, height } = Dimensions.get('window');

    const width5 = width * 0.05
    const width10 = width * 0.1
    const width15 = width * 0.15
    const width20 = width * 0.2
    const width30 = width * 0.3
    const width40 = width * 0.4
    const width50 = width * 0.5
    const width60 = width * 0.6
    const width70 = width * 0.7
    const width80 = width * 0.8
    const width90 = width * 0.9

    const height5 = height * 0.05
    const height8 = height * 0.08
    const height10 = height * 0.1
    const height15 = height * 0.15
    const height20 = height * 0.2

    const cardToCheck = useSelector((state) => state.cardToCheck);

    function handleInputChange(value, index, day, name) {
        let array = [...inputsValues];

        if (array[index]) {
            if (array[index].array) {
                array[index].array[day] = value;
                setInputsValues(array)
            } else {
                array[index].array = Array.from({ length: 31 }, (_, i) => false)
                array[index].array[day] = value;
                array[index].name = name;
                setInputsValues(array)
            }
        } else {
            array[index] = { name: name, array: Array.from({ length: 31 }, (_, i) => false) }
            array[index].array[day] = value;
            setInputsValues(array)
        }
    }

    function handleColorCheckBox(index, day) {
        // tambien creo una variable donde guardare el index mas cercano a day pero que sea igual o menor a day
        let total = 0;
        let maxIndex = 0
        let contador = 0

        if (inputsValues[3] && inputsValues[3].array) {
            for (let i = 0; i <= day; i++) {
                if (inputsValues[3].array[i]) {
                    maxIndex = i
                }
            }
        }

        // obtengo el total de elementos en true
        for (let i = maxIndex; i <= day; i++) {
            if (inputsValues[index].array[i]) {
                contador++
            }
        }


        switch (contador) {
            case 0:
                return "#11ff00"
            case 1:
                return "#59d400"
            case 2:
                return "#c3ff00"
            case 3:
                return "#ffe600"
            case 4:
                return "#fca708"
            default:
                return "#ff0000"
        }
    }

    // creo un useEffect que se ejecuta solo la primera vez que se renderiza el componente
    useEffect(() => {
        let array = []
        for (let i = 2023; i <= 2040; i++) {
            let arrayMonths = []
            for (let j = 0; j < 12; j++) {
                arrayMonths.push({
                    name: j.toString(),
                    array: [
                        { name: "Uso", array: Array.from({ length: 31 }, (_, i) => false) },
                        { name: "Filtracion", array: Array.from({ length: 31 }, (_, i) => false) },
                        { name: "Limpieza superficial", array: Array.from({ length: 31 }, (_, i) => false) },
                        { name: "Cambio de Aceite", array: Array.from({ length: 31 }, (_, i) => false) },
                        { name: "Limpieza profunda", array: Array.from({ length: 31 }, (_, i) => false) },
                    ]
                })
            }

            array.push({ name: i.toString(), meses: arrayMonths })
        }
        setGlobalInputs(array)
    }, [])

    useEffect(() => {
        if (globalInputs.length) {
            let meses = 0

            switch (month) {
                case 'enero':
                    meses = 0
                    break;
                case 'febrero':
                    meses = 1
                    break;
                case 'marzo':
                    meses = 2
                    break;
                case 'abril':
                    meses = 3
                    break;
                case 'mayo':
                    meses = 4
                    break;
                case 'junio':
                    meses = 5
                    break;
                case 'julio':
                    meses = 6
                    break;
                case 'agosto':
                    meses = 7
                    break;
                case 'septiembre':
                    meses = 8
                    break;
                case 'octubre':
                    meses = 9
                    break;
                case 'noviembre':
                    meses = 10
                    break;
                case 'diciembre':
                    meses = 11
                    break;
                default:
                    break;
            }

            setInputsValues(globalInputs[year - 2023].meses[meses].array)

        }
    }, [globalInputs, month, year])

    function updateData() {
        switch (month) {
            case 'enero':
                meses = 0
                break;
            case 'febrero':
                meses = 1
                break;
            case 'marzo':
                meses = 2
                break;
            case 'abril':
                meses = 3
                break;
            case 'mayo':
                meses = 4
                break;
            case 'junio':
                meses = 5
                break;
            case 'julio':
                meses = 6
                break;
            case 'agosto':
                meses = 7
                break;
            case 'septiembre':
                meses = 8
                break;
            case 'octubre':
                meses = 9
                break;
            case 'noviembre':
                meses = 10
                break;
            case 'diciembre':
                meses = 11
                break;
            default:
                break;
        }

        let arrayGlobal = [...globalInputs]
        arrayGlobal[year - 2023].meses[meses].array = inputsValues
        setGlobalInputs(arrayGlobal)
    }

    function handleMonthChange(itemValue) {
        updateData()
        setMonth(itemValue)
    }

    function handleYearChange(itemValue) {
        updateData()
        setYear(itemValue)
    }

    function handleInfoButton() {
        setViewInfo(true)
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={handleInfoButton}>
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 20, marginTop: 10 }}>
                    {/* traigo de AntDesign infocirlceo de color rgb(25, 118, 210) en hex */}
                    <AntDesign name="infocirlceo" size={20} color="#1976D2" style={{ marginRight: 5 }} />

                    <Text style={{
                        // fuente color azul rgb(25, 118, 210) pero en hex
                        color: '#1976D2',
                    }}>VER MÁS</Text>
                </View>
            </TouchableOpacity>

            {/* para escoger el mes y el año a revisar */}
            <View>
                <View>
                    <Text style={styles.normalText}>Mes: </Text>
                    <Picker
                        selectedValue={month}
                        onValueChange={(itemValue) => handleMonthChange(itemValue)}
                        style={styles.userInput}>
                        <Picker.Item label="Enero" value="enero" />
                        <Picker.Item label="Febrero" value="febrero" />
                        <Picker.Item label="Marzo" value="marzo" />
                        <Picker.Item label="Abril" value="abril" />
                        <Picker.Item label="Mayo" value="mayo" />
                        <Picker.Item label="Junio" value="junio" />
                        <Picker.Item label="Julio" value="julio" />
                        <Picker.Item label="Agosto" value="agosto" />
                        <Picker.Item label="Septiembre" value="septiembre" />
                        <Picker.Item label="Octubre" value="octubre" />
                        <Picker.Item label="Noviembre" value="noviembre" />
                        <Picker.Item label="Diciembre" value="diciembre" />
                    </Picker>
                </View>
                <View>
                    <Text style={[styles.normalText, { marginTop: 20 }]}>Año:</Text>
                    <Picker
                        selectedValue={year}
                        onValueChange={(itemValue) => handleYearChange(itemValue)}
                        style={styles.userInput}
                    >
                        {Array.from({ length: 18 }, (_, i) => 2023 + i).map((year) => (
                            <Picker.Item key={year} label={year.toString()} value={year} />
                        ))}
                    </Picker>
                </View>
            </View>

            <View style={{ marginVertical: 40 }}>
                <TouchableOpacity onPress={() => console.log(inputsValues)}>
                    <Text>Prueba</Text>
                </TouchableOpacity>
                {/* creo una tabla, primero creare una fila que sera la cabecera de la tabla y tendra los numeros del 1 al 31 */}
                <ScrollView horizontal={true}>
                    <View style={{ flexDirection: 'column', width: "100%" }}>
                        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', height: height5 }}>
                            <Text style={[styles.normalText,
                            {
                                fontSize: 12,
                                textAlign: 'center',
                                textAlignVertical: 'center',
                                width: width50,
                                borderLeftWidth: 1,
                                borderBottomWidth: 1,
                                borderTopWidth: 1,
                                borderColor: '#C3C3C3',
                            }]}>Día</Text>
                            {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                                <Text key={day} style={[styles.normalText, styles.casilla, { textAlign: 'center', textAlignVertical: 'center', width: width10, borderTopWidth: 1, paddingBottom: 0, borderRightWidth: day === 31 ? 1 : 0 }]}>{day}</Text>
                            ))}
                        </View>
                        {/* hago otra fila pero que en lugar de Dia diga Uso y en lugar de numeros que tenga inputs de tipo select */}
                        {cardToCheck.inputs?.length > 0 ? (
                            cardToCheck.inputs.map((input, index) => (
                                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', height: height5 }} key={input.name}>
                                    <Text style={[styles.normalText,
                                    {
                                        fontSize: 12,
                                        textAlign: 'center',
                                        width: width50,
                                        borderLeftWidth: 1,
                                        borderBottomWidth: 1,
                                        borderColor: '#C3C3C3',
                                        textAlignVertical: 'center'
                                    }]}>{input.name}</Text>
                                    {Array.from({ length: 31 }, (_, day) => (
                                        <View key={(day + input.name).toString()} style={[styles.normalText,
                                        {
                                            textAlign: 'center',
                                            width: width10,
                                            borderLeftWidth: 1,
                                            borderBottomWidth: 1,
                                            borderColor: '#C3C3C3',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRightWidth: (day === 30) ? 1 : 0,


                                        }]}>
                                            {/* <View key={day} style={[ {borderLeftWidth: 1, borderBottomWidth: 1, borderColor: '#C3C3C3', ]}> */}


                                            <Checkbox
                                                style={{}}
                                                color={((inputsValues[index]?.array[day] === true) && (inputsValues[index].name === "Uso")) ? handleColorCheckBox(index, day) : 'gray'}
                                                value={inputsValues[index] ? inputsValues[index].array[day] : false}
                                                onValueChange={(value) => handleInputChange(value, index, day, input.name)}
                                            />
                                        </View>
                                    ))}
                                </View>

                            ))
                        ) : null}


                    </View>
                </ScrollView>
            </View>

            {/* para las observaciones */}
            <View style={{ marginVertical: 20 }}>
                <Text style={[styles.normalText, {marginVertical: 5}]}>Observaciones:</Text>
                <TextInput
                    style={[styles.userInput, { height: 100, textAlignVertical: 'top', borderWidth: 1, borderColor: "#C3C3C3", borderRadius: 10, padding: 10}]}
                    multiline={true}
                    numberOfLines={4}
                    onChangeText={(text) => setObservacionesInput(text)}
                    value={observacionesInput}
                />
            </View>


            {/* para guardar los datos */}
            <View style={{ borderBottomColor: 'black', borderBottomWidth: 1, marginTop: 20 }} />
            <TouchableOpacity style={styles.buttonForm} onPress={() => console.log('Guardar')}>
                <Text style={styles.buttonFormText}>
                    Guardar
                </Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    casilla: {
        // les pongo solo borde a la izquierda y abajo para que no se vea el borde de la derecha
        borderLeftWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#C3C3C3',
    },
    buttonFooterStyle: {
        width: '48%',
        marginHorizontal: '1%',
        height: 50,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#7BC100',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 10,
        alignSelf: 'center'
    },
    buttonText: {
        color: '#7BC100',
        fontSize: 16,
        fontFamily: "GothamRoundedMedium"
    },
    fila: {
        display: 'flex',
        flexDirection: 'column',
        paddingHorizontal: 5,
    },
    normalText: {
        color: 'black',
        fontSize: 16,
        fontFamily: "GothamRoundedMedium",
        textAlign: 'left'
    },
    reglon: {
        flexDirection: 'column',
        borderWidth: 1,
        borderRadius: 10,
        borderColor: '#C3C3C3',
        padding: 10,
    },
    passwordInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#C3C3C3',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
    },
    container: {
        backgroundColor: '#fff',
        padding: 12,
        flex: 1,
    },
    titleForm: {
        fontFamily: 'GothamRoundedBold',
        fontSize: 14,
        paddingVertical: 15
    },
    buttonForm: {
        marginVertical: 20,
        backgroundColor: '#7BC100',
        width: '50%',
        marginHorizontal: '1%',
        height: 50,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
    },
    buttonFormText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: "GothamRoundedMedium",
    },

    userInput: {
        flex: 1,
        height: 40,
        color: '#C3C3C3',
        fontSize: 16,
        fontFamily: "GothamRoundedMedium"
        // cambio el color del placeholder de este textInput a #C3C3C3

    },
})