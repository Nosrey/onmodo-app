import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import DatePicker from './DatePicker';
import TimePicker from './TimePicker';
// traigo el icon plussquareo la libreria AntDesign
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';

export default function FormType2({ indexPicked, setIndexPicked, setVisibleForm, navigation, visibleForm, reglones, setReglones, setViewDelete, setReglonPicked, editionMode, setEditionMode, setViewInfo, setNotif, setCortina, cortina }) {
    const [inputsValues, setInputsValues] = useState([]); // [ {name: "nombre", value: "valor"}, {name: "apellido", value: "valor"} aca se guardan los valores de los inputs de todo el formulario
    const [saving, setSaving] = useState(false); // si saving es true, se muestra un mensaje de guardando... y se deshabilita el boton de guardar

    const cardToCheck = useSelector((state) => state.cardToCheck);
    const id = useSelector((state) => state.id);

    useEffect(() => {
        if (cardToCheck.inputs?.length > 0) {
            let array = [];
            for (let i = 0; i < cardToCheck.inputs.length; i++) {
                if (cardToCheck.inputs[i].tipo !== "select") {
                    array.push({ name: cardToCheck.inputs[i].name, value: '' })
                } else {
                    array.push({ name: cardToCheck.inputs[i].name, value: cardToCheck.inputs[i].options[0] })
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

    function handleDeleteButton(index, index2) {
        setReglonPicked(index)
        setIndexPicked(index2)
        setViewDelete(true)
    }

    function handleEditButton(index, index2) {
        setReglonPicked(index)
        setIndexPicked(index2)
        setEditionMode(true)
        setCortina(true)
        let copiaVisibleForm = visibleForm;
        copiaVisibleForm[index2] = true;
        setVisibleForm(copiaVisibleForm);
    }

    function handleInfoButton() {
        setViewInfo(true)
    }

    function handleSaveButton() {
        if (saving) return; // si saving es true, no hago nada
        else {
            setSaving(true); // si saving es false, lo pongo en true
            let copiaInputsValue = []
            for (let i = 0; i < cardToCheck.inputs?.length; i++) {
                if (cardToCheck.inputs[i]?.tipo === "row") {
                    let reglonFinal = [];
                    for (let j = 0; j < reglones[i]?.length; j++) {
                        reglonFinal.push(reglones[i][j].values)
                        for (let k = 0; k < reglonFinal.length; k++) {
                            for (let l = 0; l < reglonFinal[k].length; l++) {
                                if (cardToCheck.inputs[i]?.options[l].tipo === "select" && reglonFinal[k][l].value === "") {
                                    reglonFinal[k][l].value = cardToCheck.inputs[i]?.options[l].options[0]
                                }
                            }
                        }
                    }
                    copiaInputsValue.push({ name: inputsValues[i]?.name, value: reglonFinal })
                    console.log('reglonFinal:', reglonFinal)

                } else if (cardToCheck.inputs[i]?.tipo !== "subTitle") {
                    copiaInputsValue.push({ name: inputsValues[i]?.name, value: inputsValues[i]?.value })
                }
            }

            let objeto = {
                idUser: id,
            }
            if (cardToCheck.exception2) {
                let inputFinal = [];
                for (let i = 0; i < copiaInputsValue[0].value.length; i++) {
                    inputFinal.push({ id: i, fecha: copiaInputsValue[0].value[i][0].value, turno: copiaInputsValue[0].value[i][1].value, productoDecomisado: copiaInputsValue[0].value[i][2].value, cantidad: copiaInputsValue[0].value[i][3].value, causa: copiaInputsValue[0].value[i][4].value })
                }
                objeto.inputs = inputFinal
            } else {
                objeto.inputs = copiaInputsValue
            }

            console.log('objeto: ', objeto)


            // hago fetch a la url de cardToCheck.url y le paso los inputsValues en body
            fetch(cardToCheck.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(objeto),
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Success:', data);
                    setNotif({ view: true, message: "¡Formulario creado exitosamente!", color: "verde" })

                    if (cardToCheck.inputs?.length > 0) {
                        let array = [];
                        for (let i = 0; i < cardToCheck.inputs.length; i++) {
                            if (cardToCheck.inputs[i].tipo !== "select") {
                                array.push({ name: cardToCheck.inputs[i].name, value: '' })
                            } else {
                                array.push({ name: cardToCheck.inputs[i].name, value: cardToCheck.inputs[i].options[0] })
                            }
                        }




                        setInputsValues(array);
                        setReglones([]);
                    }


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
            <TouchableOpacity onPress={handleInfoButton} style={{ display: (cardToCheck.verMas?.length ? 'flex' : 'none') }}>
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
                if (input.tipo === "date") {
                    return (
                        <DatePicker key={index} inputReceived={input} index={index} setInputsGlobal={setInputsGlobal} inputsValues={inputsValues} />
                    )
                }
                else if (input.tipo === "row") return (
                    <View key={index} style={{ marginTop: 5, marginBottom: 20 }} >
                        <Text style={styles.normalText}>{input.name + ':'}</Text>

                        <View style={styles.reglon}>
                            <View style={styles.fila}>
                                {reglones.length ? (
                                    reglones[index]?.map((reglon, index2) => {
                                        return (
                                            <View key={index2}>
                                                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                                    <Text style={{ fontFamily: 'GothamRoundedMedium', width: "80%" }}>{"Elemento #" + (index2 + 1)}</Text>

                                                    <TouchableOpacity style={{ display: 'flex', alignItems: 'left', justifyContent: 'center', width: "10%", }}>
                                                        <Feather name="edit-3" size={20} color="black" onPress={() => { handleEditButton(index2, index) }} />
                                                    </TouchableOpacity>

                                                    <TouchableOpacity style={{ display: 'flex', alignItems: 'right', justifyContent: 'center', width: "10%", }}>
                                                        <Feather name="trash-2" size={20} color="black" onPress={() => { handleDeleteButton(index2, index) }} />
                                                    </TouchableOpacity>

                                                </View>
                                                <View style={{ borderBottomColor: '#C3C3C3', borderBottomWidth: 1, marginVertical: 10 }} />
                                            </View>

                                        )
                                    })) : null}
                                <TouchableOpacity style={styles.buttonFooterStyle} onPress={() => {
                                    let copiaVisibleForm = visibleForm;
                                    copiaVisibleForm[index] = true;
                                    setVisibleForm(copiaVisibleForm);
                                    setCortina(true)
                                }}>
                                    <AntDesign name="plussquareo" size={30} color="#7BC100" style={{ alignSelf: 'center' }} />
                                    <Text style={[styles.buttonText]}>Agregar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )
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
                                        array[index].value = value;
                                        setInputsValues(array);
                                    }}
                                />
                            </View>
                        </View>
                    )
                }
                else if (input.tipo === "time") {
                    return (
                        <TimePicker key={index} inputReceived={input} index={index} setInputsGlobal={setInputsGlobal} inputsValues={inputsValues} />
                    )
                }
                else if (input.tipo === "subTitle") {
                    return (
                        <Text key={index} style={[styles.normalText, { fontSize: 18, marginBottom: 10, marginTop: 15 }]}>{input.name}</Text>
                    )
                }
                else if (input.tipo === "select") {
                    return (
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
                }
      
            })}

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
        marginBottom: 5,
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