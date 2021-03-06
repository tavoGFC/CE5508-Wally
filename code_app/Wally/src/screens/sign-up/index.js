import * as React from 'react';
import {
  ActivityIndicator,
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import stylesSignUp from '../../styles/styles';
import SimpleCrypto from 'simple-crypto-js';

export default class SignUp extends React.Component {
  static navigationOptions = {
    title: 'Registrese en Wally'
  };

  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      response: ''
    };

    this.validateName = this.validateName.bind(this);
    this.validateEmail = this.validateEmail.bind(this);
    this.validatePassword = this.validatePassword.bind(this);
  }

  _onSearchNameUser = event => {
    this.setState({
      name: event.nativeEvent.text
    });
  };

  _onSearchEmailUser = event => {
    this.setState({
      email: event.nativeEvent.text
    });
  };

  _onSearchPasswordUser = event => {
    this.setState({
      password: event.nativeEvent.text
    });
  };

  _onSearchConfirmPasswordUser = event => {
    this.setState({
      confirmPassword: event.nativeEvent.text
    });
  };

  _signUp = () => {
    const formData = new FormData();
    formData.append('name', this.state.name);
    formData.append('email', this.state.email);
    const simpleCrypto = new SimpleCrypto('RNwallyAPP');
    const passwordEncrypt = simpleCrypto.encrypt(this.state.password);
    formData.append('password', passwordEncrypt);
    fetch('http://192.168.43.84:8000/api/v1/users/insert', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      body: formData
    })
      .then(response => response.text())
      .then(responseMessage => {
        if (responseMessage === '1') {
          this.props.navigation.navigate('Home');
        } else {
          Alert.alert('Ya existe una cuenta con este correo electronico.');
        }
      });
  };

  _submitInformation = () => {
    if (
      this.validateName() &&
      this.validateEmail() &&
      this.validatePassword()
    ) {
      this._signUp();
    } else {
      Alert.alert('Los datos ingresados son incorrectos.');
    }
  };

  validateName() {
    if (this.state.name === '') {
      return false;
    } else {
      return true;
    }
  }

  validateEmail() {
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(this.state.email) === false) {
      return false;
    } else {
      return true;
    }
  }

  validatePassword() {
    if (this.state.password !== this.state.confirmPassword) {
      return false;
    }
    if (this.state.password === '' || this.state.confirmPassword === '') {
      return false;
    } else {
      return true;
    }
  }

  render() {
    const spinner = this.state.isLoading ? (
      <ActivityIndicator size='large' />
    ) : null;
    return (
      <View style={styles.containerSignUp}>
        <Text style={styles.description}>
          Bienvenido. Por favor ingrese datos.
        </Text>
        <View style={styles.flowRight}>
          <TextInput
            onChange={this._onSearchNameUser}
            placeholder='Nombre'
            placeholderTextColor='#656565'
            style={styles.textInput}
            underlineColorAndroid={'transparent'}
            value={this.state.searchNameUser}
          />
          <TextInput
            autoCapitalize={'none'}
            onChange={this._onSearchEmailUser}
            placeholder='Correo'
            placeholderTextColor='#656565'
            style={styles.textInput}
            underlineColorAndroid={'transparent'}
            value={this.state.searchEmailUser}
          />
          <TextInput
            onChange={this._onSearchPasswordUser}
            placeholder='Contraseña'
            placeholderTextColor='#656565'
            secureTextEntry={true}
            style={styles.textInput}
            underlineColorAndroid={'transparent'}
            value={this.state.searchPasswordUser}
          />
          <TextInput
            onChange={this._onSearchConfirmPasswordUser}
            placeholder='Repetir Contraseña '
            placeholderTextColor='#656565'
            secureTextEntry={true}
            style={styles.textInput}
            underlineColorAndroid={'transparent'}
            value={this.state.searchConfirmPasswordUser}
          />
        </View>
        <TouchableOpacity onPress={this._submitInformation}>
          <Text style={styles.button}>REGISTRARSE</Text>
        </TouchableOpacity>
        {spinner}
      </View>
    );
  }
}

const styles = stylesSignUp;
