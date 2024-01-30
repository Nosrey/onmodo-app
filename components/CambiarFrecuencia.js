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

export default function CambiarFrecuencia({ setBlackScreen, visible, setVisible, handleClose, tarea, setTarea, descripcion, setDescripcion, link, setLink, linkTitle, setLinkTitle, status, setStatus, frecuencia, setFrecuencia, fechaInicio, setFechaInicio, setUpdate, recordatorioId, listaRecordatorios }) {

    const [showDate, setShowDate] = useState(false);
    const [date, setDate] = useState(new Date());

    // traigo id de usuario de useSelector
    const id = useSelector(state => state.id);
    const business = useSelector(state => state.business);

    const onChange = (event, selectedDate) => {
        // QUE LA hora siempre sea 00:00:00
        // const currentDate = selectedDate || date;
        const currentDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 0, 0, 0, 0) || date;
        setFechaInicio(currentDate)
        setShowDate(false)
    };

    const generarFechas = (fechaInicial, temporalidad) => {
        console.log('temporalidad, ', temporalidad)
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
        
        // ubico el elemento en listaRecordatorios que tenga el id de item._id
        let index = listaRecordatorios.findIndex((itemLista) => itemLista._id === recordatorioId);
        // creo una copia del elemento
        let itemCopia = { ...listaRecordatorios[index] };
        // cambio el valor del status en el elemento dentro de itemCopia al valor de itemValue
        itemCopia.status = 'En curso';
        itemCopia.frecuencia = frecuencia;
        itemCopia.fechaInicio = fechaInicio;

        let fechaFormateada = fechaInicio.toISOString().split('T')[0];
        console.log('fechaFormateada: ', fechaFormateada)

        const fechasGeneradas = generarFechas(fechaFormateada, frecuencia);
        itemCopia.fechas = fechasGeneradas;

        setVisible(false)

        url = API_URL + '/api/recordatorio/' + recordatorioId;
        fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(itemCopia),
        })
            .then((response) => response.json())
            .then((json) => {
                setUpdate(true);
                handleClose();
                
            })
            .catch((error) => {
                setUpdate(true);
                handleClose();
                console.error(error);
            });
    }


    return (
        <View style={{
            display: (visible ? 'flex' : 'none'),
            position: 'absolute',
            zIndex: 2,
            width: '95%',
            height: 'auto',
            marginTop: '10%',



            backgroundColor: 'white',
            //una sombra negra leve abajo y al costado
            shadowColor: "black",
            shadowOffset: {
                width: 2,
                height: 2,
            },

            alignSelf: 'center',
            marginVertical: '4%',
            padding: 20,
            // redondeo los bordes
            borderRadius: 10,
        }}>
            <ScrollView>
                <TouchableOpacity style={{ position: 'absolute', right: -5, top: -10, padding: 5, zIndex: 100 }} >
                    <AntDesign name="close" size={26} color="black" onPress={() => handleClose()} />
                </TouchableOpacity>

                <Text style={styles.texto}>Elige la Frecuencia</Text>

                <View style={{

                }}>
                    <View style={[styles.cajaInputs]}>
                        <Text style={{ marginLeft: 15, marginTop: 10, color: "gray" }}>Frecuencia</Text>
                        <Picker
                            selectedValue={frecuencia}
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

                    <View style={{ width: "50%", alignSelf: 'center' }}>
                        <Text style={{ color: "gray", textAlign: 'center', fontSize: 16, marginTop: 10 }}>
                            {fechaInicio ? fechaInicio?.toLocaleDateString('es-ES', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : 'Sin Fecha'}
                        </Text>

                        <TouchableOpacity style={[styles.buttonForm, {
                            backgroundColor: "#7BC100", marginTop: 5, width: "80%", alignSelf: 'center', paddingHorizontal: 5
                        }]} onPress={() => {
                            setShowDate(true)
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
                </View>

                <TouchableOpacity style={[styles.buttonForm, {
                    backgroundColor: (
                        (fechaInicio !== '' && frecuencia !== '' && frecuencia !== ' ') ? "#7BC100" : "gray"
                    ), marginTop: 5
                }]} onPress={() => {
                    if (fechaInicio !== '' && frecuencia !== '' && frecuencia !== ' ') {
                        postearRecordatorio()
                    }
                }}>
                    <Text style={styles.buttonFormText}>
                        CREAR
                    </Text>
                </TouchableOpacity>

 
                {frecuencia === ' ' &&
                    <Text style={{ color: "gray", textAlign: 'center', fontSize: 16, marginTop: 0, marginBottom: 10, marginHorizontal: 10 }}>* La Frecuencia de inicio es obligatoria</Text>}
                {fechaInicio === '' &&
                    <Text style={{ color: "gray", textAlign: 'center', fontSize: 16, marginTop: 0, marginBottom: 10, marginHorizontal: 10 }}>* La Fecha es obligatoria</Text>
                }
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