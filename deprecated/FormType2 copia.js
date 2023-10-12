import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import DateTimePicker from '@react-native-community/datetimepicker';
import DatePicker from './DatePicker';
import TimePicker from './TimePicker';
// traigo el icon plussquareo la libreria AntDesign
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';

export default function FormType2({ setVisibleForm, navigation, visibleForm, reglones, setReglones, setViewDelete, setReglonPicked, editionMode, setEditionMode, setViewInfo, setNotif}) {
    const [inputsValues, setInputsValues] = useState([]); // [ {name: "nombre", value: "valor"}, {name: "apellido", value: "valor"} aca se guardan los valores de los inputs de todo el formulario
    const [saving, setSaving] = useState(false); // si saving es true, se muestra un mensaje de guardando... y se deshabilita el boton de guardar

    const cardToCheck = useSelector((state) => state.cardToCheck);
    const id = useSelector((state) => state.id);

    useEffect(() => {
        if (cardToCheck.inputs?.length > 0) {
            let array = [];
            for (let i = 0; i < cardToCheck.inputs.length; i++) {
                array.push({ name: cardToCheck.inputs[i].name, value: '' })
            }
            setInputsValues(array);
        }
    }, [cardToCheck])

    function setInputsGlobal(index, enteredValue) {
        let array = [...inputsValues];
        array[index].value = enteredValue;
        setInputsValues(array);
    }

    function handleDeleteButton(index) {
        setReglonPicked(index)
        setViewDelete(true)
    }

    function handleEditButton(index) {
        setReglonPicked(index)
        setEditionMode(true)
        setVisibleForm(true)
    }

    function handleInfoButton() {
        setViewInfo(true)
    }

    function handleSaveButton() {
        if (saving) return; // si saving es true, no hago nada
        else {
            setSaving(true); // si saving es false, lo pongo en true
            let copiaInputsValue = []
            for (let i = 0; i < inputsValues?.length; i++) {
                if (inputsValues[i]?.name === "Servicios") {
                    copiaInputsValue.push({ name: inputsValues[i]?.name, value: reglones[0]?.values })
                } else {
                    copiaInputsValue.push({ name: inputsValues[i]?.name, value: inputsValues[i]?.value })
                }
            }

            let objeto = {
                idUser: id,
                inputs: copiaInputsValue,
            }

            
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
                    setNotif({view: true, message: "¡Formulario creado exitosamente!", color: "verde"})
                    
                    if (cardToCheck.inputs?.length > 0) {
                        let array = [];
                        for (let i = 0; i < cardToCheck.inputs.length; i++) {
                            array.push({ name: cardToCheck.inputs[i].name, value: '' })
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
                    setNotif({view: true, message: "¡Ups! Ocurrió un error", color: "naranja"})
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
            <DatePicker inputReceived={cardToCheck.inputs[0]} index={0} setInputsGlobal={setInputsGlobal} inputsValues={inputsValues} />

            <Text style={styles.normalText}>{cardToCheck.inputs[1].name + ':'}</Text>
            <View style={styles.reglon}>
                <View style={styles.fila}>
                    {reglones.length ? (
                        reglones.map((reglon, index) => {
                            return (
                                <View key={index}>
                                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text style={{ fontFamily: 'GothamRoundedMedium', width: "80%" }}>{"#" + (index + 1) + " " + ((reglon.values[0]?.value) ? reglon.values[0]?.value : '(sin servicio)') + " por " + ((reglon.values[9]?.value) ? reglon.values[9]?.value : '(sin responsable)')}</Text>

                                        <TouchableOpacity style={{ display: 'flex', alignItems: 'left', justifyContent: 'center', width: "10%", }}>
                                            <Feather name="edit-3" size={20} color="black" onPress={() => { handleEditButton(index) }} />
                                        </TouchableOpacity>

                                        <TouchableOpacity style={{ display: 'flex', alignItems: 'right', justifyContent: 'center', width: "10%", }}>
                                            <Feather name="trash-2" size={20} color="black" onPress={() => { handleDeleteButton(index) }} />
                                        </TouchableOpacity>

                                    </View>
                                    <View style={{ borderBottomColor: '#C3C3C3', borderBottomWidth: 1, marginVertical: 10 }} />
                                </View>

                            )
                        })) : null}
                    <TouchableOpacity style={styles.buttonFooterStyle} onPress={() => setVisibleForm(true)}>
                        <AntDesign name="plussquareo" size={30} color="#7BC100" style={{ alignSelf: 'center' }} />
                        <Text style={[styles.buttonText]}>Agregar</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View key={2} style={{ marginTop: 5, marginBottom: 20 }} >
                <Text style={{ fontFamily: "GothamRoundedMedium", fontSize: 16, marginRight: 10, marginBottom: 5 }}>{cardToCheck.inputs[2].name}</Text>
                <View style={styles.passwordInputContainer}>
                    <TextInput
                        style={styles.userInput}
                        placeholder={cardToCheck.inputs[2].name}
                        value={inputsValues[2]?.value}
                        onChangeText={(value) => {
                            let array = [...inputsValues];
                            array[2].value = value;
                            setInputsValues(array);
                        }}
                    />
                </View>
            </View>

            <DatePicker inputReceived={cardToCheck.inputs[3]} index={3} setInputsGlobal={setInputsGlobal} inputsValues={inputsValues} />

            <TimePicker inputReceived={cardToCheck.inputs[4]} index={4} setInputsGlobal={setInputsGlobal} inputsValues={inputsValues} />
            
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