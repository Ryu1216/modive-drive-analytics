import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

type Props = {
  value: string;
  setValues: (text: string) => void;
  moveNext: () => void;
};

export default function RegisterDriveScreen({ value, setValues, moveNext }: Props) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: '1년 미만',  value: '0' },
    { label: '1년 이상',  value: '1' },
    { label: '2년 이상',  value: '2' },
    { label: '3년 이상',  value: '3' },
    { label: '4년 이상',  value: '4' },
    { label: '5년 이상',  value: '5' },
    { label: '6년 이상',  value: '6' },
    { label: '7년 이상',  value: '7' },
    { label: '8년 이상',  value: '8' },
    { label: '9년 이상',  value: '9' },
    { label: '10년 이상', value: '10' },
  ]);

  return (
    <View>
      <Text style={styles.title}>운전 경력을 선택해주세요.</Text>
      <Text style={styles.content}>선택하신 운전 경력에 맞는 피드백을 제공해드릴게요.</Text>

      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValues}
        setItems={setItems}
        placeholder="선택"
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownContainer}
      />
      <Text style={styles.charCount}/>
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
  dropdown: {
    marginTop: 20,
    borderColor: '#D9D9D9',
    width: 320,
    height: 56,
  },
  dropdownContainer: {
    borderColor: '#D9D9D9',
    marginTop: 20,
    width: 320,
    height: 200,
  },
  charCount: {
    alignSelf: 'flex-end',
    fontSize: 16,
    color: '#C7C7CD',
    marginTop: 10,
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
