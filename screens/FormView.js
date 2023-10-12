import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Header from '../components/Header';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { NavigationContext } from "@react-navigation/native";
import CrearServicio from '../components/CrearServicioView';
import BlackWindow from '../components/BlackWIndow';
import FormType1View from '../components/FormType1View';
import FormType2View from '../components/FormType2View';
import FormType3View from '../components/FormType3View';
import ButtonBar from '../components/ButtonBar';
import ConfirmScreen from '../components/ConfirmScreen';
import InfoScreen from '../components/InfoScreen';
import Notification from '../components/Notification';
import { formulariosData } from '../functions/globalFunctions';

export default function FormView({ navigation }) {
    // traigo del redux el state cardToCheck

    const [visibleForm, setVisibleForm] = useState([]); // visibleForm es un booleano que indica si se muestra o no el formulario de crear servicio
    const [viewDelete, setViewDelete] = useState(false);
    const [reglonPicked, setReglonPicked] = useState(null)
    const [indexPicked, setIndexPicked] = useState(null)
    const [editionMode, setEditionMode] = useState(false);
    const [viewInfo, setViewInfo] = useState(false);
    const [viewInfo2, setViewInfo2] = useState(false);
    const [viewCortinaNegra, setViewCortinaNegra] = useState(false);
    const [notif, setNotif] = useState({view: false, message: '', color: 'naranja'}); // notif es un booleano que indica si se muestra o no la notificacion de guardado exitoso
    const [inputsValuesFormType2, setInputsValuesFormType2] = useState([]); // [ {name: "nombre", value: "valor"}, {name: "apellido", value: "valor"} aca se guardan los valores de los inputs de todo el formulario

    const [reglones, setReglones] = useState([]); 

    const cardToCheck = useSelector((state) => state.cardToCheck);
    const objectToCheck = useSelector((state) => state.objectToCheck);
    const rol = useSelector((state) => state.rol);
    const formulario = formulariosData.find((form) => form.title === cardToCheck.title)

    useEffect(() => {
        let array = []
        for (let i = 0; i < formulario.inputs?.length; i++) {
            if (formulario.inputs[i].tipo === "row") {
                let item = objectToCheck.inputs?.find((input) => input.name === formulario.inputs[i].name)
                array[i] = []
                for (let j = 0; j < item?.value.length; j++) {
                    array[i].push({values: item?.value[j]})
                }
            }
        }
        setReglones(array)
        // console.log("array de reglones:", JSON.stringify(array))

    //     [null,null,null,null,null,null,null,null,null,[{"values":[{"name":"Fecha de Carga","value":""},{"name":"Fecha de Recepción","value":""},{"name":"Proveedor","value":""},{"name":"Producto","value":""},{"name":"Cantidad Comprada","value":""},{"name":"Cantidad Recibida","value":""},{"name":"T° de Carga","value":""},{"name":"T° de Recepcion","value":""},{"name":"T° de Carga","value":""},{"name":"T° de Recepcion","value":""},{"name":"Dentro de vida útil","value":""},{"name":"Nro. lote","value":""},{"name":"Fecha vto.","value":""},{"name":"Recibido","value":""},{"name":"Motivo del rechazo","value":""}]},{"values":[{"name":"Fecha de Carga","value":""},{"name":"Fecha de Recepción","value":""},{"name":"Proveedor","value":""},{"name":"Producto","value":""},{"name":"Cantidad Comprada","value":""},{"name":"Cantidad Recibida","value":""},{"name":"T° de Carga","value":""},{"name":"T° de Recepcion","value":""},{"name":"T° de Carga","value":""},{"name":"T° de Recepcion","value":""},{"name":"Dentro de vida útil","value":""},{"name":"Nro. lote","value":""},{"name":"Fecha vto.","value":""},{"name":"Recibido","value":""},{"name":"Motivo del rechazo","value":""}]}]]

    //     [
    //         [{"name":"Fecha de Carga","value":""},{"name":"Fecha de Recepción","value":""},{"name":"Proveedor","value":""},{"name":"Producto","value":""},{"name":"Cantidad Comprada","value":""},{"name":"Cantidad Recibida","value":""},{"name":"T° de Carga","value":""},{"name":"T° de Recepcion","value":""},{"name":"T° de Carga","value":""},{"name":"T° de Recepcion","value":""},{"name":"Dentro de vida útil","value":""},{"name":"Nro. lote","value":""},{"name":"Fecha vto.","value":""},{"name":"Recibido","value":""},{"name":"Motivo del rechazo","value":""}],[{"name":"Fecha de Carga","value":""},{"name":"Fecha de Recepción","value":""},{"name":"Proveedor","value":""},{"name":"Producto","value":""},{"name":"Cantidad Comprada","value":""},{"name":"Cantidad Recibida","value":""},{"name":"T° de Carga","value":""},{"name":"T° de Recepcion","value":""},{"name":"T° de Carga","value":""},{"name":"T° de Recepcion","value":""},{"name":"Dentro de vida útil","value":""},{"name":"Nro. lote","value":""},{"name":"Fecha vto.","value":""},{"name":"Recibido","value":""},{"name":"Motivo del rechazo","value":""}]
    //     ]

    //     {"_id":"652605c690091cdad581d830","respTermografo":[],"inputs":
    //     [{"name":"Estado sanitario:","value":"Cumple"},{"name":"Patente térmico","value":""},{"name":"Habilitación SENASA","value":""},{"name":"N° Precinto lateral","value":""},{"name":"N° Precinto trasero","value":""},{"name":"Termógrafo:","value":"SI"},{"name":"Resp. lectura termógrafo","value":""},{"name":"Observaciones","value":""},{"name":"Carga/ Recepción","value":

  

    // }],"status":"","rol":"2","nombre":"joaquin giorgis","businessName":"test","idUser":["64a0bc8a3de38bb95eb1717d"],"createdAt":"2023-10-11T02:17:42.867Z","updatedAt":"2023-10-11T02:17:42.867Z","__v":0} 

    }, [])

    useEffect(() => {
        navigation?.setOptions({
            title: cardToCheck.title,
        });
    }, []);

    // ubico en que formulario estoy

    // hago un useEffect donde al cambiar objectToCheck reviso si cardToCheck.formType es igual a 2, de ser asi establezco 

    function deteleReglon() {
        let array = [...reglones];
        array[indexPicked].splice(reglonPicked, 1)
        // actualizo el array de reglones
        setReglones(array)
    }

    let cajaText = [{

    }]

    let paramsDelete = {
        title: '¿Desea eliminar este elemento?',
        message: 'Si así lo decides, se eliminará de manera permanante y no lo podrás recuperar.',
        viewWindow: viewDelete,
        setViewWindow: setViewDelete,
        action: deteleReglon,
        data: reglonPicked,
        data2: indexPicked,
        botonNo: "Cancelar",
        botonYes: "Eliminar",
    }

    let paramsInfo = {
        mensajes: cardToCheck.verMas,
        viewWindow: viewInfo,
        setViewWindow: setViewInfo,
        action: '',
        data: '',
        botonNo: "Cancelar",
        botonYes: "Eliminar",
    }

    // let paramsInfo2 = {
    //     title1: 'Instrucciones',
    //     message1: 'Tildar las actividades realizadas diariamente.',
    //     message1p2: '',
    //     title2: 'Precauciones',
    //     message2: 'No sobrecalentar las grasas y aceites por encima de los 180 °C.', 
    //     message2p2: 'Filtrar las grasas y aceites luego de su uso.', 
    //     message2p3: 'Verificar la calidad de las grasas y aceites en forma regular.',
    //     message2p4: 'Desechar las grasas y aceites con cambios evidentes de color, olor y sabor.',
    //     message2p5: 'No utilizar el aceite más de 5 veces (el Registro permite llevar cuenta del uso de la freidora).',
    //     viewWindow: viewInfo2,
    //     setViewWindow: setViewInfo2,
    //     action: '',
    //     data: '',
    //     botonNo: "Cancelar",
    //     botonYes: "Eliminar",
    // }


    return (
        <View style={styles.container}>
            <Notification params={notif} notif={notif} setNotif={setNotif}/>
            <Header cajaText={cajaText} unElemento={true} />
            <BlackWindow visible={viewDelete} setVisible={setViewDelete} />
            <ConfirmScreen navigation={navigation} params={paramsDelete}/>

            <BlackWindow visible={viewInfo} setVisible={setViewInfo} />
            <InfoScreen navigation={navigation} params={paramsInfo} msg/>        

            <BlackWindow visible={viewCortinaNegra} setVisible={() => {
                setEditionMode(false)
            }} />



            {cardToCheck.inputs?.map((input, index) => {
                if (input.tipo === "row") {
                    return (
                        <CrearServicio key={index} params={{
                            index: index,
                            indexPicked: indexPicked,
                            visible: visibleForm,
                            setVisible: setVisibleForm,
                            cortina: viewCortinaNegra,
                            setCortina: setViewCortinaNegra,
                            setReglones: setReglones,
                            reglones: reglones,
                            editionMode: editionMode,
                            setEditionMode: setEditionMode,
                            reglonPicked: reglonPicked,
                        }} />
                    )
                }
            })
            }                  

            <ScrollView>
                <Text style={styles.titleForm}>{cardToCheck.title}</Text>
                {cardToCheck.formType === 1 ? (
                    <FormType1View navigation={navigation} setNotif={setNotif}/>
                ) : cardToCheck.formType === 2 ? (
                    <FormType2View setCortina={setViewCortinaNegra} cortina={viewCortinaNegra} indexPicked={indexPicked} setIndexPicked={setIndexPicked} setNotif={setNotif} navigation={navigation} visibleForm={visibleForm} setVisibleForm={setVisibleForm} reglones={reglones} setReglones={setReglones} setViewDelete={setViewDelete} reglonPicked={reglonPicked} setReglonPicked={setReglonPicked} editionMode={editionMode} setEditionMode={setEditionMode}  viewInfo={viewInfo} setViewInfo={setViewInfo} inputsValues={inputsValuesFormType2} setInputsValues={setInputsValuesFormType2}/>
                ) : null}
                {cardToCheck.formType === 3 ? (
                    <FormType3View setNotif={setNotif} navigation={navigation} setViewInfo={setViewInfo}/>
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