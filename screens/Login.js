import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);

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
      style={{ flex: 1 }}
    >
      <LinearGradient
        colors={['#ffda73', '#ffda73', '#dca8e8', '#ff9494']} 
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.fundo}
      >
        <View style={styles.containerPrincipal}>
          <View style={styles.logoContainer}>
            <Image
              source={require('./logo.png')}
              style={styles.imagem}
              resizeMode='contain'
            />
          </View>
          <View style={styles.cartao}>
            
            <Text style={styles.labelCampo}>EMAIL</Text>
            <View style={styles.inputContainer}>
              <Ionicons name='mail-outline' size={20} color='#5C4100' style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="nome.sobrenome@ort.org.br"
                placeholderTextColor='#777777'
                keyboardType='email-address'
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>
            <Text style={styles.labelCampo}>SENHA</Text>
            <View style={styles.inputContainer}>
              <Ionicons name='lock-closed-outline' size={20} color="#5C4100" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder='••••••••••'
                placeholderTextColor="#777777"
                secureTextEntry={!mostrarSenha}
                value={senha}
                onChangeText={setSenha}
              />
            <TouchableOpacity onPress={() => setMostrarSenha(!mostrarSenha)}>
                <Ionicons 
                  name={mostrarSenha ? 'eye-outline' : 'eye-off-outline'} 
                  size={20} 
                  color="#5C4100" 
                  style={styles.iconeOlho} 
                />
              </TouchableOpacity>
            </View>
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
                style={styles.logo2}
                resizeMode="contain"
              />
            </View>
          </View>
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  fundo: {
    flex: 1,
  },
  containerPrincipal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  logoContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  imagem: {
    width: 260, 
    height: 100,
    marginLeft: 75
  },
  cartao: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  labelCampo: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#5C4100', 
    marginBottom: 6,
    alignSelf: 'flex-start',
    letterSpacing: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    borderRadius: 16,
    height: 52,
    width: '100%',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  inputIcon: {
    marginRight: 10,
  },
  iconeOlho: {
    marginLeft: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#222222',
    paddingVertical: 0,
    backgroundColor: 'transparent',
    outlineStyle: 'none', 
    boxShadow: 'none',
    borderRadius: 14,
    paddingVertical: 9,
    paddingHorizontal: 13
  },
  botao: {
    width: '100%',
    marginTop: 10,
    borderRadius: 30, 
    overflow: 'hidden', 
    elevation: 6, 
    shadowColor: '#8607cf', 
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  botaoGradiente: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botaoTexto: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  logoContainer2: {
    alignItems: 'center',
    marginTop: 70,
  },
  logo2: {
    width: 100,
    height: 100,
  },
});