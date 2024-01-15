import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Button, Image, ScrollView, Linking, Dimensions  } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import logo from '../assets/on-modo-grande.png';
import ButtonBar from '../components/ButtonBar';
// importo useSelector, useDispatch
import { useSelector, useDispatch } from 'react-redux';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import Header from '../components/Header';
import Buscador from '../components/Buscador';
import { API_URL } from '../functions/globalFunctions';
// traigo FontAwesome
import { FontAwesome } from '@expo/vector-icons';
// importo lo necesario para react native chart kit
import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart
} from "react-native-chart-kit";


export default function Estadisticas({ navigation }) {
    const screenWidth = Dimensions.get("window").width;
    let cajaTextoHeader = [
        { title: "| Estadísticas", style: "title" },
        { title: "Panel de Estadísticas", style: "title" }
    ];

    return (
        <View style={styles.container}>
            <View>
                <Header cajaText={cajaTextoHeader} />
            </View>

            <View>
                <Text>Bezier Line Chart</Text>
                <LineChart
                    data={{
                        labels: ["January", "February", "March", "April", "May", "June"],
                        datasets: [
                            {
                                data: [
                                    Math.random() * 100,
                                    Math.random() * 100,
                                    Math.random() * 100,
                                    Math.random() * 100,
                                    Math.random() * 100,
                                    Math.random() * 100
                                ]
                            }
                        ]
                    }}
                    width={Dimensions.get("window").width} // from react-native
                    height={220}
                    yAxisLabel="$"
                    yAxisSuffix="k"
                    yAxisInterval={1} // optional, defaults to 1
                    chartConfig={{
                        backgroundColor: "#e26a00",
                        backgroundGradientFrom: "#fb8c00",
                        backgroundGradientTo: "#ffa726",
                        decimalPlaces: 2, // optional, defaults to 2dp
                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        style: {
                            borderRadius: 16
                        },
                        propsForDots: {
                            r: "6",
                            strokeWidth: "2",
                            stroke: "#ffa726"
                        }
                    }}
                    bezier
                    style={{
                        marginVertical: 8,
                        borderRadius: 16
                    }}
                />
            </View>

            {/* <ScrollView>
                <View style={[styles.titleForm, {
                    // que sea en horizontal
                    flexDirection: 'row',
                    // que se esten lo mas opuestos uno de otro
                    justifyContent: 'space-between',
                }]}>
                    <Text style={{
                        fontSize: 18,
                        fontFamily: "GothamRoundedBold",
                        width: "70%",
                        // que el texto salte de linea si es muy largo
                        flexWrap: 'wrap',
                    }}>Personal</Text>
                </View>

                <View style={[styles.titleForm, {
                    // que sea en horizontal
                    flexDirection: 'row',
                    // que se esten lo mas opuestos uno de otro
                    justifyContent: 'space-between',
                }]}>
                    <Text style={{
                        fontSize: 18,
                        fontFamily: "GothamRoundedBold",
                        width: "70%",
                        // que el texto salte de linea si es muy largo
                        flexWrap: 'wrap',
                    }}>Distribución geográfica</Text>
                </View>

                <View style={[styles.titleForm, {
                    // que sea en horizontal
                    flexDirection: 'row',
                    // que se esten lo mas opuestos uno de otro
                    justifyContent: 'space-between',
                }]}>
                    <Text style={{
                        fontSize: 18,
                        fontFamily: "GothamRoundedBold",
                        width: "70%",
                        // que el texto salte de linea si es muy largo
                        flexWrap: 'wrap',
                    }}>Formularios</Text>
                </View>

                <View style={[styles.titleForm, {
                    // que sea en horizontal
                    flexDirection: 'row',
                    // que se esten lo mas opuestos uno de otro
                    justifyContent: 'space-between',
                }]}>
                    <Text style={{
                        fontSize: 18,
                        fontFamily: "GothamRoundedBold",
                        width: "70%",
                        // que el texto salte de linea si es muy largo
                        flexWrap: 'wrap',
                    }}>Uso de Formularios en el tiempo</Text>
                </View>

                <View style={[styles.titleForm, {
                    // que sea en horizontal
                    flexDirection: 'row',
                    // que se esten lo mas opuestos uno de otro
                    justifyContent: 'space-between',
                }]}>
                    <Text style={{
                        fontSize: 18,
                        fontFamily: "GothamRoundedBold",
                        width: "70%",
                        // que el texto salte de linea si es muy largo
                        flexWrap: 'wrap',
                    }}>Solicitudes de Edición</Text>
                </View>

            </ScrollView> */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 12,
        paddingTop: 16,
        backgroundColor: '#fff',
        flexDirection: 'column',
        justifyContent: 'space-between'
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
    headerTextContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    logoHeader: {
        resizeMode: 'center',
        width: 160,
        height: 40,
        // centro de manera horizontal la imagen
        alignSelf: 'center',
    },
    containerBox: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: "100%",
        paddingBottom: 10,

        // justifyContent: 'space-around',
        // marginTop: 20,
    },
    box: {
        // width: 150,
        width: "45%",
        marginHorizontal: "2.5%",
        height: 100,
        borderRadius: 10,
        marginTop: 15,
        backgroundColor: '#E7E7E7',
        justifyContent: 'center',
        padding: 5,
    },
    boxTitle: {
        textAlign: 'center',
        justifyContent: 'center',
        fontFamily: "GothamRoundedMedium",
        fontSize: 12,

    },
    title: {
        fontSize: 24,
        paddingLeft: 16,
        paddingRight: 16,
        marginTop: 30,
        fontSize: 20,
        textAlign: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        fontFamily: "GothamRoundedBold"
    },
    titleRol: {
        fontSize: 24,
        paddingLeft: 16,
        paddingRight: 16,
        marginTop: 30,
        fontSize: 20,
        textAlign: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        fontFamily: "GothamRoundedMedium"
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
        fontFamily: "GothamRoundedMedium",
        flex: 1,
        height: 40,
        color: '#C3C3C3',
        fontSize: 14,
    },
    searchIcon: {
        padding: 15,
    },

});