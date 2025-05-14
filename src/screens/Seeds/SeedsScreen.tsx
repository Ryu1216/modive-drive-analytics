import React from 'react';
import { ScrollView, View, Text, StyleSheet, ImageBackground } from 'react-native';

export default function SeedsScreen() {
  const seeds = [
    { index:0, number: 5, balance: 500, text: '주행 점수 보상' },
    { index:1, number: 1, balance: 495, text: '주행 이벤트 보상' },
    { index:2, number: -10000, balance: 494, text: '할인 쿠폰 구매' },
    { index:3, number: 1, balance: 10494, text: '출석 보상' },
  ]

  const seedList = () => {
    return seeds.map((seed, index) => {
      return (
        <View key={index}>
          <View style={styles.card}>
            <View style={styles.leftSection}>
              <Text style={styles.cardTitle}>{seed.text}</Text>
              <Text style={styles.cardSubtitle}>잔여 씨앗</Text>
            </View>
            <View style={styles.cardRightSection}>
              <Text style={seed.number >= 0 ? styles.plus : styles.minus}>{(seed.number > 0) && <Text>+</Text>}{seed.number}</Text>
              <Text style={styles.cardSeed}>{seed.balance}</Text>
            </View>
          </View>
        </View>
      )
    })
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>씨앗 내역</Text>
      <View style={styles.header}>
        <ImageBackground
          source={require('../../assets/reward_background.png')}
          style={styles.backgroundImage}
        >
          <View style={styles.overlay} />
          <View style={styles.seedBlock}>
            <Text style={styles.seedTitle}>사용 가능 씨앗</Text>
            <Text style={styles.seeds}>500 s</Text>
          </View>
          <View style={styles.seedBlock}>
            <Text style={styles.seedTitle}>총 씨앗</Text>
            <Text style={styles.seeds}>14,300 s</Text>
          </View>
        </ImageBackground>
      </View>
      <Text style={styles.menu}>적립/사용</Text>
      <View style={{alignItems: 'center'}}>
        {seedList()}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3F5AF0',
    marginBottom: 20,
    marginTop: 20,
    marginLeft: 12,
  },
  header: {
    margin: 'auto',
    marginTop: 0,
    marginBottom: 0,
  },
  backgroundImage: {
    width: 380,
    height: 200,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // 이미지 위에 반투명 흰색
  },
  seedBlock: {
    width: 380,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  seedTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    opacity: 1,
  },
  seeds: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'black',
    opacity: 1,
  },
  menu: {
    fontSize: 18,
    fontWeight: 'bold',
    margin: 25,
    marginBottom: 10,
  },
  card: {
    width: 350,
    height: 90,
    backgroundColor: '#F3F6FD', // 연한 파란색
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4, // Android 그림자
    marginVertical: 10,
  },
  leftSection: {
    flexDirection: 'column',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#000',
  },
  cardRightSection: {
    alignItems: 'flex-end',
  },
  plus: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4C6EF5',
    marginBottom: 10,
  },
  minus: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF0000',
    marginBottom: 10,
  },
  cardSeed: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
})
