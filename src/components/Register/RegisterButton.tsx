import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import React from 'react';

type ButtonProps = {
  title: string;
  moveNext: () => void;
};

export const RegisterButton = ({title, moveNext}:ButtonProps) => {
  return (
    <TouchableOpacity style={styles.nextButton} onPress={moveNext}>
      <Text style={styles.nextButtonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  nextButton: {
    width: '100%',
    marginTop: 40,
    backgroundColor: '#3B5BFF',
    borderRadius: 10,
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
