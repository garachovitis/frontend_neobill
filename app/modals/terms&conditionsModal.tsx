import React from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <Modal
      transparent
      animationType="fade"
      visible={isOpen}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>❌</Text>
          </TouchableOpacity>

          <ScrollView style={styles.content}>
            <Text style={styles.title}>Όροι και Προϋποθέσεις</Text>
            <Text style={styles.text}>
            <Text style={{ fontWeight: 'bold' }}>1. Εισαγωγή</Text>{'\n'}
              Η εφαρμογή neobill παρέχει στους χρήστες της τη δυνατότητα να παρακολουθούν λογαριασμούς κοινής ωφελείας (ΔΕΚΟ) τοπικά στις συσκευές τους. Η χρήση της εφαρμογής προϋποθέτει τη συναίνεση του χρήστη με τους παρόντες όρους.{'\n\n'}

              <Text style={{ fontWeight: 'bold' }}>2. Εξόρυξη Δεδομένων Χρηστών</Text>{'\n'}
              Η εφαρμογή neobill χρησιμοποιεί τεχνικές εξόρυξης για την ανάκτηση δεδομένων από ιστοτόπους παροχών κοινής ωφελείας. Οι πληροφορίες που αντλούνται αφορούν αποκλειστικά λογαριασμούς που ανήκουν στον χρήστη και αποθηκεύονται τοπικά στη συσκευή του και μόνο εκεί. Κανένα από αυτά τα δεδομένα δεν αποθηκεύεται ή συλλέγεται από την εταιρεία μας και ούτε έχουμε πρόσβαση σε αυτά.{'\n\n'}

              <Text style={{ fontWeight: 'bold' }}>3. Κρυπτογράφηση Δεδομένων</Text>{'\n'}
              Όλα τα προσωπικά στοιχεία και τα δεδομένα λογαριασμών του χρήστη κρυπτογραφούνται και αποθηκεύονται τοπικά στη συσκευή του χρήστη. Οι κωδικοί πρόσβασης και άλλα στοιχεία ασφαλείας αποθηκεύονται επίσης κρυπτογραφημένα και τοπικά.{'\n\n'}

              <Text style={{ fontWeight: 'bold' }}>4. Διαχείριση Δεδομένων από τον Χρήστη</Text>{'\n'}
              Ο χρήστης είναι αποκλειστικά υπεύθυνος για τη διαχείριση των δεδομένων του μέσω της εφαρμογής. Έχει τη δυνατότητα να διαγράψει όλα τα δεδομένα του ανά πάσα στιγμή μέσα από την εφαρμογή.{'\n\n'}

              <Text style={{ fontWeight: 'bold' }}>5. Μη Συλλογή Δεδομένων</Text>{'\n'}
              Η εταιρεία μας δεν συλλέγει ή επεξεργάζεται τα δεδομένα του χρήστη. Όλες οι πληροφορίες παραμένουν τοπικά στη συσκευή του χρήστη και δεν αποθηκεύονται σε κεντρικούς διακομιστές.{'\n\n'}

              <Text style={{ fontWeight: 'bold' }}>6. Ασφάλεια</Text>{'\n'}
              Η ασφάλεια των προσωπικών δεδομένων είναι υψίστης σημασίας για εμάς. Παρέχουμε κρυπτογράφηση υψηλού επιπέδου και ασφαλή αποθήκευση των δεδομένων στον τοπικό χώρο της συσκευής του χρήστη.{'\n\n'}

              <Text style={{ fontWeight: 'bold' }}>7. Ευθύνη</Text>{'\n'}
              Η εταιρεία δεν φέρει ευθύνη για τυχόν απώλεια δεδομένων που προκύπτει από εσφαλμένη χρήση της εφαρμογής από τον χρήστη ή από ανασφαλείς συσκευές. Επιπλέον, ο χρήστης έχει την πλήρη ευθύνη και την αποκλειστική δυνατότητα αξιοποίησης των δεδομένων που συλλέγονται από τους παρόχους καθώς και αδειοδοτεί την εταιρεία neobill να του παρέχει τη δυνατότητα αυτή.{'\n\n'}

              <Text style={{ fontWeight: 'bold' }}>8. Ισχύουσα Νομοθεσία</Text>{'\n'}
              Η εφαρμογή neobill και οι διαδικασίες που ακολουθούνται συμμορφώνονται με τον Γενικό Κανονισμό για την Προστασία Δεδομένων (GDPR) (Κανονισμός (ΕΕ) 2016/679), ο οποίος διέπει την επεξεργασία και προστασία των προσωπικών δεδομένων στην Ευρωπαϊκή Ένωση. Σύμφωνα με αυτόν τον κανονισμό: 
                <Text style={styles.bullet}>• Οι χρήστες έχουν το δικαίωμα να διαχειρίζονται, να διαγράφουν και να ελέγχουν τα προσωπικά τους δεδομένα.</Text>{'\n'}
                <Text style={styles.bullet}>• Η εφαρμογή εφαρμόζει την προστασία των δεδομένων εξ ορισμού και χρησιμοποιεί κρυπτογράφηση για την ασφάλεια των προσωπικών δεδομένων.</Text>{'\n'}
                <Text style={styles.text}>
                Επιπλέον, η εφαρμογή συμμορφώνεται με τις διατάξεις του Ελληνικού Νόμου 4624/2019, ο οποίος ενσωματώνει τον GDPR στην εθνική νομοθεσία και καθορίζει επιπλέον υποχρεώσεις για την επεξεργασία των προσωπικών δεδομένων στην Ελλάδα. Συγκεκριμένα:
              </Text>{'\n'}
                <Text style={styles.bullet}>• Τα προσωπικά δεδομένα των χρηστών προστατεύονται, και η εφαρμογή εγγυάται ότι παραμένουν υπό τον πλήρη έλεγχο του χρήστη.</Text>{'\n\n'}
            
            <Text style={styles.text}>
                Με τη χρήση της εφαρμογής neobill, οι χρήστες επιβεβαιώνουν την κατανόησή τους για τους παρόντες όρους και τη συμμόρφωση της εφαρμογής με τα σχετικά νομικά πλαίσια για την προστασία δεδομένων.
            </Text>{'\n\n'}

            </Text>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    width: '90%',
    maxHeight: '80%',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#555',
  },
  content: {
    marginTop: 30,
    maxHeight: 400,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  text: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
  },
  bulletContainer: {
    paddingLeft: 20,
    marginBottom: 10,
},
bullet: {
    fontSize: 14,
    color: '#555',
    marginBottom: 6,
    lineHeight: 20,
}
});

export default TermsModal;