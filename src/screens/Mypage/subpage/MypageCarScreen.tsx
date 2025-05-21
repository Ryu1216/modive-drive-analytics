import React, {useState} from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import CustomModal from '../../../components/common/CustomModal';
import {BlueButton} from '../../../components/common/button/BlueButton.tsx';
import {MypageCarList} from '../../../components/Mypage/MypageCarList.tsx';

type MypageCarProps = {
  cars: Car[];
  addCar: () => void;
  setCar: () => void;
  deleteCar: () => void;
}

export default function MypageCarScreen({cars, addCar, setCar, deleteCar}: MypageCarProps) {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <View style={styles.container}>
        <MypageCarList
          cars={cars}
          setVisible={setVisible}
        />
        <BlueButton title={'+ 차량 추가'} moveNext={addCar} />
      </View>
      <CustomModal
        visible={visible}
        title="이 차량으로 등록할까요?"
        content={['선택한 차량으로 설정돼요.', '나중에 언제든 바꿀 수 있어요.']}
        onClose={() => setVisible(false)}
        onConfirm={setCar}
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
});
