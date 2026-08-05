import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useAuthStore } from '../../store/authStore';
import { Link, useRouter } from 'expo-router';

export default function RegisterScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const { register, isLoading } = useAuthStore();
  const router = useRouter();

  const handleRegister = async () => {
    setError(null);
    setFieldErrors({});

    let hasError = false;
    const newFieldErrors = {};
    
    if (!fullName) {
      newFieldErrors.fullName = "Full name is required";
      hasError = true;
    }
    if (!email) {
      newFieldErrors.email = "Email is required";
      hasError = true;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newFieldErrors.email = "Please enter a valid email address";
      hasError = true;
    }
    if (!password) {
      newFieldErrors.password = "Password is required";
      hasError = true;
    }

    if (hasError) {
      setFieldErrors(newFieldErrors);
      return;
    }

    try {
      await register(fullName, email, password);
      router.replace('/(auth)/login');
    } catch (err) {
      if (err.message === 'Email already exists') {
        setFieldErrors({ email: err.message });
      } else {
        setError(err.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={[styles.input, fieldErrors.fullName && styles.inputError]}
            placeholder="Enter your full name"
            placeholderTextColor="#8f6f6e"
            value={fullName}
            onChangeText={setFullName}
            editable={!isLoading}
          />
          {fieldErrors.fullName && <Text style={styles.fieldErrorText}>{fieldErrors.fullName}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, fieldErrors.email && styles.inputError]}
            placeholder="Enter your email"
            placeholderTextColor="#8f6f6e"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!isLoading}
          />
          {fieldErrors.email && <Text style={styles.fieldErrorText}>{fieldErrors.email}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={[styles.input, fieldErrors.password && styles.inputError]}
            placeholder="Create a password"
            placeholderTextColor="#8f6f6e"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!isLoading}
          />
          {fieldErrors.password && <Text style={styles.fieldErrorText}>{fieldErrors.password}</Text>}
        </View>

        {error && <Text style={styles.errorText}>{error}</Text>}

        <TouchableOpacity 
          style={[styles.button, isLoading && styles.buttonDisabled]} 
          onPress={handleRegister}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>S'inscrire</Text>
          )}
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <Link href="/(auth)/login" asChild>
            <TouchableOpacity disabled={isLoading}>
              <Text style={styles.link}>Sign in</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff8f7',
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#271717',
    marginBottom: 40,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#271717',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff8f7',
    borderWidth: 1,
    borderColor: '#e4bebc',
    borderRadius: 18,
    height: 56,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#271717',
  },
  inputError: {
    borderColor: '#ba1a1a',
  },
  fieldErrorText: {
    color: '#ba1a1a',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  errorText: {
    color: '#ba1a1a',
    fontSize: 14,
    marginBottom: 16,
    marginTop: -8,
  },
  button: {
    backgroundColor: '#E63946',
    height: 56,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    color: '#5b403f',
    fontSize: 14,
  },
  link: {
    color: '#E63946',
    fontSize: 14,
    fontWeight: '600',
  },
});
