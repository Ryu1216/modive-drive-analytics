import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';

// @ts-ignore
export default function MypageScreen({navigation}) {
  return (
    <View style={styles.container}>
      <View style={styles.profile}>
        <Image source={require('../../assets/mypage/default_profile.png')} style={styles.profileImage}/>
        <View>
          <Text style={styles.profileName}>honghong</Text>
          <Text style={styles.profileCar}>04히 2025</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.EditContainer}
        onPress={() => navigation.navigate('mypage_car')}
      >
        <View style={styles.EditHeader}>
          <Image
            source={require('../../assets/mypage/my_car.png')}
            style={styles.EditIcon}
          />
          <Text style={styles.EditTitle}>내 차 정보</Text>
        </View>
        <Image
          source={require('../../assets/mypage/next_icon.png')}
          style={styles.NextIcon}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.EditContainer}
        onPress={() => navigation.navigate('mypage_info')}
      >
        <View style={styles.EditHeader}>
          <Image
            source={require('../../assets/mypage/my_info.png')}
            style={styles.EditIcon}
          />
          <Text style={styles.EditTitle}>내 정보</Text>
        </View>
        <Image
          source={require('../../assets/mypage/next_icon.png')}
          style={styles.NextIcon}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.EditContainer}
        onPress={() => navigation.navigate('mypage_interest')}
      >
        <View style={styles.EditHeader}>
          <Image
            source={require('../../assets/mypage/my_interest.png')}
            style={styles.EditIcon}
          />
          <Text style={styles.EditTitle}>내 관심사</Text>
        </View>
        <Image
          source={require('../../assets/mypage/next_icon.png')}
          style={styles.NextIcon}
        />
      </TouchableOpacity>
      <TouchableOpacity
      style={styles.EditContainer}>
        <View style={styles.EditHeader}>
          <Image
            source={require('../../assets/mypage/logout.png')}
            style={styles.EditIcon}
          />
          <Text style={styles.logout}>로그아웃</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
  },

  profile: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    margin: 'auto',
    marginTop: 30,
    marginBottom: 30,
    width: 330,
    height: 85,
    borderRadius: 10,
    backgroundColor: '#F1F5FD',
  },

  profileImage: {
    margin: 20,
    marginRight: 25,
  },

  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3F5AF0',
  },

  profileCar: {
    fontSize: 12,
    color: '#B3B3B3',
  },

  EditContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 'auto',
    marginTop: 0,
    marginBottom: 5,
    width: 330,
    height: 70,
    borderBottomWidth: 0.5,
    borderBottomColor: '#D9D9D9',
  },

  EditHeader: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 5,
  },

  EditIcon: {
    width: 40,
    height: 40,
  },

  EditTitle: {
    fontSize: 16,
    color: '#0F172A',
    marginLeft: 10,
  },

  NextIcon: {
    width: 10,
    height: 10,
    marginRight: 30,
  },

  logout: {
    fontSize: 16,
    color: '#FF0000',
    marginLeft: 10,
  },

})
