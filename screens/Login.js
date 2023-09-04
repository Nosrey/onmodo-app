import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Importa el ícono de ojo

export default function Login() {
    const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar la contraseña

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Ingresa a tu cuenta</Text>
            <View style={styles.inp}>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Legajo o DNI</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Ingresa tu legajo o DNI"
                        placeholderTextColor="#555"
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Contraseña</Text>
                    <View style={styles.passwordInputContainer}>
                        <TextInput
                            style={styles.passwordInput}
                            placeholder="Ingresa tu contraseña"
                            placeholderTextColor="#555"
                            secureTextEntry={!showPassword}
                        />
                        <TouchableOpacity
                            onPress={() => setShowPassword(!showPassword)}
                            style={styles.passwordToggleIcon}
                        >
                            <Icon
                                name={showPassword ? 'eye' : 'eye-slash'}
                                size={20}
                                color="#555"
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Ingresar</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    inp: {
        flex: 1,
        justifyContent:'center'
    },
    title: {
        fontSize: 24,
        marginTop: 50,
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    inputContainer: {
        marginBottom: 10,
    },
    label: {
        color: '#555',
        marginBottom: 5,
        fontSize: 16,
    },
    input: {
        width: '100%',
        height: 40,
        color: '#C3C3C3',
        borderColor: '#C3C3C3',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        fontSize: 16,
    },
    passwordInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#C3C3C3',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
    },
    passwordInput: {
        flex: 1,
        height: 40,
        color: '#C3C3C3',
        fontSize: 16,
    },
    passwordToggleIcon: {
        padding: 10,
    },
    button: {
        width: '100%',
        height: 50,
        backgroundColor: '#7BC100',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
    },
});
