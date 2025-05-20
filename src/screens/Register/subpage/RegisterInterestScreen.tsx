import React from 'react';
import {StyleSheet, View} from 'react-native';
import {RegisterHeader} from '../../../components/Register/RegisterHeader.tsx';
import {RegisterButton} from '../../../components/Register/RegisterButton.tsx';
import {RegisterCategory} from '../../../components/Register/RegisterCategory.tsx';

type InterestProps = {
  value: string;
  setValue: (text: string) => void;
  register: () => void;
};

const categories = [
  '연비', '보험료',
  '초보운전', '앱테크',
  '차량 관리', '탄소 절감',
  '드라이브 스타', '드라이빙 테크닉',
];

export default function RegisterInterestScreen({ value, setValue, register }: InterestProps) {
  return (
    <View style={styles.page}>
      <RegisterHeader
        title={'관심 있는 항목을 선택해주세요.'}
        content={'선택한 관심사를 중심으로 리포트를 구성해드릴게요.'}
        top={true}
      />
      <RegisterCategory
        value={value}
        setValue={setValue}
        categories={categories}
      />
      <RegisterButton
        title={'완료'}
        moveNext={register}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    width: '100%',
    paddingHorizontal: 40,
  },
});
