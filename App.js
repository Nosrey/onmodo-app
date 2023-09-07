import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Login from './screens/Login';
import Inicio from './screens/Inicio';
import PasswordRecovery from './screens/PasswordRecovery';
import Loading from './screens/Loading';
import { NavigationContainer } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
// importo de react redux provider, useSelector, useDispatch
import { Provider } from 'react-redux';
// importo de reduxjs/toolkit configureStore y createSlice
import { configureStore, createSlice } from '@reduxjs/toolkit';

const initialState = {
  counter : 0,
}

const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment(state) {
      state.counter += 1;
    },
    decrement(state) {
      state.counter -= 1;
    },
  },
});

const store = configureStore({
  reducer: counterSlice.reducer,
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
            name="PasswordRecovery"
            component={PasswordRecovery}
            options={{ title: 'Password Recovery' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

{/* <NavigationContainer>
<Stack.Navigator>
  <Stack.Screen
    name="Inicio"
    component={Inicio}
    options={{ title: 'Inicio' }}
  />
  <Stack.Screen
    name="Login"
    component={Login}
    options={{ title: 'Login' }}
  />
</Stack.Navigator>
</NavigationContainer> */}


