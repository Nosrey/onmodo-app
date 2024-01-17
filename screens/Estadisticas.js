import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Button, Image, ScrollView, Linking, Dimensions, FlatList } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import logo from '../assets/on-modo-grande.png';
import ButtonBar from '../components/ButtonBar';
// importo useSelector, useDispatch
import { useSelector, useDispatch } from 'react-redux';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import Header from '../components/Header';
import Buscador from '../components/Buscador';
import { API_URL, getTitle } from '../functions/globalFunctions';
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
    // traigo businessName de redux
    const business = useSelector(state => state.business);

    const [totalUsuarios, setTotalUsuarios] = useState(0);
    // const [usuariosPorRol, setUsuariosPorRol] = useState([0, 0, 0]);
    const [usuariosPorRol, setUsuariosPorRol] = useState([{
        name: "- Nivel 1",
        population: 0,
        color: "#20c997",
        legendFontColor: "#7F7F7F",
        legendFontSize: 15
    },
    {
        name: "- Nivel 2",
        population: 0,
        color: "#0da1f0",
        legendFontColor: "#7F7F7F",
        legendFontSize: 15
    },
    {
        name: "- Nivel 3",
        population: 0,
        color: "#6f42c1",
        legendFontColor: "#7F7F7F",
        legendFontSize: 15
    },
    {
        name: "- Nivel 4",
        population: 0,
        color: "#ffc107",
        legendFontColor: "#7F7F7F",
        legendFontSize: 15
    }
    ]);
    const [distribucionGeo, setDistribucionGeo] = useState([]);
    const [filtroDistribucionGeo, setFiltroDistribucionGeo] = useState('Cantidad de Personas');

    const [totalFormularios, setTotalFormularios] = useState(0);
    const [top3Formularios, setTop3Formularios] = useState([]);

    useEffect(() => {
        // fetch a http://192.168.1.107:8080/api/statsusers/test but instead of this IP you need to put your IP from API_URL
        fetch(API_URL + '/api/statsusers/' + business)
            .then((response) => response.json())
            .then((json) => {
                setTotalUsuarios(json.response.totalUsers);
                setDistribucionGeo(json.response.provinciaCounts);
                setTotalFormularios(json.response.totalFormularios);
                setTop3Formularios(json.response.top3Forms);
            })
            .catch((error) => {
                console.error(error);
            });

        fetch(API_URL + '/api/rol1-2-3/' + business)
            .then((response) => response.json())
            .then((json) => {
                let totalRol1 = 0;
                let totalRol2 = 0;
                let totalRol3 = 0;
                let totalRol4 = 0;
                // recorro el array que es json
                for (let i = 0; i < json.length; i++) {
                    if (json[i].rol === 1) {
                        totalRol1 = totalRol1 + 1;
                    } else if (json[i].rol === 2) {
                        totalRol2 = totalRol2 + 1;
                    }
                    else if (json[i].rol === 3) {
                        totalRol3 = totalRol3 + 1;
                    } else {
                        totalRol4 = totalRol4 + 1;
                    }
                }
                let usuariosPorRolCopy = JSON.parse(JSON.stringify(usuariosPorRol));
                setUsuariosPorRol(
                    [
                        {
                            ...usuariosPorRolCopy[0],
                            population: totalRol1
                        },
                        {
                            ...usuariosPorRolCopy[1],
                            population: totalRol2
                        },
                        {
                            ...usuariosPorRolCopy[2],
                            population: totalRol3
                        },
                        {
                            ...usuariosPorRolCopy[3],
                            population: totalRol4
                        },
                    ]
                )
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    const screenWidth = Dimensions.get("window").width;
    let cajaTextoHeader = [
        { title: "| Estadísticas", style: "title" },
        { title: "Panel de Estadísticas", style: "title" }
    ];

    const data = [
        {
            name: "Seoul",
            population: 21500000,
            color: "rgba(131, 167, 234, 1)",
            legendFontColor: "#7F7F7F",
            legendFontSize: 15
        },
        {
            name: "Toronto",
            population: 2800000,
            color: "#F00",
            legendFontColor: "#7F7F7F",
            legendFontSize: 15
        },
        {
            name: "Beijing",
            population: 527612,
            color: "red",
            legendFontColor: "#7F7F7F",
            legendFontSize: 15
        },
        {
            name: "New York",
            population: 8538000,
            color: "#ffffff",
            legendFontColor: "#7F7F7F",
            legendFontSize: 15
        },
        {
            name: "Moscow",
            population: 11920000,
            color: "rgb(0, 0, 255)",
            legendFontColor: "#7F7F7F",
            legendFontSize: 15
        }
    ];

    const chartConfig = {
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
    }

    return (
        <View style={[styles.container]}>
            <View>
                <Header cajaText={cajaTextoHeader} />
            </View>
            {/* <TouchableOpacity onPress={() => console.log('usuariosPorRol', usuariosPorRol)}>
                <Text>usuariosPorRol</Text>
            </TouchableOpacity> */}
            <ScrollView>
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
                <View style={styles.reglon}>
                    <View style={[styles.bloqueData]}>
                        <Text style={{ fontFamily: "GothamRoundedMedium" }}>Cantidad Total</Text>
                        <Text style={{ fontFamily: "GothamRoundedMedium" }}>{totalUsuarios}</Text>
                    </View>
                    <View style={{ padding: 10, width: screenWidth * 0.7 }}>
                        <Text style={{ fontFamily: "GothamRoundedMedium" }}>Distribución por niveles</Text>
                        <PieChart
                            data={usuariosPorRol}
                            width={screenWidth * 0.6}
                            height={220}
                            chartConfig={chartConfig}
                            accessor={"population"}
                            backgroundColor={"transparent"}
                            paddingLeft={"15"}
                            // center={[10, 50]}
                            absolute
                        />
                    </View>

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
                <View style={{ width: screenWidth * 0.5, alignSelf: 'flex-end', borderWidth: 1, borderColor: 'black', borderRadius: 10, marginVertical: 10 }}>
                    <Picker
                        selectedValue={filtroDistribucionGeo}
                        onValueChange={(itemValue, itemIndex) => setFiltroDistribucionGeo(itemValue)}
                        style={{ fontFamily: "GothamRoundedMedium" }}
                    >
                        <Picker.Item label="Cantidad de Personas" value="Cantidad de Personas" />
                        <Picker.Item label="Cantidad de Formularios" value="Cantidad de Formularios" />
                    </Picker>
                </View>
                <View style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    {distribucionGeo
                    .sort((a, b) => (filtroDistribucionGeo === 'Cantidad de Personas' ? b.usersCount - a.usersCount : b.formulariosCount - a.formulariosCount))
                    ?.map((item, index) => (
                        <View style={[styles.bloqueData, { width: screenWidth * 0.3 }]} key={index}>
                            <Text style={{ fontFamily: "GothamRoundedMedium", fontSize: 12 }}>{item?.provincia}</Text>
                            <View style={{ flexDirection: 'column' }}>
                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',   
                                }}>
                                    <Text style={{
                                        fontFamily: "GothamRoundedBold",
                                    }}>{(filtroDistribucionGeo === 'Cantidad de Personas' ? item?.usersCount : item?.formulariosCount)}</Text>
                                </View>
                            </View>
                        </View>
                    ))}
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
                <View style={styles.reglon}>
                    <View style={[styles.bloqueData]}>
                        <Text style={{ fontFamily: "GothamRoundedMedium" }}>Cantidad Total</Text>
                        <Text style={{ fontFamily: "GothamRoundedMedium" }}>{totalFormularios}</Text>
                    </View>
                    <View style={{ padding: 10, width: screenWidth * 0.6, flexDirection: 'column', fontFamily: "GothamRoundedMedium" }}>
                        <View style={{ flexDirection: 'row', width: "100%" }}>
                            <Text style={[styles.redondo, { fontFamily: "GothamRoundedMedium" }]}>1</Text>
                            <Text style={{ marginLeft: 10, alignSelf: 'center', fontSize: 16, flexWrap: 'wrap', fontFamily: "GothamRoundedMedium" }}>{getTitle(top3Formularios[0])}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', width: "100%" }}>
                            <Text style={[styles.redondo, { fontFamily: "GothamRoundedMedium" }]}>2</Text>
                            <Text style={{ marginLeft: 10, alignSelf: 'center', fontFamily: "GothamRoundedMedium", fontSize: 16, flexWrap: 'wrap' }}>{getTitle(top3Formularios[1])}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', width: "100%" }}>
                            <Text style={[styles.redondo, { fontFamily: "GothamRoundedMedium" }]}>3</Text>
                            <Text style={{ marginLeft: 10, alignSelf: 'center', fontFamily: "GothamRoundedMedium", fontSize: 16, flexWrap: 'wrap' }}>{getTitle(top3Formularios[2])}</Text>
                        </View>
                    </View>

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

                <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                    <Text style={{ fontFamily: "GothamRoundedMedium", alignSelf: 'center', marginRight: 10, marginLeft: 10, fontSize: 18 }}>Ordenar por: </Text>
                    <View style={{ width: screenWidth * 0.5, alignSelf: 'flex-end', borderWidth: 1, borderColor: 'black', borderRadius: 10, marginVertical: 10, marginRight: 10 }}>
                        <Picker
                            selectedValue={'Control de Cloro Activo Residual'}
                        >
                            <Picker.Item label="Control de Cloro Activo Residual" value="Control de Cloro Activo Residuals" />
                            <Picker.Item label="Control de Equipos de Frio" value="Control de Equipos de Frio" />
                            <Picker.Item label="Control de Vidrios" value="Control de Vidrios" />
                            <Picker.Item label="Chequeo de uso de EPP" value="Chequeo de uso de EPP" />
                            <Picker.Item label="Planilla de Armado y Fraccionamiento" value="Planilla de Armado y Fraccionamiento" />
                            <Picker.Item label="Registro de Capacitación" value="Registro de Capacitación" />
                            <Picker.Item label="Planilla de Decomiso de Materias Primas" value="Planilla de Decomiso de Materias Primas" />
                            <Picker.Item label="Planilla de Carga / Recepción de Materias Primas" value="Planilla de Carga / Recepción de Materias Primas" />
                            <Picker.Item label="Control de Procesos" value="Control de Procesos" />
                            <Picker.Item label="Planilla de Descongelamiento" value="Planilla de Descongelamiento" />
                            <Picker.Item label="Despacho a Producción" value="Despacho a Producción" />
                            <Picker.Item label="Distribución / Expedición" value="Distribución / Expedición" />
                            <Picker.Item label="Planilla de Recepción" value="Planilla de Recepción" />
                            <Picker.Item label="Planilla de Sanitización" value="Planilla de Sanitización" />
                            <Picker.Item label="Servicios en línea" value="Servicios en línea" />
                            <Picker.Item label="Recuperación de Productos" value="Recuperación de Productos" />
                            <Picker.Item label="Uso y Cambio de Aceite en Freidora" value="Uso y Cambio de Aceite en Freidora" />
                            <Picker.Item label="Entrega de Bidones de Aceite Usado" value="Entrega de Bidones de Aceite Usado" />
                            <Picker.Item label="Rechazo / Devolución de Materias Primas" value="Rechazo / Devolución de Materias Primas" />
                            <Picker.Item label="Verificación Balanzas" value="Verificación Balanzas" />
                            <Picker.Item label="Verificación Termómetros" value="Verificación Termómetros" />
                            <Picker.Item label="Entrega de Ropa de Trabajo y EPP" value="Entrega de Ropa de Trabajo y EPP" />
                            <Picker.Item label="Control de Comensales con dietas especiales" value="Control de Comensales con dietas especiales" />
                            <Picker.Item label="Flash Reporte de Incidentes" value="Flash Reporte de Incidentes" />
                            <Picker.Item label="Informe interno de Accidente" value="Informe interno de Accidente" />
                            <Picker.Item label="Registro de Simulacro" value="Registro de Simulacro" />

                        </Picker>
                    </View>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                    <Text style={{ fontFamily: "GothamRoundedMedium", alignSelf: 'center', marginRight: 10, marginLeft: 10, fontSize: 18 }}>Mes: </Text>
                    <View style={{ width: screenWidth * 0.5, alignSelf: 'flex-end', borderWidth: 1, borderColor: 'black', borderRadius: 10, marginVertical: 10, marginRight: 10 }}>
                        <Picker
                            selectedValue={'Todo el año'}
                        >
                            <Picker.Item label="Todo el año" value="Todo el año" />
                            <Picker.Item label="Enero" value="Enero" />
                            <Picker.Item label="Febrero" value="Febrero" />
                            <Picker.Item label="Marzo" value="Marzo" />
                            <Picker.Item label="Abril" value="Abril" />
                            <Picker.Item label="Mayo" value="Mayo" />
                            <Picker.Item label="Junio" value="Junio" />
                            <Picker.Item label="Julio" value="Julio" />
                            <Picker.Item label="Agosto" value="Agosto" />
                            <Picker.Item label="Septiembre" value="Septiembre" />
                            <Picker.Item label="Octubre" value="Octubre" />
                            <Picker.Item label="Noviembre" value="Noviembre" />
                            <Picker.Item label="Diciembre" value="Diciembre" />
                        </Picker>
                    </View>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                    <Text style={{ fontFamily: "GothamRoundedMedium", alignSelf: 'center', marginRight: 10, marginLeft: 10, fontSize: 18 }}>Año: </Text>
                    <View style={{ width: screenWidth * 0.5, alignSelf: 'flex-end', borderWidth: 1, borderColor: 'black', borderRadius: 10, marginVertical: 10, marginRight: 10 }}>
                        <Picker
                            selectedValue={2024}
                        >
                            <Picker.Item label="2023" value={2023} />
                            <Picker.Item label="2024" value={2024} />
                        </Picker>
                    </View>
                </View>

                <View style={[styles.bloqueData, { padding: 20, alignSelf: 'center', marginTop: 20 }]}>
                    <Text style={{ fontFamily: "GothamRoundedMedium", fontSize: 24 }}>Cantidad Total</Text>
                    <Text style={{ fontFamily: "GothamRoundedMedium", fontSize: 24 }}>308</Text>
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

                <View style={{ flexDirection: 'column' }}>

                    <View style={{ padding: 10, width: screenWidth * 0.7 }}>
                        <Text style={{ fontFamily: "GothamRoundedMedium" }}>Distribución por niveles</Text>
                        <PieChart
                            data={data}
                            width={screenWidth}
                            height={220}
                            chartConfig={chartConfig}
                            accessor={"population"}
                            backgroundColor={"transparent"}
                            paddingLeft={"15"}
                            // center={[10, 50]}
                            absolute
                        />
                    </View>

                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', }}>
                        <View style={[styles.bloqueData, { width: screenWidth * 0.4 }]}>
                            <Text style={{ fontFamily: "GothamRoundedMedium" }}>Cantidad Total</Text>
                            <Text style={{ fontFamily: "GothamRoundedMedium" }}>118</Text>
                        </View>
                        <View style={[styles.bloqueData, { width: screenWidth * 0.4 }]}>
                            <Text style={{ fontFamily: "GothamRoundedMedium" }}>Cantidad Aprobados</Text>
                            <Text style={{ fontFamily: "GothamRoundedMedium" }}>72</Text>
                        </View>
                        <View style={[styles.bloqueData, { width: screenWidth * 0.4 }]}>
                            <Text style={{ fontFamily: "GothamRoundedMedium" }}>Cantidad Editados</Text>
                            <Text style={{ fontFamily: "GothamRoundedMedium" }}>15</Text>
                        </View>
                    </View>


                </View>

            </ScrollView>
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
    reglon: {
        flexDirection: 'row',
    },
    bloqueData: {
        borderWidth: 1,
        borderColor: '##363534',
        borderRadius: 5,
        padding: 10,
        // altura automatica, depende del contenido
        alignSelf: 'flex-start',
        // centrado horizontal y verticalmente
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
    },
    titleForm: {
        backgroundColor: '#c5f46e71',
        fontSize: 18,
        fontFamily: "GothamRoundedBold",
        paddingLeft: 20,
        paddingVertical: 5,
        paddingBottom: 10,
        marginTop: 40,
        marginBottom: 5,
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
    redondo: {
        fontSize: 20,
        color: "white",
        textAlign: "center",
        backgroundColor: "#6eac00",
        borderRadius: 50,
        fontFamily: "GothamRoundedBold",
        // hago un width y un height iguales para que sea un circulo y automaticos para el texto
        width: 30,
        height: 30,
        // centrado horizontal y verticalmente
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 5,
    },

});