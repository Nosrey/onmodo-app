import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Keyboard } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useFonts } from 'expo-font';

export default function Buscador({ inputValue, handleInputChange }) {
    const [fontsLoaded] = useFonts({
        "GothamRoundedMedium": require('../assets/fonts/GothamRoundedMedium_21022.ttf'),
    });
    return (
        <View style={styles.inputContainer}>
            <Icon name="search" size={20} color="#C3C3C3" style={styles.searchIcon} />

            <TextInput
                style={styles.input}
                placeholder="¿Qué estás buscando?"
                placeholderTextColor="#555"
                value={inputValue}
                onChangeText={(value) => handleInputChange(value)}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    searchIcon: {
        padding: 15,
    },
    input: {
        fontFamily: "GothamRoundedMedium",
        flex: 1,
        height: 40,
        width: '100%',
        color: '#C3C3C3',
        fontSize: 14,
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
})