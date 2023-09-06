// creo un nuevo componente de react native
import React, { useState, useEffect } from 'react';
// importo de react native el view, text, image, stylesheets, touchableOpacity
import { View, Text, Image, StyleSheet, Keyboard } from 'react-native';

const logged = false;

export default function Loading({ navigation }) {
    const [keyboardShow, setKeyboardShow] = useState();
    const footer = {
        position: 'absolute',
        bottom: keyboardShow ? -40 : 30,
        width: '100%',
        alignItems: 'center',
    }

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                setKeyboardShow(true);
            }
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setKeyboardShow(false);
            }
        );

        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };
    }, []);

    // hago que al iniciar esta pagina inicie un contador de 7 segundos para redirigir a Login
    useEffect(() => {
        setTimeout(() => {
            if (!logged) {
                navigation.replace('Login');
            } else navigation.replace('Inicio');
        }, 7000);
    }, []);

    return (
        <View style={styles.container}>
            {/* Logo */}
            <Image style={styles.logo} source={require('../assets/on-modo-grande.png')} />
            {/* Footer */}
            <View style={footer}>
                <Text style={styles.text}>Desarrollado por Yellow Patito  Propulsado por OnModo</Text>
                <Image style={styles.logoSm} source={require('../assets/on-modo-grande.png')} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        padding: 12,
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        width: '100%',
        resizeMode: 'contain',
        marginBottom: 150,
    },
    text: {
        fontSize: 14,
        // height: 50,
        paddingHorizontal: 20,
        paddingVertical: 0,
        color: '#000000',
        textAlign: 'center',
        marginBottom: 10,
    },
    logoSm: {
        width: 80,
        resizeMode: 'contain',
        height: 30,
    },
});