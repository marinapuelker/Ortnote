import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.fundo}
    >
        <View style={styles.logoContainer}>
          <Image
            source={require('./logo.png')}
            style={styles.imagem}
            resizeMode="contain"
          />
          <Text style={styles.subtitulo}>Compartilhe conhecimento. Simplifique o estudo.</Text>
        </View>

        <View style={styles.cartao}>
          <Text style={styles.labelCampo}>EMAIL</Text>
          <TextInput
            style={styles.input}
            placeholder='nome.sobrenome@ort.org.br'
            placeholderTextColor='#A0A0A0'
            keyboardType='email-address'
            autoCapitalize='none'
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.labelCampo}>SENHA</Text>
          <TextInput
            style={styles.input}
            placeholder='••••••••••'
            placeholderTextColor='#A0A0A0'
            secureTextEntry={true}
            value={senha}
            onChangeText={setSenha}
          />

          <TouchableOpacity style={styles.botao} onPress={handleLogin} activeOpacity={0.8}>
            <Text style={styles.botaoTexto}>ENTRAR</Text>
          </TouchableOpacity>

        <View style={styles.logoContainer2}>
          <Image 
          source={require('./loguinho.png')}
          stytle={styles.logo2}
          />
        </View>
        </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  fundo: {
    flex: 1,
    backgroundColor: '#b6dcff',
  },
  fundoContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  logoContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagem: {
    width: 350,
    height: 110,
    marginLeft: 110,
    marginTop: 50
  },
  cartao: {
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 30,
    marginBottom: 90,
  },
  labelCampo: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#5C4100', 
    marginBottom: 8,
    marginLeft: 4,
    letterSpacing: 1,
  },
  input: {
    backgroundColor: '#ffd900', 
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 52, 
    fontSize: 14,
    color: '#222222',
    marginBottom: 20,
    width: '100%',
  },
  botao: {
    backgroundColor: '#BC72DE',
    borderRadius: 60,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    elevation: 9,
    shadowColor: '#b700ff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    marginBottom: 110,
  },
  botaoTexto: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
  },
  subtitulo: {
    fontSize: 17,
    marginBottom: 90,
    color: 'purple'
  },
logoContainer2: {
    alignItems: 'center',
    marginTop: 90
  },
});