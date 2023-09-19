import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Header from '../components/Header';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { NavigationContext } from "@react-navigation/native";
import CrearServicio from '../components/CrearServicio';
import BlackWindow from '../components/BlackWIndow';
import FormType1 from '../components/FormType1';
import FormType2 from '../components/FormType2';
import FormType3 from '../components/FormType3';
import ButtonBar from '../components/ButtonBar';
import ConfirmScreen from '../components/ConfirmScreen';
import InfoScreen from '../components/InfoScreen';

export default function FormCreate({ navigation }) {
    // traigo del redux el state cardToCheck

    const [visibleForm, setVisibleForm] = useState(false); // visibleForm es un booleano que indica si se muestra o no el formulario de crear servicio
    const [viewDelete, setViewDelete] = useState(false);
    const [reglonPicked, setReglonPicked] = useState(null)
    const [editionMode, setEditionMode] = useState(false);
    const [viewInfo, setViewInfo] = useState(false);
    const [viewInfo2, setViewInfo2] = useState(false);

    const [reglones, setReglones] = useState([]); 

    const cardToCheck = useSelector((state) => state.cardToCheck);
    const rol = useSelector((state) => state.rol);

    useEffect(() => {
        navigation?.setOptions({
            title: cardToCheck.title,
        });
    }, []);

    function deteleReglon() {
        let array = [...reglones];
        array.splice(reglonPicked, 1)
        // actualizo el array de reglones
        setReglones(array)
    }

    let cajaText = [{

    }]

    let params = {
        visible: visibleForm,
        setVisible: setVisibleForm,
        setReglones: setReglones,
        reglones: reglones,
        editionMode: editionMode,
        setEditionMode: setEditionMode,
        reglonPicked: reglonPicked,
    }

    let paramsDelete = {
        title: '¿Desea eliminar este elemento?',
        message: 'Si así lo decides, se eliminará de manera permanante y no lo podrás recuperar.',
        viewWindow: viewDelete,
        setViewWindow: setViewDelete,
        action: deteleReglon,
        data: reglonPicked,
        botonNo: "Cancelar",
        botonYes: "Eliminar",
    }

    let paramsInfo = {
        title1: 'SERVICIO LÍNEA CALIENTE',
        message1: 'Las preparaciones calientes deben mantenerse a temperaturas mayores a 65ºC, por un tiempo máximo de 2 horas.',
        message1p2: 'Los productos sobrantes deberán ser eliminados si fueron presentados en la línea.',
        title2: 'SERVICIO LÍNEA FRIA',
        message2: 'Las preparaciones servidas en frio, entradas, postres y ensaladas deben mantenerse a temperaturas inferiores a 10ºCpor un máximo de 2 horas.', 
        message2p2: 'Los productos sobrantes deberán ser eliminados si fueron presentados en la línea.', 
        message2p3: 'Contratos certificados con IRAM BPM: mantener a menos de 4ºC.',
        viewWindow: viewInfo,
        setViewWindow: setViewInfo,
        action: '',
        data: '',
        botonNo: "Cancelar",
        botonYes: "Eliminar",
    }

    let paramsInfo2 = {
        title1: 'Instrucciones',
        message1: 'Tildar las actividades realizadas diariamente.',
        message1p2: '',
        title2: 'Precauciones',
        message2: 'No sobrecalentar las grasas y aceites por encima de los 180 °C.', 
        message2p2: 'Filtrar las grasas y aceites luego de su uso.', 
        message2p3: 'Verificar la calidad de las grasas y aceites en forma regular.',
        message2p4: 'Desechar las grasas y aceites con cambios evidentes de color, olor y sabor.',
        message2p5: 'No utilizar el aceite más de 5 veces (el Registro permite llevar cuenta del uso de la freidora).',
        viewWindow: viewInfo2,
        setViewWindow: setViewInfo2,
        action: '',
        data: '',
        botonNo: "Cancelar",
        botonYes: "Eliminar",
    }


    return (
        <View style={styles.container}>
            <Header cajaText={cajaText} unElemento={true} />
            <BlackWindow visible={viewDelete} setVisible={setViewDelete} />
            <ConfirmScreen navigation={navigation} params={paramsDelete}/>

            <BlackWindow visible={viewInfo} setVisible={setViewInfo} />
            <InfoScreen navigation={navigation} params={paramsInfo}/> 

            <BlackWindow visible={viewInfo2} setVisible={setViewInfo2} />
            <InfoScreen navigation={navigation} params={paramsInfo2}/>        

            {cardToCheck.formType === 2 ? (
                <BlackWindow visible={visibleForm} setVisible={() => {setVisibleForm(false); setEditionMode(false)}} />
            ) : null}
            {cardToCheck.formType === 2 ? (
                <CrearServicio params={params} />
            ) : null}
            <ScrollView>
                <Text style={styles.titleForm}>{cardToCheck.title}</Text>
                {cardToCheck.formType === 1 ? (
                    <FormType1 />
                ) : cardToCheck.formType === 2 ? (
                    <FormType2 visibleForm={visibleForm} setVisibleForm={setVisibleForm} reglones={reglones} setReglones={setReglones} setViewDelete={setViewDelete} reglonPicked={reglonPicked} setReglonPicked={setReglonPicked} editionMode={editionMode} setEditionMode={setEditionMode}  viewInfo={viewInfo} setViewInfo={setViewInfo}/>
                ) : null}
                {cardToCheck.formType === 3 ? (
                    <FormType3 setViewInfo={setViewInfo2}/>
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