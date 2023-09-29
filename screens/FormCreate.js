import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Header from '../components/Header';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { NavigationContext } from "@react-navigation/native";
import FormType1 from '../components/FormType1';
import FormType2 from '../components/FormType2';
import ButtonBar from '../components/ButtonBar';

export default function FormCreate({ navigation }) {
    // traigo del redux el state cardToCheck
    const cardToCheck = useSelector((state) => state.cardToCheck);
    const rol = useSelector((state) => state.rol);

    useEffect(() => {
        navigation?.setOptions({
            title: cardToCheck.title,
        });
    }, []);


    let cajaText = [{

    }]

    // cambio el title del componente por cardToCheck.title

    return (
        <View style={styles.container}>
            <Header cajaText={cajaText} unElemento={true} />
            <ScrollView>
                <Text style={styles.titleForm}>{cardToCheck.title}</Text>
                {cardToCheck.formType === 1 ? (
                    <FormType1 />
                ) : cardToCheck.formType === 2 ? (
                    <FormType2 />
                ) : null}
            </ScrollView>
            <ButtonBar navigation={navigation} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        padding: 12,
        flex: 1,
    },
    titleForm: {
        backgroundColor: '#c5f46e71',
        fontSize: 18,
        fontFamily: "GothamRoundedBold",
        paddingLeft: 20,
        paddingVertical: 10,
        paddingBottom: 20,
        marginTop: 40,
    },
})