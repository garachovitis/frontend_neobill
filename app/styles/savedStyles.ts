import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#3b8193',
    marginVertical: 20,
  },
  monthContainer: {
    marginVertical: 10,
    marginHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  monthText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  companyList: {
    paddingLeft: 15,
    paddingVertical: 5,
  },
  companyLink: {
    fontSize: 16,
    color: '#3b8193',
    textDecorationLine: 'underline',
    marginVertical: 3,
  },
});

export default styles;