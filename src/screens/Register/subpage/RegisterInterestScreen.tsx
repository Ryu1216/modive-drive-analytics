import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, FlatList} from 'react-native';

type Props = {
  value: string;
  setValue: (text: string) => void;
  register: () => void;
};

export default function RegisterInterestScreen({ value, setValue, register }: Props) {

  const categories = [
    '연비', '보험료',
    '초보운전', '앱테크',
    '차량 관리', '탄소 절감',
    '드라이브 스타', '드라이빙 테크닉',
  ];

  const renderItem = ({ item }: { item: string }) => {
    const isSelected = value === item;

    return (
      <TouchableOpacity
        onPress={() => setValue(item)}
        style={[styles.button, isSelected && styles.selectedButton]}
      >
        <Text style={[styles.text, isSelected && styles.selectedText]}>
          {item}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <View>
      <Text style={styles.title}>관심 있는 항목을 선택해주세요.</Text>
      <Text style={styles.content}>선택한 관심사를 중심으로 리포트를 구성해드릴게요.</Text>
      <View style={styles.listContainer}>
        <FlatList
          data={categories}
          renderItem={renderItem}
          keyExtractor={(item) => item}
          numColumns={2}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
        />
      </View>
      <TouchableOpacity
        style={styles.nextButton}
        onPress={register}>
        <Text style={styles.nextButtonText}>완료</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    marginTop: -75,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#565656',
  },
  content: {
    fontSize: 16,
    color: '#565656',
    opacity: 0.7,
    marginTop: 2,
  },
  listContainer: {
    height: 420,
  },
  grid: {
    paddingHorizontal: 20,
    paddingTop: 20,
    width: 320,
    height: 420,
  },
  button: {
    width: 130,
    aspectRatio: 1.6,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginTop: 5,
  },
  selectedButton: {
    borderColor: '#3B82F6',
    backgroundColor: '#F1F6FF',
  },
  text: {
    fontSize: 16,
    color: '#000',
  },
  selectedText: {
    fontWeight: '500',
  },
  nextButton: {
    width: 320,
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
