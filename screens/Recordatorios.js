// creo un nuevo componente
import React, { useState, useEffect } from 'react';
// importo de react native el view, text, image, stylesheets, touchableOpacity
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Image, Keyboard, ScrollView } from 'react-native';
import Header from '../components/Header';
import { Picker } from '@react-native-picker/picker';
import BlackWindow from '../components/BlackWIndow';
import CrearRecordatorio from '../components/CrearRecordatorio';
// useSelector
import { useSelector } from 'react-redux';
import ButtonBar from '../components/ButtonBar';

export default function Recordatorios({ navigation }) {
    const rol = useSelector(state => state.rol);
    const [status, setStatus] = useState('');
    const [tareas, setTareas] = useState('');
    const [blackWindow, setBlackWindow] = useState(false);

    const [listaTareas, setListaTareas] = useState([
        { status: "valido" },
        { status: "invalido" },
        { status: "cercano" }
    ])

    let cajaText = [
        { title: '| Mi cuenta', style: "titleProfile" },
    ]

    function crearRecordatorio() {
        let lista = [...listaTareas];
        setBlackWindow(true);
    }

    const renderItem = ({ item }) => (
        // un view diferente si rol es 1 y otro si es mayor que 1
         rol > 1 ?
            <View style={{
                padding: 20,
                backgroundColor: 'rgb(234, 233, 233)',
                borderTopColor: (item.status === 'valido' ? '#9bc568' : (item.status === 'invalido' ? '#e81212' : '#ffb600')),
                borderTopWidth: 10,
                // sombra leve negra a los costados
                shadowColor: "black",
                fontFamily: 'GothamRoundedMedium',
                marginBottom: 30,
                shadowOffset: {
                    width: 2,
                    height: 2,
                },
            }}>
                <View>

                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: 0,
                    }}>
                        <Text style={styles.letrasRecortadorios}>Bimestral <Text style={{
                            color: (item.status === 'valido' ? '#9bc568' : (item.status === 'invalido' ? '#e81212' : '#ffb600')),
                        }}>- 11/29/2023</Text></Text>
                        <Text style={[styles.letrasRecortadorios, { width: '25%', textAlign: 'center' }]}>Resuelto</Text>
                    </View>
                    <View style={{ borderBottomColor: 'gray', borderBottomWidth: 1, marginBottom: 10, width: '25%', alignSelf: 'flex-end', padding: 0 }}>
                        <Picker
                            style={[styles.letrasRecortadorios, { fontSize: 14, color: 'black', padding: 0 }]}
                            selectedValue={'no'}
                        >
                            <Picker.Item label="No" value="no" style={{ fontSize: 14, color: 'black' }} />
                            <Picker.Item label="Si" value="si" style={{ fontSize: 14, color: 'black' }} />
                        </Picker>
                    </View>
                </View>

                <Text style={{ borderBottomColor: 'gray', borderBottomWidth: 1, marginBottom: 5, fontSize: 17, fontFamily: 'GothamRoundedMedium' }}>Vencimiento de Limpieza de Cámaras Graseras.</Text>
                <Text style={{ fontFamily: 'GothamRoundedMedium', fontSize: 16 }}>dsfds</Text>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, alignItems: 'center' }}>
                    <Text style={{ color: 'blue', fontFamily: 'GothamRoundedMedium', fontSize: 16, width: '20%' }}>sdf</Text>
                    <Text style={{ fontFamily: 'GothamRoundedMedium', fontSize: 16, width: '20%' }}>Eliminar</Text>
                    <View style={{ width: '50%', borderBottomColor: 'gray', borderBottomWidth: 1, padding: 0, margin: 0 }}>

                        <Picker
                            selectedValue={'en-curso'}
                        >
                            <Picker.Item label="En curso" value="en-curso" />
                        </Picker>
                    </View>
                </View>
            </View>
            :
            <View style={{
                padding: 20,
                backgroundColor: 'rgb(234, 233, 233)',
                borderTopColor: (item.status === 'valido' ? '#9bc568' : (item.status === 'invalido' ? '#e81212' : '#ffb600')),
                borderTopWidth: 10,
                // sombra leve negra a los costados
                shadowColor: "black",
                fontFamily: 'GothamRoundedMedium',
                marginBottom: 30,
                shadowOffset: {
                    width: 2,
                    height: 2,
                },
            }}>
                <View>

                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: 0,
                    }}>
                        <Text style={[styles.letrasRecortadorios, {marginBottom: 10}]}>Bimestral <Text style={{
                            color: (item.status === 'valido' ? '#9bc568' : (item.status === 'invalido' ? '#e81212' : '#ffb600')),
                        }}>- 11/29/2023</Text></Text>
                  
                    </View>
  
                </View>

                <Text style={{ borderBottomColor: 'gray', borderBottomWidth: 1, marginBottom: 5, fontSize: 17, fontFamily: 'GothamRoundedMedium' }}>Vencimiento de Limpieza de Cámaras Graseras.</Text>
                <Text style={{ fontFamily: 'GothamRoundedMedium', fontSize: 16, marginTop: 5 }}>dsfds</Text>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, alignItems: 'center' }}>
                    <Text style={{ color: 'blue', fontFamily: 'GothamRoundedMedium', fontSize: 16, width: '20%' }}>sdf</Text>
                    <Text style={{ fontFamily: 'GothamRoundedMedium', fontSize: 16, width: '20%' }}>Eliminar</Text>
                    <View style={{ width: '50%', borderBottomColor: 'gray', borderBottomWidth: 1, padding: 0, margin: 0 }}>

                        <Picker
                            selectedValue={'en-curso'}
                        >
                            <Picker.Item label="En curso" value="en-curso" />
                        </Picker>
                    </View>
                </View>
            </View>
    )


    return (
        <View style={styles.container}>
            <BlackWindow visible={blackWindow} setVisible={setBlackWindow} />
            <CrearRecordatorio visible={blackWindow} setVisible={setBlackWindow} />
            <Header cajaText={cajaText} unElemento={true} />
            <Text style={styles.titleForm}>Recordatorios</Text>

            <TouchableOpacity style={[styles.buttonForm, { backgroundColor: "#7BC100", marginVertical: 10 }]} onPress={() => {
                crearRecordatorio()
            }}>
                <Text style={styles.buttonFormText}>
                    CREAR NUEVO
                </Text>
            </TouchableOpacity>

            <Text style={{ fontSize: 20, marginBottom: 15, fontFamily: 'GothamRoundedMedium' }}>Eventos</Text>

            <View style={[styles.inputContainer,
            { borderBottomColor: '#C3C3C3', borderBottomWidth: 1, marginBottom: 20 }]}>

                <Text
                    style={{ marginVertical: 0 }}
                >Filtrar por Status</Text>
                <Picker
                    style={{ marginVertical: 0 }}
                    selectedValue={status}
                    onValueChange={
                        (itemValue, itemIndex) => setStatus(itemValue)
                    }
                >
                    <Picker.Item label="En curso" value="en-curso" />
                    <Picker.Item label="Otro" value="otro" />
                </Picker>
            </View>

            <View style={[styles.inputContainer,
            { borderBottomColor: '#C3C3C3', borderBottomWidth: 1, marginBottom: 20 }]}>

                <Text
                    style={{ marginVertical: 0 }}
                >Filtrar por Tarea</Text>
                <Picker
                    style={{ marginVertical: 0 }}
                    selectedValue={tareas}
                    onValueChange={
                        (itemValue, itemIndex) => setTareas(itemValue)
                    }
                >
                    <Picker.Item label="Todas" value="Todas" />
                    <Picker.Item label="Otro" value="otro" />
                </Picker>
            </View>

            <Text style={{
                fontSize: 25,
                fontFamily: 'GothamRoundedMedium',
                textAlign: 'center',
                color: 'gray',
                marginVertical: 15,
                display: (listaTareas.length > 0 ? 'none' : 'flex')
            }}>No hay eventos</Text>


            <FlatList
                data={listaTareas}
                renderItem={renderItem}
                keyExtractor={(item) => item?._id}
            />
            <ButtonBar navigation={navigation} />
        </View>
    );
}

