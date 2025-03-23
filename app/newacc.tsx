import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { ProgressBar } from 'react-native-paper';
import * as SecureStore from 'expo-secure-store';
import { addBillingInfo } from '@/scripts/database';
import { Keyboard } from 'react-native';
import TermsModal from '@/app/terms&conditions';

Keyboard.dismiss(); 



Keyboard.dismiss(); 

const NewAccount: React.FC = () => {
  const [currentForm, setCurrentForm] = useState<string | null>(null);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [resultMessage, setResultMessage] = useState<string | null>(null);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState<boolean>(true);
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0); 
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

  


  useEffect(() => {
    loadCredentials();
  }, []);


  useEffect(() => {
    setIsSubmitDisabled(!(username && password && termsAccepted));
  }, [username, password, termsAccepted]);

  


  const loadCredentials = async () => {
    try {
      const storedUsername = await SecureStore.getItemAsync('username');
      const storedPassword = await SecureStore.getItemAsync('password');

      if (storedUsername && storedPassword) {
        setUsername(storedUsername);
        setPassword(storedPassword);
      }
    } catch (error) {
      console.log('Error retrieving credentials:', error);
    }
  };

  const showForm = (service: string) => {
    setCurrentForm(service);
    setUsername('');
    setPassword('');
    setResultMessage(null);
  };

  const openTermsAndConditions = () => {

    setIsTermsModalOpen(true);
  };

  const submitForm = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Παρακαλώ εισάγετε username και password.');
      return;
    }
  
    try {
      setIsLoading(true);
      setProgress(0);
      setResultMessage(null);

      const interval = setInterval(() => {
        setProgress((prev) => (prev < 1 ? prev + 0.005 : 1)); 
      }, 500);
  
      setTimeout(async () => {
        try {
          const response = await axios.post('https://backend-billy.onrender.com/api/save', {
            service: currentForm,
            username,
            password,
          });
  
          if (response.data.status === 'success' && response.data.data) {
            clearInterval(interval); 
            setProgress(1); 
            try {
             
              await SecureStore.setItemAsync('username', username);
              await SecureStore.setItemAsync('password', password);
  
              const billingData = JSON.stringify(response.data.data); 
  

  
              await addBillingInfo(currentForm!, username, null, billingData);
  
              console.log(`✅ Δεδομένα που αποθηκεύτηκαν στη SQLite για: ${currentForm}`);
              console.log(billingData); 
  
              setResultMessage(`Τα δεδομένα αποθηκεύτηκαν επιτυχώς για: ${currentForm}`);
              setUsername('');
              setPassword('');
              setTermsAccepted(false);
            } catch (secureStoreError) {
              console.error('Error saving credentials:', secureStoreError);
              setResultMessage('Failed to save credentials locally.');
            }
          } else {
            setResultMessage('Connection failed');
          }
        } catch (error) {
          clearInterval(interval); 
          setProgress(0); 
          setResultMessage('Connection failed');
        } finally {
          setIsLoading(false);
          setIsSubmitDisabled(true);
        }
      }, 5000);
    } catch (error) {
      setResultMessage('Connection failed');
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {resultMessage && (
        <View
          style={[
            styles.resultMessageContainer,
            resultMessage.toLowerCase().includes('αποθηκεύτηκαν') || resultMessage.toLowerCase().includes('επιτυχώς')
              ? styles.successMessage
              : styles.errorMessage,
          ]}
        >
          <Text
            style={[
              styles.resultMessageText,
              resultMessage.toLowerCase().includes('αποθηκεύτηκαν') || resultMessage.toLowerCase().includes('επιτυχώς')
                ? styles.successText
                : styles.errorText,
            ]}
          >
            {resultMessage}
          </Text>
        </View>
      )}
  
      <View style={styles.menu}>
        <TouchableOpacity
          style={[styles.serviceButton, styles.cosmoteButton]}
          onPress={() => showForm('cosmote')}
        >
          <Text style={styles.buttonText}>Cosmote</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.serviceButton, styles.deiButton]}
          onPress={() => showForm('dei')}
        >
          <Text style={styles.buttonText}>ΔΕΗ</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.serviceButton, styles.deyapButton]}
          onPress={() => showForm('deyap')}
        >
          <Text style={styles.buttonText}>ΔΕΥΑΠ</Text>
        </TouchableOpacity>
      </View>

        {currentForm && (
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>
            Σύνδεση σε: {currentForm === 'cosmote' ? 'Cosmote' : currentForm === 'dei' ? 'ΔΕΗ' : 'ΔΕΥΑΠ'}
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Εισαγωγή username"
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            style={styles.input}
            placeholder="Εισαγωγή password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
  
          <View style={styles.checkboxContainer}>
            <TouchableOpacity
              onPress={() => setTermsAccepted(!termsAccepted)}
              style={styles.checkbox}
            >
              {termsAccepted && <Text style={styles.checkmark}>✔</Text>}
            </TouchableOpacity>
            <TouchableOpacity onPress={openTermsAndConditions}>
              <Text style={styles.termsText}>Αποδοχή όρων χρήσης</Text>
            </TouchableOpacity>

          </View>
  
          {/* Progress bar */}
          {isLoading ? (
            <View>
              <ProgressBar progress={progress} color="#37B7C3" style={styles.progressBar} />
              <Text style={styles.progressText}>{Math.round(progress * 100)}%</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.submitButton, isSubmitDisabled && styles.disabledButton]}
              onPress={submitForm}
              disabled={isSubmitDisabled}
            >
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
  
      {isTermsModalOpen && (
        <TermsModal 
          isOpen={isTermsModalOpen} 
          onClose={() => setIsTermsModalOpen(false)} 
        />
      )}
    </View>
  );

};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20,  },
  menu: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, marginTop: 20 },
  serviceButton: { padding: 15, borderRadius: 25, alignItems: 'center', flex: 1, marginHorizontal: 5 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  cosmoteButton: { backgroundColor: '#78be20' },
  deiButton: { backgroundColor: '#003366' },
  deyapButton: { backgroundColor: '#0072bc' },
  formContainer: {
    marginBottom: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  formTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
  },
  resultMessageContainer: { marginBottom: 20, padding: 15, borderRadius: 10, alignItems: 'center' },
  resultMessageText: { fontSize: 16, color: '#333' },
  submitButton: {
    marginTop: 20,
    alignSelf: 'center',
    alignItems: 'center',
    width: 200,
    padding: 15,
    backgroundColor: '#37B7C3',
    borderRadius: 25,
  },
  disabledButton: { backgroundColor: '#cccccc' },
  submitButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderRadius: 10,
  },
  successMessage: {
    backgroundColor: '#d4edda', // Ανοιχτό πράσινο φόντο
  },
  errorMessage: {
    backgroundColor: '#f8d7da', // Ανοιχτό κόκκινο φόντο
  },
  successText: {
    color: '#155724', // Σκούρο πράσινο κείμενο
    fontWeight: 'bold',
  },
  errorText: {
    color: '#721c24', // Σκούρο κόκκινο κείμενο
    fontWeight: 'bold',
  },
  progressText: { 
    textAlign: 'center', 
    marginTop: 5, 
    fontSize: 16, 
    fontWeight: 'bold',
    color: '#333',
  },
  checkmark: { fontSize: 14, color: '#007bff' },
  termsText: { color: '#007bff', textDecorationLine: 'underline' },
  progressBar: { marginTop: 20, height: 10, borderRadius: 5 },
});

export default NewAccount;