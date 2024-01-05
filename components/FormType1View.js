import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useSelector, useDispatch } from 'react-redux';
import DateTimePicker from '@react-native-community/datetimepicker';
import DatePicker from './DatePicker';

export default function FormType1View({ navigation, setNotif }) {
    const dispatch = useDispatch();
    const cardToCheck = useSelector((state) => state.cardToCheck);
    const objectToCheck = useSelector((state) => state.objectToCheck);
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
                let item = objectToCheck.values?.find((input) => input.name === cardToCheck.inputs[i].name)
                array.push({ name: cardToCheck.inputs[i].name, value: item?.value })
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

    function traducirFecha(fecha) {
        //  traduzco de esto "2023-10-09T16:47:26.976Z" a legible
        if (fecha?.length) {

            let dia = fecha.slice(8, 10)
            let mes = fecha.slice(5, 7)
            let anio = fecha.slice(0, 4)
            let meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
            let mesTexto = meses[mes - 1]
            return dia + '/' + mesTexto + '/' + anio
        } else return 'vacio'
    }

    function traducirHora(hora) {
        // traduzco esta hora 2023-10-11T03:27:28.079Z
        if (hora?.length) {
            let horaTexto = hora.slice(11, 16)
            return horaTexto
        } else return 'vacio'
    }

    return (
        <View style={styles.container}>
            <Text style={styles.titleForm}>{cardToCheck.title2}</Text>
            <View style={{ borderBottomColor: 'black', borderBottomWidth: 1, marginBottom: 20 }} />
            <View>
                {cardToCheck.inputs?.map((input, index) => {
                    if (input.tipo === "date") {
                        return (
                            <View key={index} style={{ marginTop: 5, marginBottom: 20 }} >
                                <Text style={{ fontFamily: "GothamRoundedMedium", fontSize: 16, marginRight: 10, marginBottom: 5 }}>{input.name}</Text>
                                <Text style={{ fontFamily: "GothamRoundedMedium", fontSize: 16, marginRight: 10, marginBottom: 5 }}>{traducirFecha(inputsValues[index]?.value)}</Text>
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
                                    editable={false}
                                    style={styles.userInput}
                                    placeholder={(input.name.length >= 18 ? (input.name.substring(0, 18) + "...") : input.name)}
                                    value={inputsValues[index]?.value}
                                    onChangeText={(value) => {
                                        let array = [...inputsValues];
                                        array[index].value = value;

                                    }}
                                />
                            </View>
                        </View>)
                    else if (input.tipo === "select") return (
                        <View key={index} style={{ marginTop: 5, marginBottom: 20 }}>
                            <Text style={{ fontFamily: "GothamRoundedMedium", fontSize: 16 }}>{input.name}</Text>
                            <Picker
                                enabled={false}
                                editable={false}
                                selectedValue={inputsValues[index]?.value || input.options[0]}
                                style={styles.userInput}
                                onValueChange={(itemValue, itemIndex) => {
                                    let array = [...inputsValues];
                                    array[index].value = itemValue;

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

        </View>
    )
}

const styles = StyleSheet.create({
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


    },
})