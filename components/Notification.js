import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useEffect } from 'react';

export default function Notification({ params, notif, setNotif }) {
    const { view, message, color } = params;

    const container = {
        display: (view) ? 'flex' : 'none',
        flex: 1,
        borderRadius: 30,
        backgroundColor : (color === 'verde') ? "#A0B875" : "#F39D5E",
        width: '90%',
        paddingVertical: 15,
        position: 'absolute',
        bottom: "13.5%",
        zIndex: 100,
        alignSelf: 'center',
    }

    useEffect(() => {
        if (notif) {
            setTimeout(() => {
                setNotif(false)
            }, 3000);
        }
    }, [notif])

    return (
        <View style={container}>
            <Text style={styles.text}>{message}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    text: {
        fontFamily: 'GothamRoundedBold',
        fontSize: 14,
        textAlign: 'center',
        color: '#fff',
        // permito que la palabra se pase a la siguiente linea si hace falta
    }
});