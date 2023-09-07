import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Button } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import ButtonBar from '../components/ButtonBar';
// importo useSelector, useDispatch
import { useSelector, useDispatch } from 'react-redux';

export default function Inicio({ navigation }) {
    const counter = useSelector((state) => state.counter);
    const dispatch = useDispatch();

    // creo un estado para guardar el valor del input
    const [inputValue, setInputValue] = useState('');
    // creo un array donde pondré los distintos buttons             
    const buttons = [
        {
            title: 'Formularios',
            onPress: () => console.log('Formularios'),

        },
        {
            title: 'Formularios cargados',
            onPress: () => console.log('Formularios cargados'),
        },
        {
            title: 'Documentacion',
            onPress: () => console.log('Documentacion'),
        },
    ];
    // creo un estado llamadon buttonsFoundos para guardar los buttons que coincidan con el valor del input
    const [buttonsFound, setButtonsFound] = useState(buttons);

    // creo una función que se ejecutará cada vez que cambie el valor del input
    const handleInputChange = (value) => {
        // guardo el valor del input en el estado inputValue
        setInputValue(value);
        let inputLocal = value;
        // convierto el inputLocal en minusculas
        inputLocal = inputLocal.toLowerCase();
        // creo un array donde guardaré los buttons que coincidan con el valor del input al filtrar
        setButtonsFound(buttons.filter((item) => {
            let itemTitle = item.title.toLowerCase();
            if (itemTitle.includes(inputLocal)) return item
        }))
    }



    return (
        <View style={styles.container}>
            <View>
                <View>
                    <Text>{counter}</Text>
                </View>
                <View>
                    <Button title="Incrementar" onPress={() => dispatch({ type: 'counter/increment' })} />
                    <Button title="Decrementar" onPress={() => dispatch({ type: 'counter/decrement' })} />
                </View>
            </View>
            <View>
                <View style={styles.title}>
                    <Text style={styles.title}>| Inicio</Text>
                    <Text style={styles.title}>Nivel 1</Text>
                </View>

                <View style={styles.inputContainer}>
                    <Icon name="search" size={20} color="#C3C3C3" style={styles.searchIcon} />
                    {/* creo un textinput pero con un input controlado usando el estado */}
                    <TextInput
                        style={styles.input}
                        placeholder="¿Qué estás buscando?"
                        placeholderTextColor="#555"
                        value={inputValue}
                        onChangeText={(value) => handleInputChange(value)}
                    />
                </View>
            </View>

            <View style={styles.containerBox}>
                {/* creo estos buttons en base a los que tengo en el array buttonsFound */}
                {buttonsFound.map((boton, i) => (
                    <TouchableOpacity key={i} style={styles.box} onPress={boton.onPress}>
                        <Text style={styles.boxTitle}>
                            {boton.title}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <ButtonBar />

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 16,
        backgroundColor: '#fff',
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    containerBox: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        flexWrap: 'wrap',
        marginTop: 20,
        flex: 1,
    },
    box: {
        width: 150,
        height: 100,
        borderRadius: 10,
        marginTop: 20,
        backgroundColor: '#E7E7E7',
        justifyContent: 'center',
    },
    boxTitle: {
        textAlign: 'center',
        justifyContent: 'center'

    },
    title: {
        fontSize: 24,
        paddingLeft: 16,
        paddingRight: 16,
        marginTop: 30,
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    label: {
        color: '#555',
        marginBottom: 5,
        fontSize: 16,
    },
    inputContainer: {
        marginBottom: 10,
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#C3C3C3',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        marginLeft: 16,
        marginRight: 16,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#C3C3C3',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
    },
    input: {
        flex: 1,
        height: 40,
        color: '#C3C3C3',
        fontSize: 16,
    },
    searchIcon: {
        padding: 15,
    },

});
