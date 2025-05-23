import React from 'react';
import {StyleSheet, View} from 'react-native';
import {RegisterHeader} from '../../../components/Register/RegisterHeader.tsx';
import {RegisterInput} from '../../../components/Register/RegisterInput.tsx';
import {BlueButton} from '../../../components/common/button/BlueButton.tsx';

type NicknameProps = {
  text: string;
  setText: (text: string) => void;
  moveNext: () => void;
};

export default function RegisterNicknameView({ text, setText, moveNext }: NicknameProps) {
  return (
    <View style={styles.page}>
      <RegisterHeader
        title={'닉네임을 입력해주세요.'}
        content={'모디브에서 사용할 이름이에요.'}
      />
      <RegisterInput
        text={text}
        setText={setText}
        placeholder={'모디브'}
        isCount={true}
        maxLength={10}
      />
      <BlueButton
        title={'다음'}
        moveNext={moveNext}
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