const styles = StyleSheet.create({
    form: {

    },
    letrasRecortadorios: {
        color: 'rgb(141, 128, 141)',
        fontSize: 16,
        fontFamily: 'GothamRoundedMedium',
    },
    logoHeader: {
        resizeMode: 'center',
        width: 160,
        height: 40,
        // centro de manera horizontal la imagen
        alignSelf: 'center',
    },
    buttonFormText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: "GothamRoundedMedium",
    },
    buttonForm: {
        marginVertical: 20,
        backgroundColor: '#7BC100',
        width: '40%',
        marginHorizontal: '1%',
        height: 50,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        // lo alineo a la derecha
        alignSelf: 'flex-end',
    },
    titleForm: {
        backgroundColor: '#c5f46e71',
        fontSize: 18,
        fontFamily: "GothamRoundedBold",
        paddingLeft: 20,
        paddingVertical: 10,
        paddingBottom: 20,
        marginTop: 10,
    },
    title: {
        marginTop: 8,
        fontSize: 20,
        // hago que la fuente sea gothan rounded
        fontFamily: 'GothamRoundedBold',
        // establezo el line-height en 24px
        lineHeight: 24,
        // centro el texto
        textAlign: 'left',
        // aplico bold al texto
    },
    container: {
        flex: 1,
        padding: 12,
        // padding top en 24px
        paddingTop: 24,
        backgroundColor: '#fff',
    },
    inputContainer: {
        marginBottom: 10,
    },
    label: {
        color: '#00000080',
        marginBottom: 5,
        fontSize: 14,
        fontFamily: "GothamRoundedMedium",
        marginTop: 5,
    },
    input: {
        width: '100%',
        height: 40,
        color: '#959595',
        borderColor: '#C3C3C3',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        fontSize: 14,
        fontFamily: "GothamRoundedMedium"
    },
    passwordInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#C3C3C3',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
    },
    userInput: {
        flex: 1,
        height: 40,
        color: '#C3C3C3',
        fontSize: 16,
        fontFamily: "GothamRoundedMedium"
        // cambio el color del placeholder de este textInput a #C3C3C3

    },
    passwordToggleIcon: {
        padding: 10,
    },
    buttonFooter: {
        width: '100%',
        height: 50,
        backgroundColor: '#A0B875',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: "GothamRoundedMedium"
    },
    footerText: {
        // centro el texto
        textAlign: 'center',
        // pongo color de texto #000000;
        color: '#7BC100',
        marginTop: 10,
        fontSize: 16,
        marginBottom: 20,
    },
    profileImg: {
        width: 115,
        height: 115,
        resizeMode: "cover",
        alignSelf: 'center',
        borderRadius: 75,
        borderWidth: 2,
        marginTop: 20,
        marginBottom: 10,
    },
});