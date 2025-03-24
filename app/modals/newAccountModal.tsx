import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { ProgressBar } from 'react-native-paper';
import * as SecureStore from 'expo-secure-store';
import { addBillingInfo } from '@/scripts/database';
import { Keyboard } from 'react-native';
import TermsModal from '@/app/modals/terms&conditionsModal';
import styles from '@/app/styles/newaccStyles';

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
  
              // console.log(`✅ Δεδομένα που αποθηκεύτηκαν στη SQLite για: ${currentForm}`);
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
              <Text style={styles.submitButtonText}>Υποβολή</Text>
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


export default NewAccount;