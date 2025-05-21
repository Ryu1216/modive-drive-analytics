import React, {useState} from 'react';
import {StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {LabeledInput} from '../../../components/common/input/LabeledInput.tsx';
import {LabeledValue} from '../../../components/common/display/LabeledValue.tsx';
import {BlueButton} from '../../../components/common/button/BlueButton.tsx';

type InfoProps = {
  name: string;
  nickname: string;
  setNickname: (nickname: string) => void;
  email: string;
  save: () => void;
};

export default function MypageInfoScreen({name, nickname, setNickname, email, save}: InfoProps) {

  return (
    <View style={styles.container}>
      <LabeledValue
        title={'이름'}
        content={name} />
      <LabeledInput
        title={'닉네임'}
        content={nickname}
        setContent={setNickname}
        placeholder={'모디브'} />
      <LabeledValue
        title={'이메일'}
        content={email} />
      <BlueButton title={'저장'} moveNext={save}/>
      <Text style={styles.withdraw}>회원 탈퇴</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    padding: 40,
    paddingVertical: 100,
  },
  withdraw: {
    position: 'absolute',
    left: 40,
    bottom: 100,
    fontSize: 15,
    color: '#0F172A',
    opacity: 0.5,
    textDecorationLine: 'underline',
  }
})
