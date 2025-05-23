import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {userService} from '../../services/api/userService';
import {useUserStore} from '../../store/useUserStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {
  login,
  logout,
  getProfile as getKakaoProfile,
  shippingAddresses as getKakaoShippingAddresses,
  serviceTerms as getKakaoServiceTerms,
  unlink,
} from '@react-native-seoul/kakao-login';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types/nav';
import {authService} from '../../services/api/authService';

type Navigation = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function SocialLoginScreen() {
  const navigation = useNavigation<Navigation>();

  const handleLogin = async () => {
    try {
      const token = await login(); // 카카오 로그인
      const tokens = await authService.kakaoLogin(token.accessToken);

      // JWT 저장 + 사용자 상태 업데이트 + 홈 이동
      await AsyncStorage.setItem('jwtToken', tokens.accessToken);

      // /user/me 호출
      const userInfo = await userService.getMyInfo();
      useUserStore.getState().setUser(userInfo); // 전역 상태 저장

      navigation.reset({
        index: 0,
        routes: [{name: 'Home'}],
      });
    } catch (error) {
      console.error(error);
      Alert.alert('로그인 실패', '카카오 로그인에 실패했습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={require('../../assets/modive_logo.png')}
      />
      <View style={styles.textContainer}>
        <Text style={styles.text}> 운전의 패턴을 읽고, 데이터로 말하다.</Text>
        <Text style={styles.text}>
          {' '}
          운전 MoBTI는 무엇일까요? 지금 시작해보세요.
        </Text>
      </View>
      <TouchableOpacity onPress={handleLogin}>
        <Image
          style={styles.kakaoButton}
          source={require('../../assets/kakao_login.png')}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    height: '100%',
  },
  image: {
    marginTop: 277,
    marginLeft: 36,
    width: 243,
    resizeMode: 'contain',
  },
  textContainer: {
    marginTop: 50,
  },
  text: {
    marginTop: 5,
    marginLeft: 36,
    fontSize: 16,
    fontWeight: 'semibold',
    color: '#565656',
  },
  kakaoButton: {
    margin: 'auto',
    marginTop: 5,
    width: 330,
    resizeMode: 'contain',
  },
});
