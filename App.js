import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Login from './screens/Login';
import CreateAccount from './screens/CreateAccount';
import Inicio from './screens/Inicio';
import PasswordRecovery from './screens/PasswordRecovery';
import PasswordCreate from './screens/PasswordCreate';
import Loading from './screens/Loading';
import Profile from './screens/Profile';
import ProfileLegajos from './screens/ProfileLegajos';
import FormulariosCargados from './screens/FormulariosCargados';
import Formularios from './screens/Formularios';
import FormDetails from './screens/FormDetails';
import FormDetailsLegajos from './screens/FormDetailsLegajos';
import FormCreate from './screens/FormCreate';
import FormView from './screens/FormView';
import Recordatorios from './screens/Recordatorios';
import Legajos from './screens/Legajos';
import SolicitudesEdicion from './screens/SolicitudesEdicion';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// importo de react redux provider, useSelector, useDispatch
import { Provider } from 'react-redux';
// importo de reduxjs/toolkit configureStore y createSlice
import { configureStore, createSlice } from '@reduxjs/toolkit';
import { setJSExceptionHandler } from 'react-native-exception-handler';

const errorHandler = (error, isFatal) => {
  // Este es tu manejador de errores personalizado
  // Puedes hacer lo que quieras con el error, como enviarlo a un servidor de logs
  console.log(error, isFatal);
};

setJSExceptionHandler(errorHandler);

const initialState = {
  // creo el estado logged para saber si el usuario esta logueado o no
  logged: false,
  token: '',
  rol: '',
  id: '',
  // creo los estados para fullName, legajo, number, puesto, rol, provincia, localidad y contratoComedor
  fullName: '',
  legajo: '',
  number: '',
  puesto: '',
  provincia: '',
  localidad: '',
  business: '',
  imgProfile: '',
  contratoComedor: '',
  formularios: [],
  cardToCheck: {},
  objectToCheck: {},
  editMode: false,
  listaRecordatorios: [],
  legajoProfile: {},
  formulariosLegajo: [],
}

const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    // creo una accion que cambie el estado logged a true o false dependiendo del valor recibido
    setLogged(state, action) {
      state.logged = action.payload;
    },
    setLegajoProfile(state, action) {
      state.legajoProfile = action.payload;
    },
    setListaRecordatorios(state, action) {
      state.listaRecordatorios = action.payload;
    },
    setFormulariosLegajo(state, action) {
      state.formulariosLegajo = action.payload;
    },
    setObjectToCheck(state, action) {
      state.objectToCheck = action.payload;
    },
    // actions que editan token, rol e id con valores recibidos
    setToken(state, action) {
      state.token = action.payload;
    },
    setEditMode(state, action) {
      state.editMode = action.payload;
    },
    setRol(state, action) {
      state.rol = action.payload;
    },
    setId(state, action) {
      state.id = action.payload;
    },
    // creo acciones para editar fullName, legajo, number, puesto, rol, provincia, localidad y contratoComedor
    setFullName(state, action) {
      state.fullName = action.payload;
    },
    setLegajo(state, action) {
      state.legajo = action.payload;
    }
    ,
    setImgProfile(state, action) {
      state.imgProfile = action.payload;
    }
    ,
    setNumber(state, action) {
      state.number = action.payload;
    }
    ,
    setBusiness(state, action) {
      state.business = action.payload;
    },
    setPuesto(state, action) {
      state.puesto = action.payload;
    }
    ,
    setProvincia(state, action) {
      state.provincia = action.payload;
    }
    ,
    setLocalidad(state, action) {
      state.localidad = action.payload;
    }
    ,
    setContratoComedor(state, action) {
      state.contratoComedor = action.payload;
    }
    ,
    setFormularios(state, action) {
      state.formularios = action.payload;
    }
    ,
    setCardToCheck(state, action) {
      state.cardToCheck = action.payload;
    }
  },
});

const store = configureStore({
  reducer: counterSlice.reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

const Stack = createNativeStackNavigator();

export default function App() {

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Loading"
            component={Loading}
            options={{ title: 'Cargando...' }}
          />
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ title: 'Login' }}
          />
          <Stack.Screen
            name="Inicio"
            component={Inicio}
            options={{ title: 'Inicio' }}
          />
          <Stack.Screen
            name="SolicitudesEdicion"
            component={SolicitudesEdicion}
            options={{ title: 'Solicitudes Edicion' }}
          />
          <Stack.Screen
            name="Legajos"
            component={Legajos}
            options={{ title: 'Legajos' }}
          />
          <Stack.Screen
            name="PasswordRecovery"
            component={PasswordRecovery}
            options={{ title: 'Password Recovery' }}
          />
          <Stack.Screen
            name="PasswordCreate"
            component={PasswordCreate}
            options={{ title: 'Password Create' }}
          />
          <Stack.Screen
            name="FormDetailsLegajos"
            component={FormDetailsLegajos}
            options={{ title: 'Formularios Cargados del Legajo' }}
          />
          <Stack.Screen
            name="Profile"
            component={Profile}
            options={{ title: 'Profile' }}
          />
          <Stack.Screen
            name="ProfileLegajos"
            component={ProfileLegajos}
            options={{ title: 'Legajo' }}
          />
          <Stack.Screen
            name="CreateAccount"
            component={CreateAccount}
            options={{ title: 'Create Account' }}
          />
          <Stack.Screen
            name="Formularios"
            component={Formularios}
            options={{ title: 'Formularios' }}
          />
          <Stack.Screen
            name="Recordatorios"
            component={Recordatorios}
            options={{ title: 'Recordatorios' }}
          />
          <Stack.Screen
            name="FormCreate"
            component={FormCreate}
            options={{ title: 'Form edition' }}
          />
          <Stack.Screen
            name="FormulariosCargados"
            component={FormulariosCargados}
            options={{ title: 'Formularios Cargados' }}
          />
          <Stack.Screen
            name="FormView"
            component={FormView}
            options={{ title: 'Form View' }}
          />
          <Stack.Screen
            name="FormDetails"
            component={FormDetails}
            options={{ title: 'Form Details' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}