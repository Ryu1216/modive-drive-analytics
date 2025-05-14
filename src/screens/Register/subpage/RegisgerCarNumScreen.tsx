import React from 'react';
import {View, Text, StyleSheet, TextInput, TouchableOpacity} from 'react-native';

type Props = {
  text: string;
  setText: (text: string) => void;
  moveNext: () => void;
};

export default function RegisgerCarNumScreen({ text, setText, moveNext }: Props) {
  return (
    <View>
      <Text style={styles.title}>차량 번호를 입력해주세요.</Text>
      <Text style={styles.content}>차량 정보를 바탕으로 주행 데이터를 분석해드릴게요.</Text>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="04히 2025"
          placeholderTextColor="#C7C7CD"
          style={styles.textInput}
          maxLength={10}
          value={text}
          onChangeText={setText}
        />
      </View>
      <Text style={styles.charCount} />
      <TouchableOpacity
        style={styles.nextButton}
        onPress={moveNext}>
        <Text style={styles.nextButtonText}>다음</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#565656',
  },
  content: {
    fontSize: 14,
    color: '#565656',
    opacity: 0.7,
    marginTop: 2,
  },
  inputContainer: {
    position: 'relative',
    marginTop: 20,
  },
  textInput: {
    height: 56,
    borderWidth: 1,
    borderColor: '#D1D1D6',
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#000',
  },
  charCount: {
    alignSelf: 'flex-end',
    fontSize: 16,
    color: '#C7C7CD',
    marginTop: 10,
  },
  nextButton: {
    width: 300,
    height: 56,
    marginTop: 40,
    backgroundColor: '#3B5BFF',
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
})
