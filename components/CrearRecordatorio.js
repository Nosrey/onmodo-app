import { Text, View, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native'
// importo useState
import React, { useState } from 'react'
// traigo AntDesign
import { AntDesign } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
// traigo URL_API de globalFunctions
import { URL_API } from '../functions/globalFunctions';

export default function CrearRecordatorio({ visible, setVisible }) {
    const [date, setDate] = useState(new Date());
    const [showDate, setShowDate] = useState(false);
    const [tarea, setTarea] = useState('tarea');
    const [descripcion, setDescripcion] = useState('');
    const [link, setLink] = useState('');
    const [linkTitle, setLinkTitle] = useState('');
    const [status, setStatus] = useState('en-curso');
    const [frecuencia, setFrecuencia] = useState('');
    const [fechaInicio, setFechaInicio] = useState('');

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setFechaInicio(currentDate)
        setShowDate(false)
    };

    const postearRecordatorio = () => {
        const values = {
            tarea: tarea,
            descripcion: descripcion,
            link: link,
            linkTitle: linkTitle,
            status: status,
            frecuencia: frecuencia,
            fechaInicio: fechaInicio,
        }

        // apunto al endpoint URL_API + /api/recordatorio un POST
        fetch(URL_API + '/api/recordatorio', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // paso los valores
            body: JSON.stringify(values),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('Success:', data);
                // si la respuesta es correcta, cierro el modal
                setVisible(false)
            })
            .catch((error) => {
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
            <TouchableOpacity style={{ position: 'absolute', right: 10, top: 10 }} onPress={() => console.log('todos los estados: ', {
                tarea: tarea,
                descripcion: descripcion,
                link: link,
                linkTitle: linkTitle,
                status: status,
                frecuencia: frecuencia,
                fechaInicio: fechaInicio,                
            })}>
                <Text style={{ color: 'gray' }}>Guardar</Text>
            </TouchableOpacity>
            <AntDesign name="close" size={24} color="black" style={{ position: 'absolute', right: 10, top: 10 }} onPress={() => setVisible(false)} />
            <Text style={styles.texto}>Agregar nuevo recordatorio</Text>

            <View style={styles.cajaInputs}>
                <Picker
                    selectedValue={tarea}
                    onValueChange={(itemValue, itemIndex) => setTarea(itemValue)}
                >
                    <Picker.Item label="Tarea" value="tarea" />
                    <Picker.Item label="Trimestral" value="trimestral" />
                    <Picker.Item label="Semestral" value="semestral" />
                    <Picker.Item label="Anual" value="anual" />
                </Picker>
            </View>

            <View style={styles.cajaInputs}>
            <Text style={{ marginLeft: 15, marginTop: 10, color: "gray" }}>Descripcion</Text>
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
                        onChangeText={setLink}
                        // aumento el tamaño Vertical de la caja de texto
                        style={{ padding: 16, fontSize: 16, marginHorizontal: 10 }}
                    />
                </View>
                <View style={[styles.cajaInputs, { width: '48%' }]}>
                <Text style={{ marginLeft: 15, marginTop: 10, color: "gray" }}>Link</Text>
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
                    <Picker.Item label="Aún no desarrollado" value="aun-no-desarrollado" />
                    <Picker.Item label="En proceso de desarrollo" value="en-proceso-de-desarrollo" />
                    <Picker.Item label="En curso" value="en-curso" />
                    <Picker.Item label="Desestimado transitoriamente" value="desestimado-transitoriamente" />
                    <Picker.Item label="Resuelto" value="resuelto" />                    
                </Picker>
            </View>

            <View style={{

            }}>
                <View style={[styles.cajaInputs]}>
                <Text style={{ marginLeft: 15, marginTop: 10, color: "gray" }}>Frecuencia</Text>
                    <Picker
                        selectedValue={frecuencia}
                        onValueChange={(itemValue, itemIndex) => setFrecuencia(itemValue)}                        
                        // aumento el tamaño Vertical de la caja de texto
                        style={{ padding: 16, fontSize: 16, marginHorizontal: 10 }}
                    >          
                        <Picker.Item label="Mensual" value="mensual" />
                        <Picker.Item label="Bimestral" value="bimestral" />
                        <Picker.Item label="Trimestral" value="trimestral" />
                        <Picker.Item label="Semestral" value="semestral" />
                        <Picker.Item label="Anual" value="anual" />
                        <Picker.Item label="Cada 2 años" value="cada-2-anos" />
                    </Picker>
                </View>

                <View style={{ width: "50%", alignSelf: 'center' }}>

                    <Text style={{ color: "gray", textAlign: 'center', fontSize: 16, marginTop: 10 }}>
                        {fechaInicio ? fechaInicio?.toLocaleDateString('es-ES', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : 'Sin Fecha'}
                    </Text>

                    <TouchableOpacity style={[styles.buttonForm, { backgroundColor: "#7BC100", marginTop: 5, width: "80%", alignSelf: 'center', paddingHorizontal: 5 }]} onPress={() => {
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

            <TouchableOpacity style={[styles.buttonForm, { backgroundColor: "#7BC100", marginTop: 5 }]} onPress={() => {
                postearRecordatorio()
            }}>
                <Text style={styles.buttonFormText}>
                    CREAR
                </Text>
            </TouchableOpacity>
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