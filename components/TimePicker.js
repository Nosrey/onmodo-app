import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function TimePicker({ inputReceived, index, setInputsGlobal, gris, inputsValues }) {
    const [time, setTime] = useState({ hora: new Date(), texto: 'Sin hora' });
    const [show, setShow] = useState();

    const editMode = useSelector(state => state.editMode)

    const horaATexto = (hora) => {
        // recibira una hora en este formato 2023-09-12T23:30:52.044Z y debo retornarla en un formato legible en un formato asi: 4:30 pm
        let horas = inputsValues[index]?.value.getHours()
        let minutos = inputsValues[index]?.value.getMinutes()
        // si uno de los elementos esta solo le agrego un cero al inicio, si por ejemplo hay un 1 entonces sera 01, si hay un 10 entonces no hago nada
        if (horas < 10) {
            horas = '0' + horas
        }
        if (minutos < 10) {
            minutos = '0' + minutos
        }
        return horas + ':' + minutos
    }

    const onChange = (event, selectedDate) => {
        if (event.type === 'set') {
            const currentHour = selectedDate || inputsValues[index]?.value;
            setShow(false)
            console.log('currentHour: ', currentHour)
            setInputsGlobal(index, currentHour)
        } else {
            setShow(false)
        }
    };

    const showMode = (currentMode) => {
        setShow(true)
    };

    const colorGris = {
        backgroundColor: gris ? "#f0f0f0" : '#fff',
        padding: gris ? 10 : 0,
        paddingBottom: gris ? 20 : 0,
        paddingTop: gris ? 5 : 0,
    }

    const container = {
        marginTop: !gris ? 5 : 0,
        marginBottom: !gris ? 20 : 0,
    }

    function ajustarHora(value) {
        // recibo una hora pero en hora le pongo siempre 1am
        if (value) {
            if (value === 'Sin hora') value = new Date()
            console.log('soy value: ', value)
            let hora = new Date(value)
            hora.setFullYear(2020)
            hora.setMonth(1)
            hora.setDate(1)
            return hora
        } else {
            let hora = new Date()
            hora.setFullYear(2020)
            hora.setMonth(1)
            hora.setDate(1)
            return hora
        }
    }

    return (
        <View key={index} style={[container, colorGris]}>
            <Text style={[styles.normalText, { marginBottom: 0 }]}>
                {inputReceived.name + ':'}
            </Text>
            <Text style={[styles.normalText, { fontSize: 14 }]}>
                {(inputsValues[index]?.value) && (inputsValues[index]?.value !== 'Sin hora') ? new Date(inputsValues[index]?.value).toLocaleTimeString({ hour12: false }) : 'Sin hora'}
            </Text>
            <View style={styles.buttonFooterStyle}>
                <TouchableOpacity key={index} onPress={showMode}>
                    <Text style={styles.buttonText}>
                        {(!inputsValues[index]?.value) ? 'Agregar Hora' : 'Cambiar Hora'}
                    </Text>
                </TouchableOpacity>
                {(show === true) && (
                    <DateTimePicker
                    mode={'time'}
                    textColor={"#ffffff"}
                    display='spinner'
                    is24Hour={true}                    
                    value={ajustarHora(inputsValues[index]?.value) || ajustarHora()}
                        onChange={(event, selectedDate) => onChange(event, selectedDate)}
                    />
                )}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({

    datePickerContainer: {
        // borde de 1 px y rounded color verde
        borderWidth: 1,
        borderColor: '#00ff00',
        borderRadius: 5,
        // padding de 5 px
        padding: 5,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: "50%",
        alignSelf: 'center'
    },
    buttonFooterStyle: {
        width: '48%',
        marginHorizontal: '1%',
        height: 50,
        backgroundColor: '#A0B875',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: "50%",
        alignSelf: 'left',

    },
    buttonText: {
        color: '#fff',
        fontSize: 14,
        fontFamily: "GothamRoundedMedium"
    },
    normalText: {
        color: 'black',
        fontSize: 16,
        fontFamily: "GothamRoundedMedium",
        marginBottom: 5,
        textAlign: 'left'
    },
})
