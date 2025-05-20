import React, {useState} from 'react';
import {
  Button,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import CustomModal from '../../../components/common/CustomModal';

export default function MypageCarScreen() {
  const [selected, setSelected] = useState(0);
  const [visible, setVisible] = useState(false);

  const cars = [
    {index: 0, number: '04히 2025'},
    {index: 1, number: '04히 1234'},
    {index: 2, number: '04히 5678'},
  ];

  const handleConfirm = () => {
    // 차량 변경 api
  };

  const carList = () => {
    return cars.map(({index, number}) => (
      <View key={index}>
        <TouchableOpacity onPress={() => setVisible(true)}>
          {selected === index ? (
            <View style={styles.selectedBlock}>
              <Text style={styles.number}>{number}</Text>
              <Text style={styles.selectedText}>현재 차량</Text>
            </View>
          ) : (
            <View style={styles.carContainer}>
              <Text style={styles.number}>{number}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    ));
  };

  return (
    <>
      <View style={styles.container}>
        {carList()}
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>+ 차량 추가</Text>
        </TouchableOpacity>
      </View>
      <CustomModal
        visible={visible}
        title="이 차량으로 등록할까요?"
        content={['선택한 차량으로 설정돼요.', '나중에 언제든 바꿀 수 있어요.']}
        onClose={() => setVisible(false)}
        onConfirm={handleConfirm}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    padding: 20,
  },
  editButton: {
    fontSize: 18,
    fontWeight: 'semibold',
  },
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
  },
  button: {
    width: '100%',
    marginTop: 40,
    backgroundColor: '#3B5BFF',
    borderRadius: 10,
    padding: 20,
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
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    marginTop: 30,
    fontSize: 20,
    color: '#565656',
  },
  modalNum: {
    margin: 25,
    fontSize: 20,
    color: '#111111',
  },
  modalText: {
    marginBottom: 3,
    fontSize: 16,
    color: '#565656',
  },
  modalButtonContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 20,
  },
  modalButton: {
    width: '50%',
    height: 50,
    borderWidth: 0.5,
    borderColor: '#D9D9D9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    color: '#378CFF',
  },
});
