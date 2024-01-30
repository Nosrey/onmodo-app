// creo un nuevo componente
import React, { useState, useEffect } from 'react';
// importo de react native el view, text, image, stylesheets, touchableOpacity
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Image, Keyboard, ScrollView } from 'react-native';
import Header from '../components/Header';
import { Picker } from '@react-native-picker/picker';
import BlackWindow from '../components/BlackWIndow';
import CrearRecordatorio from '../components/CrearRecordatorio';
import CambiarFrecuencia from '../components/CambiarFrecuencia';
// useSelector
import { useSelector, useDispatch } from 'react-redux';
import ButtonBar from '../components/ButtonBar';
import { API_URL } from '../functions/globalFunctions';

export default function Recordatorios({ navigation }) {
    const dispatch = useDispatch();

    const rol = useSelector(state => state.rol);
    const business = useSelector(state => state.business);
    const [status, setStatus] = useState('En curso');
    const [tareas, setTareas] = useState('Todas');
    const [blackWindow, setBlackWindow] = useState(false);
    const [blackScreen, setBlackScreen] = useState(false);
    const [frecuenciaModal, setFrecuenciaModal] = useState(false);
    const [recordatorioId, setRecordatorioId] = useState('');

    const [tarea, setTarea] = useState(' ');
    const [descripcion, setDescripcion] = useState('');
    const [link, setLink] = useState('');
    const [linkTitle, setLinkTitle] = useState('');
    const [statusRecordatorio, setStatusRecordatorio] = useState(' ');
    const [frecuencia, setFrecuencia] = useState(' ');
    const [fechaInicio, setFechaInicio] = useState('');
    const [update, setUpdate] = useState(false);
    
    const [listaTareas, setListaTareas] = useState([])
    const [listaTareasFiltradas, setListaTareasFiltradas] = useState([])
    const [listaRecordatorios, setListaRecordatorios] = useState([])

    const arrayTareas = [
        { value: 'Vencimiento de Limpieza de Tanques.'},
        { value: 'Vencimiento de Limpieza de Cámaras Graseras.'},
        { value: 'Vencimiento de Libretas Sanitarias.'},
        { value: 'Vencimiento de Cursos de Manipulador.'},
        { value: 'Vencimiento de Matriz IPER.'},
        { value: 'Vencimientos de Análisis de Agua Fisicoquímicos.'},
        { value: 'Vencimientos de Análisis de Agua Bacteriológicos.'},
        { value: 'Vencimiento de Extintores.'},
        { value: 'Vencimiento de Medición de Puesta a Tierra.'},
        { value: 'Vencimiento de Evaluaciones Ergonómicos por Puesto.'},
        { value: 'Vencimiento de Medición de Ruido.'},
        { value: 'Vencimiento de Medición de Carga Térmica.'},
        { value: 'Vencimiento de Medición de Iluminación.'},
        { value: 'Vencimiento de Estudio de Carga de Fuego.'},
        { value: 'Vencimiento de Fumigación.'},
    ]

    let cajaText = [
        { title: '| Mi cuenta', style: "titleProfile" },
    ]

    function crearRecordatorio() {
        let lista = [...listaTareas];
        setBlackWindow(true);
    }

    const handleClose = () => {
        setTarea(' ');
        setDescripcion('');
        setLink('');
        setLinkTitle('');
        setStatusRecordatorio(' ');
        setFrecuencia(' ');
        setFechaInicio('');
        setBlackWindow(false)
    }

    function handleCloseFrecuencia() {
        setFrecuenciaModal(false)
        setTarea(' ');
        setDescripcion('');
        setLink('');
        setLinkTitle('');
        setStatusRecordatorio(' ');
        setFrecuencia(' ');
        setFechaInicio('');
    }

    function deleteRecordatorio(idRecordatorio) {
        setBlackScreen(true)
        url = API_URL + '/api/recordatorio/' + idRecordatorio;
        fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((json) => {
                setUpdate(true);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    function colorStatus(item) {
        if (item?.realizado === true || item?.realizado === null)
            return '#9bc568';
        else if (item?.realizado === false)
            switch (item.status) {
                case 'pendiente':
                    return '#ffb600';
                case 'invalido':
                    return '#e81212';
                default:
                    return '#9bc568';
            }
    }

    const FrecuenciaToDias = {
        Mensual: 7,
        Bimestral: 7,
        Trimestral: 30,
        Semestral: 30,
        Anual: 60,
        'Cada 2 años': 60,
    };

    const parseFecha = (fechaString) => {
        const parts = fechaString.split('/');
        if (parts?.length === 3) {
            const dia = parseInt(parts[0], 10);
            const mes = parseInt(parts[1], 10);
            const año = parseInt(parts[2], 10);
            if (!isNaN(dia) && !isNaN(mes) && !isNaN(año)) {
                return new Date(año, mes - 1, dia); // Resta 1 al mes, ya que los meses en JavaScript van de 0 a 11.
            }
        }
        return null;
    };

    const evaluarFechaYFrecuencia = (fechaString, frecuencia) => {
        const fechaActual = new Date();
        const fechaLimite = parseFecha(fechaString);

        // Comprueba si la fecha ya pasó
        if (fechaLimite === null) {
            return 'verde'
        }
        else if (fechaActual > fechaLimite) {
            return 'invalido';
        }

        // Comprueba si la fecha está próxima según la frecuencia
        const umbralDias = FrecuenciaToDias[frecuencia];
        // creo una nueva fecha en let fechaUmbral que es igual a fechaLimite menos los dias de umbralDias
        let fechaUmbral = new Date(fechaLimite);
        fechaUmbral.setDate(fechaUmbral.getDate() - umbralDias);

        if (fechaActual > fechaLimite) {
            return 'invalido';
        } else if (fechaActual > fechaUmbral && fechaActual < fechaLimite) { 
            return 'pendiente';
        } else {
            return 'verde';
        }

        return 'verde ';
    };

    function sacarProxFecha(fechaDefault, fechas) {
        if (!fechas?.length) {

            if (fechaDefault === undefined) return 'Sin Fecha';
            // paso la fecha de formato string a formato 2023-11-17T20:36:42.088Z a 11/17/2023
            let fecha = fechaDefault.split('T')[0].split('-');
            fecha = fecha[1] + '/' + fecha[2] + '/' + fecha[0];
            if (fechaDefault === undefined || !fechaDefault) return 'Sin Fecha';
            else return fecha;
        } else {
            // obtnego la fecha mas proxima con la propiedad ejecutado en false
            let proxFecha = fechas.find((fecha) => fecha.ejecutado === false);
            if (!proxFecha) {
                return 'Sin Fecha';
            } else {
                // paso la fecha de formato string a formato 2023-11-17T20:36:42.088Z a 11/17/2023
                return proxFecha?.fecha
            }

        }
    }

    function obtenerResuelto() {

    }


    useEffect(() => {
        // hago un fetch GET a la url de la api + /api/recordatorio/${business}
        let url = API_URL + '/api/recordatorio/' + business;
        fetch(url)
            // convierto la respuesta a json
            .then((response) => response.json())
            // seteo el estado de listaTareas con la respuesta
            .then((json) => {
                setListaRecordatorios(json.recordatorios);
                let array = []
                for (let i = 0; i < json.recordatorios?.length; i++) {
                    let item = json.recordatorios[i];
                    // dentro de item.fechas es un array, busco el que tenga la fecha mas proxima sin estar en true el valor ejecutado

                    let proxFecha = item?.fechas.find((fecha) => fecha.ejecutado === false);
                    if (!proxFecha) {
                        proxFecha = {
                            fecha: ''
                        }
                    }

                    function gestionarFechas(item) {
                        if (!item.fechas?.length && !item.fechaInicio) {
                            let fecha = item.createdAt.split('T')[0].split('-');
                            fecha = fecha[2] + '/' + fecha[1] + '/' + fecha[0];                            
                            return fecha
                        } else if (!item.fechas?.length && item.fechaInicio) {                            
                            return item.fechaInicio
                        } else {
                            // obtnego la fecha mas proxima con la propiedad ejecutado en false
                            let proxFecha = item.fechas.find((fecha) => fecha.ejecutado === false);
                            if (!proxFecha && !item.fechaInicio) {
                                let fecha = item.createdAt.split('T')[0].split('-');
                                fecha = fecha[2] + '/' + fecha[1] + '/' + fecha[0];
                                return fecha
                            } else if (!proxFecha && item.fechaInicio) {
                                return item.fechaInicio
                            } else {
                                // paso la fecha de formato string a formato 2023-11-17T20:36:42.088Z a 11/17/2023                                
                                return proxFecha?.fecha
                            }
                        }
                    }

                    function gestionarRealizado(item, fecha) {
                        // reviso si tiene length en fechas
                        if (!item.fechas?.length) {
                            return null
                        } else {
                            // en base a fecha, ubico dentro de item.fechas el elemento que tenga esa fecha
                            let index = item.fechas.findIndex((fechaItem) => fechaItem.fecha === fecha);
                            // si no lo encuentra, retorno null
                            if (index === -1) {
                                return null
                            } else {
                                // si lo encuentra, retorno el valor de ejecutado
                                return item.fechas[index].ejecutado
                            }
                        }
                    }

                    function obtenerFecha(item) {
                        if (item?.fechas?.length) {
                            // retorno el primer elemento de item.fechas[i] cuyo valor .ejecutado sea true
                            let index = item.fechas.findIndex((fecha) => fecha.ejecutado === true);
                            if (index === -1) {
                                return null
                            } else {
                                // recorro item.fechas y compruebo si tiene una estructura asi 2023-12-27 y si es el caso la retorno en formato 27/12/2023
                                let fecha = item.fechas[index].fecha.split('-');
                                if (fecha?.length === 3) {
                                    fecha = fecha[2] + '/' + fecha[1] + '/' + fecha[0];
                                    return fecha
                                } else {
                                    return item.fechas[index].fecha
                                }
                            }
                        } else if (item?.fechaInicio) {
                            console.log('entre a elif')
                            // recorro item.fechaInicio y compruebo si tiene una estructura asi 2023-12-27 y si es el caso la retorno en formato 27/12/2023
                            let fecha = item.fechaInicio.split('-');
                            if (fecha?.length === 3) {
                                fecha = fecha[2] + '/' + fecha[1] + '/' + fecha[0];
                                return fecha
                            } else {
                                return item?.fechaInicio
                            }

                        } else {
                            // "createdAt": "2023-12-27T00:07:20.742Z",
                            let fecha = item.createdAt.split('T')[0].split('-');
                            fecha = fecha[2] + '/' + fecha[1] + '/' + fecha[0];
                            return fecha
                        }
                    }

                    let itemFinal = {}

                    if (item?.status !== 'En curso') {
                        itemFinal = {
                            _id: item._id,
                            // status: evaluarFechaYFrecuencia(proxFecha?.fecha, item.frecuencia),
                            status: "verde",
                            tarea: item.tarea,
                            descripcion: item.descripcion,
                            link: item.link,
                            linkTitle: item.linkTitle,
                            statusRecordatorio: item.status,
                            realizado: gestionarRealizado(item, gestionarFechas(item)),
                            frecuencia: item.frecuencia,
                            fechaInicio: item.fechaInicio,
                            fechas: item.fechas,
                            fechaDeCard: (proxFecha?.fecha ? proxFecha?.fecha : obtenerFecha(item)),
                            businessName: item?.businessName,
                            idUser: item?.idUser
                        }
                        array.push(itemFinal);
                    } 
                    else {
                        // obtengo el indice del elemento en item.fechas que tenga la fecha mas proxima y que tenga la propiedad ejecutado en false

                        let itemFinalInterno = {
                            _id: item._id,
                            status: evaluarFechaYFrecuencia(proxFecha?.fecha, item.frecuencia),
                            tarea: item.tarea,
                            descripcion: item.descripcion,
                            link: item.link,
                            linkTitle: item.linkTitle,
                            statusRecordatorio: item.status,
                            realizado: gestionarRealizado(item, gestionarFechas(item)),
                            frecuencia: item.frecuencia,
                            fechaInicio: item.fechaInicio,
                            fechas: item.fechas,
                            // fechaDeCard: item?.fechas[j]?.fecha
                            fechaDeCard: proxFecha?.fecha,
                            businessName: item?.businessName,
                            idUser: item?.idUser
                        }
                        array.push(itemFinalInterno);

                    }
                }
                // ordeno el array en base a su fechaDeCard colocando primero los que tengan fecha mas proxima

                array.sort((a, b) => {
                    const dateA = new Date(a.fechaDeCard.split('/').reverse().join('-'));
                    const dateB = new Date(b.fechaDeCard.split('/').reverse().join('-'));

                    if (dateA > dateB) {
                        return 1;
                    }
                    if (dateA < dateB) {
                        return -1;
                    }
                    return 0;
                })
                setListaTareas(array);                
                dispatch({ type: 'counter/setListaRecordatorios', payload: array });
            })
            // si hay un error lo muestro en consola
            .catch((error) => {
                console.error(error)
                setBlackScreen(false)
                setUpdate(false)
            })
            // finalmente cierro el then
            .finally(() => {                
                setBlackScreen(false)
                setUpdate(false)
            })
    }, [update])

    useEffect(() => {
        let listaFiltrada = [...listaTareas];
        // si Status es distinto de Todas, traigo todos los elementos de listaTareas cuya propiedad statusRecordatorio sea igual a Status
        if (status !== 'Todas') {
            listaFiltrada = listaFiltrada.filter((item) => item.statusRecordatorio === status);
        }
        // si tareas es distinto de Todas, traigo todos los elementos de listaTareas cuya propiedad tarea sea igual a tareas
        if (tareas !== 'Todas') {
            listaFiltrada = listaFiltrada.filter((item) => item.tarea === tareas);
        }
        setListaTareasFiltradas(listaFiltrada)

    }, [listaTareas, tareas, status])


    return (
        <View style={styles.container}>
            <BlackWindow visible={blackWindow} setVisible={handleClose} />
            <BlackWindow visible={frecuenciaModal} setVisible={handleCloseFrecuencia} />
            <BlackWindow visible={blackScreen} setVisible={null} />

            <CrearRecordatorio visible={blackWindow} setVisible={setBlackWindow}
                tarea={tarea} setTarea={setTarea}
                descripcion={descripcion} setDescripcion={setDescripcion}
                link={link} setLink={setLink}
                linkTitle={linkTitle} setLinkTitle={setLinkTitle}
                status={statusRecordatorio} setStatus={setStatusRecordatorio}
                frecuencia={frecuencia} setFrecuencia={setFrecuencia}
                fechaInicio={fechaInicio} setFechaInicio={setFechaInicio} 
                handleClose={handleClose} setUpdate={setUpdate} 
                setBlackScreen={setBlackScreen}
            />

            <CambiarFrecuencia visible={frecuenciaModal} setVisible={setFrecuenciaModal}
                tarea={tarea} setTarea={setTarea}
                descripcion={descripcion} setDescripcion={setDescripcion}
                link={link} setLink={setLink}
                linkTitle={linkTitle} setLinkTitle={setLinkTitle}
                status={statusRecordatorio} setStatus={setStatusRecordatorio}
                frecuencia={frecuencia} setFrecuencia={setFrecuencia}
                fechaInicio={fechaInicio} setFechaInicio={setFechaInicio} 
                handleClose={handleCloseFrecuencia} setUpdate={setUpdate} 
                setBlackScreen={setBlackScreen}
                recordatorioId={recordatorioId}
                listaRecordatorios={listaRecordatorios}
            />
            <ScrollView>
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
                        <Picker.Item label="Todas" value="Todas" />
                        <Picker.Item label="Aún no desarrollado" value="Aún no desarrollado" />
                        <Picker.Item label="En proceso de desarrollo" value="En proceso de desarrollo" />
                        <Picker.Item label="En curso" value="En curso" />
                        <Picker.Item label="Desestimado transitoriamente" value="Desestimado transitoriamente" />
                        <Picker.Item label="Resuelto" value="Resuelto" />
                       
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
                        <Picker.Item label="Vencimiento de Limpieza de Tanques." value="0" />
                        <Picker.Item label="Vencimiento de Limpieza de Cámaras Graseras." value="1" />
                        <Picker.Item label="Vencimiento de Libretas Sanitarias." value="2" />
                        <Picker.Item label="Vencimiento de Cursos de Manipulador." value="3" />
                        <Picker.Item label="Vencimiento de Matriz IPER." value="4" />
                        <Picker.Item label="Vencimientos de Análisis de Agua Fisicoquímicos." value="5" />
                        <Picker.Item label="Vencimientos de Análisis de Agua Bacteriológicos." value="6" />
                        <Picker.Item label="Vencimiento de Extintores." value="7" />
                        <Picker.Item label="Vencimiento de Medición de Puesta a Tierra." value="8" />
                        <Picker.Item label="Vencimiento de Evaluaciones Ergonómicos por Puesto." value="9" />
                        <Picker.Item label="Vencimiento de Medición de Ruido." value="10" />
                        <Picker.Item label="Vencimiento de Medición de Carga Térmica." value="11" />
                        <Picker.Item label="Vencimiento de Medición de Iluminación." value="12" />
                        <Picker.Item label="Vencimiento de Estudio de Carga de Fuego." value="13" />
                        <Picker.Item label="Vencimiento de Fumigación." value="14" />
                    </Picker>
                </View>

                <Text style={{
                    fontSize: 25,
                    fontFamily: 'GothamRoundedMedium',
                    textAlign: 'center',
                    color: 'gray',
                    marginVertical: 15,
                    display: (listaTareasFiltradas?.length > 0 ? 'none' : 'flex')
                }}>No hay eventos</Text>

                {listaTareasFiltradas.map((item, index) => {
                    return (
                        rol > 1 ?
                            <View key={index} style={{
                                padding: 20,
                                backgroundColor: 'rgb(234, 233, 233)',
                                borderTopColor: colorStatus(item),
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
                                        <Text style={[styles.letrasRecortadorios, {display: (item?.fechas?.length ? 'flex' : 'none')}]}>{item?.frecuencia} <Text style={{
                                            color: colorStatus(item),
                                        }}>- {item?.fechaDeCard}</Text></Text>
                                              <Text style={[styles.letrasRecortadorios, {
                                            width: '25%', textAlign: 'center', display: (item?.statusRecordatorio === 'En curso' ? 'flex' : 'none')
                                        }]}>Resuelto</Text>
                                    </View>
                                    <View style={{ borderBottomColor: 'gray', borderBottomWidth: 1, marginBottom: 5, width: '25%', alignSelf: 'flex-end', padding: 0, display: (item?.statusRecordatorio === 'En curso' ? 'flex' : 'none') }}>
                                        <Picker
                                            style={[styles.letrasRecortadorios, { fontSize: 14, color: 'black', padding: 0 }]}
                                            selectedValue={(item?.realizado === false ? 'no' : (item?.realizado === true ? 'si' : 'no')) || 'no'}
                                            onValueChange={(itemValue, itemIndex) => {
                                                setBlackScreen(true)
                                                // ubico el elemento en listaRecordatorios que tenga el id de item._id
                                                let index = listaRecordatorios.findIndex((itemLista) => itemLista._id === item._id);
                                                // creo una copia profunda del elemento
                                                let itemCopia = JSON.parse(JSON.stringify(listaRecordatorios[index])); 

                                                // ubico el elemento en itemCopia.fechas que tenga la fecha igual a item.fechaDeCard                                                
                                                let indexFecha = itemCopia.fechas.findIndex((fecha) => fecha.fecha === item?.fechaDeCard);

                                                // creo un arrayFinal que es una copia de itemCopia.fechas pero con el elemento en indexFecha con el valor de ejecutado igual a itemValue
                                                let arrayFinal = [];
                                                for (let i = 0; i < itemCopia.fechas.length; i++) {
                                                    if (i < indexFecha) {
                                                        arrayFinal.push({ ...itemCopia.fechas[i]})
                                                    } else if (i === indexFecha) {
                                                        arrayFinal.push({ ...itemCopia.fechas[i], ejecutado: (itemValue === 'si' ? true : false) })
                                                    } else {
                                                        arrayFinal.push({ ...itemCopia.fechas[i], ejecutado: false })
                                                    }
                                                }
                                            
                                                itemCopia.fechas = arrayFinal;

                                                // actualizo el elemento en la base de datos usando la url /api/recordatorio/${recordatorioId}
                                                url = API_URL + '/api/recordatorio/' + item._id;
                                                fetch(url, {
                                                    method: 'PUT',
                                                    headers: {
                                                        'Content-Type': 'application/json',
                                                    },
                                                    body: JSON.stringify(itemCopia),
                                                })
                                                    .then((response) => response.json())
                                                    .then((json) => {
                                                        // si y solo si el usuario eligio Si en "resuelto" entonces ahora posteo en let url = API_URL + '/api/recordatorio' un objeto nuevo igual a item pero en .fechas sera un array de un elemento con la fecha de item.fechaDeCard y ejecutado en true
                                                        if (itemValue === 'si') {
                                                            console.log('entre al if para postear')
                                                            let fecha = item.fechaDeCard.split('/');
                                                            fecha = fecha[2] + '-' + fecha[1] + '-' + fecha[0];

                                                            // estructuro el objeto
                                                            let objeto = {
                                                                tarea: item.tarea,
                                                                descripcion: item.descripcion,
                                                                link: item.link,
                                                                linkTitle: item.linkTitle,
                                                                status: 'Resuelto',
                                                                frecuencia: item.frecuencia,
                                                                fechaInicio: fecha,
                                                                idUser: item.idUser,
                                                                businessName: item.businessName,
                                                                fechas: [{
                                                                    fecha: fecha,
                                                                    ejecutado: true
                                                                }]                                                                
                                                            }
                                                         
                                                            console.log('objeto: ', objeto)
                                                            url = API_URL + '/api/recordatorio';
                                                            fetch(url, {
                                                                method: 'POST',
                                                                headers: {
                                                                    'Content-Type': 'application/json',
                                                                },
                                                                body: JSON.stringify(objeto),
                                                            })
                                                                .then((response) => response.json())
                                                                .then((json) => {
                                                                    console.log('json: ', json)
                                                                })
                                                                .catch((error) => {
                                                                    console.error(error);
                                                                });
                                                        } else {
                                                            setUpdate(true);
                                                        }
                                                    })
                                                    .then((json) => {                
                                                        setUpdate(true);
                                                    })
                                                    .catch((error) => {
                                                        console.error(error);
                                                    });
                                            }}
                                        >
                                            <Picker.Item label="No" value="no" style={{ fontSize: 14, color: 'black' }} />
                                            <Picker.Item label="Si" value="si" style={{ fontSize: 14, color: 'black' }} />
                                        </Picker>
                                    </View>
                                </View>

                                <Text style={{ borderBottomColor: 'gray', borderBottomWidth: 1, marginBottom: 5, marginTop: 5, fontSize: 16, fontFamily: 'GothamRoundedMedium' }}>{arrayTareas[item?.tarea]?.value}</Text>
                                <Text style={{ fontFamily: 'GothamRoundedMedium', fontSize: 16 }}>{(item?.descripcion ? item?.descripcion : 'Sin descripción')}</Text>

                                <Text style={{ fontFamily: 'GothamRoundedMedium', fontSize: 16, marginTop: 15 }}>{item?.linkTitle}</Text>

                                <Text style={{ color: 'blue', fontFamily: 'GothamRoundedMedium', fontSize: 16, marginTop: 5 }}>{item?.link}</Text>

                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 0, alignItems: 'center' }}>
                                    <TouchableOpacity onPress={() => deleteRecordatorio(item._id)} style={{ width: '20%' }}>
                                        <Text style={{ fontFamily: 'GothamRoundedBold', fontSize: 16 }}>Eliminar</Text>
                                    </TouchableOpacity>
                                    <View style={{ width: '50%', borderBottomColor: 'gray', borderBottomWidth: 1, padding: 0, margin: 0 }}>

                                        <Picker
                                            selectedValue={item?.statusRecordatorio || ' '}
                                            // si el statuso es diferente a En curso lo desactivo
                                            enabled={item?.statusRecordatorio !== 'Resuelto' ? true : false}
                                            onValueChange={(itemValue, itemIndex) => {
                                                if (itemValue !== 'En curso') {
                                                    setBlackScreen(true)
                                                    // ubico el elemento en listaRecordatorios que tenga el id de item._id
                                                    let index = listaRecordatorios.findIndex((itemLista) => itemLista._id === item._id);
                                                    // creo una copia del elemento
                                                    let itemCopia = { ...listaRecordatorios[index] };
                                                    // cambio el valor del status en el elemento dentro de itemCopia al valor de itemValue
                                                    itemCopia.status = itemValue;
                                                    // actualizo el elemento en la base de datos usando la url /api/recordatorio/${recordatorioId}                                                
                                                    url = API_URL + '/api/recordatorio/' + item._id;
                                                    fetch(url, {
                                                        method: 'PUT',
                                                        headers: {
                                                            'Content-Type': 'application/json',
                                                        },
                                                        body: JSON.stringify(itemCopia),
                                                    })
                                                        .then((response) => response.json())
                                                        .then((json) => {
                                                            setUpdate(true);
                                                        })
                                                        .catch((error) => {
                                                            console.error(error);
                                                        });
                                                } else {
                                                    setRecordatorioId(item._id);
                                                    setFrecuenciaModal(true);
                                                }
                                            }}
                                        >
                                            <Picker.Item label="Aún no desarrollado" value="Aún no desarrollado" />
                                            <Picker.Item label="En proceso de desarrollo" value="En proceso de desarrollo" />
                                            <Picker.Item label="En curso" value="En curso" />
                                            <Picker.Item label="Desestimado transitoriamente" value="Desestimado transitoriamente" />
                                            <Picker.Item label="Resuelto" value="Resuelto" />
                                            <Picker.Item label=" " value=" " />
                                        </Picker>
                                    </View>
                                </View>
                            </View>
                            :
                            <View key={index} style={{
                                padding: 20,
                                backgroundColor: 'rgb(234, 233, 233)',
                                borderTopColor: colorStatus(item),
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
                                        <Text style={styles.letrasRecortadorios}>{item?.frecuencia} <Text style={{
                                            color: colorStatus(item),
                                        }}>- {item?.fechaDeCard}</Text></Text>
                                  
                                    </View>
                          
                                </View>

                                <Text style={{ borderBottomColor: 'gray', borderBottomWidth: 1, marginBottom: 5, marginTop: 5, fontSize: 16, fontFamily: 'GothamRoundedMedium' }}>{item?.tarea}</Text>
                                <Text style={{ fontFamily: 'GothamRoundedMedium', fontSize: 16 }}>{(item?.descripcion ? item?.descripcion : 'Sin descripción')}</Text>

                                <Text style={{ fontFamily: 'GothamRoundedMedium', fontSize: 16, marginTop: 15 }}>{item?.linkTitle}</Text>

                                <Text style={{ color: 'blue', fontFamily: 'GothamRoundedMedium', fontSize: 16, marginTop: 5 }}>{item?.link}</Text>

                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 0, alignItems: 'center' }}>
                     
                            
                                </View>
                            </View>
                    )
                })}
            </ScrollView>
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