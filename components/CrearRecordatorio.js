import { Text, View, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native'
// importo useState
import React, { useState } from 'react'
// traigo AntDesign
import { AntDesign } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
// traigo URL_API de globalFunctions
import { API_URL } from '../functions/globalFunctions';
// traigo useEffect
import { useSelector } from 'react-redux';

export default function CrearRecordatorio({ setBlackScreen, visible, setVisible, handleClose, tarea, setTarea, descripcion, setDescripcion, link, setLink, linkTitle, setLinkTitle, status, setStatus, frecuencia, setFrecuencia, fechaInicio, setFechaInicio, setUpdate }) {

    const [showDate, setShowDate] = useState(false);
    const [date, setDate] = useState(new Date());

    // traigo id de usuario de useSelector
    const id = useSelector(state => state.id);
    const business = useSelector(state => state.business);

    const onChange = (event, selectedDate) => {
        const currentDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 0, 0, 0, 0) || date;
        setFechaInicio(currentDate)
        setShowDate(false)
    };

    const generarFechas = (fechaInicial, temporalidad) => {
        const fechas = [];
        const [year, month, day] = fechaInicial.split('-').map(Number);
        const fecha = new Date(year, month - 1, day); // Meses en JavaScript se cuentan desde 0 (enero) a 11 (diciembre).

        // Agregar la fecha inicial al array
        // la tenemos en formato MM/DD/YYYY y la queremos en formato DD/MM/YYYY
        const dia = fecha.getDate().toString().padStart(2, '0');
        const mes = (fecha.getMonth() + 1).toString().padStart(2, '0'); // Se suma 1 ya que los meses van de 0 a 11
        const año = fecha.getFullYear().toString();

        const fechaFormateada = `${dia}/${mes}/${año}`;
        fechas.push({ fecha: fechaFormateada, ejecutado: false })

        // Determinar el incremento de tiempo en base a la temporalidad
        let incremento = 1;
        switch (temporalidad) {
            case "Mensual":
                incremento = 1;
                break;
            case "Bimestral":
                incremento = 2;
                break;
            case "Trimestral":
                incremento = 3;
                break;
            case "Semestral":
                incremento = 6;
                break;
            case "Anual":
                incremento = 12;
                break;
            case "Cada 2 años":
                incremento = 24;
                break;
            default:
                throw new Error("Temporalidad no válida");
        }

        // Generar fechas para un período de 10 años
        for (let i = 0; i < 10 * 12; i += incremento) {
            fecha.setMonth(fecha.getMonth() + incremento);
            // la tenemos en formato MM/DD/YYYY y la queremos en formato DD/MM/YYYY
            const dia = fecha.getDate().toString().padStart(2, '0');
            const mes = (fecha.getMonth() + 1).toString().padStart(2, '0'); // Se suma 1 ya que los meses van de 0 a 11
            const año = fecha.getFullYear().toString();

            const fechaFormateada = `${dia}/${mes}/${año}`;
            fechas.push({ fecha: fechaFormateada, ejecutado: false })
        }

        return fechas;
    }

    const postearRecordatorio = () => {
        setBlackScreen(true)
        let values = {
            tarea: tarea,
            descripcion: descripcion,
            link: link,
            linkTitle: linkTitle,
            status: status,
            frecuencia: frecuencia,
            fechaInicio: fechaInicio,
            idUser: id,
            businessName: business,
        }

        if (values.status === "En curso") {
            // viene asi 2023-12-21T15:12:11.951Z y la quiero asi 2023-12-20
            let fechaInicio = values.fechaInicio.toISOString().split('T')[0];

            console.log('values.fechaInicio: ', values.fechaInicio)
            console.log('values.frecuencia: ', fechaInicio)
            const fechasGeneradas = generarFechas(fechaInicio, values.frecuencia);
            values.fechas = fechasGeneradas;
        }

        // apunto al endpoint API_URL + /api/recordatorio un POST
        let url = API_URL + '/api/recordatorio'
        console.log('url: ', url)
        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            // paso los valores
            body: JSON.stringify(values),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('Success:', data);
                // si la respuesta es correcta, cierro el modal
                setUpdate(true)
                handleClose()
                setVisible(false)
            })
            .catch((error) => {
                setUpdate(true)
                handleClose()
                console.error('Error:', error);
            });

        setVisible(false)
    }

    return (
        <View style={{
            display: (visible ? 'flex' : 'none'),
            position: 'absolute',
            zIndex: 2,
            width: '95%',
            height: '99%',
            backgroundColor: 'white',
            //una sombra negra leve abajo y al costado
            shadowColor: "black",
            shadowOffset: {
                width: 2,
                height: 2,
            },
            alignSelf: 'center',
            marginVertical: '2%',
            padding: 20,
            // redondeo los bordes
            borderRadius: 10,
        }}>
            <ScrollView>
                <TouchableOpacity style={{ position: 'absolute', right: 0, top: -5, padding: 5, zIndex: 100 }} >
                    <AntDesign name="close" size={26} color="black" onPress={() => handleClose()} />
                </TouchableOpacity>

                <Text style={styles.texto}>Agregar nuevo recordatorio</Text>

                <View style={styles.cajaInputs}>
                <Text style={{ marginLeft: 15, marginTop: 10, color: "gray" }}>Tarea</Text>
                    <Picker
                        selectedValue={tarea}
                        onValueChange={(itemValue, itemIndex) => setTarea(itemValue)}
                    >
                        <Picker.Item label="Vencimiento de Limpieza de Tanques." value="Vencimiento de Limpieza de Tanques." />
                        <Picker.Item label="Vencimiento de Limpieza de Cámaras Graseras." value="Vencimiento de Limpieza de Cámaras Graseras." />
                        <Picker.Item label="Vencimiento de Libretas Sanitarias." value="Vencimiento de Libretas Sanitarias." />
                        <Picker.Item label="Vencimiento de Cursos de Manipulador." value="Vencimiento de Cursos de Manipulador." />
                        <Picker.Item label="Vencimiento de Matriz IPER." value="Vencimiento de Matriz IPER." />
                        <Picker.Item label="Vencimientos de Análisis de Agua Fisicoquímicos." value="Vencimientos de Análisis de Agua Fisicoquímicos." />
                        <Picker.Item label="Vencimientos de Análisis de Agua Bacteriológicos." value="Vencimientos de Análisis de Agua Bacteriológicos." />
                        <Picker.Item label="Vencimiento de Extintores." value="Vencimiento de Extintores." />
                        <Picker.Item label="Vencimiento de Medición de Puesta a Tierra." value="Vencimiento de Medición de Puesta a Tierra." />
                        <Picker.Item label="Vencimiento de Evaluaciones Ergonómicos por Puesto." value="Vencimiento de Evaluaciones Ergonómicos por Puesto." />
                        <Picker.Item label="Vencimiento de Medición de Ruido." value="Vencimiento de Medición de Ruido." />
                        <Picker.Item label="Vencimiento de Medición de Carga Térmica." value="Vencimiento de Medición de Carga Térmica." />
                        <Picker.Item label="Vencimiento de Medición de Iluminación." value="Vencimiento de Medición de Iluminación." />
                        <Picker.Item label="Vencimiento de Estudio de Carga de Fuego." value="Vencimiento de Estudio de Carga de Fuego." />
                        <Picker.Item label="Vencimiento de Fumigación." value="Vencimiento de Fumigación." />
                        <Picker.Item label=" " value=" " />
                    </Picker>
                </View>

                <View style={styles.cajaInputs}>
                    <Text style={{ marginLeft: 15, marginTop: 10, color: "gray" }}>Descripción</Text>
                    <TextInput
                        placeholder={'Descripción'}
                        value={descripcion}
                        onChangeText={setDescripcion}
                        multiline={true}
                        // aumento el tamaño Vertical de la caja de texto
                        style={{ padding: 16, fontSize: 16, height: 120, textAlignVertical: 'top', margin: 10 }}
                    />
                </View>

                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                }}>
                    <View style={[styles.cajaInputs, { width: '48%' }]}>
                        <Text style={{ marginLeft: 15, marginTop: 10, color: "gray" }}>Link</Text>
                        <TextInput
                            placeholder={'Link'}
                            value={link}
                            onChangeText={(e) => {
                                let linkValue = e;
                                // Verificar si el valor comienza con "https://"
                                if (!linkValue.startsWith("https://")) {
                                    // Si no comienza con "https://", agregarlo al principio
                                    linkValue = linkValue === "https:/" ? "" : "https://" + linkValue;
                                }
                                // Actualizar el valor
                                setLink(linkValue);
                            }}
                            // aumento el tamaño Vertical de la caja de texto
                            style={{ padding: 16, fontSize: 16, marginHorizontal: 10 }}
                        />
                    </View>
                    <View style={[styles.cajaInputs, { width: '48%' }]}>
                        <Text style={{ marginLeft: 15, marginTop: 10, color: "gray" }}>Título del Link</Text>
                        <TextInput
                            placeholder={'Título del Link'}
                            value={linkTitle}
                            onChangeText={setLinkTitle}
                            // aumento el tamaño Vertical de la caja de texto
                            style={{ padding: 16, fontSize: 16, marginHorizontal: 10 }}
                        />
                    </View>
                </View>

                <View style={styles.cajaInputs}>
                    <Text style={{ marginLeft: 15, marginTop: 10, color: "gray" }}>Status</Text>
                    <Picker
                        selectedValue={status}
                        onValueChange={(itemValue, itemIndex) => setStatus(itemValue)}
                        // aumento el tamaño Vertical de la caja de texto
                        style={{ padding: 16, fontSize: 16, marginHorizontal: 10 }}
                    >
                        <Picker.Item label="Aún no desarrollado" value="Aún no desarrollado" />
                        <Picker.Item label="En proceso de desarrollo" value="En proceso de desarrollo" />
                        <Picker.Item label="En curso" value="En curso" />
                        <Picker.Item label="Desestimado transitoriamente" value="Desestimado transitoriamente" />
                        <Picker.Item label="Resuelto" value="Resuelto" />
                        <Picker.Item label=" " value=" " />
                    </Picker>
                </View>

                <View style={{

                }}>
                    <View style={[styles.cajaInputs, {display: (status === 'En curso' ? 'flex' : 'none')}]}>
                        <Text style={{ marginLeft: 15, marginTop: 10, color: "gray" }}>Frecuencia</Text>
                        <Picker
                            selectedValue={frecuencia}
                            // lo desactivo si el status es diferente a "En curso"
                            enabled={status === "En curso"}
                            onValueChange={(itemValue, itemIndex) => setFrecuencia(itemValue)}
                            // aumento el tamaño Vertical de la caja de texto
                            style={{
                                padding: 16, fontSize: 16, marginHorizontal: 10,
                                color: status === "En curso" ? "black" : "gray"
                            }}
                        >
                            <Picker.Item label="Mensual" value="Mensual" />
                            <Picker.Item label="Bimestral" value="Bimestral" />
                            <Picker.Item label="Trimestral" value="Trimestral" />
                            <Picker.Item label="Semestral" value="Semestral" />
                            <Picker.Item label="Anual" value="Anual" />
                            <Picker.Item label="Cada 2 años" value="Cada 2 años" />
                            <Picker.Item label=" " value=" " />
                        </Picker>
                    </View>

                    <View style={{ width: "50%", alignSelf: 'center', display: (status === 'En curso' ? 'flex' : 'none') }}>
                        <Text style={{ color: "gray", textAlign: 'center', fontSize: 16, marginTop: 10 }}>
                            {fechaInicio ? fechaInicio?.toLocaleDateString('es-ES', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : 'Sin Fecha'}
                        </Text>

                        <TouchableOpacity style={[styles.buttonForm, {
                            backgroundColor: (
                                status === "En curso" ? "#7BC100" : "gray"
                            ), marginTop: 5, width: "80%", alignSelf: 'center', paddingHorizontal: 5
                        }]} onPress={() => {
                            if (status === "En curso") {
                                setShowDate(true)
                            }
                        }}>
                            <Text style={styles.buttonFormText}>
                                Agregar Fecha
                            </Text>
                        </TouchableOpacity>

                        {showDate &&
                            <DateTimePicker
                                testID="dateTimePicker"
                                // que la fecha minima sea apartir de mañana
                                minimumDate={new Date(Date.now() + 86400000)}
                                value={fechaInicio ? new Date(fechaInicio) : new Date()}
                                mode={'date'}
                                is24Hour={true}
                                display="default"
                                onChange={onChange}
                            />
                        }
                    </View>
                    {/* agrego este texto "*Para establecer una frecuencia y fecha de recordatorio es necesario que la tarea esté con Status: En curso" cuando el status es diferente a "En curso" */}
                    {status !== "En curso" &&
                        <Text style={{ color: "gray", textAlign: 'center', fontSize: 16, marginTop: 0, marginBottom: 10, marginHorizontal: 10 }}>
                            *Para establecer una frecuencia y fecha de recordatorio es necesario que la tarea esté con Status: En curso
                        </Text>
                    }
                </View>

                <TouchableOpacity style={[styles.buttonForm, {
                    backgroundColor: (
                        tarea !== ' ' && status !== ' ' && (status === 'En curso' ? frecuencia !== ' ' : true) && (status === 'En curso' ? fechaInicio !== '' : true) ? "#7BC100" : "gray"
                    ), marginTop: 5
                }]} onPress={() => {
                    if (tarea !== ' ' && status !== ' ' && (status === 'En curso' ? frecuencia !== ' ' : true) && (status === 'En curso' ? fechaInicio !== '' : true)) {
                        postearRecordatorio()
                    }
                }}>
                    <Text style={styles.buttonFormText}>
                        CREAR
                    </Text>
                </TouchableOpacity>

                {tarea === ' ' &&
                    <Text style={{ color: "gray", textAlign: 'center', fontSize: 16, marginTop: 0, marginBottom: 10, marginHorizontal: 10 }}>* La tarea es obligatoria</Text>}
                {status === ' ' &&
                    <Text style={{ color: "gray", textAlign: 'center', fontSize: 16, marginTop: 0, marginBottom: 10, marginHorizontal: 10 }}>* El status es obligatorio</Text>}
                {status === "En curso" && fechaInicio === '' &&
                    <Text style={{ color: "gray", textAlign: 'center', fontSize: 16, marginTop: 0, marginBottom: 10, marginHorizontal: 10 }}>* La Fecha es obligatoria</Text>
                }
                {status === "En curso" && frecuencia === ' ' &&
                    <Text style={{ color: "gray", textAlign: 'center', fontSize: 16, marginTop: 0, marginBottom: 10, marginHorizontal: 10 }}>* La Frecuencia de inicio es obligatoria</Text>}
            </ScrollView>
        </View>
    )
}

// creo styles
const styles = StyleSheet.create({
    texto: {
        fontSize: 18,
        fontFamily: 'GothamRoundedMedium',
    },
    buttonForm: {
        marginVertical: 20,
        backgroundColor: '#7BC100',
        width: '25%',
        marginHorizontal: '1%',
        height: 50,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        // lo alineo a la derecha
        alignSelf: 'flex-end',
    },
    buttonFormText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: "GothamRoundedMedium",
    },
    cajaInputs: {
        // borde color 'rgb(179, 212, 140)
        borderColor: 'rgb(179, 212, 140)',
        borderWidth: 1,
        borderRadius: 10,
        marginVertical: 10,
    }
})