// creo un componente para formularios cargados
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, TextInput, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useSelector, useDispatch } from 'react-redux';
import Header from '../components/Header';
import Buscador from '../components/Buscador';
import Filtrador from '../components/Filtrador';
// importo getTitle de globalFunctions
import { getTitle } from '../functions/globalFunctions';
import ButtonBar from '../components/ButtonBar';
import { API_URL } from '../functions/globalFunctions'

export default function Formularios({ navigation }) {
    const dispatch = useDispatch();
    // traigo rol del redux
    const rol = useSelector((state) => state.rol);

    const [fontsLoaded] = useFonts({
        "GothamRoundedMedium": require('../assets/fonts/GothamRoundedMedium_21022.ttf'),
        "GothamRoundedBold": require('../assets/fonts/GothamRoundedBold_21016.ttf')
    });

    const formularios = [
        {
            title: "Control de Cloro Activo Residual",
            rolNeeded: 1,
            formType: 2,
            url:  API_URL + "/api/controlcloro",
            inputs: [
                {
                    name: "Control", tipo: "row", options: [
                        { name: "Fecha", tipo: "date" },
                        { name: "Punto de toma de agua evaluado", tipo: "text" },
                        { name: "Punto de Corte", tipo: "select", options: ['Menor 0,2 (Valor ppm)', '0,2 - 0,5 (Valor ppm)', '0,5 - 0,8 (Valor ppm)', 'Mayor a 0,8 (Valor ppm)'] },
                        { name: "Acciones de correción", tipo: "select", options: ["Dar aviso escrito al cliente.", "Lavado y desinfección de reservorios de agua."] },
                    ]
                }
            ]
        },
        {
            title: "Control de Equipos de Frío",
            rolNeeded: 1,
            formType: 2,
            url:  API_URL + "/api/controlequipofrio",
            verMas: [
                { text: "Límite de control", tipo: "title" },
                { text: "Temperaturas de cámaras:", tipo: "text" },
                { text: "menor a 5ºC.", tipo: "text" },
                { text: "Temperatura de ante-cámaras y heladeras para descongelamiento o de tránsito (menor a 4 horas) o expositora:", tipo: "text" },
                { text: "menor a 10ºC.", tipo: "text" },
                { text: "Temperaturas de freezer:", tipo: "text" },
                { text: "Menor a -18ºC.", tipo: "text" },
                { text: "Contratos certificados con IRAM BPM:", tipo: "text" },
                { text: "Temperatura de equipos de frío refrigerados menor a 4ºC.", tipo: "text" },
                { text: "Según los turnos de producciónse debe controlar la temperatura de cámaras y heladeras, distando entre un control y el otro entre 8 y 10 horas(mínimo 2 veces).", tipo: "text" },
                { text: "Un alimento correspondiente a cada cámara, seleccionado al azar, debe ser registrado. Alimentos críticos: postres, productos cocidos, vegetales desinfectados.", tipo: "text" },

                { text: "Acciones de corrección", tipo: "title" },
                { text: "Equipos refrigerados:", tipo: "text" },

                { text: "1. Sila T° de los equipos supera el límite, controlar la temperatura de alimentos en distintas zonas del equipo. Re chequear la temperatura de los alimentos habiendo mantenido cerrada la puerta de cámara.", tipo: "text" },
                { text: "2. Luego de la hora, si los alimentos se encuentran dentro del límite, ninguna otra acción es requerida, si la lectura del termómetro del equipo es correcta", tipo: "text" },
                { text: "3. Luego de la hora, si los alimentos se encuentran a más del límite, chequear alimentos en distintas zonas del equipo:", tipo: "text" },
                { text: "        ° Si la temperatura de los alimentos supera los 7°Cen cámara o los 10°C en heladera de tránsito (IRAMBPM mayor a 4ºC): trasladarlos a otro equipo.", tipo: "text" },
                { text: "        ° Si la temperatura de los alimentos supera los 13°C (IRAM BPM mayor a 7ºC): deben ser DESECHADOS.", tipo: "text" },
                { text: "Equipos congelados:", tipo: "text" },
                { text: "1. Si el freezer se encuentra con temperaturas superiores a -12°C, chequear la dureza al tacto y signos de descongelamiento.", tipo: "text" },
                { text: "2. Si hay signos de descongelamiento, los alimentos deben descongelarse en cámara y ser tratados como producto fresco, con una vida útil de 24 hs. una vez descongelado. Deben rotularse: -fecha de inicio del descongelamiento y hora –fecha final de descongelamiento y hora.", tipo: "text" },
                { text: "3. Si los alimentos no pierden dureza al tacto y no presentan signos de descongelamiento,se vuelvena monitorear los mismos alimentos a la hora.", tipo: "text" },
                { text: "4. Si los alimentos NO reflejan cambios en la dureza superficial y el equiposigue indicando una T° mayor a -12°C, trasladar los alimentos a otro equipo o utilizar la mercadería como producto fresco.", tipo: "text" },
                { text: "5. Si el equipo ahora indica entre -12°C y -18°C, ninguna otra acción es requerida.", tipo: "text" },
            ],
            inputs: [
                { name: "Fecha", tipo: "date" },
                { name: "Turno", tipo: "select", options: ['Turno Mañana', 'Turno Tarde', 'Turno Noche'] },
                {
                    name: "Servicios", tipo: "row", rolIndex: 0, options: [
                        { name: "Equipo", tipo: "text" },
                        { name: "Nro y Nombre", tipo: "text" },
                        { name: "Hora", tipo: "time" },
                        { name: "Temperatura Equipo", tipo: "text" },
                        { name: "Alimento", tipo: "text" },
                        { name: "Temperatura Alimento", tipo: "text" },
                        { name: "Acción de correción", tipo: "text" },
                        { name: "Responsable", tipo: "text" },
                    ]
                },
            ]
        },
        {
            title: "Control de Vidrios",
            rolNeeded: 1,
            formType: 2,
            url:  API_URL + "/api/controlvidrios",

            inputs: [

                // { name: "Registro de envases de vidrio y roturas", tipo: "title" },
                { name: "Registro de envases de vidrio y roturas", tipo: "subTitle" },
                {
                    name: "Recepción", tipo: "row", options: [
                        { name: "Fecha de Recepción", tipo: "date" },
                        { name: "Proveedor", tipo: "text" },
                        { name: 'Alimento contenido en vidrio', tipo: 'text' },
                        { name: 'Responsable de control', tipo: 'text' },
                    ]
                },
                {
                    name: 'Daños', tipo: 'row', options: [
                        { name: 'Fecha', tipo: 'date' },
                        // envase de vidrio roto text
                        { name: 'Envase de vidrio roto', tipo: 'text' },
                        // 'Acción correctiva sobre el alimento' text
                        { name: 'Acción correctiva sobre el alimento', tipo: 'text' },
                        // responsable text
                        { name: 'Responsable', tipo: 'text' },
                    ]
                },
            ]
        },
        {
            title: "Checkeo de uso de EPP",
            rolNeeded: 2,
            formType: 3,
            url:  API_URL + "/api/chequeoepp",
            verMas: [
                { text: "Instrucciones", tipo: "title" },
                { text: "Tildar el uso de EPP de cada empleado según los que corresponden con su puesto de trabajo.", tipo: "text" },
                { text: "El incumplimiento en el uso de EPP genera la observación proactiva al empleado y su posterior registro STOP.", tipo: "text" },
            ],
            inputs: [
                { name: "Mes", tipo: "picker", options: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"], subManejador: true },
                // hago otro picker pero con los años de 2023 a 2040 en array
                { name: "Año", tipo: "picker", options: ["2023", "2024", "2025", "2026", "2027", "2028", "2029", "2030", "2031", "2032", "2033", "2034", "2035", "2036", "2037", "2038", "2039", "2040"], manejador: true },
                { name: "Empleado", tipo: "select", options: ['Andres', 'Eric', 'Fernando', 'Daniela', 'Ivonne'] },
                { name: "Sector", tipo: "text" },
                { name: "Puesto", disabled: true, tipo: "select", options: [' '] },
                {
                    name: "chequeo de uso E.P.P", tipo: "checkBox", options: [
                        "Ropa de trabajo",
                        "Calzado de Seguridad",
                        "Guantes",
                        "Protección Ocular",
                        "Protección Facial",
                        "Protección Auditiva",
                        "Protección Respiratoria",
                        "Protección de Tronco",
                        "Otro",
                    ], colores: true
                },
                { name: "Observaciones", tipo: "textGrande" },
            ]

        },
        {
            title: "Armado y Fraccionamiento",
            rolNeeded: 1,
            formType: 2,
            url:  API_URL + "/api/planillaarmado",
            verMas: [
                { text: "Instrucciones", tipo: "title" },
                { text: "LÍMITE CRÍTICO", tipo: "text" },
                { text: "TEMPERATURA INTERNA: Menor a 13ºC", tipo: "text" },
                { text: "PROCEDIMIENTO", tipo: "text" },
                { text: "1. Se prepara el primer plato (plato testigo) como muestra de referencia para armar el resto de los platos, teniendo en cuenta gramajes, ingredientes, formas, tamaños, presentación, entre otros.", tipo: "text" },
                { text: "2. Se registra en esta planillala temperatura inicial del alimento del plato testigo y se deja el termómetro colocado en él durante todo el proceso. El uso de porcionadores es mandatorio para la estandarización del producto final y uso racional de la materia prima.", tipo: "text" },
                { text: "3. El primer plato permanece a un lado con el termómetro mientras se continúa con la producción de todo el lote, siguiendo el plato testigo.", tipo: "text" },
                { text: "4. Del plato testigo se monitorea su temperatura, estando correcto el procedimiento si el alimento se encuentra a menos de 13ºC en el centro del alimento.", tipo: "text" },
                { text: "5. Finalizado el último plato, se efectúa la lectura del termómetro del plato testigo y se registra en esta planillala temperatura final. El armado de platos no debe superar los 45 minutos de exposición a temperatura ambiente.", tipo: "text" },
                { text: "ACCIONES DE CORRECCIÓN", tipo: "text" },
                { text: "Si la temperatura interna del alimento:", tipo: "text" },
                { text: "-Está entre 13ºC y 15ºC, refrigerar el lote inmediatamente.", tipo: "text" },
                { text: "-Supera los 15ºC, desechar el lote.", tipo: "text" },
            ],
            inputs: [
                {name: "Planilla de Armado/Fraccionamiento", tipo: "row", options: [
                    { name: "Fecha", tipo: "date" },
                    { name: "Producto", tipo: "text" },

                    { name: "Hora", tipo: "timeHeader", titulo: "PROCESO DE ARMADO/FRACCIONAMIENTO", cabecera: "INICIO" }, { name: "Temp. Interna", tipo: "textFooter" },
                    { name: "Hora", tipo: "timeTop", cabecera: "FINAL" }, { name: "Temp. Interna", tipo: "textFooter" },

                    { name: "Acciones Correcion", tipo: "text" },
                ]}
            ],


        },
        {
            "title": "Registro de Capacitación",
            "rolNeeded": 2
        },
        {
            title: "Decomiso de materias primas",
            rolNeeded: 1,
            formType: 2,
            url:  API_URL + "/api/registrodecomiso",
            exception2: true,
            inputs: [
                {
                    name: "Registros de decomisos de materias primas", tipo: "row", options:
                        [
                            { name: "Fecha", tipo: "date" },
                            { name: "Turno", tipo: "select", options: ['Turno Mañana', 'Turno Tarde', 'Turno Noche'] },
                            { name: "Producto decomisado", tipo: "text" },
                            { name: "Cantidad", tipo: "text" },
                            { name: "Causa", tipo: "select", options: ['Recall', 'Desvíos de proceso', 'Fuera fecha de vida util', 'Fuera de aptitud', 'Otras Causas'] }
                        ]
                },
            ]
        },
        {
            title: "Carga/Recepción de materia prima",
            rolNeeded: 1,
            formType: 2,
            url:  API_URL + "/api/carga",
            verMas: [
                { text: "LÍMITES CRÍTICOS PARA EL INGRESO DE MERCADERÍAS", tipo: "title" },
                { text: "TEMPERATURA DE ALIMENTOS:", tipo: "text" },
                { text: "* Congelados: -18ºC ± 6ºC, o según indicación rótulo.", tipo: "text" },
                { text: "* Carnes Frescas: 1 a 5ºC .", tipo: "text" },
                { text: "* Pollos: -2ºC a 2ºC, hasta 7ºC con notificación al proveedor.", tipo: "text" },
                { text: "* Lácteoss: 2ºC a 5ºC, hasta 7ºC con notificación al proveedor o según indicación en el envase.", tipo: "text" },
                { text: "* Fiambres: Hasta 7ºC o según indicación en el envase.", tipo: "text" },
                { text: "* Huevos: Cascara: 8ºC a 13°C. Pasteurizado: hasta 7°C.", tipo: "text" },
                { text: "* Frutas y verduras frescas: Hasta 7°C o según indicación proveedor.", tipo: "text" },
                { text: "* Otros alimentos no perecederos: Ambiente.", tipo: "text" },
                { text: "ADHERENCIA A LAS ESPECIFICACIONES POR PRODUCTO:", tipo: "text" },
                { text: "* Congelados: RNE, RNPA, fecha de vencimiento y fecha de elaboración: N° SENASA si es de origen animal. Verificar dureza y ausencia de desecación por congelamiento. Envase íntegro. Sin signos de descongelamiento previo.", tipo: "text" },
                { text: "* Carnes Frescas:RNE, RNPA, Nº de SENASA, fecha de vencimiento y fecha de elaboración Olor característico", tipo: "text" },
                { text: "* Pollos: RNE, RNPA, Nº de SENASA, fecha de vencimiento y fecha de faena. Canastos plásticos limpios.", tipo: "text" },
                { text: "* Lácteos: RNE, RNPA, fecha de vencimiento y fecha de elaboración. Puede tener Nº de SENASA. Envase íntegro y limpio.", tipo: "text" },
                { text: "* Fiambres: RNE, RNPA, fecha de vencimiento y fecha de elaboración. Puede requerir Nº de SENASA. Envase íntegro y limpio.", tipo: "text" },
                { text: "* Huevos:Nº SENASA, fecha de vencimiento.Huevos limpios y sin rajaduras, envases limpios.", tipo: "text" },
                { text: "* Frutas y verduras frescas: Características organolépticas acordes al producto.Cajones plásticos limpios.", tipo: "text" },
                { text: "* Otros alimentos no perecederos: RNE, RNPA, fecha de vencimiento y fecha de elaboración. Pueden Requerir Nº SENASA. Envases íntegros y limpios.", tipo: "text" },
                { text: "ACCIONES DE CORRECCIÓN", tipo: "title" },
                { text: "Si los alimentos no cumplen con las especificaciones deben ser rechazados en el momento de la recepción.", tipo: "text" },
                { text: "Cada rechazo genera un “Reporte de rechazo/devolución de Materias Primas” del cual se generan dos copias firmadas:", tipo: "text" },
                { text: "* Constancia para el establecimiento", tipo: "text" },
                { text: "* Constancia para el proveedor", tipo: "text" },
                { text: "Desvíos encontrados en la recepción que se hayan repetido más de 3 veces correspondientes a un mismo proveedor y a un mismo desvío deben ser informados a: hseq@aramark.com.ar para su intervención, junto con los reportes correspondientes.", tipo: "text" },
            ],
            inputs: [
                { name: "DATOS DE TRANSPORTE", tipo: "subTitle" },
                { name: "Estado sanitario:", tipo: "select", options: ["Cumple", "No cumple"] },
                { name: "Patente térmico", tipo: "text" },
                { name: "Habilitación SENASA", tipo: "text" },
                { name: "N° Precinto lateral", tipo: "text" },
                { name: "N° Precinto trasero", tipo: "text" },
                { name: "Termógrafo:", tipo: "select", options: ["SI", "NO"] },
                { name: "Resp. lectura termógrafo", tipo: "text" },
                { name: "Observaciones", tipo: "textGrande" },
                {
                    name: "Carga/ Recepción", tipo: "row", options: [
                        { name: "Fecha de Carga", tipo: "dateTop", cabecera: "Fechas" }, { name: "Fecha de Recepción", tipo: "dateFooter" },
                        { name: "Proveedor", tipo: "text" },
                        { name: "Producto", tipo: "text" },
                        { name: "Cantidad Comprada", tipo: "textTop", cabecera: "Cantidad (Kg-Un)" }, { name: "Cantidad Recibida", tipo: "textFooter" },
                        { name: "T° de Carga", tipo: "textTop", cabecera: "Temperatura Alimento (ºC)" }, { name: "T° de Recepcion", tipo: "textFooter" },
                        { name: "T° de Carga", tipo: "textTop", cabecera: "Temperatura Caja Camión (ºC)" }, { name: "T° de Recepcion", tipo: "textFooter" },
                        { name: "Dentro de vida útil", tipo: "textTop", cabecera: "Rotulación" }, { name: "Nro. lote", tipo: "textMiddle" }, { name: "Fecha vto.", tipo: "textFooter" },
                        { name: "Recibido", tipo: "textTop", cabecera: "Acciones de corrección tomadas" }, { name: "Motivo del rechazo", tipo: "textFooter" },
                    ]
                }
            ]

        },
        {
            "title": "Control de Proceso",
            "rolNeeded": 1,
        },
        {
            title: "Descongelamiento",
            rolNeeded: 1,
            url:  API_URL + "/api/descongelamiento",
            formType: 2,
            verMas: [
                // titulo PROCEDIMIENTO
                { text: "PROCEDIMIENTO", tipo: "title" },
                { text: "En equipos de frío:", tipo: "text" },
                { text: "1. Se retiran del freezer los alimentos a descongelar, eliminando los contenedores de cartón u otros materiales aislantes.", tipo: "text" },
                { text: "2. Se dispone el alimento en un recipiente limpio y sanitizado con una bandeja adecuada. Se rotula con fecha de inicio del proceso.", tipo: "text" },
                { text: "3. Se colocan dichos recipientes en cámaras, antecámaras o heladeras a temperaturas entre 5ºC y 12ºC.", tipo: "text" },
                { text: "4. Al finalizar el proceso, se rotula el alimento con la fecha del día.", tipo: "text" },
                { text: "5. Mantener refrigerado hasta el final de su vida útil.", tipo: "text" },
                { text: "Sumergido en agua no contacto directo :", tipo: "text" },
                { text: "1. Se dispone del producto en un contenedor o bacha previamente sanitizada y cubrir con agua caliente (si es posible utilizar agua hirviendo).", tipo: "text" },
                { text: "2. El recambio de esta agua se hace cada 30 minutos y el tiempo máximo que se establece para mantener esta operación es de 4 horas.", tipo: "text" },
                { text: "3. Al finalizar el proceso, se rotula el alimento con la fecha del día. Vida útil: 24 hs.", tipo: "text" },
                { text: "4. Mantener refrigerado hasta el final de su vida útil.", tipo: "text" }, 
                { text: "MICROONDAS:", tipo: "text" }, 
                { text: "1. Se retira el envoltorio externo del producto.", tipo: "text" }, 
                { text: "2. Se dispone de la pieza en un contenedor limpio y sanitizado, apto para microondas.", tipo: "text" }, 
                { text: "3. Se selecciona la función de “descongelar”, y se programa el nivel de potencia y tiempo según lo establecido en el manual del equipo.", tipo: "text" }, 
                { text: "4. Todos los alimentos crudos descongelados en microondas se cocinan dentro de las 12 horas de finalizado el descongelamiento.", tipo: "text" }, 
                { text: "", tipo: "text" }, 
                { text: "ACCIONES DE CORRECCIÓN", tipo: "title" }, 
                { text: "Si la temperatura interna del alimento es hasta 13ºC, cocinar. Si es mayor a 13ºC, descartar.", tipo: "text" }, 
            ],
            inputs: [
                {
                    name: "Proceso", tipo: "row", options: [
                        { name: "Fecha", tipo: "date" },
                        { name: "Alimento", tipo: "text" },
                        { name: "Nro. lote", tipo: "text" },
                        { name: "Método", tipo: "select", options: [
                            "Equipos de Frío",
                            "Agua caliente",
                            "Microondas",
                            "Cocción directa",
                        ]},
                        { name: "Hora", tipo: "timeTop", titulo: "", cabecera: "Inicio" }, { name: "Temp", tipo: "textFooter" },
                        { name: "Hora", tipo: "timeTop", titulo: "", cabecera: "Monitoreo 1" }, { name: "Temp", tipo: "textFooter" },
                        { name: "Hora", tipo: "timeTop", titulo: "", cabecera: "Monitoreo 2" }, { name: "Temp", tipo: "textFooter" },
                        { name: "Hora", tipo: "timeTop", titulo: "", cabecera: "Monitoreo 3" }, { name: "Temp", tipo: "textFooter" },
                        { name: "Hora", tipo: "timeTop", titulo: "", cabecera: "Final" }, { name: "Temp", tipo: "textFooter" },
                        { name: "Acciones de correción", tipo: "text" },
                        { name: "Responsable", tipo: "text" },
                    ]
                },
            ]
        },
        {
            title: "Despacho a producción",
            rolNeeded: 1,
            formType: 2,
            url:  API_URL + "/api/despachoproduccion",
            inputs: [
                // un subTitle de "Los productos que deben registrarse en la siguiente planilla son:"
                { name: "Los productos que deben registrarse en la siguiente planilla son:", tipo: "subTitle" },
                { name: "* Carnes vacunas", tipo: "subTitle" },
                { name: "* Pollo", tipo: "subTitle" },
                { name: "* Pescado", tipo: "subTitle" },
                { name: "* Cerdo", tipo: "subTitle" },
                { name: "* Huevo pasteurizado (líquido, barra, salmuera)", tipo: "subTitle" },
                { name: "Frecuencia: Diaria", tipo: "subTitle" },
                // un tipo Fecha
                { name: "Fecha", tipo: "date" },
                // un row
                {
                    name: "Despacho a producción", tipo: "row", options: [
                        { name: "Producto", tipo: "select", options: ["Carnes vanucas", "Pollo", "Pescado", "Cerdo", "Huevo", "pasteurizado (líquido, barra, salmuera)"] },
                        { name: "Cantidad planificada", tipo: "text" },
                        { name: "Cantidad real", tipo: "text" },
                        { name: "Proveedor", tipo: "text" },
                        { name: "Lote", tipo: "text" },
                    ]
                },
            ]
        },
        {
            title: "Distribución y expedición",
            rolNeeded: 1,
            formType: 2,
            url:  API_URL + "/api/distribucion",
            verMas: [
                { text: "Llegado al punto de distribución los alimentos deben consumirse dentro de las 2 horas de entrega o mantenerse en refrigeración hasta el momento de su regeneración.", tipo: "text" },
                { text: "ALIMENTOS CALIENTES", tipo: "title" },
                { text: "Las preparaciones calientes deben mantenerse a temperaturas mayores a 65ºC durante el transporte y la recepción.", tipo: "text" },
                { text: "ALIMENTOS FRÍOS", tipo: "title" },
                { text: "Las preparaciones servidas en frio, entradas, postres y ensaladas deben mantenerse a temperaturas inferiores a 10ºC", tipo: "text" },
            ],
            inputs: [
                // un fecha
                { name: "Fecha", tipo: "date" },
                // un row
                {
                    name: "Distribución y expedición", tipo: "row", options: [
                        // servicio tipo select con "Desayuno" | "Almuerzo" | "Merienda" | "Cena".
                        { name: "Servicio", tipo: "select", options: ["Desayuno", "Almuerzo", "Merienda", "Cena"] },
                        // preparacion tipo text
                        { name: "Preparación", tipo: "textGrande" },
                        { name: "Hora", tipo: "timeTop", cabecera: "Despacho", titulo: "Distribución/Expedición" }, { name: "Temp", tipo: "textFooter" },

                        { name: "Hora", tipo: "timeTop", cabecera: "Recepción" }, { name: "Temp", tipo: "textFooter" },
                        // un select con las siguientes opciones llamado acciones correctivas
                        // *Desechar porque el tiempo transcurrido entre el despacho y la recepción fue mayor a 2 horas.
                        // * Desechar porque la temperatura está por debajo de 55 °C,
                        // * Desechar porque la temperatura está por encima de 15°C.
                        // * Si la temperatura está en un rango ente 55°C y 64°C recalentar hasta alcanzar más de 65°C.
                        // * Si la temperatura está en un rango entre 10°C y 15°refrigerar hasta alcanzar menos de 10°C.
                        { name: "Acciones correctivas", tipo: "selectShow", options: ["Desechar porque el tiempo transcurrido entre el despacho y la recepción fue mayor a 2 horas.", "Desechar porque la temperatura está por debajo de 55 °C", "Desechar porque la temperatura está por encima de 15°C", "Si la temperatura está en un rango ente 55°C y 64°C recalentar hasta alcanzar más de 65°C", "Si la temperatura está en un rango entre 10°C y 15°refrigerar hasta alcanzar menos de 10°C"] },
                    ]   
                },
            ]
        },
        {
            "title": "Planilla de recepción",
            "rolNeeded": 1
        },
        {
            title: "Planilla de sanitización",
            rolNeeded: 1,
            formType: 2,
            url: API_URL + "/api/sanitizacion",
            verMas: [
                // titulo sanitizacion
                { text: "SANITIZACIÓN", tipo: "title" },
                // text 1. Seleccionar las unidades/hojas que no cuenten con características organolépticas apropiadas..
                { text: "1. Seleccionar las unidades/hojas que no cuenten con características organolépticas apropiadas.", tipo: "text" },
                { text: "2. Lavado inicial: sumergir y remover los productos en una bacha con agua potable durante 5 minutos.", tipo: "text" },
                { text: "3. Sanitización: Colocar los vegetales/frutas previamente lavados en solución clorada (15 ml de lavandina o cloro cada 5 litros de agua) durante 5 minutos. Recambiar la solución clorada en cada operación.", tipo: "text" },
                { text: "4. Enjuague final: todos los vegetales y frutas deben ser enjuagados.", tipo: "text" },
                { text: "5. Acondicionamiento post-sanitización:se deben disponer en recipientes limpios (canastos o bolsas cristal), rotulados y protegidos. Los vegetales,una vez sanitizados, deben ser tratados como alimentos listos para consumo, refrigerados a menos de 5ºC.", tipo: "text" },
                { text: "LÍMITE CRÍTICO", tipo: "title" },
                { text: '* Concentración deseada entre 100 y 200 ppm" (medir con tiras reactivas)', tipo: "text" },
                { text: "Tiempo de contacto 5 minutos.", tipo: "text" },
                { text: "ACCIONES DE CORRECCIÓN", tipo: "title" },
                { text: "Si la concentración es mayor, diluir con agua potable hasta llegar a la concentración deseada.", tipo: "text" },
                { text: "Si la concentración es menor, dosificar manualmente en relación al volumen de la bacha.", tipo: "text" },
            ],
            inputs: [
                // tipo row
                {
                    name: "Sanitización", tipo: "row", options: [
                        // fecha
                        { name: "Fecha", tipo: "date" },
                        // Vegetal a desinfectar
                        { name: "Vegetal a desinfectar", tipo: "text" },
                        // select Si/No con opciones Si, No
                        { name: "Lavado", tipo: "selectTop", cabecera: "LAVADO INICIAL", options: ["Si", "No"] },
                        // tipo selectHeader 
                        { name: "Concentración", tipo: "selectHeader", titulo: "DESINFECCIÓN", cabecera: "", options: ["Si", "No"] },
                        { name: "Minutos", tipo: "textFooterCabecera", cabecera: "Tiempo inmersión"},
                        { name: "Enjuague", tipo: "selectTop", cabecera: "ENJUAGUE FINAL", options: ["Si", "No"] },
                        // tipo text acciones de correcion
                        { name: "Acciones de correción", tipo: "text" },
                        // responsable
                        { name: "Responsable", tipo: "text" },
                    ]
                },
                // responsable tipo text
                { name: "Responsable", tipo: "text" },
                // Fecha
                { name: "Fecha", tipo: "date" },
                // hora    
                { name: "Hora", tipo: "time" },
            ]    
        },
        {
            title: "Servicio en línea",
            rolNeeded: 1,
            formType: 2,
            url:  API_URL + "/api/servicioenlinea",
            verMas: [
                { text: "SERVICIO LÍNEA CALIENTE", tipo: "title" },
                { text: "Las preparaciones calientes deben mantenerse a temperaturas mayores a 65ºC, por un tiempo máximo de 2 horas.", tipo: "text" },
                { text: "Los productos sobrantes deberán ser eliminados si fueron presentados en la línea.", tipo: "text" },
                { text: "SERVICIO LÍNEA FRIA", tipo: "title" },
                { text: "Las preparaciones servidas en frio, entradas, postres y ensaladas deben mantenerse a temperaturas inferiores a 10ºCpor un máximo de 2 horas.", tipo: "text" },
                { text: "Los productos sobrantes deberán ser eliminados si fueron presentados en la línea.", tipo: "text" },
                { text: "Contratos certificados con IRAM BPM: mantener a menos de 4ºC.", tipo: "text" },
            ],
            inputs: [
                { name: "Fecha", tipo: "date" },
                {
                    name: "Servicios", tipo: "row", rolIndex: 0, options: [
                        { name: "Servicio", tipo: "text" },
                        { name: "Preparación", tipo: "text" },
                        { name: "Hora", tipo: "timeHeader", cabecera: "Inicio del servicio", titulo: "Mantenimiento" }, { name: "Temp", tipo: "textFooter" },
                        { name: "Hora", tipo: "timeTop", cabecera: "Mantenimiento 1" }, { name: "Temp", tipo: "textFooter" },
                        { name: "Hora", tipo: "timeTop", cabecera: "Mantenimiento 2" }, { name: "Temp", tipo: "textFooter" },
                        { name: "Acciones correctivas", tipo: "text" },
                        { name: "Responsable", tipo: "text" }
                    ]
                },
                { name: "Verificado por", tipo: "text" },
                { name: "Fecha", tipo: "date" },
                { name: "Hora", tipo: "time" },
            ]
        },
        {
            title: "Recuperación de productos",
            url:  API_URL + "/api/recuperacionproducto",
            rolNeeded: 1,
            title2: "Registro para el comedor",
            inputs: [
                { name: "Fecha de alerta", tipo: "date" },
                { name: "Fecha de recuperación", tipo: "date" },
                { name: "Responsables", tipo: "text" },
                { name: "Producto", tipo: "text" },
                { name: "Marca", tipo: "text" },
                { name: "Lote/Vencimiento", tipo: "date" },
                { name: "Cantidad de producto", tipo: "text" },
                { name: "Destino del producto", tipo: "text" },
                { name: "Fecha de disposición final", tipo: "date" },
            ],
            formType: 1,
        },
        {
            title: "Uso y cambio de aceite en freidora",
            url:  API_URL + "/api/usocambioaceite",
            rolNeeded: 1,
            formType: 3,
            exception1: true,
            verMas: [
                { text: "Instrucciones", tipo: "title" },
                { text: "Tildar las actividades realizadas diariamente.", tipo: "text" },
                { text: "Precauciones", tipo: "title" },
                { text: "No sobrecalentar las grasas y aceites por encima de los 180 °C.", tipo: "text" },
                { text: "Filtrar las grasas y aceites luego de su uso.", tipo: "text" },
                { text: "Verificar la calidad de las grasas y aceites en forma regular.", tipo: "text" },
                { text: "Desechar las grasas y aceites con cambios evidentes de color, olor y sabor.", tipo: "text" },
                { text: "No utilizar el aceite más de 5 veces (el Registro permite llevar cuenta del uso de la freidora).", tipo: "text" },
                ],
            inputs: [
                { name: "Mes", tipo: "picker", options: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"], subManejador: true },
                // hago otro picker pero con los años de 2023 a 2040 en array
                { name: "Año", tipo: "picker", options: ["2023", "2024", "2025", "2026", "2027", "2028", "2029", "2030", "2031", "2032", "2033", "2034", "2035", "2036", "2037", "2038", "2039", "2040"], manejador: true },
                { name: "Control del aceite en freidora", tipo: "checkBox", options: ["Uso", "Filtracion", "Limpieza superficial", "Cambio de Aceite", "Limpieza profunda"], colores: true, afectada: "Uso", afectadora: "Cambio de Aceite" },
                    { name: "Observaciones", tipo: "text" },
                ]
            },
        {
            "title": "Entrega de bidones de aceite usado",
            "rolNeeded": 1
        },
        {
            "title": "Rechazo-devolución de materia prima",
            "rolNeeded": 1
        },
        {
            "title": "Verificación de Balanzas",
            "rolNeeded": 1
        },
        {
            "title": "Verificación de Termómetros",
            "rolNeeded": 1
        }
    ]

    let cards = formularios.map((item) => {
        return {
            title: item.title,
            rolNeeded: item.rolNeeded,
            title2: item.title2,
            inputs: item.inputs,
            formType: item.formType,
            url: item.url,
            verMas: item.verMas,
            exception1: item.exception1,
            onPress: () => {
                // creo un useDispatch para establecer cardToCheck    
                dispatch({ type: 'counter/setCardToCheck', payload: item });
                navigation.navigate('FormCreate');
            },
        }
    })

    const [cardsFound, setCardsFound] = useState(cards);
    const [inputValue, setInputValue] = useState('');
    let cajaText = [
        { title: '| Formularios', style: 'titleProfile' },
    ]

    const handleInputChange = (value) => {
        // guardo el valor del input en el estado inputValue
        setInputValue(value);
        let inputLocal = value;
        // convierto el inputLocal en minusculas
        inputLocal = inputLocal.toLowerCase();
        // creo un array donde guardaré los buttons que coincidan con el valor del input al filtrar
        setCardsFound(cards.filter((item) => {
            let itemTitle = item.title.toLowerCase();
            if (itemTitle.includes(inputLocal)) return item
        }))
    }

    return (
        <View style={styles.container}>
            <Header cajaText={cajaText} unElemento={true} />
            <View style={{ marginBottom: 5 }}>

                <Buscador inputValue={inputValue} handleInputChange={handleInputChange} />
                <Filtrador states={cardsFound} setStates={setCardsFound} />
            </View>

            <ScrollView>
                <View style={styles.containerBox}>
                    {/* si cardFound.length es 0, muestro un mensaje de que no hay resultados */}
                    {cardsFound.length == 0 ? <Text style={[styles.title, styles.notFoundMsg]}>No hay resultados</Text>
                        : (
                            cardsFound.filter((card) => (card.rolNeeded) <= rol).map((card, i) => {
                                return (
                                    <TouchableOpacity key={i} style={styles.box} onPress={card.onPress}>
                                        <Text style={styles.boxTitle}>
                                            {card.title}
                                        </Text>
                                    </TouchableOpacity>
                                )
                            }
                            )
                        )}
                </View>
            </ScrollView>
            <ButtonBar navigation={navigation} />
        </View>
    )
}


const styles = StyleSheet.create({
    boxTitle: {
        textAlign: 'center',
        justifyContent: 'center',
        fontFamily: "GothamRoundedMedium",
        fontSize: 12,

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
    containerBox: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: "100%",
        paddingBottom: 10,
    },
    container: {
        flex: 1,
        padding: 12,
        paddingTop: 16,
        backgroundColor: '#fff',
        flexDirection: 'column',
        justifyContent: 'space-between'
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
        paddingHorizontal: 10,

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
    notFoundMsg: {
        textAlign: 'center',
        alignSelf: 'center',
    },
});