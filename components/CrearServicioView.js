// creo un componente para que se muestre un popup donde confirmare una accion con dos botones de si o no
import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useSelector, useDispatch } from 'react-redux';
import DatePicker from './DatePicker';
import TimePicker from './TimePicker';
// traigo el icon de closecircle de la libreria de AntDesign
import { AntDesign } from '@expo/vector-icons';
// importo dot-orange, red y green para los colores de los puntos
import dotGreen from '../assets/dotGreen.png'
import dotOrange from '../assets/dotOrange.png'
import dotRed from '../assets/dotRed.png'

export default function CrearServicio({ navigation, params }) {
    const { visible, setVisible, reglones, setReglones, editionMode, reglonPicked, setEditionMode, index, cortina, setCortina, indexPicked, dot, setDot } = params
    const [row, setRow] = useState([])
    const scrollRef = useRef(null);
    const [inputsValueRow, setInputsValueRow] = useState([]); // [ {name: "nombre", value: "valor"}, {name: "apellido", value: "valor"} aca se guardan los valores de los inputs de todo el formulario


    const cardToCheck = useSelector((state) => state.cardToCheck);

    // un useEffect que se ejecute una sola vez y establezca row
    useEffect(() => {
        setRow(cardToCheck.inputs[index].options)
    }, [])

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({ x: 0, y: 0, animated: true })
        }
    }, [visible])

    useEffect(() => {
        if (row.length > 0) {
            if (!editionMode) {
                let array = [];
                for (let i = 0; i < row.length; i++) {
                    if (row[i].tipo === "select") array.push({ name: row[i].name, value: row[i].options[0] })
                    else array.push({ name: row[i].name, value: '' })
                }
                setInputsValueRow(array);
            }
            else if (editionMode) {
                if (index === indexPicked) {
                    let array = [];
                    for (let i = 0; i < reglones[index][reglonPicked]?.values.length; i++) {
                        array.push({ name: reglones[index][reglonPicked]?.values[i]?.name ?? '', value: reglones[index][reglonPicked]?.values[i]?.value ?? 0 })
                    }
                    if (cardToCheck?.exceptionR1 === true) {
                        dotSelect(array[5]?.value, array[2]?.value)
                    }
                    else if (cardToCheck?.title === 'Control de Equipos de Frío') {
                        for (let i = 0; i < inputsValueRow.length; i++) {
                            if (inputsValueRow[i]?.name === "Temperatura Equipo") dotSelect(reglones[index][reglonPicked].values[i].value, reglones[index][reglonPicked].values[0].value, i)
                        }
                    } else if (cardToCheck?.title === 'Control de Equipos de Frío') {
                        for (let i = 0; i < inputsValueRow.length; i++) {
                            if (inputsValueRow[i]?.name === "Temperatura Equipo") dotSelect(reglones[index][reglonPicked].values[i].value, reglones[index][reglonPicked].values[0].value, i)
                        }
                    } else if (cardToCheck?.title === 'Servicios en línea') {
                        for (let i = 0; i < inputsValueRow.length; i++) {
                            if (inputsValueRow[i]?.name === "Temperatura") dotSelect(reglones[index][reglonPicked].values[i].value, reglones[index][reglonPicked].values[0].value, i)
                        }
                    } else if (cardToCheck?.title === 'Control de Procesos') {
                        for (let i = 0; i < inputsValueRow.length; i++) {
                            if (inputsValueRow[i]?.name === "Temperatura ") dotSelect(reglones[index][reglonPicked].values[i].value, reglones[index][reglonPicked].values[0].value, i)
                        }
                    } else if (cardToCheck?.title === 'Planilla de Armado y Fraccionamiento en frio') {
                        for (let i = 0; i < inputsValueRow.length; i++) {
                            if (inputsValueRow[i]?.name === "Temperatura Interna") dotSelect(reglones[index][reglonPicked].values[i].value, reglones[index][reglonPicked].values[0].value, i)
                        }
                    }
                    // setInputsValueRow(array)
                    setInputsValueRow(array)
                }
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
        setDot([])
        if (!editionMode) {
            let copiaReglones = [...reglones];
            // reviso en un if si copiaReglones[index] es un array
            if (Array.isArray(copiaReglones[index])) {
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
            setReglones(copiaReglones)
            setEditionMode(false)
        }
        let visibleCopia = [...visible];
        visibleCopia[index] = false;
        setVisible(visibleCopia)
        setCortina(false)
    }
    // agrego q por default el segundo parametro de dotSelect sea inputsValueRow[2]?.value
    function dotSelect(value, producto = (cardToCheck?.exceptionR1 === true ? inputsValueRow[2]?.value : inputsValueRow[0]?.value), index) {
        let valueInNumber = parseInt(value)
        let muestra = []
        if (cardToCheck?.exceptionR1 === true) {
            // TEMPERATURA DE ALIMENTOS:
            // Congelados: Hasta -12ºC.
            // Carnes Frescas:Hasta 5ºC .
            // Pollos:Hasta 2ºC. recepción normal, hasta 7ºC con notificación al proveedor.
            // Lácteos: Hasta 5ºC recepción normal, hasta 7ºC con notificación al proveedor.
            // Fiambres:Hasta 7ºC o según indicación en el envase.
            // Huevos: Cascara: hasta 10°C.
            // Frutas y verduras frescas: Hasta 10°C.
            // Otros alimentos no perecederos: Ambiente.  
            muestra = [
                "Congelados",
                "Carnes frescas",
                "Pollos",
                "Lácteos",
                "Fiambres",
                "Huevos",
                "Frutas y verduras frescas",
                "Otros alimentos no perecederos",
            ]

            // ubico el index de la muestra en base a producto
            let indexMuestra = muestra.indexOf(producto)

            if (!isNaN(valueInNumber)) {
                switch (indexMuestra) {
                    case 0:
                        if (valueInNumber > -12) setDot([dotRed])
                        else setDot([dotGreen])
                        break;
                    case 1:
                        if (valueInNumber > 5) setDot([dotRed])
                        else setDot([dotGreen])
                        break;
                    case 2:
                        if (valueInNumber > 7) setDot([dotRed])
                        else if (valueInNumber > 2) setDot([dotOrange])
                        else setDot([dotGreen])
                        break;
                    case 3:
                        if (valueInNumber > 7) setDot([dotRed])
                        else if (valueInNumber > 5) setDot([dotOrange])
                        else setDot([dotGreen])
                        break;
                    case 4:
                        if (valueInNumber > 7) setDot([dotRed])
                        else setDot([dotGreen])
                        break;
                    case 5:
                        if (valueInNumber > 10) setDot([dotRed])
                        else setDot([dotGreen])
                        break;
                    case 6:
                        if (valueInNumber > 10) setDot([dotRed])
                        else setDot([dotGreen])
                        break;
                    case 7:
                        setDot([])
                        break;
                    default:
                        break;
                }
            } else setDot([])
        } else if (cardToCheck?.title === "Control de Equipos de Frío") {
            // LÍMITE CRÍTICO
            // Carne vacuna, cerdo, cordero: Mayor o igual 65°C .
            // Pollo y otras aves de corral: Mayor o igual a 74°C .
            // Pescado: Mayor o igual a 63°C .
            // Pastas rellenas: Mayor o igual a 74°C.
            // Huevos y alimentos preparados: Mayor o igual a 74°C.
            muestra = ['Heladera', 'Freezer', 'Camara']

            // ubico el index de la muestra en base a producto
            let indexMuestra = muestra.indexOf(producto)

            let dotTemp = dotGreen
            let dotArray = dot
            if (!isNaN(valueInNumber)) {
                switch (indexMuestra) {
                    case 0:
                        if (valueInNumber <= 10) dotTemp = dotGreen
                        else dotTemp = dotRed
                        dotArray[index] = dotTemp
                        setDot(dotArray)
                        break;
                    case 1:
                        if (valueInNumber <= -18) dotTemp = dotGreen
                        else dotTemp = dotRed
                        dotArray[index] = dotTemp
                        setDot(dotArray)
                        break;
                    case 2:
                        if (valueInNumber <= 5) dotTemp = dotGreen
                        else dotTemp = dotRed
                        dotArray[index] = dotTemp
                        setDot(dotArray)
                        break;
                    default:
                        break;
                }
            } else {
                dotArray[index] = null
                setDot(dotArray)
            }
        } else if (cardToCheck?.title === "Servicios en línea") {
            // LÍMITE CRÍTICO
            // Carne vacuna, cerdo, cordero: Mayor o igual 65°C .
            // Pollo y otras aves de corral: Mayor o igual a 74°C .
            // Pescado: Mayor o igual a 63°C .
            // Pastas rellenas: Mayor o igual a 74°C.
            // Huevos y alimentos preparados: Mayor o igual a 74°C.
            muestra = ["Servicio en caliente", "Servicio en frío"]

            // ubico el index de la muestra en base a producto
            let indexMuestra = muestra.indexOf(producto)

            let dotTemp = dotGreen
            let dotArray = dot
            if (!isNaN(valueInNumber)) {
                switch (indexMuestra) {
                    case 0:
                        if (valueInNumber >= 65) dotTemp = dotGreen
                        else dotTemp = dotRed
                        dotArray[index] = dotTemp
                        setDot(dotArray)
                        break;
                    case 1:
                        if (valueInNumber <= 10) dotTemp = dotGreen
                        else dotTemp = dotRed
                        dotArray[index] = dotTemp
                        setDot(dotArray)
                        break;
                    default:
                        break;
                }
            } else {
                dotArray[index] = null
                setDot(dotArray)
            }
        } else if (cardToCheck?.title === "Control de Procesos") {
            // LÍMITE CRÍTICO
            // Carne vacuna, cerdo, cordero: Mayor o igual 65°C .
            // Pollo y otras aves de corral: Mayor o igual a 74°C .
            // Pescado: Mayor o igual a 63°C .
            // Pastas rellenas: Mayor o igual a 74°C.
            // Huevos y alimentos preparados: Mayor o igual a 74°C.
            muestra = ["Carne vacuna, cerdo, cordero", "Pollo y otras aves de corral", "Pescado", "Pastas rellenas", "Huevos y alimentos preparados"]

            console.log('index: ', index)


            // ubico el index de la muestra en base a producto
            let indexMuestra = muestra.indexOf(producto)

            let dotTemp = dotGreen
            let dotArray = dot
            if (index === 2) {
                if (!isNaN(valueInNumber)) {
                    switch (indexMuestra) {
                        case 0:
                            if (valueInNumber >= 65) dotTemp = dotGreen
                            else dotTemp = dotRed
                            dotArray[index] = dotTemp
                            setDot(dotArray)
                            break;
                        case 1:
                            if (valueInNumber >= 74) dotTemp = dotGreen
                            else dotTemp = dotRed
                            dotArray[index] = dotTemp
                            setDot(dotArray)
                            break;
                        case 2:
                            if (valueInNumber >= 63) dotTemp = dotGreen
                            else dotTemp = dotRed
                            dotArray[index] = dotTemp
                            setDot(dotArray)
                            break;
                        case 3:
                            if (valueInNumber >= 74) dotTemp = dotGreen
                            else dotTemp = dotRed
                            dotArray[index] = dotTemp
                            setDot(dotArray)
                            break;
                        case 4:
                            if (valueInNumber >= 74) dotTemp = dotGreen
                            else dotTemp = dotRed
                            dotArray[index] = dotTemp
                            setDot(dotArray)
                            break;
                        default:
                            break;
                    }
                } else {
                    dotArray[index] = null
                    setDot(dotArray)
                }
            } else if (index > 4 && index < 7) {
                if (!isNaN(valueInNumber)) {
                    // en las primeras 2 horas (es decir en la medicion inicial y la de 2 horas), si es menor a 21 es VERDE y si es igual o mayor, ROJO
                    if (valueInNumber < 21) dotTemp = dotGreen
                    else dotTemp = dotRed
                    dotArray[index] = dotTemp
                    setDot(dotArray)
                } else {
                    dotArray[index] = null
                    setDot(dotArray)
                }
            } else if (index > 6 && index < 9) {
                if (!isNaN(valueInNumber)) {
                    // - en las siguientes dos mediciones , es decir a 4hr y 6 hr . si es menor a 6 grados es VERDE y si es mayor o igual ROJO
                    if (valueInNumber < 6) dotTemp = dotGreen
                    else dotTemp = dotRed
                    dotArray[index] = dotTemp
                    setDot(dotArray)
                } else {
                    dotArray[index] = null
                    setDot(dotArray)
                }
            } else if (index === 11) {
                // Regeneracion Temp final: 74 o mas es verde 
                if (!isNaN(valueInNumber)) {
                    if (valueInNumber >= 74) dotTemp = dotGreen
                    else dotTemp = dotRed
                    dotArray[index] = dotTemp
                    setDot(dotArray)
                } else {
                    dotArray[index] = null
                    setDot(dotArray)
                }
            } else if (index > 12 && index < 16) {
                // Regeneracion Temperaturas de 1hrs y 2 hrs: 65 o mas es verde 
                if (!isNaN(valueInNumber)) {
                    if (valueInNumber >= 65) dotTemp = dotGreen
                    else dotTemp = dotRed
                    dotArray[index] = dotTemp
                    setDot(dotArray)
                } else {
                    dotArray[index] = null
                    setDot(dotArray)
                }
            }
        } else if (cardToCheck?.title === "Planilla de Armado y Fraccionamiento en frio") {
            let dotTemp = dotGreen
            let dotArray = dot
            if (!isNaN(valueInNumber)) {
                // menor o igual a 13 , es verde14 o mas es rojo
                if (valueInNumber <= 13) dotTemp = dotGreen
                else dotTemp = dotRed
                dotArray[index] = dotTemp
                setDot(dotArray)
            } else {
                dotArray[index] = null
                setDot(dotArray)
            }
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
        <View style={[styles.container, visibleStyle]} onPress={() => {
            let visibleCopia = [...visible];
            visibleCopia[index] = false;
            setVisible(visibleCopia)
        }}>
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                <Text style={styles.titleForm}>Agregar:</Text>
                <TouchableOpacity>
                    <AntDesign name="closecircle" size={30} color="black" style={styles.closeBtn} onPress={() => {
                        setDot([])
                        let visibleCopia = [...visible];
                        visibleCopia[index] = false;
                        setVisible(visibleCopia);
                        setCortina(false)
                        setEditionMode(false)
                    }} />
                </TouchableOpacity>
            </View>
            <ScrollView ref={scrollRef} style={{ paddingHorizontal: 10 }}>
                {/* mapeo el array de row y si es tipo text o tipo date creare un componente diferente */}
                {row?.map((input, index) => {
                    if (input.tipo === "date") {
                        return (
                            <View key={index}>
                                <Text style={{ fontFamily: "GothamRoundedMedium", fontSize: 16, marginRight: 10, marginBottom: 5 }}>{row[index].name}</Text>
                                <Text style={{ fontFamily: "GothamRoundedMedium", fontSize: 16, marginRight: 10, marginBottom: 5 }}>{traducirFecha(inputsValueRow[index]?.value)}</Text>
                            </View>
                        )
                    } else if (input.tipo === "textTempHeader") {
                        return (
                            <View key={index} style={{ marginTop: 10 }}>
                                <Text style={{ fontFamily: "GothamRoundedMedium", fontSize: 16, marginRight: 10 }}>{input.titulo}</Text>
                                <View style={{ borderBottomColor: 'black', borderBottomWidth: 1, marginTop: 10, marginBottom: 25 }} />
                                <View key={index} style={{ backgroundColor: "#f0f0f0", padding: 10 }} >
                                    <Text style={{ fontFamily: "GothamRoundedMedium", fontSize: 16, backgroundColor: "#f0f0f0", paddingBottom: 10, paddingLeft: 5, paddingTop: 5, }}>{input.cabecera}</Text>
                                    <View style={{ display: 'flex', flexDirection: 'row', marginBottom: 5 }}>
                                        <Text style={{ fontFamily: "GothamRoundedMedium", fontSize: 16, marginRight: 5, marginLeft: 2, marginBottom: 5 }}>{row[index].name}</Text>


                                        <Image source={dot[index]} style={{ width: 25, height: 25, margin: 0, display: ((!dot[index])) ? 'none' : 'flex' }} />

                                    </View>
                                    <View style={styles.passwordInputContainer}>
                                        <TextInput
                                            enabled={false}
                                            editable={false}
                                            keyboardType={"numeric"}
                                            style={styles.userInput}
                                            placeholder={row[index].name}
                                            value={inputsValueRow[index]?.value || ''}

                                            onChangeText={(value) => {
                                                dotSelect(value, inputsValueRow[input?.guia]?.value, index)
                                                let array = [...inputsValueRow];
                                                array[index].value = value;
                                                setInputsValueRow(array);
                                            }
                                            }
                                        />
                                    </View>
                                </View>
                            </View>
                        )
                    }

                    else if (input.tipo === "text") {
                        return (
                            <View key={index} style={{ marginTop: 5, marginBottom: 20 }} >
                                <Text style={{ fontFamily: "GothamRoundedMedium", fontSize: 16, marginRight: 10, marginBottom: 5 }}>{row[index].name}</Text>
                                <View style={styles.passwordInputContainer}>
                                    <TextInput
                                        editable={false}
                                        style={styles.userInput}
                                        placeholder={row[index].name}
                                        value={inputsValueRow[index]?.value || ''}
                                        onChangeText={(value) => {
                                            let array = [...inputsValueRow];
                                            array[index].value = value;

                                        }}
                                    />
                                </View>
                            </View>
                        )
                    }
                    else if (input.tipo === "textTemp") {
                        return (
                            <View key={index} style={{ marginTop: 5, marginBottom: 20 }} >

                                <View style={{ display: 'flex', flexDirection: 'row', marginBottom: 5 }}>
                                    <Text style={{ fontFamily: "GothamRoundedMedium", fontSize: 16, marginRight: 5, marginLeft: 2, marginBottom: 5 }}>{row[index].name}</Text>

                                    <Image source={dot[index]} style={{ width: 25, height: 25, margin: 0, display: ((!dot[index])) ? 'none' : 'flex' }} />

                                </View>
                                <View style={styles.passwordInputContainer}>
                                    <TextInput
                                        keyboardType={"numeric"}
                                        style={styles.userInput}
                                        placeholder={row[index].name}
                                        value={inputsValueRow[index]?.value || ''}

                                        onChangeText={(value) => {
                                            dotSelect(value, inputsValueRow[input?.guia]?.value, index)
                                            let array = [...inputsValueRow];
                                            array[index].value = value;
                                            setInputsValueRow(array);
                                        }
                                        }
                                    />
                                </View>
                            </View>
                        )
                    }
                    else if (input.tipo === "textTempFooter") {
                        return (
                            <View key={index} style={{ marginBottom: 30, backgroundColor: "#f0f0f0", padding: 10 }} >

                                <View style={{ display: 'flex', flexDirection: 'row', marginBottom: 5 }}>
                                    <Text style={{ fontFamily: "GothamRoundedMedium", fontSize: 16, marginRight: 5, marginLeft: 2, marginBottom: 5 }}>{row[index].name}</Text>

                                    <Image source={dot[index]} style={{ width: 25, height: 25, margin: 0, display: ((!dot[index])) ? 'none' : 'flex' }} />

                                </View>
                                <View style={styles.passwordInputContainer}>
                                    <TextInput
                                        enabled={false}
                                        editable={false}
                                        keyboardType={"numeric"}
                                        style={styles.userInput}
                                        placeholder={row[index].name}
                                        value={inputsValueRow[index]?.value || ''}

                                        onChangeText={(value) => {
                                            dotSelect(value, inputsValueRow[input?.guia]?.value, index)
                                            let array = [...inputsValueRow];
                                            array[index].value = value;
                                            setInputsValueRow(array);
                                        }
                                        }
                                    />
                                </View>
                            </View>
                        )
                    }
                    else if (input.tipo === "textTempMiddle") {
                        return (
                            <View key={index} style={{ marginBottom: 30, backgroundColor: "#f0f0f0", padding: 10 }} >

                                <View style={{ display: 'flex', flexDirection: 'row', marginBottom: 5 }}>
                                    <Text style={{ fontFamily: "GothamRoundedMedium", fontSize: 16, marginRight: 5, marginLeft: 2, marginBottom: 5 }}>{row[index].name}</Text>

                                    <Image source={dot[index]} style={{ width: 25, height: 25, margin: 0, display: ((!dot[index])) ? 'none' : 'flex' }} />

                                </View>
                                <View style={styles.passwordInputContainer}>
                                    <TextInput
                                        enabled={false}
                                        editable={false}
                                        keyboardType={"numeric"}
                                        style={styles.userInput}
                                        placeholder={row[index].name}
                                        value={inputsValueRow[index]?.value || ''}

                                        onChangeText={(value) => {
                                            dotSelect(value, inputsValueRow[input?.guia]?.value, index)
                                            let array = [...inputsValueRow];
                                            array[index].value = value;
                                            setInputsValueRow(array);
                                        }
                                        }
                                    />
                                </View>
                            </View>
                        )
                    }
                    else if (input.tipo === "textTempTop") {
                        return (
                            <View key={index} style={{ backgroundColor: "#f0f0f0", padding: 10 }} >
                                <Text style={{ fontFamily: "GothamRoundedMedium", fontSize: 16, backgroundColor: "#f0f0f0", paddingBottom: 10, paddingLeft: 5, paddingTop: 5, }}>{input.cabecera}</Text>
                                <View style={{ display: 'flex', flexDirection: 'row', marginBottom: 5 }}>
                                    <Text style={{ fontFamily: "GothamRoundedMedium", fontSize: 16, marginRight: 5, marginLeft: 2, marginBottom: 5 }}>{row[index].name}</Text>


                                    <Image source={dot[index]} style={{ width: 25, height: 25, margin: 0, display: ((!dot[index])) ? 'none' : 'flex' }} />

                                </View>
                                <View style={styles.passwordInputContainer}>
                                    <TextInput
                                        enabled={false}
                                        editable={false}
                                        keyboardType={"numeric"}
                                        style={styles.userInput}
                                        placeholder={row[index].name}
                                        value={inputsValueRow[index]?.value || ''}

                                        onChangeText={(value) => {
                                            dotSelect(value, inputsValueRow[input?.guia]?.value, index)
                                            let array = [...inputsValueRow];
                                            array[index].value = value;
                                            setInputsValueRow(array);
                                        }
                                        }
                                    />
                                </View>
                            </View>
                        )
                    }
                    else if (input.tipo === "time") {
                        return (
                            <View key={index}>
                                <Text style={{ fontFamily: "GothamRoundedMedium", fontSize: 16, marginRight: 10, marginBottom: 5 }}>{row[index].name}</Text>
                                <Text style={{ fontFamily: "GothamRoundedMedium", fontSize: 16, marginRight: 10, marginBottom: 5 }}>{traducirHora(inputsValueRow[index]?.value)}</Text>
                            </View>
                        )
                    } else if (input.tipo === "timeHeader") {
                        return (
                            <View key={index} style={{ marginTop: 10 }}>
                                <Text style={{ fontFamily: "GothamRoundedMedium", fontSize: 16, marginRight: 10 }}>{input.titulo}</Text>
                                <View style={{ borderBottomColor: 'black', borderBottomWidth: 1, marginTop: 10, marginBottom: 25 }} />
                                <Text style={{ fontFamily: "GothamRoundedMedium", fontSize: 16, backgroundColor: "#f0f0f0", paddingBottom: 10, paddingLeft: 5, paddingTop: 5, }}>{input.cabecera}</Text>
                                <Text style={{ fontFamily: "GothamRoundedMedium", fontSize: 16, backgroundColor: "#f0f0f0", paddingBottom: 10, paddingLeft: 5, paddingTop: 5, }}>{traducirHora(inputsValueRow[index]?.value)}</Text>
                            </View>
                        )
                    } else if (input.tipo === "timeTop") {
                        return (
                            <View key={index}>
                                <Text style={{ fontFamily: "GothamRoundedMedium", fontSize: 16, backgroundColor: "#f0f0f0", paddingBottom: 10, paddingLeft: 5, paddingTop: 5, }}>{input.cabecera}</Text>
                                <Text style={{ fontFamily: "GothamRoundedMedium", fontSize: 16, backgroundColor: "#f0f0f0", paddingBottom: 10, paddingLeft: 5, paddingTop: 5, }}>{traducirHora(inputsValueRow[index]?.value)}</Text>
                            </View>
                        )
                    }
                    else if (input.tipo === "textTop") {
                        return (
                            <View key={index} style={{ backgroundColor: "#f0f0f0", padding: 10 }}>
                                <Text style={{ fontFamily: "GothamRoundedMedium", fontSize: 16, backgroundColor: "#f0f0f0", paddingBottom: 10, paddingLeft: 5, paddingTop: 5, }}>{input.cabecera}</Text>
                                <View style={{ display: 'flex', flexDirection: 'row', marginBottom: 5 }}>
                                    <Text style={{ fontFamily: "GothamRoundedMedium", fontSize: 16, marginRight: 5, marginLeft: 2, marginBottom: 5 }}>{row[index].name}</Text>
                                    {((input?.name === "Alimento" && cardToCheck.exceptionR1 === true) || (input?.name === "Temp." && cardToCheck?.exceptionP1) ?
                                        <Image source={(cardToCheck.exceptionR1 === true) ? dot[0] : dot[index]} style={{ width: 25, height: 25, margin: 0, display: ((cardToCheck.exceptionR1 === true) ? (!dot[0]) : (!dot[index])) ? 'none' : 'flex' }} />
                                        : null)}
                                </View>
                                <View style={styles.passwordInputContainer}>
                                    <TextInput
                                        editable={false}
                                        keyboardType={((input?.name === "Alimento" && cardToCheck.exceptionR1 === true) || (input?.name === "Temp." && cardToCheck?.exceptionP1) ? "numeric" : "default")}
                                        style={styles.userInput}
                                        placeholder={row[index].name}
                                        value={inputsValueRow[index]?.value}
                                        onChangeText={(value) => {

                                            let array = [...inputsValueRow];
                                            array[index].value = value;

                                        }}
                                    />
                                </View>
                            </View>
                        )
                    }
                    else if (input.tipo === "selectTop") {
                        return (
                            <View key={index} style={{ backgroundColor: "#f0f0f0", padding: 10 }}>
                                <Text style={{ fontFamily: "GothamRoundedMedium", fontSize: 16, backgroundColor: "#f0f0f0", paddingBottom: 10, paddingLeft: 5, paddingTop: 5, }}>{input.cabecera}</Text>

                                <Text style={{ fontFamily: "GothamRoundedMedium", fontSize: 16 }}>{input.name}</Text>
                                <Picker
                                    enabled={false}
                                    editable={false}
                                    selectedValue={inputsValueRow[index]?.value || input.options[0]}
                                    style={styles.userInput}
                                    onValueChange={(itemValue, itemIndex) => {
                                        let array = [...inputsValueRow];
                                        array[index].value = itemValue;

                                    }}
                                >
                                    {input.options.map((option, index) => {
                                        return (
                                            <Picker.Item key={index} label={option} value={option} />
                                        )
                                    })}
                                </Picker>
                                <Text style={{ textAlign: 'justify', padding: 5, marginBottom: 10, fontFamily: "GothamRoundedMedium", fontSize: 16, display: (cardToCheck.exceptionR1 === true ? 'flex' : 'none') }}>{
                                    (inputsValueRow[index]?.value === input.options[6]) ? "Se sugiere efectuar el reclamo al proveedor detallando el número de lote y si es posible adjuntando una fotografía" : ''
                                }</Text>
                            </View>
                        )
                    }
                    else if (input.tipo === "selectHeader") {
                        return (
                            <View key={index} style={{ backgroundColor: "#f0f0f0", padding: 10, marginTop: 25 }}>
                                <Text style={{ fontFamily: "GothamRoundedMedium", fontSize: 16, marginRight: 10 }}>{input.titulo}</Text>
                                <View style={{ borderBottomColor: 'black', borderBottomWidth: 1, marginTop: 0, marginBottom: 15 }} />

                                <Text style={{ fontFamily: "GothamRoundedMedium", fontSize: 16, backgroundColor: "#f0f0f0", paddingBottom: 10, paddingLeft: 5, paddingTop: 5, display: (input.cabecera.length ? 'flex' : "none") }}>{input.cabecera}</Text>

                                <Text style={{ fontFamily: "GothamRoundedMedium", fontSize: 16 }}>{input.name}</Text>
                                <Picker
                                    enabled={false}
                                    editable={false}
                                    selectedValue={inputsValueRow[index]?.value || input.options[0]}
                                    style={styles.userInput}
                                    onValueChange={(itemValue, itemIndex) => {
                                        let array = [...inputsValueRow];
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
                    }
                    else if (input.tipo === "textGrandeTop") {
                        return (
                            <View key={index} style={{ backgroundColor: "#f0f0f0", padding: 10 }}>
                                <Text style={{ fontFamily: "GothamRoundedMedium", fontSize: 16, backgroundColor: "#f0f0f0", paddingBottom: 10, paddingLeft: 5, paddingTop: 5, }}>{input.cabecera}</Text>
                                <Text style={{ fontFamily: "GothamRoundedMedium", fontSize: 16, marginRight: 10, marginBottom: 5 }}>{row[index].name}</Text>
                                <View style={styles.passwordInputContainer}>
                                    <TextInput
                                        editable={false}
                                        style={[styles.userInput, { height: 100, textAlignVertical: 'top', borderWidth: 1, borderColor: "#C3C3C3", borderRadius: 10, padding: 10 }]}
                                        placeholder={row[index].name}
                                        value={inputsValueRow[index]?.value || ''}
                                        onChangeText={(value) => {
                                            let array = [...inputsValueRow];
                                            array[index].value = value;

                                        }}
                                    />
                                </View>
                            </View>
                        )
                    }
                    else if (input.tipo === "textGrande") {
                        return (
                            <View key={index} style={{ marginVertical: 20, marginTop: 5 }}>
                                <Text style={[styles.normalText, { marginVertical: 5 }]}>{input.name}</Text>
                                <TextInput
                                    editable={false}
                                    style={[styles.userInput, { height: 100, textAlignVertical: 'top', borderWidth: 1, borderColor: "#C3C3C3", borderRadius: 10, padding: 10 }]}
                                    multiline={true}
                                    numberOfLines={4}
                                    onChangeText={(value) => {
                                        let array = [...inputsValueRow];
                                        array[index].value = value;

                                    }}
                                    value={inputsValueRow[index]?.value || ''}
                                />
                            </View>
                        )
                    }
                    else if (input.tipo === "dateTop") {
                        return (
                            <View key={index} style={{ backgroundColor: "#f0f0f0", padding: 10 }}>
                                <Text style={{ fontFamily: "GothamRoundedMedium", fontSize: 16, paddingBottom: 10, paddingLeft: 5, paddingTop: 5, }}>{input.cabecera}</Text>
                                <Text style={{ fontFamily: "GothamRoundedMedium", fontSize: 16, marginRight: 10, marginBottom: 5 }}>{row[index].name}</Text>
                                <Text style={{ fontFamily: "GothamRoundedMedium", fontSize: 16, marginRight: 10, marginBottom: 5 }}>{traducirFecha(inputsValueRow[index]?.value)}</Text>
                            </View>
                        )
                    }
                    else if (input.tipo === "imagePicker") {
                        return (
                            <View key={index} style={{ backgroundColor: "#f0f0f0", padding: 10, marginTop: 25 }}>
                                <Text style={{ fontFamily: "GothamRoundedMedium", fontSize: 16, marginRight: 10, marginBottom: 10 }}>{
                                    // hago que el primer valor se reemplaze por una mayuscula
                                    row[index].name.charAt(0).toUpperCase() + row[index].name.slice(1)
                                }</Text>

                                {/* una imagen con el src inputsValueRow[index]?.value */}
                                {
                                    inputsValueRow[index]?.value
                                        ? <Image source={{ uri: inputsValueRow[index]?.value }} style={{ width: 200, height: 200, margin: 0, alignSelf: 'center' }} />
                                        : null
                                }


                            </View>
                        )
                    }
                    else if (input.tipo === "textFooter") {
                        return (
                            <View key={index} style={{ marginBottom: 30, backgroundColor: "#f0f0f0", padding: 10 }} >
                                <View style={{ display: 'flex', flexDirection: 'row', marginBottom: 5 }}>
                                    <Text style={{ fontFamily: "GothamRoundedMedium", fontSize: 16, marginRight: 5, marginLeft: 2, marginBottom: 5 }}>{row[index].name}</Text>
                                    {((input?.name === "Alimento" && cardToCheck.exceptionR1 === true) || (input?.name === "Temp." && cardToCheck?.exceptionP1) ?
                                        <Image source={(cardToCheck.exceptionR1 === true) ? dot[0] : dot[index]} style={{ width: 25, height: 25, margin: 0, display: ((cardToCheck.exceptionR1 === true) ? (!dot[0]) : (!dot[index])) ? 'none' : 'flex' }} />
                                        : null)}
                                </View>
                                <View style={styles.passwordInputContainer}>
                                    <TextInput
                                        editable={false}
                                        keyboardType={((input?.name === "Alimento" && cardToCheck.exceptionR1 === true) || (input?.name === "Temp." && cardToCheck?.exceptionP1) ? "numeric" : "default")}
                                        style={styles.userInput}
                                        placeholder={row[index].name}
                                        value={inputsValueRow[index]?.value || ''}
                                        onChangeText={(value) => {

                                            let array = [...inputsValueRow];
                                            array[index].value = value;

                                        }}
                                    />
                                </View>
                            </View>
                        )
                    }
                    else if (input.tipo === "textFooterCabecera") {
                        return (
                            <View key={index} style={{ marginBottom: 30, backgroundColor: "#f0f0f0", padding: 10 }} >
                                <Text style={{ fontFamily: "GothamRoundedMedium", fontSize: 16, backgroundColor: "#f0f0f0", paddingBottom: 10, paddingLeft: 5, paddingTop: 5, }}>{input.cabecera}</Text>
                                <Text style={{ fontFamily: "GothamRoundedMedium", fontSize: 16, marginRight: 10, marginBottom: 5 }}>{row[index].name}</Text>
                                <View style={styles.passwordInputContainer}>
                                    <TextInput
                                        editable={false}
                                        style={styles.userInput}
                                        placeholder={row[index].name}
                                        value={inputsValueRow[index]?.value || ''}
                                        onChangeText={(value) => {
                                            let array = [...inputsValueRow];
                                            array[index].value = value;

                                        }}
                                    />
                                </View>
                            </View>
                        )
                    }
                    else if (input.tipo === "textMiddle") {
                        return (
                            <View key={index} style={{ backgroundColor: "#f0f0f0", padding: 10 }} >
                                <View style={{ display: 'flex', flexDirection: 'row', marginBottom: 5 }}>
                                    <Text style={{ fontFamily: "GothamRoundedMedium", fontSize: 16, marginRight: 5, marginLeft: 2, marginBottom: 5 }}>{row[index].name}</Text>
                                    {((input?.name === "Alimento" && cardToCheck.exceptionR1 === true) || (input?.name === "Temp." && cardToCheck?.exceptionP1) ?
                                        <Image source={(cardToCheck.exceptionR1 === true) ? dot[0] : dot[index]} style={{ width: 25, height: 25, margin: 0, display: ((cardToCheck.exceptionR1 === true) ? (!dot[0]) : (!dot[index])) ? 'none' : 'flex' }} />
                                        : null)}
                                </View>
                                <View style={styles.passwordInputContainer}>
                                    <TextInput
                                        editable={false}
                                        keyboardType={((input?.name === "Alimento" && cardToCheck.exceptionR1 === true) || (input?.name === "Temp." && cardToCheck?.exceptionP1) ? "numeric" : "default")}
                                        style={styles.userInput}
                                        placeholder={row[index].name}
                                        value={inputsValueRow[index]?.value || ''}
                                        onChangeText={(value) => {

                                            let array = [...inputsValueRow];
                                            array[index].value = value;

                                        }}
                                    />
                                </View>
                            </View>
                        )
                    }
                    else if (input.tipo === "dateFooter") {
                        return (
                            <View key={index} style={{ marginBottom: 30, backgroundColor: "#f0f0f0", padding: 10 }} >
                                <Text style={{ fontFamily: "GothamRoundedMedium", fontSize: 16, marginRight: 10, marginBottom: 5 }}>{row[index].name}</Text>
                                <Text style={{ fontFamily: "GothamRoundedMedium", fontSize: 16, marginRight: 10, marginBottom: 5 }}>{traducirFecha(inputsValueRow[index]?.value)}</Text>
                            </View>
                        )
                    }
                    else if (input.tipo === "select") return (
                        <View key={index} style={{ marginTop: 10, marginBottom: 20 }}>
                            <Text style={{ fontFamily: "GothamRoundedMedium", fontSize: 16 }}>{input.name}</Text>
                            <Picker
                                enabled={false}
                                editable={false}
                                selectedValue={inputsValueRow[index]?.value || input.options[0]}
                                style={styles.userInput}
                                onValueChange={(itemValue, itemIndex) => {
                                    if (cardToCheck.exceptionR1 === true) dotSelect(inputsValueRow[5]?.value, itemValue, index)
                                    else if (cardToCheck?.title === 'Control de Equipos de Frío') {
                                        console.log('entrando a opcion')
                                        for (let i = 0; i < inputsValueRow.length; i++) {
                                            if (inputsValueRow[i]?.name === "Temperatura Equipo") {
                                                dotSelect(inputsValueRow[i]?.value, itemValue, i)
                                            }
                                        }
                                    } else if (cardToCheck?.title === 'Servicios en línea') {
                                        for (let i = 0; i < inputsValueRow.length; i++) {
                                            if (inputsValueRow[i]?.name === "Temperatura") {
                                                dotSelect(inputsValueRow[i]?.value, itemValue, i)
                                            }
                                        }
                                    } else if (cardToCheck?.title === 'Control de Procesos') {
                                        for (let i = 0; i < inputsValueRow.length; i++) {
                                            if (inputsValueRow[i]?.name === "Temperatura ") {
                                                dotSelect(inputsValueRow[i]?.value, itemValue, i)
                                            }
                                        }
                                    } else if (cardToCheck?.title === 'Planilla de Armado y Fraccionamiento en frio') {
                                        for (let i = 0; i < inputsValueRow.length; i++) {
                                            if (inputsValueRow[i]?.name === "Temperatura Interna") {
                                                dotSelect(inputsValueRow[i]?.value, itemValue, i)
                                            }
                                        }
                                    }

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

                    else if (input.tipo === "selectShow") {
                        return (
                            <View key={index} style={{ marginTop: 5, marginBottom: 20 }}>
                                <Text style={{ fontFamily: "GothamRoundedMedium", fontSize: 16 }}>{input.name}</Text>
                                <Picker
                                    enabled={false}
                                    editable={false}
                                    selectedValue={inputsValueRow[index]?.value || input.options[0]}
                                    style={styles.userInput}
                                    onValueChange={(itemValue, itemIndex) => {
                                        let array = [...inputsValueRow];
                                        array[index].value = itemValue;

                                    }}
                                >
                                    {input.options.map((option, index) => {
                                        return (
                                            <Picker.Item key={index} label={option} value={option} />
                                        )
                                    })}
                                </Picker>
                                <Text style={{ fontFamily: "GothamRoundedMedium", fontSize: 16 }}>{inputsValueRow[index]?.value || input.options[0]}</Text>
                            </View>
                        )
                    }

                })}


                <View style={{ borderBottomColor: 'black', borderBottomWidth: 1, marginTop: 20 }} />


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
        fontFamily: "GothamRoundedMedium",
        color: "black",
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