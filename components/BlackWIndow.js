import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';

export default function BlackWindow({ visible, setVisible }) {
    const screenWidth = Dimensions.get('window').width;
    const screenHeight = Dimensions.get('window').height;

    const size = {
        width: screenWidth,
        height: screenHeight,
        display: visible ? "flex" : "none",
    }

    return (
        <View style={[styles.container, size]}>
            <TouchableOpacity style={{width: "100%", height: "100%"}} onPress={() => setVisible(false)}></TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 1,
        // pongo un fondo gris al 50% de transparencia
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
});