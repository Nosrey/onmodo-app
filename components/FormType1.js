import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useSelector, useDispatch } from 'react-redux';
import DateTimePicker from '@react-native-community/datetimepicker';
import DatePicker from './DatePicker';

export default function FormType1({ navigation, setNotif }) {
    const dispatch = useDispatch();
    const cardToCheck = useSelector((state) => state.cardToCheck);
    const id = useSelector((state) => state.id);
    
    const businessName = useSelector((state) => state.business);
    const rol = useSelector((state) => state.rol);
    const nombre = useSelector((state) => state.fullName);

    const [inputsValues, setInputsValues] = useState([]); // [ {name: "nombre", value: "valor"}, {name: "apellido", value: "valor"} aca se guardan los valores de los inputs de todo el formulario
    const [saving, setSaving] = useState(false); // si saving es true, se muestra un mensaje de guardando... y se deshabilita el boton de guardar

    // creo un array inicial con la longitud de cardToCheck.inputs si su longitud es mayor a 0 usando un useEffect
    useEffect(() => {
        if (cardToCheck.inputs?.length > 0) {
            let array = [];
            for (let i = 0; i < cardToCheck.inputs.length; i++) {
                if ((cardToCheck.inputs[i].tipo !== "select") && (cardToCheck.inputs[i].tipo !== "title") && (cardToCheck.inputs[i].tipo !== "subtitle")) {
                    array.push({ name: cardToCheck.inputs[i].name, value: '' })
                }
                else if ((cardToCheck.inputs[i].tipo !== "title") && (cardToCheck.inputs[i].tipo !== "subtitle")) {
                    array.push({ name: cardToCheck.inputs[i].name, value: cardToCheck.inputs[i].options[0] })
                } else {
                    array.push(null)
                }
            }
            setInputsValues(array);
        }
    }, [cardToCheck])

    function setInputsGlobal(index, enteredValue) {
        let array = [...inputsValues];
        array[index].value = enteredValue;
        setInputsValues(array);
    }

    function handleSaveButton() {
        if (saving) return; // si saving es true, no hago nada
        else {
            setSaving(true); // si saving es false, lo pongo en true
            // hago fetch a la url de cardToCheck.url y le paso los inputsValues en body
            let objetoFinal = {
                idUser: id,
                values: inputsValues,
                rol: rol,
                nombre: nombre,
                businessName: businessName,
            }

            console.log("🚀 ~ file: FormType1.js:50 ~ handleSaveButton ~ objetoFinal:", objetoFinal)

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
                    setSaving(false);
                    // si la respuesta es exitosa, muestro un mensaje de exito
                    setNotif({ view: true, message: "¡Formulario creado exitosamente!", color: "verde" })
                    if (cardToCheck.inputs?.length > 0) {
                        let array = [];
                        for (let i = 0; i < cardToCheck.inputs.length; i++) {
                            if ((cardToCheck.inputs[i].tipo !== "select") && (cardToCheck.inputs[i].tipo !== "title") && (cardToCheck.inputs[i].tipo !== "subtitle")) {
                                array.push({ name: cardToCheck.inputs[i].name, value: '' })
                            }
                            else if ((cardToCheck.inputs[i].tipo !== "title") && (cardToCheck.inputs[i].tipo !== "subtitle")) {
                                array.push({ name: cardToCheck.inputs[i].name, value: cardToCheck.inputs[i].options[0] })
                            } else {
                                array.push(null)
                            }
                        }
                        setInputsValues(array);
                    }
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
            <Text style={styles.titleForm}>{cardToCheck.title2}</Text>
            <View style={{ borderBottomColor: 'black', borderBottomWidth: 1, marginBottom: 20 }} />
            <View>
                {cardToCheck.inputs?.map((input, index) => {
                    if (input.tipo === "date") {
                        return (
                            <View key={index}>
                                <DatePicker inputReceived={input} index={index} setInputsGlobal={setInputsGlobal} inputsValues={inputsValues} />
                            </View>
                        )
                    }
                    else if (input.tipo === "title") return (
                        <View key={index} style={{ marginTop: 5, marginBottom: 20 }} >
                            <Text style={{ fontFamily: "GothamRoundedMedium", fontSize: 20, textAlign: 'center', paddingHorizontal: 5, marginRight: 10, marginBottom: 5 }}>{input.name}</Text>
                        </View>
                    )
                    else if (input.tipo === "subtitle") return (
                        <View key={index} style={{ marginTop: 5, marginBottom: 10 }} >

                            <View style={{ borderBottomColor: 'black', borderBottomWidth: 1, marginBottom: 20 }} />
                            <Text style={{ fontFamily: "GothamRoundedMedium", fontSize: 18, marginRight: 10, marginBottom: 5 }}>{input.name}</Text>
                        </View>
                    )
                    else if (input.tipo === "text") return (
                        <View key={index} style={{ marginTop: 5, marginBottom: 20 }} >
                            <Text style={{ fontFamily: "GothamRoundedMedium", fontSize: 16, marginRight: 10, marginBottom: 5 }}>{input.name}</Text>
                            <View style={styles.passwordInputContainer}>
                                <TextInput
                                    style={styles.userInput}
                                    placeholder={(input.name.length >= 18 ? (input.name.substring(0, 18) + "...") : input.name)}
                                    value={inputsValues[index]?.value}
                                    onChangeText={(value) => {
                                        let array = [...inputsValues];
                                        array[index].value = value;
                                        setInputsValues(array);
                                    }}
                                />
                            </View>
                        </View>)
                    else if (input.tipo === "select") return (
                        <View key={index} style={{ marginTop: 5, marginBottom: 20 }}>
                            <Text style={{ fontFamily: "GothamRoundedMedium", fontSize: 16 }}>{input.name}</Text>
                            <Picker
                                selectedValue={inputsValues[index]?.value || input.options[0]}
                                style={styles.userInput}
                                onValueChange={(itemValue, itemIndex) => {
                                    let array = [...inputsValues];
                                    array[index].value = itemValue;
                                    setInputsValues(array);
                                }}
                            >
                                {input.options.map((option, index) => {
                                    return (
                                        <Picker.Item key={index} label={option} value={option} />
                                    )
                                })}
                            </Picker>
                        </View>
                    )
                })}

            </View>
            <View style={{ borderBottomColor: 'black', borderBottomWidth: 1, marginTop: 20 }} />
            <TouchableOpacity style={styles.buttonForm} onPress={() => handleSaveButton()}>
                <Text style={styles.buttonFormText}>
                    Guardar
                </Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
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
        fontFamily: "GothamRoundedMedium",


    },
})