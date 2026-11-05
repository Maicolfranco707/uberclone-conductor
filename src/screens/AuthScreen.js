// AI-assisted: see docs/AI_LOG.md #1
import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase';
import Field from '../components/Field';
import { validators } from '../utils/validators';
import { s } from '../theme';

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

  const go = async () => {
    setServerError('');
    try {
      const fn = mode === 'login' ? signInWithEmailAndPassword : createUserWithEmailAndPassword;
      await fn(auth, email.trim(), password);
    } catch (e) {
      setServerError('No se pudo completar: ' + e.code);
    }
  };

  return (
    <View style={[s.screen, { justifyContent: 'center' }]}>
      <Text style={s.title}>UberClone Conductor</Text>
      <Field def={{ label: 'Correo', keyboard: 'email-address' }} value={email} error={touched.email ? errors.email : ''} onChange={setEmail} onTouch={() => setTouched((t) => ({ ...t, email: true }))} />
      <Field def={{ label: 'Contraseña', secure: true }} value={password} error={touched.password ? errors.password : ''} onChange={setPassword} onTouch={() => setTouched((t) => ({ ...t, password: true }))} />
      {serverError ? <Text style={s.error}>{serverError}</Text> : null}
      <Pressable style={[s.btn, !valid && s.btnOff]} disabled={!valid} onPress={go}>
        <Text style={s.btnText}>{mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}</Text>
      </Pressable>
      <Pressable onPress={() => setMode(mode === 'login' ? 'register' : 'login')} style={{ marginTop: 16 }}>
        <Text style={{ textAlign: 'center' }}>{mode === 'login' ? '¿Sin cuenta? Regístrate' : 'Ya tengo cuenta'}</Text>
      </Pressable>
    </View>
  );
}
