// AI-assisted: see docs/AI_LOG.md #2
import React, { useState } from 'react';
import { View, Text, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase';
import Field from '../components/Field';
import { validators } from '../utils/validators';
import { s, colors, fonts } from '../theme';

export default function AuthScreen() {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [touched, setTouched] = useState({});
  const [serverError, setServerError] = useState('');

  const errors = {
    email: validators.email(email),
    password: password.length >= 6 ? '' : 'Mínimo 6 caracteres',
  };
  const valid = !errors.email && !errors.password;
  const isLogin = mode === 'login';

  const go = async () => {
    setServerError('');
    try {
      const fn = isLogin ? signInWithEmailAndPassword : createUserWithEmailAndPassword;
      await fn(auth, email.trim(), password);
    } catch (e) {
      setServerError('No se pudo completar: ' + e.code);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={{ flex: 1, justifyContent: 'center', padding: 28 }}>
        <View style={{ width: 56, height: 22, borderRadius: 11, backgroundColor: colors.accent, marginBottom: 24 }} />
        <Text style={{ fontFamily: fonts.bold, fontSize: 36, letterSpacing: -1.2, color: colors.text }}>
          {isLogin ? 'Bienvenido' : 'Crea tu cuenta'}
        </Text>
        <Text style={[s.muted, { marginTop: 8, marginBottom: 12, fontSize: 15 }]}>
          {isLogin ? 'Inicia sesión para recibir viajes y ver tus ganancias.' : 'Después completarás tus datos, tu vehículo y tus documentos.'}
        </Text>

        <Field
          def={{ label: 'Correo', keyboard: 'email-address' }}
          value={email}
          error={touched.email ? errors.email : ''}
          onChange={setEmail}
          onTouch={() => setTouched((t) => ({ ...t, email: true }))}
        />
        <Field
          def={{ label: 'Contraseña', secure: true }}
          value={password}
          error={touched.password ? errors.password : ''}
          onChange={setPassword}
          onTouch={() => setTouched((t) => ({ ...t, password: true }))}
        />
        {serverError ? <Text style={s.error}>{serverError}</Text> : null}

        <Pressable style={[s.btn, { marginTop: 22 }, !valid && s.btnOff]} disabled={!valid} onPress={go}>
          <Text style={s.btnText}>{isLogin ? 'Iniciar sesión' : 'Crear cuenta'}</Text>
        </Pressable>
        <Pressable onPress={() => setMode(isLogin ? 'register' : 'login')} style={{ marginTop: 20 }}>
          <Text style={{ textAlign: 'center', fontFamily: fonts.semibold, color: colors.text }}>
            {isLogin ? '¿Sin cuenta? Regístrate' : 'Ya tengo cuenta'}
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
