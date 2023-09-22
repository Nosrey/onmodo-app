// creo un componente para que se muestre un popup donde confirmare una accion con dos botones de si o no
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useSelector, useDispatch } from 'react-redux';
import DatePicker from './DatePicker';
import TimePicker from './TimePicker';
// traigo el icon de closecircle de la libreria de AntDesign
import { AntDesign } from '@expo/vector-icons';

export default function CrearServicio({ navigation, params }) {
    const { visible, setVisible, reglones, setReglones, editionMode, reglonPicked, setEditionMode, index, cortina, setCortina } = params
    const [row, setRow] = useState([])
    const [inputsValueRow, setInputsValueRow] = useState([]); // [ {name: "nombre", value: "valor"}, {name: "apellido", value: "valor"} aca se guardan los valores de los inputs de todo el formulario

    const cardToCheck = useSelector((state) => state.cardToCheck);

    // un useEffect que se ejecute una sola vez y establezca row
    useEffect(() => {
        setRow(cardToCheck.inputs[index].options)
    }, [])

    useEffect(() => {
        if (row.length > 0) {
            
            if (!editionMode) {
                let array = [];
                for (let i = 0; i < row.length; i++) {
                    array.push({ name: row[i].name, value: '' })
                }
                setInputsValueRow(array);
            } else if (editionMode) {
                let array = [];
                for (let i = 0; i < reglones[index][reglonPicked].values.length; i++) {
                    array.push({ name: reglones[index][reglonPicked].values[i].name, value: reglones[index][reglonPicked].values[i].value })
                }
                setInputsValueRow(array);
            }
        }
    }, [row, visible, reglones, editionMode])

    const visibleStyle = {
        display: visible[index] ? "flex" : "none",
    }

    function setInputsGlobal(index, enteredValue) {
        let array = [...inputsValueRow];
        array[index].value = enteredValue;
        setInputsValueRow(array);
    }

    function handleSaveButton() {
        if (!editionMode) {
            let copiaReglones = [...reglones];
            if (copiaReglones[index]) {
                copiaReglones[index].push({ values: inputsValueRow })
            } else {
                copiaReglones[index] = [{ values: inputsValueRow }]
            }
            setReglones(copiaReglones)
        } else {
            let copiaReglones = [...reglones];
            copiaReglones[index][reglonPicked] = {
                values: inputsValueRow,
            }
            console.log('guardado: ', copiaReglones)
            setReglones(copiaReglones)
            setEditionMode(false)
        }
        let visibleCopia = [...visible];
        visibleCopia[index] = false;
        setVisible(visibleCopia)
        setCortina(false)
    }

    return (
        <View style={[styles.container, visibleStyle]} onPress={() => {
            let visibleCopia = [...visible];
            visibleCopia[index] = false;
            setVisible(visibleCopia)
        }}>
            <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between',         marginBottom: 10}}>
                <Text style={styles.titleForm}>Agregar:</Text>
                <TouchableOpacity>
                    <AntDesign name="closecircle" size={30} color="black" style={styles.closeBtn} onPress={() => {
                        let visibleCopia = [...visible];
                        visibleCopia[index] = false;
                        setVisible(visibleCopia);
                        setCortina(false)
                        setEditionMode(false)
                    }} />
                </TouchableOpacity>
            </View>
            <ScrollView style={{paddingHorizontal: 10}}>
                {/* mapeo el array de row y si es tipo text o tipo date creare un componente diferente */}
                {row?.map((input, index) => {
                    if (input.tipo === "date") {
                        return (                    
                            <View key={index}>
                                <DatePicker inputReceived={input} index={index} setInputsGlobal={setInputsGlobal} inputsValues={inputsValueRow}/>
                            </View>
                        )
                    } else if (input.tipo === "text") {
                        return (
                            <View key={index} style={{ marginTop: 5, marginBottom: 20 }} >
                                <Text style={{ fontFamily: "GothamRoundedMedium", fontSize: 16, marginRight: 10, marginBottom: 5 }}>{row[index].name}</Text>
                                <View style={styles.passwordInputContainer}>
                                    <TextInput
                                        style={styles.userInput}
                                        placeholder={row[index].name}
                                        value={inputsValueRow[index]?.value || ''}
                                        onChangeText={(value) => {
                                            let array = [...inputsValueRow];
                                            array[index].value = value;
                                            setInputsValueRow(array);
                                        }}
                                    />
                                </View>
                            </View>
                        )
                    } else if (input.tipo === "time") {
                        return (
                            <View key={index}>
                                <TimePicker inputReceived={input} index={index} setInputsGlobal={setInputsGlobal} inputsValues={inputsValueRow}/>
                            </View>
                        )
                    }  else if (input.tipo === "timeHeader") {
                        return (
                            <View key={index}>
                                <Text style={{ fontFamily: "GothamRoundedMedium", fontSize: 16, marginRight: 10 }}>Mantenimiento</Text>
                                <View style={{ borderBottomColor: 'black', borderBottomWidth: 1, marginTop: 10, marginBottom: 25 }} />
                                <Text style={{ fontFamily: "GothamRoundedMedium", fontSize: 16, backgroundColor: "#f0f0f0", paddingBottom: 10, paddingLeft: 5, paddingTop: 5, }}>{input.cabecera}</Text>
                                <TimePicker inputReceived={input} index={index} setInputsGlobal={setInputsGlobal} gris={true} inputsValues={inputsValueRow}/>
                            </View>
                        )
                    }  else if (input.tipo === "timeTop") {
                        return (
                            <View key={index}>
                                <Text style={{ fontFamily: "GothamRoundedMedium", fontSize: 16, backgroundColor: "#f0f0f0", paddingBottom: 10, paddingLeft: 5, paddingTop: 5, }}>{input.cabecera}</Text>
                                <TimePicker inputReceived={input} index={index} setInputsGlobal={setInputsGlobal} gris={true} inputsValues={inputsValueRow}/>
                            </View>
                        )
                    }
                    else if (input.tipo === "textFooter") {
                        return (
                            <View key={index} style={{ marginBottom: 30, backgroundColor: "#f0f0f0", padding: 10 }} >
                                <Text style={{ fontFamily: "GothamRoundedMedium", fontSize: 16, marginRight: 10, marginBottom: 5 }}>{row[index].name}</Text>
                                <View style={styles.passwordInputContainer}>
                                    <TextInput
                                        style={styles.userInput}
                                        placeholder={row[index].name}
                                        value={inputsValueRow[index]?.value || ''}
                                        onChangeText={(value) => {
                                            let array = [...inputsValueRow];
                                            array[index].value = value;
                                            setInputsValueRow(array);
                                        }}
                                    />
                                </View>
                            </View>
                        )
                    }
                    else if (input.tipo === "select") return (
                        <View key={index} style={{ marginTop: 5, marginBottom: 20 }}>
                            <Text style={{ fontFamily: "GothamRoundedMedium", fontSize: 16 }}>{input.name}</Text>
                            <Picker
                                selectedValue={inputsValueRow[index]?.value || input.options[0]}
                                style={styles.userInput}
                                onValueChange={(itemValue, itemIndex) => {
                                    let array = [...inputsValueRow];
                                    array[index].value = itemValue;
                                    setInputsValueRow(array);
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


                <View style={{ borderBottomColor: 'black', borderBottomWidth: 1, marginTop: 20 }} />
                <TouchableOpacity style={styles.buttonForm} onPress={() => handleSaveButton()}>
                    <Text style={styles.buttonFormText}>
                        { (!editionMode) ? "Guardar" : "Actualizar" }
                    </Text>
                </TouchableOpacity>

            </ScrollView>
        </View>
    )
}


const styles = StyleSheet.create({
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
    titleForm: {
        fontFamily: "GothamRoundedBold",
        fontSize: 18,
    },
    closeBtn: {
        alignSelf: 'flex-end',
        top: 0,
        right: 0,
        zIndex: 3,
    },
    userInput: {
        flex: 1,
        height: 40,
        color: '#C3C3C3',
        fontSize: 16,
        fontFamily: "GothamRoundedMedium"
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
        backgroundColor: 'white',
        borderWidth: 1,
        borderRadius: 15,
        borderColor: '#C3C3C3',
        paddingVertical: 12,
        zIndex: 2,
        position: 'absolute',
        bottom: "15%",
        height: "80%",
        width: "100%",
        alignSelf: 'center',
        display: 'flex',
        paddingHorizontal: 15,
    },

});