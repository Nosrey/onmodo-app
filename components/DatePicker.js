import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function DatePicker({ inputReceived, index, setInputsGlobal, inputsValues, allowSaveCaseProcess, setAllowSaveCaseProcess }) {
    const [date, setDate] = useState({ fecha: new Date(), texto: 'sin fecha' });
    const [show, setShow] = useState();
    const [mode, setMode] = useState('date');

    // traigo el cardToCheck del redux
    const cardToCheck = useSelector((state) => state.cardToCheck);

    const fechaATexto = (fecha) => {
        fecha = new Date(fecha)
        fecha = fecha.toISOString()

        let dia = fecha.slice(8, 10)
        let mes = fecha.slice(5, 7)
        let anio = fecha.slice(0, 4)
        let meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
        let mesTexto = meses[mes - 1]
        return dia + '/' + mesTexto + '/' + anio
    }

    const onChange = (event, selectedDate) => {
        if (event.type === 'set') {
            const currentDate = selectedDate || inputsValues[index]?.value;
            setShow(false)
            console.log('currentDDate: ', currentDate)
            setInputsGlobal(index, new Date(currentDate))
        } else {
            setShow(false)
        }
    };

    const showMode = (currentMode) => {
        setShow(true)
    };

    function ajustarFecha(value) {
        // recibo una fecha pero en hora le pongo siempre 1am
        if (value) {
            if (value === 'Sin fecha') value = new Date()
            let fecha = new Date(value)
            fecha.setHours(1)
            return fecha
        } else {
            let fecha = new Date()
            fecha.setHours(1)
            return fecha
        }
    }


    return (
        <View key={index} style={styles.container}>
            <Text style={[styles.normalText, { marginBottom: 0 }]}>
                {inputReceived.name + ':'}
            </Text>
            <Text style={[styles.normalText, { fontSize: 14 }]}>
                {inputsValues[index]?.value && inputsValues[index]?.value !== 'Sin fecha' ? fechaATexto(inputsValues[index]?.value) : "Sin fecha"}
            </Text>
            <View style={styles.buttonFooterStyle}>
                <TouchableOpacity key={index} onPress={() => showMode('date')}>
                    <Text style={styles.buttonText}>
                        {!inputsValues[index]?.value ? 'Agregar Fecha' : 'Cambiar Fecha'}
                    </Text>
                </TouchableOpacity>
                {(show === true) && (
                    <DateTimePicker
                        value={ajustarFecha(inputsValues[index]?.value) || ajustarFecha()}
                        mode={'date'}
                        textColor={"#ffffff"}
                        display='spinner'
                        // pongo timeZone para argentina                    

                        onChange={(event, selectedDate) => {
                            if (cardToCheck.exceptionP1 && inputReceived.name === "Fecha") setAllowSaveCaseProcess(true)
                            onChange(event, selectedDate)
                        }}
                    />
                )}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 5,
        marginBottom: 20,
    },
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
