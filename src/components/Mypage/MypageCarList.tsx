import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';

type CarProps = {
  car: Car;
  setVisible: (visible: boolean) => void;
}

type ListProps = {
  cars: Car[];
  setVisible: (visible: boolean) => void;
}

const CarComponent = ({car, setVisible}: CarProps)  => {
  return <TouchableOpacity onPress={() => setVisible(true)}>
    <View style={car.selected ? styles.selectedBlock : styles.carContainer}>
      <Text style={styles.number}>{car.number}</Text>
      {car.selected && <Text style={styles.selectedText}>현재 차량</Text>}
    </View>
  </TouchableOpacity>;
};

export const MypageCarList = ({cars, setVisible}: ListProps) => {
  return (
    <>
      {cars.map((car) => (
        <View key={car.index}>
          <CarComponent car={car} setVisible={setVisible} />
        </View>
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  carContainer: {
    width: '100%',
    marginTop: 25,
    borderWidth: 1,
    borderColor: '#F2F2FF',
    borderRadius: 10,
    padding: 23,
  },
  number: {
    fontSize: 20,
  },
  selectedBlock: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 25,
    borderWidth: 1,
    borderColor: '#3B82F6',
    borderRadius: 10,
    padding: 23,
  },
  selectedText: {
    fontSize: 16,
    color: '#3B82F6',
  }
});

