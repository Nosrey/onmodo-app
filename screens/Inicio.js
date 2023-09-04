import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import ButtonBar from '../components/ButtonBar';

export default function Inicio() {
    return (
        <View style={styles.container}>
            <View>
                <View style={styles.title}>
                    <Text style={styles.title}>| Inicio</Text>
                    <Text style={styles.title}>Nivel 1</Text>
                </View>

                <View style={styles.inputContainer}>
                    <Icon name="search" size={20} color="#C3C3C3" style={styles.searchIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="¿Qué estás buscando?"
                        placeholderTextColor="#555"
                    />
                </View>
            </View>

            <View style={styles.containerBox}>
                <TouchableOpacity style={styles.box}>
                    <Text style={styles.boxTitle}>
                        Formularios
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.box}>
                    <Text style={styles.boxTitle}>
                        Formularios cargados
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.box}>
                    <Text style={styles.boxTitle}>
                        Documentacion
                    </Text>
                </TouchableOpacity>
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
    containerBox:{
        flexDirection:'row',
        justifyContent:'space-around',
        flexWrap:'wrap',
        marginTop:20,
        flex: 1,
    },
    box: {
        width: 150,
        height: 100,
        borderRadius: 10,
        marginTop:20,
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
        padding: 10,
    },

});
