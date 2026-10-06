import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

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

        <TouchableOpacity onPress={handleLogin} activeOpacity={0.8} style={styles.botao}>
            <LinearGradient
            colors={['#B77FD1', '#8607cf']} 
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.botaoGradiente}
              >
            <Text style={styles.botaoTexto}>Entrar</Text>
            </LinearGradient>
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
    backgroundColor: '#ffdd6d',
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
    paddingVertical: 40,
    marginBottom: 90,
  },
  labelCampo: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#5C4100', 
    marginBottom: 8,
    marginLeft: 55,
    letterSpacing: 1,
  },
  input: {
    backgroundColor: 'transparent', 
    borderWidth: 1.9,
    borderColor: 'white',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 30,
    height: 52, 
    fontSize: 14,
    color: '#222222',
    marginBottom: 20,
    marginLeft: 50,
    width:'80%',
  },
  botao: {
    width: '85%',
    marginTop: 20,
    marginLeft: 40,
    borderRadius: 30, 
    overflow: 'hidden', 
    elevation: 4, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  botaoGradiente: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botaoTexto: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
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