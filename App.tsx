import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import Detail from './src/Detail';

const App: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Detail />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default App;