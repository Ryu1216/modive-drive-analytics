import {Button, Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';

export default function MypageCarScreen({navigation}) {

  const [selected, setSelected] = useState(0);
  const [visible, setVisible] = useState(false);

  const cars = [
    { index:0, number: '04히 2025' },
    { index:1, number: '04히 1234' },
    { index:2, number: '04히 5678' },
  ]

  const carList = () => {
    return cars.map(({ index, number }) => (
      <View key={index}>
        <TouchableOpacity
        onPress={() => setVisible(true)}
        >
          {(selected === index) ? <View style={styles.selectedBlock}>
            <Text style={styles.number}>{number}</Text>
            <Text style={styles.selectedText}>현재 차량</Text>
          </View> :
          <View style={styles.carContainer}>
            <Text style={styles.number}>{number}</Text>
          </View>}
        </TouchableOpacity>
        <Modal
          animationType="slide" // 'none' | 'slide' | 'fade'
          transparent={true} // 배경 투명 여부
          visible={visible}
          onRequestClose={() => setVisible(false)} // Android back 버튼용
        >ㅗ
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalText}>이 차량으로 등록할까요?</Text>
              <Text style={styles.modalText}>{number}</Text>
              <Text style={styles.modalText}>선택한 차량으로 설정돼요.</Text>
              <Text style={styles.modalText}>나중에 언제든 바꿀 수 있어요.</Text>
              <View style={styles.modalButtonContainer}>
                <Button title="닫기" onPress={() => setVisible(false)} />
                <Button title="열기" onPress={() => setVisible(false)} />
              </View>
            </View>
          </View>
        </Modal>
      </View>
    ));
  };

  return (
    <View style={styles.container}>
      <View style={styles.editContainer}>
        <View/>
        <TouchableOpacity onPress={() => navigation.navigate('mypage_car_edit')}>
          <Text style={styles.editButton}>편집</Text>
        </TouchableOpacity>
      </View>
      {carList()}
      <TouchableOpacity
        style={styles.button}
      >
        <Text style={styles.buttonText}>+  차량 추가</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  editContainer: {
    width:320,
    marginTop: 50,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  editButton: {
    fontSize: 18,
    fontWeight: 'semibold',
  },
  carContainer: {
    width: 320,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 25,
    borderWidth: 2,
    borderColor: '#F2F2FF',
    borderRadius: 10,
    padding: 24,
  },
  number: {
    fontSize: 20,
  },
  selectedBlock: {
    width: 320,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 25,
    borderWidth: 2,
    borderColor: '#3B82F6',
    borderRadius: 10,
    padding: 24,
  },
  selectedText: {
    fontSize: 16,
    color: '#3B82F6',
  },
  button: {
    width: 320,
    height: 56,
    marginTop: 40,
    backgroundColor: '#3B5BFF',
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', // 반투명 배경
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    marginBottom: 15,
    fontSize: 16,
  },
  modalButtonContainer: {
    display: 'flex',
    flexDirection: 'row'
  }
})
