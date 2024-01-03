import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, Image } from 'react-native';
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
    const dispatch = useDispatch();
    const [inputsValues, setInputsValues] = useState([]); // [ {name: "nombre", value: "valor"}, {name: "apellido", value: "valor"} aca se guardan los valores de los inputs de todo el formulario
    const [saving, setSaving] = useState(false); // si saving es true, se muestra un mensaje de guardando... y se deshabilita el boton de guardar
    const [allowSaveCaseProcess, setAllowSaveCaseProcess] = useState(false);

    const cardToCheck = useSelector((state) => state.cardToCheck);
    const id = useSelector((state) => state.id);
    const editMode = useSelector((state) => state.editMode);
    const objectToCheck = useSelector((state) => state.objectToCheck);
    const businessName = useSelector((state) => state.business);
    const rol = useSelector((state) => state.rol);
    const nombre = useSelector((state) => state.fullName);

    const [imageChanged, setImageChanged] = useState(false);

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
    }, [])

    useEffect(() => {
        if (editMode === true) {
            if (cardToCheck.title === 'Registro de Capacitación') {
                let reglonesCopy = [...reglones]
                if (JSON.parse(objectToCheck?.asistentes)?.length > 0) {
                    let parsed = JSON.parse(objectToCheck?.asistentes)

                    let reglonFinal = [
                        {
                            values: [
                                {
                                    "name": "DNI",
                                    "value": parsed[0]?.dni
                                },
                                {
                                    "name": "Nombre y Apellido",
                                    "value": parsed[0]?.nombre
                                },
                                {
                                    "name": "Area/Lugar de trabajo",
                                    "value": parsed[0]?.area
                                },
                                {
                                    "name": "Resultado Evaluacion",
                                    "value": parsed[0]?.resultado
                                },
                                {
                                    "name": "Método de evaluación",
                                    "value": parsed[0]?.metodo
                                },
                            ]
                        }
                    ]
                    reglonesCopy[20] = reglonFinal

                }
                setReglones(reglonesCopy)

                let checkboxes = JSON.parse(objectToCheck?.checkboxes)
                let materialEntregado = JSON.parse(objectToCheck?.materialEntregado)
                let materialExpuesto = JSON.parse(objectToCheck?.materialExpuesto)

                let inputsValuesCopy = [...inputsValues]

                inputsValuesCopy[3] = { name: "Inducción", value: checkboxes?.[0]?.check ? "Si" : "No" }
                inputsValuesCopy[4] = { name: "Campaña", value: checkboxes?.[1]?.check ? "Si" : "No" }
                inputsValuesCopy[5] = { name: "Entrenamiento Puesto de trabajo", value: checkboxes?.[2]?.check ? "Si" : "No" }
                inputsValuesCopy[6] = { name: "Capacitaciones gubernamentales", value: checkboxes?.[3]?.check ? "Si" : "No" }
                inputsValuesCopy[7] = { name: "Capacitación sobre Normas o Certificaciones", value: checkboxes?.[4]?.check ? "Si" : "No" }
                inputsValuesCopy[8] = { name: "Cierre Auditoría", value: checkboxes?.[5]?.check ? "Si" : "No" }

                inputsValuesCopy[0] = { name: "Fecha", value: (objectToCheck?.fecha.length ? new Date(objectToCheck?.fecha) : 'Sin fecha') }
                inputsValuesCopy[1] = { name: "Hora", value: (objectToCheck?.tiempoDuracion ? new Date("2023-11-28T" + objectToCheck?.tiempoDuracion + ":57.244") : 'Sin hora') }
                inputsValuesCopy[23] = { name: "Firma", value: { uri: objectToCheck?.firma } }
                inputsValuesCopy[22] = { ...inputsValuesCopy[22], value: objectToCheck?.instructor }

                inputsValuesCopy[9] = { name: "Temas dados", value: objectToCheck?.temas }
                inputsValuesCopy[11] = { name: "Manual /instructivo", value: materialEntregado?.[0]?.check ? "Si" : "No" }
                inputsValuesCopy[12] = { name: "Folleto", value: materialEntregado?.[1]?.check ? "Si" : "No" }
                inputsValuesCopy[13] = { name: "Procedimiento", value: materialEntregado?.[2]?.check ? "Si" : "No" }
                inputsValuesCopy[14] = { name: "Otros1", value: materialEntregado?.[3]?.check ? "Si" : "No", value2: materialEntregado?.[3]?.desc }

                inputsValuesCopy[16] = { name: "Video", value: materialExpuesto?.[0]?.check ? "Si" : "No" }
                inputsValuesCopy[17] = { name: "Filminas", value: materialExpuesto?.[1]?.check ? "Si" : "No" }
                inputsValuesCopy[18] = { name: "Disertación", value: materialExpuesto?.[2]?.check ? "Si" : "No" }
                inputsValuesCopy[19] = { name: "Otros2", value: materialExpuesto?.[3]?.check ? "Si" : "No", value2: materialExpuesto?.[3]?.desc }

                inputsValuesCopy[21] = { name: "Observaciones", value: objectToCheck?.observaciones }

                setInputsValues(inputsValuesCopy)

            } else if (cardToCheck.title === 'Planilla de Decomiso de Materias Primas') {

                let reglonesCopy = [...reglones]
                let inputsValuesCopy = [...inputsValues]

                inputsValuesCopy = [{ "name": "Registros de decomisos de materias primas", "value": "" }]

                for (let i = 0; i < objectToCheck.inputs.length; i++) {
                    reglonesCopy[i] = [{
                        values: [
                            {
                                "name": "Fecha",
                                "value": new Date(objectToCheck.inputs[i].fecha)
                            },
                            {
                                "name": "Turno",
                                "value": objectToCheck.inputs[i].turno
                            },
                            {
                                "name": "Producto decomisado",
                                "value": objectToCheck.inputs[i].productoDecomisado
                            },
                            {
                                "name": "Cantidad",
                                "value": objectToCheck.inputs[i].cantidad
                            },
                            {
                                "name": "Causa",
                                "value": objectToCheck.inputs[i].causa
                            },
                        ]
                    }]
                }

                setInputsValues(inputsValuesCopy)
                setReglones(reglonesCopy)
                console.log('modo 2')
            } else if (cardToCheck.title === 'Recuperación de Productos') {
                let inputsValuesCopy = [...inputsValues]
                let reglonesCopy = [...reglones]

                console.log("objectToCheck 1: ", objectToCheck)

                let subTitulos = 0

                for (let i = 0; i < cardToCheck.values.length; i++) {
                    console.log('entre al for ', i)
                    if (cardToCheck.values[i].tipo === "row") {
                        console.log('entre al row en la vuelta ', i)
                        reglonesCopy[i] = objectToCheck?.values[i - subTitulos].value?.map(item => ({ values: item }));
                        inputsValuesCopy[i] = { name: cardToCheck.values[i].name, value: '' }
                    } else if (cardToCheck.values[i].tipo === "subTitle") {
                        console.log('entre al subTitle en la vuelta ', i)
                        subTitulos = subTitulos + 1
                    }
                    else if (cardToCheck.values[i].tipo !== "subTitle" && cardToCheck.values[i].tipo !== "title") {
                        console.log('entre al else en la vuelta ', i)
                        inputsValuesCopy[i] = objectToCheck?.values[i - subTitulos];
                    }
                    console.log('sali de la vuelta, ', i)
                }

                console.log('inputsValuesCopy 2: ', inputsValuesCopy)
                console.log('reglonesCopy: ', JSON.stringify(reglonesCopy))
                setInputsValues(inputsValuesCopy)
                setReglones(reglonesCopy)
            } else if (cardToCheck.title === 'Rechazo /  Devolución de Materias Primas') {
                let inputsValuesCopy = [...inputsValues]

                console.log("objectToCheck 1: ", objectToCheck)

                inputsValuesCopy[0] = { name: "Posibles no conformidades: Marcar la casilla y completar con la descripción de la no conformidad.", value: '' }
                inputsValuesCopy[1] = { name: "Condiciones de entrega", value: '' }
                inputsValuesCopy[2] = { name: "Atrasado", value: objectToCheck?.condicionesEntrega[0]?.checked ? "Si" : "No" }
                inputsValuesCopy[3] = { name: "Descripción de no conformidad", value: objectToCheck?.condicionesEntrega[0]?.description }
                inputsValuesCopy[4] = { name: "Adelantado", value: objectToCheck?.condicionesEntrega[1]?.checked ? "Si" : "No" }
                inputsValuesCopy[5] = { name: "Descripción de no conformidad", value: objectToCheck?.condicionesEntrega[1]?.description }
                inputsValuesCopy[6] = { name: "Calidad", value: '' }
                inputsValuesCopy[7] = { name: "Temperatura", value: objectToCheck?.calidad[0]?.checked ? "Si" : "No" }
                inputsValuesCopy[8] = { name: "Descripción de no conformidad", value: objectToCheck?.calidad[0]?.description }
                inputsValuesCopy[9] = { name: "Vida útil", value: objectToCheck?.calidad[1]?.checked ? "Si" : "No" }
                inputsValuesCopy[10] = { name: "Descripción de no conformidad", value: objectToCheck?.calidad[1]?.description }
                inputsValuesCopy[11] = { name: "Embalaje", value: objectToCheck?.calidad[2]?.checked ? "Si" : "No" }
                inputsValuesCopy[12] = { name: "Descripción de no conformidad", value: objectToCheck?.calidad[2]?.description }
                inputsValuesCopy[13] = { name: "Rótulo", value: objectToCheck?.calidad[3]?.checked ? "Si" : "No" }
                inputsValuesCopy[14] = { name: "Descripción de no conformidad", value: objectToCheck?.calidad[3]?.description }
                inputsValuesCopy[15] = { name: "Calibre", value: objectToCheck?.calidad[4]?.checked ? "Si" : "No" }
                inputsValuesCopy[16] = { name: "Descripción de no conformidad", value: objectToCheck?.calidad[4]?.description }
                inputsValuesCopy[17] = { name: "Color", value: objectToCheck?.calidad[5]?.checked ? "Si" : "No" }
                inputsValuesCopy[18] = { name: "Descripción de no conformidad", value: objectToCheck?.calidad[5]?.description }
                inputsValuesCopy[19] = { name: "Signos de maduración", value: objectToCheck?.calidad[6]?.checked ? "Si" : "No" }
                inputsValuesCopy[20] = { name: "Descripción de no conformidad", value: objectToCheck?.calidad[6]?.description }
                inputsValuesCopy[21] = { name: "Consistencia/Textura", value: objectToCheck?.calidad[7]?.checked ? "Si" : "No" }
                inputsValuesCopy[22] = { name: "Descripción de no conformidad", value: objectToCheck?.calidad[7]?.description }
                inputsValuesCopy[23] = { name: "Olor", value: objectToCheck?.calidad[8]?.checked ? "Si" : "No" }
                inputsValuesCopy[24] = { name: "Descripción de no conformidad", value: objectToCheck?.calidad[8]?.description }
                inputsValuesCopy[25] = { name: "Diferencias", value: '' }
                inputsValuesCopy[26] = { name: "Precio", value: objectToCheck?.diferencias[0]?.checked ? "Si" : "No" }
                inputsValuesCopy[27] = { name: "Descripción de no conformidad", value: objectToCheck?.diferencias[0]?.description }
                inputsValuesCopy[28] = { name: "Cantidad", value: objectToCheck?.diferencias[1]?.checked ? "Si" : "No" }
                inputsValuesCopy[29] = { name: "Descripción de no conformidad", value: objectToCheck?.diferencias[1]?.description }
                inputsValuesCopy[30] = { name: "Transporte", value: '' }
                inputsValuesCopy[31] = { name: "Temperatura de la caja", value: objectToCheck?.transporte[0]?.checked ? "Si" : "No" }
                inputsValuesCopy[32] = { name: "Descripción de no conformidad", value: objectToCheck?.transporte[0]?.description }
                inputsValuesCopy[33] = { name: "Uniforme del proveedor", value: objectToCheck?.transporte[1]?.checked ? "Si" : "No" }
                inputsValuesCopy[34] = { name: "Descripción de no conformidad", value: objectToCheck?.transporte[1]?.description }
                inputsValuesCopy[35] = { name: "Predisposición/Conducta", value: objectToCheck?.transporte[2]?.checked ? "Si" : "No" }
                inputsValuesCopy[36] = { name: "Descripción de no conformidad", value: objectToCheck?.transporte[2]?.description }
                inputsValuesCopy[37] = { name: "Vehículo", value: objectToCheck?.transporte[3]?.checked ? "Si" : "No" }
                inputsValuesCopy[38] = { name: "Descripción de no conformidad", value: objectToCheck?.transporte[3]?.description }
                inputsValuesCopy[39] = { name: "Otras faltas", value: objectToCheck?.transporte[4]?.checked ? "Si" : "No" }
                inputsValuesCopy[40] = { name: "Descripción de no conformidad", value: objectToCheck?.transporte[4]?.description }
                inputsValuesCopy[41] = { name: "MEDIDAS TOMADAS", value: '' }
                inputsValuesCopy[42] = { name: "Rechazo (en el momento de la recepción)", value: objectToCheck?.medidasTomadas[0]?.checked ? "Si" : "No" }
                inputsValuesCopy[43] = { name: "Cantidad", value: objectToCheck?.medidasTomadas[0]?.description }
                inputsValuesCopy[44] = { name: "Devolución (lotes ya ingresados)", value: objectToCheck?.medidasTomadas[1]?.checked ? "Si" : "No" }
                inputsValuesCopy[45] = { name: "Cantidad", value: objectToCheck?.medidasTomadas[1]?.description }
                inputsValuesCopy[46] = { name: "Aceptado condicional (ante cambios de calidad de mercadería, sin peligros de inocuidad)", value: objectToCheck?.medidasTomadas[2]?.checked ? "Si" : "No" }
                inputsValuesCopy[47] = { name: "Cantidad", value: objectToCheck?.medidasTomadas[2]?.description }

                setInputsValues(inputsValuesCopy)
            } else if (cardToCheck.title === 'Verificación Balanzas') {
                let inputsValuesCopy = [...inputsValues]
                let reglonesCopy = [...reglones]

                let fechaTemp = new Date(objectToCheck?.fecha)
                // checo si el resultado es una fecha
                if (fechaTemp.toString() !== "Invalid Date") {
                    console.log('fecha es valida -----------------')
                    console.log('fechaTemp: ', fechaTemp)
                } else {
                    fechaTemp = 'Sin fecha'
                    console.log('fecha es Invalida -----------------')
                    console.log('fechaTemp: ', fechaTemp)
                }
                inputsValuesCopy[0] = { name: "Fecha", value: fechaTemp }
                inputsValuesCopy[1] = { name: "Instrumento", value: objectToCheck?.balanza }

                inputsValuesCopy[2] = { name: "Código", value: '' }

                reglonesCopy = [null, null, []]

                for (let i = 0; i < objectToCheck.inputs.length; i++) {
                    reglonesCopy[2].push({
                        values: [
                            {
                                "name": "Código",
                                "value": objectToCheck.inputs[i].código
                            },
                            {
                                "name": "Tipo",
                                "value": objectToCheck.inputs[i]["Tipo (BP/BR)"]
                            },
                            {
                                "name": "Responsable del uso",
                                "value": objectToCheck.inputs[i].responsabledeluso
                            },
                            {
                                "name": "Área",
                                "value": objectToCheck.inputs[i].área
                            },
                            {
                                "name": "Peso Masa ref/Pto balanza",
                                "value": objectToCheck.inputs[i]["pesomasaref/ptobalanza"]
                            },
                            {
                                "name": "Peso real",
                                "value": objectToCheck.inputs[i].pesoreal
                            },
                            {
                                "name": "Desvío",
                                "value": objectToCheck.inputs[i].desvío
                            },
                            {
                                "name": "Acciones de correción",
                                "value": objectToCheck.inputs[i]["Acciones de corrección"]
                            },
                        ]
                    })
                }

                setInputsValues(inputsValuesCopy)
                setReglones(reglonesCopy)

            } else if (cardToCheck.title === 'Verificación de Termómetros') {
                let inputsValuesCopy = [...inputsValues]
                let reglonesCopy = [...reglones]

                console.log('entrando a el inicio de inputs')

                inputsValuesCopy[0] = { name: "Fecha", value: new Date(objectToCheck?.fecha) }
                inputsValuesCopy[1] = { name: "Responsable de validación", value: objectToCheck?.responsable }
                inputsValuesCopy[2] = { name: "TERMÓMETROS DE PINCHE/INFRARROJOS", value: '' }
                inputsValuesCopy[3] = { name: "TERMÓMETROS DE CÁMARAS, ANTECAMARAS, HELADERAS Y FREEZER", value: '' }

                reglonesCopy = [null, null, [], []]

                console.log('entrada hacia los reglones')

                for (let i = 0; i < objectToCheck?.inputsTrimestral?.length; i++) {
                    reglonesCopy[2].push({
                        values: [
                            {
                                "name": "Código",
                                "value": objectToCheck?.inputsTrimestral[i]?.código
                            },
                            {
                                "name": "Tipo",
                                "value": objectToCheck?.inputsTrimestral[i]?.["Tipo (PIN/IR)"]
                            },
                            {
                                "name": "Responsable del uso",
                                "value": objectToCheck?.inputsTrimestral[i]?.responsabledeluso
                            },
                            {
                                "name": "Área",
                                "value": objectToCheck?.inputsTrimestral[i]?.área
                            },
                            {
                                "name": "Punto 0",
                                "value": objectToCheck?.inputsTrimestral[i]?.punto0
                            },
                            {
                                "name": "Desvío",
                                "value": objectToCheck?.inputsTrimestral[i]?.desvío0
                            },
                            {
                                "name": "Punto 100",
                                "value": objectToCheck?.inputsTrimestral[i]?.punto100
                            },
                            {
                                "name": "Desvío",
                                "value": objectToCheck?.inputsTrimestral[i]?.desvío100
                            },
                            {
                                "name": "Acciones de correción",
                                "value": objectToCheck?.inputsTrimestral[i]?.["Acciones de corrección"]
                            },
                        ]
                    })
                }

                for (let i = 0; i < objectToCheck?.inputsSemestral?.length; i++) {
                    reglonesCopy[3].push({
                        values: [
                            {
                                "name": "Código",
                                "value": objectToCheck?.inputsSemestral[i]?.código
                            },
                            {
                                "name": "Área",
                                "value": objectToCheck?.inputsSemestral[i]?.área
                            },
                            {
                                "name": "Temp. termón referencia",
                                "value": objectToCheck?.inputsSemestral[i]?.["temp.termómreferencia"]
                            },
                            {
                                "name": "Temp. termón evaluado",
                                "value": objectToCheck?.inputsSemestral[i]?.["temp.termómevaluado"]
                            },
                            {
                                "name": "Desvío",
                                "value": objectToCheck?.inputsSemestral[i]?.desvío
                            },
                            {
                                "name": "Acciones de correción",
                                "value": objectToCheck?.inputsSemestral[i]?.["Acciones de corrección"]
                            },
                        ]
                    })
                }
                console.log('salida de inputs')
                setReglones(reglonesCopy)
                setInputsValues(inputsValuesCopy)
            }
            else if (cardToCheck.title === "Entrega de Bidones de Aceite Usado") {
                if (objectToCheck) {
                    console.log('entre a bidones')
                    let array = objectToCheck.inputs.map((input, index) => ({
                        values: [
                            { name: "Fecha", value: input.fecha },
                            { name: "Cantidad de litros entregados", value: input.cantidaddelitrosentregados },
                            { name: "Responsable de entrega", value: input.responsabledeentrega },
                            { name: "Responsable de retiro", value: input.responsablederetiro },
                            { name: "foto de transporte", value: objectToCheck.certificadoTransporte[index], objeto: objectToCheck.certificadoTransporte[index] },
                            { name: "foto de disposición final", value: objectToCheck.certificadoDisposicion[index], objeto: objectToCheck.certificadoDisposicion[index] },
                        ]
                    }));
                    // hago que esto se aplique 0.1s despues
                    setTimeout(() => {
                        setReglones([array]);
                    }, 0.1);
                }
            }
            else {
                let inputsValuesCopy = [...inputsValues]
                let reglonesCopy = [...reglones]

                console.log("objectToCheck 1: ", objectToCheck)

                let subTitulos = 0
                console.log('modo else on')

                for (let i = 0; i < cardToCheck.inputs.length; i++) {
                    console.log('entre al for ', i)
                    if (cardToCheck.inputs[i].tipo === "row") {
                        console.log('entre al row en la vuelta ', i)
                        reglonesCopy[i] = objectToCheck?.inputs[i - subTitulos]?.value?.map(item => ({ values: item }));
                        inputsValuesCopy[i] = { name: cardToCheck.inputs[i].name, value: '' }
                    } else if (cardToCheck.inputs[i].tipo === "subTitle") {
                        console.log('entre al subTitle en la vuelta ', i)
                        subTitulos = subTitulos + 1
                    }
                    else if (cardToCheck.inputs[i].tipo !== "subTitle" && cardToCheck.inputs[i].tipo !== "title") {
                        console.log('entre al else en la vuelta ', i)
                        inputsValuesCopy[i] = objectToCheck?.inputs[i - subTitulos];
                    }
                    console.log('sali de la vuelta, ', i)
                }

                console.log('inputsValuesCopy 2: ', inputsValuesCopy)
                console.log('reglonesCopy: ', JSON.stringify(reglonesCopy))
                setInputsValues(inputsValuesCopy)
                setReglones(reglonesCopy)
            }
        }
    }, [])

    const selectDoc = async (index) => {
        try {
            const res = await DocumentPicker.getDocumentAsync({ type: ['application/pdf', 'image/*'] })
            console.log(res)
            if (res.canceled === false) {
                let inputsCopy = [...inputsValues]
                inputsCopy[index].value = res.assets[0]
                setInputsValues(inputsCopy)
                if (editMode === true) setImageChanged(true)
            }
        } catch (error) {
            console.log(error)
        }
    }


    function setInputsGlobal(index, enteredValue) {
        let array = [...inputsValues];
        array[index] = { ...array[index], value: enteredValue }
        console.log('enteredValue: ', enteredValue)
        console.log('index: ', index)
        console.log('aplicando: ', JSON.stringify(array))
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

    function zonaHorariaArgentina(fecha) {
        // el formato es Thu Nov 23 2023 18:39:07 GMT-0400
        if (fecha === "") return ""
        // Crear un objeto Date con la fecha proporcionada
        let date = new Date(fecha);
        // Ajustar la fecha a la zona horaria de Argentina (GMT-0300)
        let fechaFinal = date.toLocaleString({ hour12: false });
        return fechaFinal.toString();
    }

    function getUrl() {
        let url = cardToCheck.url + "edit/" + objectToCheck._id;
        return url
    }

    async function handleUpdateButton() {
        if (saving) return;
        setSaving(true);

        let objetoFinal = {}
        let formData = new FormData();

        let bidonesUpdateo = false

        if (cardToCheck.title === "Registro de Capacitación") {
            let newFecha = ''
            if (inputsValues[0]?.value !== 'Sin fecha' && inputsValues[0]?.value !== '') {
                if (inputsValues[0]?.value.toString().length > 0) newFecha = inputsValues[0]?.value.toString().split(" ")[3] + "-" + (inputsValues[0]?.value.toString().split(" ")[1] === "Jan" ? "01" : inputsValues[0]?.value.toString().split(" ")[1] === "Feb" ? "02" : inputsValues[0]?.value.toString().split(" ")[1] === "Mar" ? "03" : inputsValues[0]?.value.toString().split(" ")[1] === "Apr" ? "04" : inputsValues[0]?.value.toString().split(" ")[1] === "May" ? "05" : inputsValues[0]?.value.toString().split(" ")[1] === "Jun" ? "06" : inputsValues[0]?.value.toString().split(" ")[1] === "Jul" ? "07" : inputsValues[0]?.value.toString().split(" ")[1] === "Aug" ? "08" : inputsValues[0]?.value.toString().split(" ")[1] === "Sep" ? "09" : inputsValues[0]?.value.toString().split(" ")[1] === "Oct" ? "10" : inputsValues[0]?.value.toString().split(" ")[1] === "Nov" ? "11" : "12") + "-" + inputsValues[0]?.value.toString().split(" ")[2]
            }

            let horaArg = zonaHorariaArgentina(inputsValues[1]?.value)

            // lo recibo asi 11/23/2023, 9:43:09 PM y lo quiero asi 21:43
            let newTiempoDuracion = ''
            if (horaArg.toString().length > 0 && horaArg.toString() !== "Invalid Date") {
                // obtengo la hora y los minutos
                let hora = horaArg.toString().split(" ")[1].split(":")[0]
                // quito el PM
                let minutos = horaArg.toString().split(" ")[1].split(":")[1].split(" ")[0]
                // lo paso a formato de 24 horas
                if (horaArg.toString().split(" ")[2] === "PM") {
                    hora = parseInt(hora) + 12
                }
                newTiempoDuracion = hora + ":" + minutos
            }

            let asistentesFinal = []
            if (reglones[20]?.length) {
                for (let i = 0; i < reglones[20].length; i++) {
                    asistentesFinal.push({
                        "dni": reglones[20][i]?.values[0]?.value,
                        "nombre": reglones[20][i]?.values[1]?.value,
                        "area": reglones[20][i]?.values[2]?.value,
                        "resultado": reglones[20][i]?.values[3]?.value,
                        "metodo": reglones[20][i]?.values[4]?.value,
                    })
                }
            }

            objetoFinal = {
                instructor: inputsValues[22]?.value,
                fecha: newFecha,
                tiempoDuracion: newTiempoDuracion,
                firma: inputsValues[23]?.value?.uri,
                checkboxes: JSON.stringify([
                    {
                        "label": "Inducción",
                        "check": (inputsValues[3]?.value === "Si" ? true : false)
                    },
                    {
                        label: "Campaña",
                        check: inputsValues[4]?.value === "Si" ? true : false
                    },
                    {
                        label: "Entrenamiento Puesto de trabajo",
                        check: inputsValues[5]?.value === "Si" ? true : false
                    },
                    {
                        label: "Capacitaciones gubernamentales",
                        check: inputsValues[6]?.value === "Si" ? true : false
                    },
                    {
                        label: "Capacitación sobre Normas o Certificaciones",
                        check: inputsValues[7]?.value === "Si" ? true : false
                    },
                    {
                        label: "Cierre Auditoría",
                        check: inputsValues[8]?.value === "Si" ? true : false
                    },

                ]),
                temas: inputsValues[9]?.value,
                materialEntregado: JSON.stringify([
                    {
                        "label": "Manual /instructivo",
                        "check": inputsValues[11]?.value === "Si" ? true : false
                    },
                    {
                        "label": "Folleto",
                        "check": inputsValues[12]?.value === "Si" ? true : false
                    },
                    {
                        "label": "Procedimiento",
                        "check": inputsValues[13]?.value === "Si" ? true : false
                    },
                    {
                        "label": "Otros1",
                        "check": inputsValues[14]?.value === "Si" ? true : false,
                        "desc": inputsValues[14]?.value2
                    },
                ]),
                materialExpuesto: JSON.stringify([
                    {
                        "label": "Video",
                        "check": inputsValues[16]?.value === "Si" ? true : false
                    },
                    {
                        "label": "Filminas",
                        "check": inputsValues[17]?.value === "Si" ? true : false
                    },
                    {
                        "label": "Disertación",
                        "check": inputsValues[18]?.value === "Si" ? true : false
                    },
                    {
                        "label": "Otros2",
                        "check": inputsValues[19]?.value === "Si" ? true : false,
                        "desc": inputsValues[19]?.value2
                    },
                ]),
                asistentes: JSON.stringify(asistentesFinal),
                observaciones: inputsValues[21]?.value,
            }

            if (objectToCheck.status !== 'free') {
                objetoFinal = {
                    ...objetoFinal,
                    editEnabled: false
                }
            }

            if (imageChanged) {
                objetoFinal = {
                    instructor: inputsValues[22]?.value,
                    fecha: newFecha,
                    tiempoDuracion: newTiempoDuracion,
                    firma: inputsValues[23]?.value,
                    checkboxes: [
                        {
                            "label": "Inducción",
                            "check": (inputsValues[3]?.value === "Si" ? true : false)
                        },
                        {
                            label: "Campaña",
                            check: inputsValues[4]?.value === "Si" ? true : false
                        },
                        {
                            label: "Entrenamiento Puesto de trabajo",
                            check: inputsValues[5]?.value === "Si" ? true : false
                        },
                        {
                            label: "Capacitaciones gubernamentales",
                            check: inputsValues[6]?.value === "Si" ? true : false
                        },
                        {
                            label: "Capacitación sobre Normas o Certificaciones",
                            check: inputsValues[7]?.value === "Si" ? true : false
                        },
                        {
                            label: "Cierre Auditoría",
                            check: inputsValues[8]?.value === "Si" ? true : false
                        },

                    ],
                    temas: inputsValues[9]?.value,
                    materialEntregado: [
                        {
                            "label": "Manual /instructivo",
                            "check": inputsValues[11]?.value === "Si" ? true : false
                        },
                        {
                            "label": "Folleto",
                            "check": inputsValues[12]?.value === "Si" ? true : false
                        },
                        {
                            "label": "Procedimiento",
                            "check": inputsValues[13]?.value === "Si" ? true : false
                        },
                        {
                            "label": "Otros1",
                            "check": inputsValues[14]?.value === "Si" ? true : false,
                            "desc": inputsValues[14]?.value2
                        },
                    ],
                    materialExpuesto: [
                        {
                            "label": "Video",
                            "check": inputsValues[16]?.value === "Si" ? true : false
                        },
                        {
                            "label": "Filminas",
                            "check": inputsValues[17]?.value === "Si" ? true : false
                        },
                        {
                            "label": "Disertación",
                            "check": inputsValues[18]?.value === "Si" ? true : false
                        },
                        {
                            "label": "Otros2",
                            "check": inputsValues[19]?.value === "Si" ? true : false,
                            "desc": inputsValues[19]?.value2
                        },
                    ],
                    asistentes: asistentesFinal,
                    observaciones: inputsValues[21]?.value,

                }

                if (objectToCheck.status !== 'free') {
                    objetoFinal = {
                        ...objetoFinal,
                        editEnabled: false
                    }
                }

                let fileUri = objetoFinal['firma'].uri;
                let fileType = objetoFinal['firma'].mimeType; // Asume que el archivo es una imagen JPEG
                let fileName = objetoFinal['firma'].name; // Asume que el nombre del archivo es 'firma.jpeg'

                for (const key in objetoFinal) {
                    if (key === 'firma') {
                        formData.append('firma', { uri: fileUri, type: fileType, name: fileName });
                        // si es array
                    } else if (Array.isArray(objetoFinal[key])) {
                        // Si es un array, como propiedades que son arrays de objetos,
                        // puedes serializarlo a JSON y luego agregarlo al FormData
                        formData.append(key, JSON.stringify(objetoFinal[key]));
                    } else {
                        formData.append(key, objetoFinal[key]);
                    }
                }

                // Agregar otras propiedades como businessName, rol, nombre, etc., al FormData
                formData.append('idUser', id);
                formData.append('businessName', businessName);
                formData.append('rol', rol);
                formData.append('nombre', nombre);

                objetoFinal = formData
            }

        } else if (cardToCheck.title === 'Planilla de Decomiso de Materias Primas') {
            let inputFinal = [];

            for (let i = 0; i < reglones[0].length; i++) {
                inputFinal.push({
                    "id": i,
                    "fecha": reglones[0][i]?.values[0]?.value,
                    "turno": reglones[0][i]?.values[1]?.value,
                    "productoDecomisado": reglones[0][i]?.values[2]?.value,
                    "cantidad": reglones[0][i]?.values[3]?.value,
                    "causa": reglones[0][i]?.values[4]?.value,
                })
            }

            objetoFinal = {
                ...objectToCheck,
                inputs: inputFinal,
                editEnabled: false
            }

        } else if (cardToCheck.title === 'Rechazo /  Devolución de Materias Primas') {

            objetoFinal = {
                ...objectToCheck,
                condicionesEntrega: [
                    {
                        "checked": inputsValues[2]?.value === "Si" ? true : false,
                        "name": "Atrasado",
                        "description": inputsValues[3]?.value
                    },
                    {
                        "checked": inputsValues[4]?.value === "Si" ? true : false,
                        "name": "Adelantado",
                        "description": inputsValues[5]?.value
                    }
                ],
                calidad: [
                    {
                        "checked": inputsValues[7]?.value === "Si" ? true : false,
                        "name": "Temperatura",
                        "description": inputsValues[8]?.value
                    },
                    {
                        "checked": inputsValues[9]?.value === "Si" ? true : false,
                        "name": "Vida útil",
                        "description": inputsValues[10]?.value
                    },
                    {
                        "checked": inputsValues[11]?.value === "Si" ? true : false,
                        "name": "Embalaje",
                        "description": inputsValues[12]?.value
                    },
                    {
                        "checked": inputsValues[13]?.value === "Si" ? true : false,
                        "name": "Rótulo",
                        "description": inputsValues[14]?.value
                    },
                    {
                        "checked": inputsValues[15]?.value === "Si" ? true : false,
                        "name": "Calibre",
                        "description": inputsValues[16]?.value
                    },
                    {
                        "checked": inputsValues[17]?.value === "Si" ? true : false,
                        "name": "Color",
                        "description": inputsValues[18]?.value
                    },
                    {
                        "checked": inputsValues[19]?.value === "Si" ? true : false,
                        "name": "Signos de maduración",
                        "description": inputsValues[20]?.value
                    },
                    {
                        "checked": inputsValues[21]?.value === "Si" ? true : false,
                        "name": "Consistencia/Textura",
                        "description": inputsValues[22]?.value
                    },
                    {
                        "checked": inputsValues[23]?.value === "Si" ? true : false,
                        "name": "Olor",
                        "description": inputsValues[24]?.value
                    }
                ],
                diferencias: [
                    {
                        "checked": inputsValues[26]?.value === "Si" ? true : false,
                        "name": "Precio",
                        "description": inputsValues[27]?.value
                    },
                    {
                        "checked": inputsValues[28]?.value === "Si" ? true : false,
                        "name": "Cantidad",
                        "description": inputsValues[29]?.value
                    }
                ],
                transporte: [
                    {
                        "checked": inputsValues[31]?.value === "Si" ? true : false,
                        "name": "Temperatura de la caja",
                        "description": inputsValues[32]?.value
                    },
                    {
                        "checked": inputsValues[33]?.value === "Si" ? true : false,
                        "name": "Uniforme del proveedor",
                        "description": inputsValues[34]?.value
                    },
                    {
                        "checked": inputsValues[35]?.value === "Si" ? true : false,
                        "name": "Predisposición/Conducta",
                        "description": inputsValues[36]?.value
                    },
                    {
                        "checked": inputsValues[37]?.value === "Si" ? true : false,
                        "name": "Vehículo",
                        "description": inputsValues[38]?.value
                    },
                    {
                        "checked": inputsValues[39]?.value === "Si" ? true : false,
                        "name": "Otras faltas",
                        "description": inputsValues[40]?.value
                    }
                ],
                medidasTomadas: [
                    {
                        "checked": inputsValues[42]?.value === "Si" ? true : false,
                        "name": "Rechazo (en el momento de la recepción)",
                        "description": inputsValues[43]?.value
                    },
                    {
                        "checked": inputsValues[44]?.value === "Si" ? true : false,
                        "name": "Devolución (lotes ya ingresados)",
                        "description": inputsValues[45]?.value
                    },
                    {
                        "checked": inputsValues[46]?.value === "Si" ? true : false,
                        "name": "Aceptado condicional (ante cambios de calidad de mercadería, sin peligros de inocuidad)",
                        "description": inputsValues[47]?.value
                    }
                ],
                editEnabled: false
            }

        } else if (cardToCheck.title === 'Verificación Balanzas') {
            let inputsFinalReglones = []

            for (let i = 0; i < reglones[2].length; i++) {
                inputsFinalReglones.push({
                    "código": reglones[2][i]?.values[0]?.value,
                    "Tipo (BP/BR)": reglones[2][i]?.values[1]?.value,
                    "responsabledeluso": reglones[2][i]?.values[2]?.value,
                    "área": reglones[2][i]?.values[3]?.value,
                    "pesomasaref/ptobalanza": reglones[2][i]?.values[4]?.value,
                    "pesoreal": reglones[2][i]?.values[5]?.value,
                    "desvío": reglones[2][i]?.values[6]?.value,
                    "Acciones de corrección": reglones[2][i]?.values[7]?.value,
                })

                objetoFinal = {
                    ...objectToCheck,
                    fecha: inputsValues[0]?.value,
                    balanza: inputsValues[1]?.value,
                    inputs: inputsFinalReglones,
                    editEnabled: false
                }
            }
        } else if (cardToCheck.title === 'Verificación de Termómetros') {
            let inputsTrimestralFinal = []
            let inputsSemestralFinal = []

            for (let i = 0; i < reglones[2].length; i++) {
                inputsSemestralFinal.push({
                    "código": reglones[2][i]?.values[0]?.value,
                    "Tipo (PIN/IR)": reglones[2][i]?.values[1]?.value,
                    "responsabledeluso": reglones[2][i]?.values[2]?.value,
                    "área": reglones[2][i]?.values[3]?.value,
                    "punto0": reglones[2][i]?.values[4]?.value,
                    "desvío0": reglones[2][i]?.values[5]?.value,
                    "punto100": reglones[2][i]?.values[6]?.value,
                    "desvío100": reglones[2][i]?.values[7]?.value,
                    "acciones": reglones[2][i]?.values[8]?.value,
                })
            }

            for (let i = 0; i < reglones[3].length; i++) {
                inputsTrimestralFinal.push({
                    "código": reglones[3][i]?.values[0]?.value,
                    "área": reglones[3][i]?.values[1]?.value,
                    "temp.termómreferencia": reglones[3][i]?.values[2]?.value,
                    "temp.termómevaluado": reglones[3][i]?.values[3]?.value,
                    "desvío": reglones[3][i]?.values[4]?.value,
                    "Acciones de corrección": reglones[3][i]?.values[5]?.value,
                })
            }

            objetoFinal = {
                ...objectToCheck,
                fecha: inputsValues[0]?.value,
                responsable: inputsValues[1]?.value,
                inputsSemestral: inputsSemestralFinal,
                inputsTrimestral: inputsTrimestralFinal,
                editEnabled: false
            }
        } else if (cardToCheck.title === "Entrega de Bidones de Aceite Usado") {
            objetoFinal = await entregabidones(reglones, id)
            objetoFinal = {
                ...objetoFinal,
                editEnabled: false,
                idUser: id,
                rol: rol,
                nombre: nombre,
                businessName: businessName,
                editEnabled: false
            }
            bidonesUpdateo = true
        }
        else {
            let inputFinal = [];
            for (let i = 0; i < cardToCheck.inputs.length; i++) {
                if (cardToCheck.inputs[i].tipo === "row") {
                    console.log('a row')
                    inputFinal.push({
                        "name": cardToCheck.inputs[i].name,
                        "value": reglones[i]?.map(item => (item.values))
                    })
                } else if (cardToCheck.inputs[i].tipo !== "subTitle" && cardToCheck.inputs[i].tipo !== "title") {
                    console.log('another')
                    inputFinal.push({
                        "name": cardToCheck.inputs[i].name,
                        "value": inputsValues[i]?.value
                    })
                }
            }
            if (bidonesUpdateo === false) {
                objetoFinal = {
                    ...objectToCheck,
                    inputs: inputFinal,
                }
            }

            if (objectToCheck.status !== 'free') {
                objetoFinal = {
                    ...objetoFinal,
                    editEnabled: false
                }
            }
        }

        let url = getUrl()

        if (!imageChanged) {
            // console.log('objetoFinal: ', JSON.stringify(objetoFinal))
            fetch(url, {
                method: 'PUT',
                // aplica este header application/json; charset=utf-8
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(objetoFinal)
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Success:', data);
                    setNotif({ view: true, message: "¡Formulario actualizado exitosamente!", color: "verde" })
                    setSaving(false);
                    // si la respuesta es exitosa, muestro un mensaje de exito
                    // y vuelvo a la pantalla anterior
                    // espero
                    setTimeout(() => {
                        // voy a formularios cargados
                        navigation.navigate('FormulariosCargados');
                    }, 1000);
                })
                .catch((error) => {
                    setSaving(false);
                    setNotif({ view: true, message: "¡Ups! Ocurrió un error", color: "naranja" })
                    console.error('Error:', error);
                });
        } else {
            fetch(url, {
                method: 'PUT',
                body: formData,
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Success:', data);
                    setNotif({ view: true, message: "¡Formulario actualizado exitosamente!", color: "verde" })
                    setSaving(false);
                    setTimeout(() => {
                        // voy a formularios cargados
                        navigation.navigate('FormulariosCargados');
                    }, 1000);
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

    async function handleSaveButton() {
        if (allowSaveCaseProcess || !cardToCheck.exceptionP1) {
            if (saving) return; // si saving es true, no hago nada
            else if (cardToCheck.exceptionForm2Cap === true) {
                setSaving(true);

                let newFecha = ''
                if (inputsValues[0]?.value !== 'Sin fecha' && inputsValues[0]?.value !== '') {
                    if (inputsValues[0]?.value.toString().length > 0) newFecha = inputsValues[0]?.value.toString().split(" ")[3] + "-" + (inputsValues[0]?.value.toString().split(" ")[1] === "Jan" ? "01" : inputsValues[0]?.value.toString().split(" ")[1] === "Feb" ? "02" : inputsValues[0]?.value.toString().split(" ")[1] === "Mar" ? "03" : inputsValues[0]?.value.toString().split(" ")[1] === "Apr" ? "04" : inputsValues[0]?.value.toString().split(" ")[1] === "May" ? "05" : inputsValues[0]?.value.toString().split(" ")[1] === "Jun" ? "06" : inputsValues[0]?.value.toString().split(" ")[1] === "Jul" ? "07" : inputsValues[0]?.value.toString().split(" ")[1] === "Aug" ? "08" : inputsValues[0]?.value.toString().split(" ")[1] === "Sep" ? "09" : inputsValues[0]?.value.toString().split(" ")[1] === "Oct" ? "10" : inputsValues[0]?.value.toString().split(" ")[1] === "Nov" ? "11" : "12") + "-" + inputsValues[0]?.value.toString().split(" ")[2]
                }

                let horaArg = zonaHorariaArgentina(inputsValues[1]?.value)
                // lo recibo asi 11/23/2023, 9:43:09 PM y lo quiero asi 21:43
                let newTiempoDuracion = ''
                if (horaArg.toString().length > 0) {
                    // obtengo la hora y los minutos
                    let hora = horaArg.toString().split(" ")[1].split(":")[0]
                    // quito el PM
                    let minutos = horaArg.toString().split(" ")[1].split(":")[1].split(" ")[0]
                    // lo paso a formato de 24 horas
                    if (horaArg.toString().split(" ")[2] === "PM") {
                        hora = parseInt(hora) + 12
                    }
                    newTiempoDuracion = hora + ":" + minutos
                }

                let inputsFinal = {
                    "fecha": newFecha,
                    "tiempoDuracion": newTiempoDuracion,
                    "checkboxes": [
                        {
                            "label": "Inducción",
                            "check": (inputsValues[3]?.value === "Si" ? true : false)
                        },
                        {
                            label: "Campaña",
                            check: inputsValues[4]?.value === "Si" ? true : false
                        },
                        {
                            label: "Entrenamiento Puesto de trabajo",
                            check: inputsValues[5]?.value === "Si" ? true : false
                        },
                        {
                            label: "Capacitaciones gubernamentales",
                            check: inputsValues[6]?.value === "Si" ? true : false
                        },
                        {
                            label: "Capacitación sobre Normas o Certificaciones",
                            check: inputsValues[7]?.value === "Si" ? true : false
                        },
                        {
                            label: "Cierre Auditoría",
                            check: inputsValues[8]?.value === "Si" ? true : false
                        },

                    ],
                    "temas": inputsValues[9]?.value,
                    "materialEntregado": [
                        {
                            "label": "Manual /instructivo",
                            "check": inputsValues[11]?.value === "Si" ? true : false
                        },
                        {
                            "label": "Folleto",
                            "check": inputsValues[12]?.value === "Si" ? true : false
                        },
                        {
                            "label": "Procedimiento",
                            "check": inputsValues[13]?.value === "Si" ? true : false
                        },
                        {
                            "label": "Otros1",
                            "check": inputsValues[14]?.value === "Si" ? true : false,
                            "desc": inputsValues[14]?.value2
                        },
                    ],
                    "materialExpuesto": [
                        {
                            "label": "Video",
                            "check": inputsValues[16]?.value === "Si" ? true : false
                        },
                        {
                            "label": "Filminas",
                            "check": inputsValues[17]?.value === "Si" ? true : false
                        },
                        {
                            "label": "Disertación",
                            "check": inputsValues[18]?.value === "Si" ? true : false
                        },
                        {
                            "label": "Otros2",
                            "check": inputsValues[19]?.value === "Si" ? true : false,
                            "desc": inputsValues[19]?.value2
                        },
                    ],
                    "asistentes": [],
                    "observaciones": inputsValues[21]?.value,
                    "instructor": inputsValues[22]?.value,
                }
                // "firma": inputsValues[23]?.value,

                if (inputsValues[23]?.value?.uri) {
                    inputsFinal = {
                        ...inputsFinal,
                        firma: inputsValues[23]?.value
                    }
                }

                console.log('inputsValues: ', JSON.stringify(inputsValues))
                console.log('reglones: ', JSON.stringify(reglones))

                if (reglones[20]?.length > 0) {
                    for (let i = 0; i < reglones[20].length; i++) {
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
                    objeto = await entregabidones(reglones, id)
                    objeto = {
                        ...objeto,
                        idUser: id,
                        rol: rol,
                        nombre: nombre,
                        businessName: businessName,
                    }
                    console.log('objeto: ', {
                        ...objeto,
                        // los primeros 10 valores de certificadoTransporte
                        certificadoTransporte: [objeto.certificadoTransporte[0].slice(0, 10)],
                        certificadoDisposicion: [objeto.certificadoDisposicion[0].slice(0, 10)],
                    })
                }

                console.log("🚀 ~ file: FormType2.js:98 ~ handleSaveButton ~ objeto:", objeto)

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
                                        array[index] = { name: input.name, value: value };
                                        setInputsValues(array);
                                    }}
                                />
                            </View>
                        </View>
                    )
                }
                else if (input.tipo === "fileUpload") {
                    return (
                        <View key={index} style={{ marginTop: 5, marginBottom: 20, alignItems: 'center' }} >
                            <Text style={{ fontFamily: "GothamRoundedMedium", fontSize: 16, marginRight: 10, marginBottom: 10 }}>{input.name}</Text>
                            <Image
                                source={{ uri: inputsValues[index]?.value?.uri }}
                                style={
                                    {
                                        width: 200,
                                        height: 200,
                                        marginBottom: 10,
                                        display: (inputsValues[index]?.value?.uri ? 'flex' : 'none'),
                                    }
                                } />
                            <Text style={{ marginBottom: 5, display: (inputsValues[index]?.value?.uri && !editMode ? 'flex' : 'none') }}>{
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
                                    console.log('cambiando select')
                                    array[index] = { name: input.name, value: itemValue };
                                    console.log('array', array)
                                    setInputsValues(array);
                                }}
                            >
                                {input.options?.map((option, index) => {
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
                                {input.options?.map((option, index) => {
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
                                {input.options?.map((option, index) => {
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
            <TouchableOpacity style={[styles.buttonForm, { backgroundColor: ((!allowSaveCaseProcess && !editMode) && cardToCheck.exceptionP1 === true) ? "#b4b5b3" : "#7BC100" }]} onPress={() => {
                if (editMode) {
                    handleUpdateButton()
                } else {
                    handleSaveButton()
                }
            }}>
                <Text style={styles.buttonFormText}>
                    {(editMode === true ? "Actualizar" : "Guardar")}
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