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
import { API_URL, registroCapacitacion, verificacionTermometros, verificacionBalanzas, reporterechazo, entregabidones } from '../functions/globalFunctions'
import * as DocumentPicker from 'expo-document-picker';

export default function FormType2({ indexPicked, setIndexPicked, setVisibleForm, navigation, visibleForm, reglones, setReglones, setViewDelete, setReglonPicked, editionMode, setEditionMode, setViewInfo, setNotif, setCortina, cortina }) {
    const [inputsValues, setInputsValues] = useState([]); // [ {name: "nombre", value: "valor"}, {name: "apellido", value: "valor"} aca se guardan los valores de los inputs de todo el formulario
    const [saving, setSaving] = useState(false); // si saving es true, se muestra un mensaje de guardando... y se deshabilita el boton de guardar
    const [allowSaveCaseProcess, setAllowSaveCaseProcess] = useState(false);

    const cardToCheck = useSelector((state) => state.cardToCheck);
    const id = useSelector((state) => state.id);
    const businessName = useSelector((state) => state.business);
    const rol = useSelector((state) => state.rol);
    const nombre = useSelector((state) => state.fullName);

    const [image, setImage] = useState(null);

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

    // CREA LA funcion que DocumentPicker para que traiga archivos pdf e imagenes
    // para la api expo-document-picker creo la cfuncion selectDoc
    const selectDoc = async (index) => {
        try {
            const res = await DocumentPicker.getDocumentAsync({ type: ['application/pdf', 'image/*'] })
            console.log(res)
            if (res.canceled === false) {
                let inputsCopy = [...inputsValues]
                // inputsCopy[index].value = res
                // haz que sea un file object, con la propiedad path y name adecuadas, este es el formato  {"assets": [{"mimeType": "image/jpeg", "name": "IMG-20210328-WA0016.jpg", "size": 84176, "uri": "file:///data/user/0/host.exp.exponent/cache/DocumentPicker/ecae440f-de45-468e-b68e-5dc0ea484b15.jpg"}], "canceled": false} que recibiras
                inputsCopy[index].value = res.assets[0]
                
                setInputsValues(inputsCopy)
            }
        } catch (error) {
            console.log(error)
        }
    }


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
        if (allowSaveCaseProcess || !cardToCheck.exceptionP1) {
            if (saving) return; // si saving es true, no hago nada
            else if (cardToCheck.exceptionForm2Cap === true) {
                setSaving(true);
                let inputsFinal = {
                    "fecha": inputsValues[0]?.value,
                    "tiempoDuracion": inputsValues[1]?.value,
                    "checkboxes": [
                        {
                            "label": "Inducción",
                            "check": inputsValues[3]?.value
                        },
                        {
                            label: "Campaña",
                            check: inputsValues[4]?.value
                        },
                        {
                            label: "Entrenamiento Puesto de trabajo",
                            check: inputsValues[5]?.value
                        },
                        {
                            label: "Capacitaciones gubernamentales",
                            check: inputsValues[6]?.value
                        },
                        {
                            label: "Capacitación sobre Normas o Certificaciones",
                            check: inputsValues[7]?.value
                        },
                        {
                            label: "Cierre Auditoría",
                            check: inputsValues[8]?.value
                        },

                    ],
                    "temas": inputsValues[9]?.value,
                    "materialEntregado": [
                        {
                            "label": "Manual /instructivo",
                            "check": inputsValues[11]?.value
                        },
                        {
                            "label": "Folleto",
                            "check": inputsValues[12]?.value
                        },
                        {
                            "label": "Procedimiento",
                            "check": inputsValues[13]?.value
                        },
                        {
                            "label": "Otros",
                            "check": inputsValues[14]?.value,
                            "text": inputsValues[14]?.value2
                        },
                    ],
                    "materialExpuesto": [
                        {
                            "label": "Video",
                            "check": inputsValues[16]?.value
                        },
                        {
                            "label": "Filminas",
                            "check": inputsValues[17]?.value
                        },
                        {
                            "label": "Disertación",
                            "check": inputsValues[18]?.value
                        },
                        {
                            "label": "Otros",
                            "check": inputsValues[19]?.value,
                            "text": inputsValues[19]?.value2
                        },
                    ],
                    "asistentes": [],
                    "observaciones": inputsValues[21]?.value,
                    "instructor": inputsValues[22]?.value,
                    "firma": inputsValues[23]?.value,
                }

                console.log('inputsValues: ', JSON.stringify(inputsValues))
                console.log('reglones: ', JSON.stringify(reglones))

                if (reglones[20]?.length > 0) {
                    for (let i = 0; i < reglones[20].length; i++) {
                        console.log('vuelta ', i)
                        inputsFinal.asistentes.push(
                            {
                                "dni": reglones[20][i].values[0]?.value,
                                "nombre": reglones[20][i].values[1]?.value,
                                "area": reglones[20][i].values[2]?.value,
                                "resultado": reglones[20][i].values[3]?.value,
                                "metodo": reglones[20][i].values[4]?.value,
                            },
                        )
                    }
                }

                let example2 = {
                    "fecha": "",
                    "tiempoDuracion": "",
                    "checkboxes": [
                        {}
                    ],
                    "temas": "",
                    "materialEntregado": [
                        {}
                    ],
                    "materialExpuesto": [
                        {}
                    ],
                    "asistentes": [],
                    "observaciones": "",
                    "instructor": "",
                    "firma": {
                        "path": "_04c2d993-6e2d-454a-b1cc-1d427958cae2.jpeg"
                    },
                    "idUser": "65511179c66bd0041901aa5b"
                }

                console.log('inputsFinal:', inputsFinal)

                registroCapacitacion(inputsFinal, setSaving, rol, id, businessName, nombre, inputsValues[23].value)
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
            }
            else {
                console.log('entre')
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

                    } else if (cardToCheck.inputs[i]?.tipo !== "subTitle" && cardToCheck.inputs[i]?.tipo !== "title") {
                        copiaInputsValue.push({ name: inputsValues[i]?.name, value: inputsValues[i]?.value })
                    }
                }

                let objeto = {
                    idUser: id,
                    rol: rol,
                    nombre: nombre,
                    businessName: businessName,
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


                if (cardToCheck.title === "Verificación de Termómetros") {
                    objeto = verificacionTermometros(copiaInputsValue)
                    objeto = {
                        ...objeto,
                        idUser: id,
                        rol: rol,
                        nombre: nombre,
                        businessName: businessName,
                    }
                }

                if (cardToCheck.title === "Verificación Balanzas") {
                    console.log('copiaInputsValue: ', JSON.stringify(copiaInputsValue))
                    objeto = verificacionBalanzas(copiaInputsValue)
                    objeto = {
                        ...objeto,
                        idUser: id,
                        rol: rol,
                        nombre: nombre,
                        businessName: businessName,
                    }
                }

                if (cardToCheck.title === "Rechazo /  Devolución de Materias Primas") {
                    objeto = reporterechazo(inputsValues)
                    objeto = {
                        ...objeto,
                        idUser: id,
                        rol: rol,
                        nombre: nombre,
                        businessName: businessName,
                    }
                }

                if (cardToCheck.title === "Entrega de Bidones de Aceite Usado") {
                    let inputs = entregabidones(reglones[0])
                    objeto = {
                        inputs: inputs,
                        idUser: id,
                        rol: rol,
                        nombre: nombre,
                        businessName: businessName,
                    }
                }

                console.log("🚀 ~ file: FormType2.js:98 ~ handleSaveButton ~ objeto:", JSON.stringify(objeto))

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
        } else if (inputsValues[0].value == "") {
            setNotif({ view: true, message: "Por favor ingresa una fecha", color: "naranja" })
        } else {
            setNotif({ view: true, message: "Porfavor elige una fecha que no este repetida", color: "naranja" })
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
            <TouchableOpacity onPress={() => {
                console.log('inputsValues: ', JSON.stringify(inputsValues))
                console.log('reglones: ', JSON.stringify(reglones))
            }}>
                <Text>Prueba</Text>
            </TouchableOpacity>

            {cardToCheck.inputs?.map((input, index) => {
                if (input.tipo === "date") {
                    return (
                        <DatePicker key={index} inputReceived={input} index={index} setInputsGlobal={setInputsGlobal} inputsValues={inputsValues} setAllowSaveCaseProcess={setAllowSaveCaseProcess} allowSaveCaseProcess={allowSaveCaseProcess} />
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
                else if (input.tipo === "fileUpload") {
                    return (
                        <View key={index} style={{ marginTop: 5, marginBottom: 20 }} >
                            <Text style={{ fontFamily: "GothamRoundedMedium", fontSize: 16, marginRight: 10, marginBottom: 10 }}>{input.name}</Text>
                            <Text style={{ marginBottom: 5, display: (inputsValues[index]?.value?.uri ? 'flex' : 'none') }}>{
                                (inputsValues[index]?.value?.uri ? inputsValues[index]?.value?.uri.split("/")[inputsValues[index]?.value?.uri.split("/").length - 1] : '')
                            }</Text>
                            <View style={styles.buttonFooterStyle}>
                                <TouchableOpacity onPress={() => selectDoc(index)}>
                                    <Text style={styles.buttonText}>Subir archivo</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )
                }
                else if (input.tipo === "textGrande") {
                    return (
                        <View key={index} style={{ marginVertical: 20, marginTop: 5 }}>
                            <Text style={[styles.normalText, { marginVertical: 5 }]}>{input.name}</Text>
                            <TextInput
                                style={[styles.userInput, { height: 100, textAlignVertical: 'top', borderWidth: 1, borderColor: "#C3C3C3", borderRadius: 10, padding: 10 }]}
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
                else if (input.tipo === "time") {
                    return (
                        <TimePicker key={index} inputReceived={input} index={index} setInputsGlobal={setInputsGlobal} inputsValues={inputsValues} />
                    )
                }
                else if (input.tipo === "subTitle") {
                    return (
                        <Text key={index} style={[styles.normalText, { fontSize: 18, marginBottom: 10, marginTop: 15, borderBottomColor: 'black', borderBottomWidth: 1, paddingBottom: 10 }]}>{input.name}</Text>
                    )
                }
                else if (input.tipo === "title") {
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
                else if (input.tipo === "selectConText") {
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

                            <View style={[styles.passwordInputContainer, { display: (input.activador === inputsValues[index]?.value ? 'flex' : 'none') },]}>
                                <TextInput
                                    style={[styles.userInput]}
                                    placeholder={(input.name.length >= 18 ? (input.name.substring(0, 18) + "...") : input.name)}
                                    value={inputsValues[index]?.value2}
                                    onChangeText={(value) => {
                                        let array = [...inputsValues];
                                        array[index].value2 = value;
                                        setInputsValues(array);
                                    }}
                                />
                            </View>


                        </View>
                    )
                }
                else if (input.tipo === "selectShow") {
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
                            <Text style={{ fontFamily: "GothamRoundedMedium", fontSize: 16 }}>{inputsValues[index]?.value || input.options[0]}</Text>
                        </View>
                    )
                }

            })}

            <View style={{ borderBottomColor: 'black', borderBottomWidth: 1, marginTop: 20 }} />
            <TouchableOpacity style={[styles.buttonForm, { backgroundColor: (!allowSaveCaseProcess && cardToCheck.exceptionP1 === true) ? "#b4b5b3" : "#7BC100" }]} onPress={handleSaveButton}>
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