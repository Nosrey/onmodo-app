import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Dimensions, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Picker } from '@react-native-picker/picker';
import { AntDesign } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox';

export default function FormType3({ setViewInfo, navigation, setNotif }) {

    const [globalInputs, setGlobalInputs] = useState([]); // este es el array que tendra todos los inputs que se creen en el formulario
    const [inputsValues, setInputsValues] = useState([])
    const [saving, setSaving] = useState(false); // si saving es true, se muestra un mensaje de guardando... y se deshabilita el boton de guardar

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
    const id = useSelector((state) => state.id);
    const businessName = useSelector((state) => state.business);
    const rol = useSelector((state) => state.rol);
    const nombre = useSelector((state) => state.fullName);

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

    function handleColorCheckBox(index, indexAfectada, indexAfectadora, indexManejador, indexSubManejador, day) {
        let maxIndex = 0
        let contador = 0
        if (inputsValues[index]?.value[indexManejador - 2023]?.[indexSubManejador]?.[indexAfectadora]) {

            for (let i = 0; i <= day; i++) {
                if (inputsValues[index]?.value[indexManejador - 2023]?.[indexSubManejador]?.[indexAfectadora]?.[i]) {
                    maxIndex = i
                }
            }
        }

        // obtengo el total de elementos en true
        for (let i = maxIndex; i <= day; i++) {
            if (inputsValues[index]?.value[indexManejador - 2023]?.[indexSubManejador]?.[indexAfectada]?.[i]) {
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


    // useEffect(() => {
    //     if (globalInputs.length) {
    //         let yearIndex = cardToCheck.inputs.findIndex((element) => element.manejador === true)
    //         let year = inputsValues[yearIndex].value
    //         let monthIndex = cardToCheck.inputs.findIndex((element) => element.subManejador === true)
    //         let meses = inputsValues[monthIndex].value

    //         setInputsValues(globalInputs[year - 2023].meses[meses].array)

    //     }
    // }, [globalInputs, inputsValues])

    useEffect(() => {
        let array = inputsValues
        for (let i = 0; i < cardToCheck.inputs.length; i++) {
            if ((cardToCheck.inputs[i].tipo === "picker") && (cardToCheck.inputs[i].name === "Mes")) {
                array[i] = { name: cardToCheck.inputs[i].name, value: new Date().toLocaleString('es-ES', { month: 'long' }).toLowerCase() }
            }
            else if ((cardToCheck.inputs[i].tipo === "picker") && (cardToCheck.inputs[i].name === "Año")) {
                array[i] = { name: cardToCheck.inputs[i].name, value: new Date().getFullYear() }
            }
            else if (cardToCheck.inputs[i].tipo === "select") {
                array[i] = { name: cardToCheck.inputs[i].name, value: cardToCheck.inputs[i].options[0] }
            }
        }
        setInputsValues(array)
    }, [])

    function updateData(index) {
        if (cardToCheck.inputs[index].subManejador === true || cardToCheck.inputs[index].manejador === true) {
            let yearIndex = cardToCheck.inputs.findIndex((element) => element.manejador === true)
            let year = inputsValues[yearIndex].value

            // encuentro el index del objeto cardToCheck.inputs[index].options que sea igual a itemValue
            let mesIndex = cardToCheck.inputs.findIndex((element) => manejador.subManejador === true)
            let meses = inputsValues[mesIndex].value

            let arrayGlobal = [...globalInputs]
            arrayGlobal[year - 2023].meses[meses].array = inputsValues
            setGlobalInputs(arrayGlobal)
        }
    }

    function handleCheckValue(day, index, index2) {
        let indexManejador = cardToCheck.inputs.findIndex((element) => element.manejador === true)
        let indexSubManejador = cardToCheck.inputs.findIndex((element) => element.subManejador === true)

        if ((indexManejador !== -1) && (indexSubManejador !== -1)) {
            let manejadorValue = inputsValues[indexManejador]?.value
            let subManejadorValue = null
            if (cardToCheck.inputs[indexSubManejador].name === "Mes") {
                subManejadorValue = cardToCheck.inputs[indexSubManejador].options.findIndex((element) => element.toLowerCase() === inputsValues[indexSubManejador]?.value.toLowerCase())
            }
            else {
                subManejadorValue = inputsValues[indexSubManejador]?.value
            }
            let final = inputsValues[index]?.value && inputsValues[index]?.value[manejadorValue - 2023]?.[subManejadorValue]?.[index2]?.[day]
            return (final || false)

        } else {
            return inputsValues[index]?.value[0][0][index2][day]
        }
    }


    function handleCheckChange(value, day, index, index2) {
        let indexManejador = cardToCheck.inputs.findIndex((element) => element.manejador === true);
        let indexSubManejador = cardToCheck.inputs.findIndex((element) => element.subManejador === true);

        let array = [...inputsValues];

        if (inputsValues && indexManejador !== -1 && indexSubManejador !== -1) {
            let manejadorValue = inputsValues[indexManejador]?.value;
            let subManejadorValue = null;
            if (cardToCheck.inputs[indexSubManejador].name === "Mes") {
                // indexSubManejador = 
                subManejadorValue = cardToCheck.inputs[indexSubManejador].options.findIndex((element) => element.toLowerCase() === inputsValues[indexSubManejador]?.value.toLowerCase())
            } else {
                subManejadorValue = inputsValues[indexSubManejador]?.value;
            }

            // creo esa direccion
            if (!array[index]?.value) {
                array[index] = { name: cardToCheck.inputs[index]?.name, value: [] }
            }
            if (!array[index]?.value[manejadorValue - 2023]) {
                array[index].value[manejadorValue - 2023] = []
            }
            if (!array[index]?.value[manejadorValue - 2023][subManejadorValue]) {
                array[index].value[manejadorValue - 2023][subManejadorValue] = []
            }
            if (!array[index]?.value[manejadorValue - 2023][subManejadorValue][index2]) {
                array[index].value[manejadorValue - 2023][subManejadorValue][index2] = []
            }
            array[index].value[manejadorValue - 2023][subManejadorValue][index2][day] = value;

            setInputsValues(array);

        } else {
            // creo esa direccion
            if (!array[index]?.value) {
                array[index] = { name: cardToCheck.inputs[index]?.name, value: [] }
            }
            if (!array[index]?.value[0]) {
                array[index].value[0] = []
            }
            if (!array[index]?.value[0][0]) {
                array[index].value[0][0] = []
            }
            if (!array[index]?.value[0][0][index2]) {
                array[index].value[0][0][index2] = []
            }
            array[index].value[0][0][index2][day] = value;
            setInputsValues(array);
        }
    }

    function handleCheckColor(day, index, index2) {
        let afectadora = cardToCheck.inputs[index].afectadora
        let afectada = cardToCheck.inputs[index].afectada

        let indexManejador = cardToCheck.inputs.findIndex((element) => element.manejador === true)
        let indexSubManejador = cardToCheck.inputs.findIndex((element) => element.subManejador === true)

        let yearIndex = inputsValues[indexManejador]?.value
        let monthIndex = null

        if (cardToCheck.inputs[indexSubManejador]?.name === "Mes") {
            monthIndex = cardToCheck.inputs[indexSubManejador].options.findIndex((element) => element.toLowerCase() === inputsValues[indexSubManejador]?.value.toLowerCase())
        } else {
            monthIndex = inputsValues[indexSubManejador]?.value
        }



        if (afectada && afectadora) {
            let indexAfectada = cardToCheck.inputs[index].options.findIndex((element) => element === afectada)
            let indexAfectadora = cardToCheck.inputs[index].options.findIndex((element) => element === afectadora)

            if ((index2 === indexAfectada) && (inputsValues[index]?.value[yearIndex - 2023]?.[monthIndex]?.[indexAfectada]?.[day] === true)) {
                return handleColorCheckBox(index, indexAfectada, indexAfectadora, yearIndex, monthIndex, day)
            } else {
                return 'black'
            }
        }
        else return 'gray'

    }

    function handleInfoButton() {
        setViewInfo(true)
    }

    function handleSaveButton() {
        if (saving) return; // si saving es true, no hago nada
        else {
            setSaving(true); // si saving es false, lo pongo en true

            let objetoFinal = {
                idUser: id,
                rol: rol,
                nombre: nombre,
                businessName: businessName,
            }
            if (cardToCheck.exception1 === true) {
                let indexCheckBox = cardToCheck.inputs.findIndex((element) => element.tipo === "checkBox")
                let arrayFinal = []
                for (let i = 0; i < inputsValues[indexCheckBox]?.value.length; i++) {
                    let mesesFinal = []
                    for (let j = 0; j < inputsValues[indexCheckBox]?.value[i]?.length; j++) {
                        let entrar = false
                        let arrayOptions = []
                        for (let k = 0; k < inputsValues[indexCheckBox]?.value[i]?.[j]?.length; k++) {
                            let arrayDays = []
                            let entrar2 = false
                            for (let l = 0; l < 31; l++) {
                                if (inputsValues[indexCheckBox]?.value[i]?.[j]?.[k]?.[l] === true) {
                                    entrar = true
                                    entrar2 = true
                                    arrayDays.push(true)
                                } else {
                                    arrayDays.push(false)
                                }
                            }
                            if (entrar2) arrayOptions.push({ name: cardToCheck.inputs[indexCheckBox].options[k], array: arrayDays })
                        }
                        if (entrar) mesesFinal.push({ name: (j).toString(), array: arrayOptions })
                    }
                    arrayFinal.push({ name: (i + 2023).toString(), meses: mesesFinal })
                }

                objetoFinal.inputs = arrayFinal
                let indexObservaciones = cardToCheck.inputs.findIndex((element) => element.name === "Observaciones")
                objetoFinal.observaciones = inputsValues[indexObservaciones]?.value
            } else {                
                // SOLO FUNCIONA SI HAY UN SOLO CHECKBOX

                let indexCheckBox = cardToCheck.inputs.findIndex((element) => element.tipo === "checkBox")
                let arrayFinal = []
                for (let i = 0; i < inputsValues[indexCheckBox]?.value.length; i++) {
                    let mesesFinal = []
                    for (let j = 0; j < inputsValues[indexCheckBox]?.value[i]?.length; j++) {
                        let entrar = false
                        let arrayOptions = []
                        for (let k = 0; k < inputsValues[indexCheckBox]?.value[i]?.[j]?.length; k++) {
                            let arrayDays = []
                            let entrar2 = false
                            for (let l = 0; l < 31; l++) {
                                if (inputsValues[indexCheckBox]?.value[i]?.[j]?.[k]?.[l] === true) {
                                    entrar = true
                                    entrar2 = true
                                    arrayDays.push(true)
                                } else {
                                    arrayDays.push(false)
                                }
                            }
                            if (entrar2) arrayOptions.push({ name: cardToCheck.inputs[indexCheckBox].options[k], array: arrayDays })
                        }
                        if (entrar) mesesFinal.push({ name: (j).toString(), array: arrayOptions })
                    }
                    arrayFinal.push({ name: (i + 2023).toString(), meses: mesesFinal })
                }

                objetoFinal.inputs = arrayFinal
                // let indexObservaciones = cardToCheck.inputs.findIndex((element) => element.name === "Observaciones")
                // objetoFinal.observaciones = inputsValues[indexObservaciones]?.value

                for (let i = 0; i < cardToCheck.inputs.length; i++) {
                    if (i === indexCheckBox) continue
                    let objeto = {}
                    objeto.name = cardToCheck.inputs[i].name
                    objeto.value = inputsValues[i]?.value
                    objetoFinal[objeto.name] = { value: objeto.value}    
                }
            }
            // console.log('objetoFinal: ', objetoFinal)
            console.log("🚀 ~ file: FormType3.js:330 ~ handleSaveButton ~ objetoFinal:", JSON.stringify(objetoFinal))

            // hago fetch a la url de cardToCheck.url y le paso los inputsValues en bod
            fetch(cardToCheck.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(objetoFinal),                
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Success:', data);
                    setNotif({ view: true, message: "¡Formulario creado exitosamente!", color: "verde" })

                    let array = []
                    for (let i = 0; i < cardToCheck.inputs.length; i++) {
                        if ((cardToCheck.inputs[i].tipo === "picker") && (cardToCheck.inputs[i].name === "Mes")) {
                            array[i] = { value: new Date().toLocaleString('default', { month: 'long' }) }
                        }
                        else if ((cardToCheck.inputs[i].tipo === "picker") && (cardToCheck.inputs[i].name === "Año")) {
                            array[i] = { value: new Date().getFullYear() }
                        }
                        else if (cardToCheck.inputs[i].tipo === "select") {
                            array[i] = { name: cardToCheck.inputs[i].name, value: cardToCheck.inputs[i].options[0] }
                        }
                    }

                    setInputsValues(array)

                    setSaving(false);

                    // si la respuesta es exitosa, muestro un mensaje de exito
                    // y vuelvo a la pantalla anterior
                })
                .catch((error) => {
                    setSaving(false);
                    setNotif({ view: true, message: "¡Ups! Ocurrió un error", color: "naranja" })
                    console.error('Error:', error);
                });
        }
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

            {cardToCheck.inputs?.map((input, index) => {
                if (input.tipo === "picker") {
                    return (
                        <View key={index}>
                            <Text style={styles.normalText}>{input.name}</Text>
                            <Picker
                                selectedValue={inputsValues[index]?.value}
                                onValueChange={(itemValue) => {
                                    let array = [...inputsValues];
                                    array[index] = { value: itemValue };
                                    setInputsValues(array);
                                }}
                                style={styles.userInput}>
                                {input.options.map((option) => (
                                    <Picker.Item key={option} label={option} value={option.toLowerCase()} />
                                ))}
                            </Picker>
                        </View>
                    )
                }
                else if (input.tipo === "textGrande") {
                    return (
                        <View key={index} style={{ marginVertical: 20 }}>
                            <Text style={[styles.normalText, { marginVertical: 5 }]}>{input.name}</Text>
                            <TextInput
                                style={[styles.userInput, { height: 100, textAlignVertical: 'top', borderWidth: 1, borderColor: '#3b3b3b', borderRadius: 10, padding: 10 }]}
                                multiline={true}
                                numberOfLines={4}
                                onChangeText={(value) => {
                                    let array = [...inputsValues];
                                    array[index] = { name: input.name, value: value };
                                    setInputsValues(array);
                                }}
                                value={inputsValues[index]?.value}
                            />
                        </View>
                    )
                }
                else if (input.tipo === "text") {
                    return (
                        <View key={index} style={{ marginTop: 5, marginBottom: 20 }} >
                            <Text style={{ fontFamily: "GothamRoundedMedium", fontSize: 16, marginRight: 10, marginBottom: 5 }}>{input.name}</Text>
                            <View style={styles.passwordInputContainer}>
                                <TextInput
                                    style={styles.userInput}
                                    placeholder={(input.name.length >= 18 ? (input.name.substring(0, 18) + "...") : input.name)}
                                    value={inputsValues[index]?.value}
                                    onChangeText={(value) => {
                                        let array = [...inputsValues];
                                        array[index] = { name: input.name, value: value };
                                        setInputsValues(array);
                                    }}
                                />
                            </View>
                        </View>
                    )
                }
                else if (input.tipo === "checkBox") {
                    return (
                        <View key={index} style={{ marginVertical: 40 }}>
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

                                    {input.options?.map((option, index2) => {
                                        return (
                                            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', height: height5 }} key={option}>
                                                <Text style={[styles.normalText,
                                                {
                                                    fontSize: 12,
                                                    textAlign: 'center',
                                                    width: width50,
                                                    borderLeftWidth: 1,
                                                    borderBottomWidth: 1,
                                                    borderColor: '#C3C3C3',
                                                    textAlignVertical: 'center'
                                                }]}>{option}</Text>
                                                {Array.from({ length: 31 }, (_, day) => (
                                                    <View key={(day + option).toString()} style={[styles.normalText,
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
                                                        <Checkbox
                                                            style={{}}
                                                            color={handleCheckColor(day, index, index2)}
                                                            value={handleCheckValue(day, index, index2)}
                                                            onValueChange={(value) => handleCheckChange(value, day, index, index2)}
                                                        />
                                                    </View>
                                                ))}
                                            </View>
                                        )
                                    })}
                                </View>
                            </ScrollView>
                        </View>
                    )
                }
                else if (input.tipo === "select") {
                    return (
                        <View key={index} style={[{ marginTop: 5, marginBottom: 20 }]}>
                            <Text style={{ fontFamily: "GothamRoundedMedium", fontSize: 16 }}>{input.name}</Text>
                            <Picker
                                selectedValue={inputsValues[index]?.value.toLowerCase()}
                                style={styles.userInput}
                                editable={input.disabled ? false : true}
                                onValueChange={(itemValue, itemIndex) => {
                                    let array = [...inputsValues];
                                    array[index].value = itemValue;
                                    setInputsValues(array);
                                }}
                            >
                                {input.options.map((option, index) => {
                                    return (
                                        <Picker.Item key={index} label={option.toLowerCase()} value={option} />
                                    )
                                })}
                            </Picker>
                        </View>
                    )
                }

            })}



            {/* para guardar los datos */}
            <View style={{ borderBottomColor: 'black', borderBottomWidth: 1, marginTop: 20 }} />
            <TouchableOpacity style={styles.buttonForm} onPress={handleSaveButton}>
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
        borderColor: '#3b3b3b',
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
        color: 'black',
        fontSize: 16,
        fontFamily: "GothamRoundedMedium",
        marginBottom: 15,
        // cambio el color del placeholder de este textInput a #C3C3C3

    },
})