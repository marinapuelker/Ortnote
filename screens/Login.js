import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  function handleLogin() {
    if (email === '' || senha === '') {
      alert('Atenção, preencha o email e a senha.');
      return;
    }

    navigation.navigate('Home');
  }

  return (
    <View style={styles.fundo}>
      <Image source={require('./logo.png')} style={styles.imagem}  />

      <View style={styles.cartao}>
        <Text style={styles.labelCampo}>EMAIL</Text>
        <TextInput
          style={styles.input}
          placeholder="nome.sobrenome@ort.org.br"
          placeholderTextColor="#b89a30"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.labelCampo}>SENHA</Text>
        <TextInput
          style={styles.input}
          placeholder="••••••••••"
          placeholderTextColor="#b89a30"
          secureTextEntry={true}
          value={senha}
          onChangeText={setSenha}
        />

        <TouchableOpacity style={styles.botao} onPress={handleLogin}>
          <Text style={styles.botaoTexto}>ENTRAR</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fundo: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  fundoContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 24,
  },
  imagem: {
    width: 200, height: 100,
    marginBottom: 40,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignSelf: 'center'

  },
  labelCampo: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#805701',
    marginTop: 18,
    marginBottom: 7,
    letterSpacing: 1,
    marginLeft: 30,
  },
  input: {
    backgroundColor: '#d4a800',
    borderRadius: 10,
    paddingHorizontal: 90,
    paddingVertical: 14,
    fontSize: 15,
    color: '#fff',
    marginBottom: 4,
    width: '85%',
    alignSelf: 'center',
  },
  botao: {
    backgroundColor: '#8c06da',
    borderRadius: 70,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
    width: '60%',
    alignSelf: 'center',
  },
  botaoTexto: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    letterSpacing: 1,
  },
});