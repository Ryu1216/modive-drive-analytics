import React, {useState} from 'react';
import {StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';

export default function MypageInfoScreen() {
  const [nickname, setNickname] = useState('honghong');

  return (<View style={styles.container}>
    <View style={{marginTop:50}}/>
    <View style={styles.contentContainer}>
      <Text style={styles.title}>이름</Text>
      <View style={styles.block}>
          <Text style={styles.blockText}> 신예빈 </Text>
      </View>
    </View>
    <View style={styles.contentContainer}>
      <Text style={styles.title}>닉네임</Text>
      <TextInput
        placeholder="모디브"
        placeholderTextColor="#C7C7CD"
        style={styles.textInput}
        maxLength={10}
        value={nickname}
        onChangeText={setNickname}
      />
    </View>
    <View style={styles.contentContainer}>
      <Text style={styles.title}>이메일</Text>
      <View style={styles.block}>
        <Text style={styles.blockText}> dpqls9799@naver.com </Text>
      </View>
    </View>
    <TouchableOpacity
      style={styles.button}
      >
      <Text style={styles.buttonText}>저장</Text>
    </TouchableOpacity>
    <Text style={styles.withdraw}>회원 탈퇴</Text>
  </View>);
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  contentContainer: {
    width: 320,
    marginTop: 20,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    color: '#000',
  },
  block: {
    width: 240,
    height: 40,
    backgroundColor: '#F8F8F8',
    padding: 10,
    borderColor: '#D9D9D9',
    borderWidth: 0.5,
    borderRadius: 6,
  },
  blockText: {
    fontSize: 16,
    color: '#909090',
  },
  textInput: {
    width: 240,
    height: 40,
    borderWidth: 1,
    borderColor: '#D1D1D6',
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#000',
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
  withdraw: {
    position: 'absolute',
    left: 40,
    bottom: 40,
    fontSize: 15,
    color: '#0F172A',
    opacity: 0.5,
    textDecorationLine: 'underline',
  }
})
