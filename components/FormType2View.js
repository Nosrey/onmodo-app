import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, Image } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import DatePicker from './DatePickerView';
import TimePicker from './TimePickerView';
// traigo el icon plussquareo la libreria AntDesign
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
// traigo de globalfunctions formulariosData
import { formulariosData } from '../functions/globalFunctions'

export default function FormType2View({ indexPicked, setIndexPicked, setVisibleForm, navigation, visibleForm, reglones, setReglones, setViewDelete, setReglonPicked, editionMode, setEditionMode, setViewInfo, setNotif, setCortina, cortina }) {
    const [inputsValues, setInputsValues] = useState([]); // [ {name: "nombre", value: "valor"}, {name: "apellido", value: "valor"} aca se guardan los valores de los inputs de todo el formulario
    const [saving, setSaving] = useState(false); // si saving es true, se muestra un mensaje de guardando... y se deshabilita el boton de guardar
    const [allowSaveCaseProcess, setAllowSaveCaseProcess] = useState(false);

    const cardToCheck = useSelector((state) => state.cardToCheck);
    const objectToCheck = useSelector((state) => state.objectToCheck);
    const id = useSelector((state) => state.id);
    const businessName = useSelector((state) => state.business);
    const rol = useSelector((state) => state.rol);
    const nombre = useSelector((state) => state.fullName);
    const [reglonesVisibles, setReglonesVisibles] = useState([]);

    // un useEffect donde si el valor de reglones cambia este se le asgina a reglonesVisibles
    useEffect(() => {
        setReglonesVisibles(reglones)
    }, [reglones])

    useEffect(() => {
        if (cardToCheck.title === "Verificación de Termómetros") {
            let card = formulariosData.find((card) => card.title === "Verificación de Termómetros")
            console.log('objectToCheck: ', JSON.stringify(objectToCheck))

            // Establecer inputsValues


            // Establecer reglones
            let reglones2 = [null, null];
            reglones2.push(objectToCheck.inputsSemestral.map(input => ({
                values: Object.keys(input).map(key => ({ name: key, value: input[key] }))
            })));
            reglones2.push(objectToCheck.inputsTrimestral.map(input => ({
                values: Object.keys(input).map(key => ({ name: key, value: input[key] }))
            })));
            console.log('reglones2: ', JSON.stringify(reglones2))
            // aplico el setReglones(reglones2); medio segundo despues
            setTimeout(() => {
                setReglones(reglones2);
            }, 0.1);

            setInputsValues([
                { name: "Fecha", value: objectToCheck.fecha },
                { name: "Responsable de validación", value: objectToCheck.responsable },
                { name: "TERMÓMETROS DE PINCHE/INFRARROJOS", value: "" },
                { name: "TERMÓMETROS DE CÁMARAS, ANTECAMARAS, HELADERAS Y FREEZER", value: "" }
            ]);

        }
        else if (cardToCheck.title === "Verificación Balanzas") {
            console.log('entre a balanzas')
            let inputsValues = [
                { name: "Fecha", value: objectToCheck.fecha },
                { name: "Instrumento", value: objectToCheck.balanza },
                { name: "Identificación Balanza", value: "" }
            ];
            setInputsValues(inputsValues);

            if (objectToCheck.inputs?.length > 0) {
                let reglones = [null, null];
                reglones.push(objectToCheck.inputs.map(input => ({
                    values: [
                        { name: "Código", value: input.codigo },
                        { name: "Tipo", value: input.tipo === "BP" ? "" : input.tipo },
                        { name: "Responsable del uso", value: input.responsableUso },
                        { name: "Área", value: input.area },
                        { name: "Peso Masa ref/Pto balanza", value: input.pesoMasa },
                        { name: "Peso real", value: input.pesoReal },
                        { name: "Desvío", value: input.desvio },
                        { name: "Acciones de correción", value: input.accionesCorrecion }
                    ]
                })));
                setTimeout(() => {
                    setReglones(reglones);
                }, 0.1);
            }
        }
        else if (cardToCheck.title === "Rechazo /  Devolución de Materias Primas") {
            if (cardToCheck.title === "Rechazo /  Devolución de Materias Primas") {
                if (objectToCheck) {
                    let array = [
                        { name: "Posibles no conformidades: Marcar la casilla y completar con la descripción de la no conformidad.", value: "" },
                        { name: "Condiciones de entrega", value: "" },
                        { name: "Atrasado", value: objectToCheck.condicionesEntrega[0]?.checked ? "Si" : "No" },
                        { name: "Descripción de no conformidad", value: objectToCheck.condicionesEntrega[0]?.description },
                        { name: "Adelantado", value: objectToCheck.condicionesEntrega[1]?.checked ? "Si" : "No" },
                        { name: "Descripción de no conformidad", value: objectToCheck.condicionesEntrega[1]?.description },
                        // Continúa con el resto de los campos...
                        {
                            "name": "Calidad",
                            "value": ""
                        },
                        {
                            "name": "Temperatura",
                            "value": objectToCheck.calidad[0]?.checked ? "Si" : "No"
                        },
                        {
                            "name": "Descripción de no conformidad",
                            "value": objectToCheck.calidad[0]?.description
                        },
                        {
                            "name": "Vida útil",
                            "value": objectToCheck.calidad[1]?.checked ? "Si" : "No"
                        },
                        {
                            "name": "Descripción de no conformidad",
                            "value": objectToCheck.calidad[1]?.description
                        },
                        {
                            "name": "Embalaje",
                            "value": objectToCheck.calidad[2]?.checked ? "Si" : "No"
                        },
                        {
                            "name": "Descripción de no conformidad",
                            "value": objectToCheck.calidad[2]?.description
                        },
                        {
                            "name": "Rótulo",
                            "value": objectToCheck.calidad[3]?.checked ? "Si" : "No"
                        },
                        {
                            "name": "Descripción de no conformidad",
                            "value": objectToCheck.calidad[3]?.description
                        },
                        {
                            "name": "Calibre",
                            "value": objectToCheck.calidad[4]?.checked ? "Si" : "No"
                        },
                        {
                            "name": "Descripción de no conformidad",
                            "value": objectToCheck.calidad[4]?.description
                        },
                        {
                            "name": "Color",
                            "value": objectToCheck.calidad[5]?.checked ? "Si" : "No"
                        },
                        {
                            "name": "Descripción de no conformidad",
                            "value": objectToCheck.calidad[5]?.description
                        },
                        {
                            "name": "Signos de maduración",
                            "value": objectToCheck.calidad[6]?.checked ? "Si" : "No"
                        },
                        {
                            "name": "Descripción de no conformidad",
                            "value": objectToCheck.calidad[6]?.description
                        },
                        {
                            "name": "Consistencia/Textura",
                            "value": objectToCheck.calidad[7]?.checked ? "Si" : "No"
                        },
                        {
                            "name": "Descripción de no conformidad",
                            "value": objectToCheck.calidad[7]?.description
                        },
                        {
                            "name": "Olor",
                            "value": objectToCheck.calidad[8]?.checked ? "Si" : "No"
                        },
                        {
                            "name": "Descripción de no conformidad",
                            "value": objectToCheck.calidad[8]?.description
                        },
                        {
                            "name": "Diferencias",
                            "value": ""
                        },
                        {
                            "name": "Precio",
                            "value": objectToCheck.diferencias[0]?.checked ? "Si" : "No"
                        },
                        {
                            "name": "Descripción de no conformidad",
                            "value": objectToCheck.diferencias[0]?.description
                        },
                        {
                            "name": "Cantidad",
                            "value": objectToCheck.diferencias[1]?.checked ? "Si" : "No"
                        },
                        {
                            "name": "Descripción de no conformidad",
                            "value": objectToCheck.diferencias[1]?.description
                        },
                        {
                            "name": "Transporte",
                            "value": ""
                        },
                        {
                            "name": "Temperatura de la caja",
                            "value": objectToCheck.transporte[0]?.checked ? "Si" : "No"
                        },
                        {
                            "name": "Descripción de no conformidad",
                            "value": objectToCheck.transporte[0]?.description
                        },
                        {
                            "name": "Uniforme del proveedor",
                            "value": objectToCheck.transporte[1]?.checked ? "Si" : "No"
                        },
                        {
                            "name": "Descripción de no conformidad",
                            "value": objectToCheck.transporte[1]?.description
                        },
                        {
                            "name": "Predisposición /Conducta",
                            "value": objectToCheck.transporte[2]?.checked ? "Si" : "No"
                        },
                        {
                            "name": "Descripción de no conformidad",
                            "value": objectToCheck.transporte[2]?.description
                        },
                        {
                            "name": "Vehículo",
                            "value": objectToCheck.transporte[3]?.checked ? "Si" : "No"
                        },
                        {
                            "name": "Descripción de no conformidad",
                            "value": objectToCheck.transporte[3]?.description
                        },
                        {
                            "name": "Otras Faltas",
                            "value": objectToCheck.transporte[4]?.checked ? "Si" : "No"
                        },
                        {
                            "name": "Descripción de no conformidad",
                            "value": objectToCheck.transporte[4]?.description
                        },
                        {
                            "name": "MEDIDAS TOMADAS",
                            "value": ""
                        },
                        {
                            "name": "Rechazo (en el momento de la recepción)",
                            "value": objectToCheck.medidasTomadas[0]?.checked ? "Si" : "No"
                        },
                        {
                            "name": "Cantidad",
                            "value": objectToCheck.medidasTomadas[0]?.description
                        },
                        {
                            "name": "Devolución (lotes ya ingresados)",
                            "value": objectToCheck.medidasTomadas[1]?.checked ? "Si" : "No"
                        },
                        {
                            "name": "Cantidad",
                            "value": objectToCheck.medidasTomadas[1]?.description
                        },
                        {
                            "name": "Aceptado condicional (ante cambios de calidad de mercadería, sin peligros de inocuidad)",
                            "value": objectToCheck.medidasTomadas[2]?.checked ? "Si" : "No"
                        },
                        {
                            "name": "Cantidad",
                            "value": objectToCheck.medidasTomadas[2]?.description
                        }
                    ]
                    setInputsValues(array);
                }
            }
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
                        { name: "foto de transporte", value: objectToCheck.certificadoTransporte[index] },
                        { name: "foto de disposición final", value: objectToCheck.certificadoDisposicion[index] },
                    ]
                }));
                // hago que esto se aplique 0.1s despues
                setTimeout(() => {
                    setReglones([array]);
                }, 0.1);
            }
        }
        else if (cardToCheck.title === "Registro de Capacitación") {
            let parsedObject = {};

            for (let [key, value] of Object.entries(objectToCheck)) {
                if (key !== 'firma' && key !== "updatedAt" && key !== "createdAt" && key !== "idUser" && key !== "businessName" && key !== "nombre" && key !== "status" && key !== "_id" && key !== "temas" && key !== "observaciones" && key !== "instructor" && key !== "fecha" && key !== "tiempoDuracion")  {
                    try {
                        parsedObject[key] = JSON.parse(value);
                    } catch (error) {
                        console.error(`Error parsing key ${key}: ${error}`);
                        parsedObject[key] = value;
                    }
                } else if (key === 'fecha') {
                    if (value === '') parsedObject[key] = ''
                    else parsedObject[key] = value;
                }
                else {
                    parsedObject[key] = value;
                }
            }

            // Ahora puedes usar parsedObject
            console.log("parsed: ", parsedObject);
            
            // recibire fecha asi 2023-11-23 pero quiero que se vea asi 2023-11-23T17:41:50.449Z (la informacion que no tienes ponla en 0)
            let newFecha = ''
            if (parsedObject.fecha !== '') newFecha = parsedObject.fecha + "T00:00:00.000Z"
            // recibire tiempoDuracion asi 17:41 pero quiero que se vea asi 2023-11-23T17:41:50.449Z (la informacion que no tienes ponla en 0)
            let newTiempoDuracion = "2023-11-23T" + parsedObject.tiempoDuracion + ":00.000Z"
            if (parsedObject.tiempoDuracion === '') newTiempoDuracion = 'Sin hora'

            // recorro checkboxes de parsedObject y si el check es true entonces le asigno el valor "Si" y si es false le asigno "No"
            for (let i = 0; i < parsedObject.checkboxes.length; i++) {
                if (parsedObject.checkboxes[i].check === true) {
                    parsedObject.checkboxes[i].check = "Si"
                } else {
                    parsedObject.checkboxes[i].check = "No"
                }
            }

            // ahora con materialEntregado y materialExpuesto hago lo mismo
            for (let i = 0; i < parsedObject.materialEntregado.length; i++) {
                if (parsedObject.materialEntregado[i].check === true) {
                    parsedObject.materialEntregado[i].check = "Si"
                } else {
                    parsedObject.materialEntregado[i].check = "No"
                }
            }

            for (let i = 0; i < parsedObject.materialExpuesto.length; i++) {
                if (parsedObject.materialExpuesto[i].check === true) {
                    parsedObject.materialExpuesto[i].check = "Si"
                } else {
                    parsedObject.materialExpuesto[i].check = "No"
                }
            }

            const data = { ...parsedObject, fecha: newFecha, tiempoDuracion: newTiempoDuracion }

            const inputsValues2 =
                [
                    { "name": "Fecha", "value": data.fecha },
                    { "name": "Hora", "value": data.tiempoDuracion },
                    { "name": "Tipo de capacitación (Selecciona la opción que corresponda)", "value": "" },
                    { "name": "Inducción", "value": data.checkboxes[0].check },
                    { "name": "Campaña", "value": data.checkboxes[1].check },
                    { "name": "Entrenamiento Puesto de trabajo", "value": data.checkboxes[2].check },
                    { "name": "Capacitaciones gubernamentales", "value": data.checkboxes[3].check },
                    { "name": "Capacitación sobre Normas o Certificaciones", "value": data.checkboxes[4].check },
                    { "name": "Cierre Auditoría", "value": data.checkboxes[5].check },
                    { "name": "Temas dados", "value": data.temas },
                    { "name": "Material didáctico Entregado", "value": "" },
                    { "name": "Manual /instructivo", "value": data.materialEntregado[0].check },
                    { "name": "Folleto", "value": data.materialEntregado[1].check },
                    { "name": "Procedimiento", "value": data.materialEntregado[2].check },
                    { "name": "Otros", "value": data.materialEntregado[3].check, value2: data.materialEntregado[3].desc },
                    { "name": "Material didáctico Expuesto", "value": "" },
                    { "name": "Video", "value": data.materialExpuesto[0].check },
                    { "name": "Filminas", "value": data.materialExpuesto[1].check },
                    { "name": "Disertación", "value": data.materialExpuesto[2].check },
                    { "name": "Otros", "value": data.materialExpuesto[3].check, value2: data.materialExpuesto[3].desc },
                    { "name": "ASISTENTES", "value": "" },
                    { "name": "Observaciones", "value": data.observaciones },
                    { "name": "Instructor", "value": data.instructor },
                    { "name": "Firma de los participantes", "value": data.firma }
                ]

            setInputsValues(inputsValues2);

            let reglon = data.asistentes.map(asistente => ({
                values: [
                    { name: "DNI", value: asistente.dni },
                    { name: "Nombre y Apellido", value: asistente.nombre },
                    { name: "Area/Lugar de trabajo", value: asistente.area },
                    { name: "Resultado Evaluacion", value: asistente.resultado },
                    { name: "Método de evaluación", value: asistente.metodo }
                ]
            }))

            console.log('reglon: ', JSON.stringify(reglon))

            const reglones2 = [
                null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, reglon
                // Aquí mapeas los valores de "asistentes" a su correspondiente entrada en "reglones"
                
            ];            

            // espero 0.1 segundo
            setTimeout(() => {
                setReglones(reglones2);
            }, 0.1);
                

        }
        else {
            if (objectToCheck.inputs?.length > 0) {
                let array = [];
                for (let i = 0; i < cardToCheck.inputs.length; i++) {
                    // establezco inputsValue con los valores de objectToCheck
                    let item = objectToCheck.inputs?.find((input) => input.name === cardToCheck.inputs[i].name)
                    array.push({ name: cardToCheck.inputs[i].name, value: item?.value })
                }
                setInputsValues(array);
            }
        }
    }, [cardToCheck])

    function setInputsGlobal(index, enteredValue) {
        let array = [...inputsValues];
        array[index].value = enteredValue;
        setInputsValues(array);
    }

    function handleDeleteButton(index, index2) {

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

                    } else if (cardToCheck.inputs[i]?.tipo !== "subTitle" && cardToCheck.inputs[i]?.tipo === "title") {
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
        if (cardToCheck.title === "Registro de Capacitación") {
            if (hora?.length) {
                let horaTexto = hora.slice(11, 16)
                return horaTexto;
            } else return 'vacio'

        } else {
            if (hora?.length) {
                let horaTexto = new Date(hora).toLocaleTimeString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires', hour12: false })
                return horaTexto;
            } else return 'vacio'
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
                        <View key={index} style={{ marginTop: 5, marginBottom: 20 }} >
                            <Text style={{ fontFamily: "GothamRoundedMedium", fontSize: 16, marginRight: 10, marginBottom: 5 }}>{input.name}</Text>
                            <Text style={{ fontFamily: "GothamRoundedMedium", fontSize: 16, marginRight: 10, marginBottom: 5 }}>{(inputsValues[index]?.value.length && inputsValues[index]?.value !== 'Sin fecha' ? traducirFecha(inputsValues[index]?.value) : 'Sin fecha')}</Text>
                        </View>
                    )
                }
                else if (input.tipo === "row") return (
                    <View key={index} style={{ marginTop: 5, marginBottom: 20 }} >
                        <Text style={styles.normalText}>{input.name + ':'}</Text>
                        <View style={styles.reglon}>
                            <View style={styles.fila}>
                                {reglonesVisibles.length ? (
                                    reglonesVisibles[index]?.map((reglon, index2) => {
                                        return (
                                            <View key={index2}>
                                                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                                    <Text style={{ fontFamily: 'GothamRoundedMedium', width: "80%" }}>{"Elemento #" + (index2 + 1)}</Text>

                                                    <TouchableOpacity style={{ display: 'flex', alignItems: 'left', justifyContent: 'center', width: "10%", }}>
                                                        <Feather name="eye" size={20} color="black" onPress={() => { handleEditButton(index2, index) }} />
                                                    </TouchableOpacity>



                                                </View>
                                                <View style={{ borderBottomColor: '#C3C3C3', borderBottomWidth: 1, marginVertical: 10 }} />
                                            </View>

                                        )
                                    })) : null}

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
                                    let array = [...inputsValues];
                                    array[index] = { name: input.name, value: value };

                                }}
                                value={inputsValues[index]?.value}
                            />
                        </View>
                    )
                }
                else if (input.tipo === "time") {
                    return (
                        <View key={index} style={{ marginTop: 5, marginBottom: 20 }} >
                            <Text style={{ fontFamily: "GothamRoundedMedium", fontSize: 16, marginRight: 10, marginBottom: 5 }}>{input.name}</Text>
                            <Text style={{ fontFamily: "GothamRoundedMedium", fontSize: 16, marginRight: 10, marginBottom: 5 }}>{(inputsValues[index]?.value && inputsValues[index]?.value !== 'Sin hora' ? traducirHora(inputsValues[index]?.value) : 'Sin hora')}</Text>
                        </View>
                    )
                }
                else if (input.tipo === "subTitle") {
                    return (
                        <Text key={index} style={[styles.normalText, { fontSize: 18, marginBottom: 10, marginTop: 15 }]}>{input.name}</Text>
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
                }
                else if (input.tipo === "fileUpload") {
                    return (
                        <View key={index} style={{ marginTop: 5, marginBottom: 20, alignItems: 'center' }} >
                            <Text style={{ fontFamily: "GothamRoundedMedium", fontSize: 16, marginRight: 10, marginBottom: 10 }}>{input.name}</Text>
                            <Image
                                source={{ uri: inputsValues[index]?.value }}
                                style={
                                    {
                                        width: 200,
                                        height: 200,
                                        marginBottom: 10,
                                        display: (inputsValues[index]?.value ? 'flex' : 'none'),
                                    }
                                } />
                            <Text style={{ marginBottom: 5, display: (inputsValues[index]?.value ? 'flex' : 'none') }}>{
                                (inputsValues[index]?.value ? inputsValues[index]?.value?.split("/")[inputsValues[index]?.value?.split("/").length - 1] : '')
                            }</Text>
                
                        </View>
                    )
                }
                else if (input.tipo === "selectShow") {
                    return (
                        <View key={index} style={{ marginTop: 5, marginBottom: 20 }}>
                            <Text style={{ fontFamily: "GothamRoundedMedium", fontSize: 16 }}>{input.name}</Text>
                            <Picker
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
                            <Text style={{ fontFamily: "GothamRoundedMedium", fontSize: 16 }}>{inputsValues[index]?.value || input.options[0]}</Text>
                        </View>
                    )
                }
                else if (input.tipo === "selectConText") {
                    return (
                        <View key={index} style={{ marginTop: 5, marginBottom: 20 }}>
                            <Text style={{ fontFamily: "GothamRoundedMedium", fontSize: 16 }}>{input.name}</Text>
                            <Picker
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

                            <View style={[styles.passwordInputContainer, { display: (input.activador === inputsValues[index]?.value ? 'flex' : 'none') },]}>
                                <TextInput
                                    editable={false}
                                    style={[styles.userInput]}
                                    placeholder={(input.name.length >= 18 ? (input.name.substring(0, 18) + "...") : input.name)}
                                    value={inputsValues[index]?.value2}
                                    onChangeText={(value) => {
                                        let array = [...inputsValues];
                                        array[index].value2 = value;

                                    }}
                                />
                            </View>


                        </View>
                    )
                }

            })}

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