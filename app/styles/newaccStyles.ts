import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20,  
  },
  menu: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 20, 
    marginTop: 20 
  },
  serviceButton: { 
    padding: 15, 
    borderRadius: 25, 
    alignItems: 'center', 
    flex: 1, 
    marginHorizontal: 5 
  },
  buttonText: { 
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 14 
  },
  cosmoteButton: { 
    backgroundColor: '#78be20' 
  },
  deiButton: { 
    backgroundColor: '#003366' 
  },
  deyapButton: { 
    backgroundColor: '#0072bc' 
  },
  formContainer: {
    marginBottom: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  formTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginBottom: 20, 
    color: '#333' 
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 13,
    borderRadius: 15,
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
  },
  resultMessageContainer: { 
    marginBottom: 20, 
    padding: 15, 
    borderRadius: 10, 
    alignItems: 'center' 
  },
  resultMessageText: { 
    fontSize: 16, 
    color: '#333' 
  },
  submitButton: {
    marginTop: 20,
    alignSelf: 'center',
    alignItems: 'center',
    width: 200,
    padding: 15,
    backgroundColor: '#37B7C3',
    borderRadius: 25,
  },
  disabledButton: { 
    backgroundColor: '#cccccc' 
  },
  submitButtonText: { 
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 18 
  },
  checkboxContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 10 
  },
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
    backgroundColor: '#d4edda',
  },
  errorMessage: {
    backgroundColor: '#f8d7da',
  },
  successText: {
    color: '#155724',
    fontWeight: 'bold',
  },
  errorText: {
    color: '#721c24',
    fontWeight: 'bold',
  },
  progressText: { 
    textAlign: 'center', 
    marginTop: 5, 
    fontSize: 16, 
    fontWeight: 'bold',
    color: '#333',
  },
  checkmark: { 
    fontSize: 14, 
    color: '#007bff' 
  },
  termsText: { 
    color: '#007bff', 
    textDecorationLine: 'underline' 
  },
  progressBar: { 
    marginTop: 20, 
    height: 10, 
    borderRadius: 5 
  },
  progressMessage: {
    marginTop: 8,
    fontSize: 16,
    color: '#888', 
    textAlign: 'center', 
  },
});

export default styles;