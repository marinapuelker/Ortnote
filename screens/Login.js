import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { entrar, cadastrar } from '../services/auth';

function mensagemDeErro(e) {
  switch (e.code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'E-mail ou senha incorretos.';
    case 'auth/email-already-in-use':
      return 'Esse e-mail já está cadastrado.';
    case 'auth/weak-password':
      return 'A senha precisa ter pelo menos 6 caracteres.';
    case 'auth/invalid-email':
      return 'E-mail inválido.';
    case 'auth/too-many-requests':
      return 'Muitas tentativas. Tente novamente em alguns minutos.';
    default:
      return e.message;
  }
}

export default function Login({ navigation }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [modoCadastro, setModoCadastro] = useState(false);
  const [carregando, setCarregando] = useState(false);

  async function handleLogin() {
    if (carregando) return;

    if (email === '' || senha === '' || (modoCadastro && nome === '')) {
      alert('Atenção, preencha todos os campos.');
      return;
    }

    try {
      setCarregando(true);
      if (modoCadastro) {
        await cadastrar(email, senha, nome);
        alert('Enviamos um link de confirmação para o seu e-mail. Clique nele e depois entre.');
        setModoCadastro(false);
        setSenha('');
      } else {
        await entrar(email, senha);
        setSenha('');
        navigation.navigate('Home');
      }
    } catch (e) {
      alert(mensagemDeErro(e));
    } finally {
      setCarregando(false);
    }
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

            {modoCadastro && (
              <>
                <Text style={styles.labelCampo}>NOME</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name='person-outline' size={20} color='#5C4100' style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Seu nome"
                    placeholderTextColor='#777777'
                    value={nome}
                    onChangeText={setNome}
                  />
                </View>
              </>
            )}

            <Text style={styles.labelCampo}>EMAIL</Text>
            <View style={styles.inputContainer}>
              <Ionicons name='mail-outline' size={20} color='#5C4100' style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="seuemail@exemplo.com"
                placeholderTextColor='#777777'
                keyboardType='email-address'
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>
            <Text style={styles.labelCampo}>SENHA</Text>
            <View style={styles.inputContainer}>
              <Ionicons name='lock-closed-outline' size={20} color='#5C4100' style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder='••••••••••'
                placeholderTextColor="#777777"
                secureTextEntry={!mostrarSenha}
                value={senha}
                onChangeText={setSenha}
                onSubmitEditing={handleLogin}
              />
              <TouchableOpacity onPress={() => setMostrarSenha(!mostrarSenha)}>
                <Ionicons 
                  name={mostrarSenha ? 'eye-outline' : 'eye-off-outline'} 
                  size={20} 
                  color='#5C4100'
                  style={styles.iconeOlho} 
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={handleLogin}
              disabled={carregando}
              activeOpacity={0.8}
              style={styles.botao}
            >
              <LinearGradient
                colors={['#B77FD1', '#8607cf']} 
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.botaoGradiente}
              >
                <Text style={styles.botaoTexto}>
                  {carregando ? 'Aguarde...' : modoCadastro ? 'Criar conta' : 'Entrar'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setModoCadastro(!modoCadastro)}
              style={{ marginTop: 16 }}
            >
              <Text style={{ color: '#5C4100', fontWeight: '600' }}>
                {modoCadastro ? 'Já tenho conta' : 'Criar conta'}
              </Text>
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