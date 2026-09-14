import React, { useState } from 'react';
import {View,Text,TextInput, TouchableOpacity, StyleSheet, Alert, Image} from 'react-native';

export default function Login({ navigation }) {

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  function handleLogin() {
    if (email === '' || senha === '') {
      alert('Atenção, preencha o email e a senha.');
      return; 
    }

      navigation.navigate('HomeScreen'); 
  }

  return (
    <View style={styles.fundo}>
    <Image source={require('./logo.png')} style={styles.imagem} resizeMode="contain"/>
    
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
          <Text style={styles.botaoTexto}>ENTRAR →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fundo: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',  
  },
  cartao: {
    backgroundColor: '#f5c534', 
    borderTopLeftRadius: 90,
    borderTopRightRadius: 90,
    padding: 28,
    width: '100%',
    height: '85%',
    marginTop: 160,
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 9)',
    elevation: 10,
  },
  labelCampo: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#805701',
    marginTop: 40,
    marginBottom: 7,
    letterSpacing: 1,
    marginLeft: 40
  
  },
  input: {
    backgroundColor: '#d4a800',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 20,
    fontSize: 15,
    color: '#fff',
    marginBottom: 4,
    width: '85%',
    marginLeft: 35
  },
  botao: {
    backgroundColor: '#8c06da',
    borderRadius: 12,
    paddingVertical: 20,
    alignItems: 'center',
    marginTop: '80%',
    width: '85%',
    marginLeft: 40
  },
  botaoTexto: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    letterSpacing: 1,
  },
  imagem: {
    position: 'absolute',
    top: 0,
    left: 0,
    marginLeft: 100,
    width: 500,
    height: 160,
    alignSelf: 'center',   
},
});