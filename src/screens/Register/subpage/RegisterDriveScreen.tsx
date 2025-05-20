import React, {Dispatch, SetStateAction, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {RegisterHeader} from '../../../components/Register/RegisterHeader.tsx';
import {RegisterButton} from '../../../components/Register/RegisterButton.tsx';
import {RegisterDropdown} from '../../../components/Register/RegisterDropdown.tsx';
import {ItemType} from 'react-native-dropdown-picker';

type DriveProps = {
  value: string;
  setValues: Dispatch<SetStateAction<string>>;
  moveNext: () => void;
};

export default function RegisterDriveScreen({ value, setValues, moveNext }: DriveProps) {

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<ItemType<string>[]>([
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
    <View style={styles.page}>
      <RegisterHeader
        title={'운전 경력을 선택해주세요.'}
        content={'선택하신 운전 경력에 맞는 피드백을 제공해드릴게요.'}
      />
      <RegisterDropdown
        open={open}
        setOpen={setOpen}
        items={items}
        setItems={setItems}
        value={value}
        setValues={setValues}
      />
      <RegisterButton title={'다음'} moveNext={moveNext} />
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    width: '100%',
    paddingHorizontal: 40,
  },
});
