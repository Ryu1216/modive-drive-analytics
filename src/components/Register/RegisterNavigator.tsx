import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';

type NavigatorProps = {
  pageIndex: number;
  goToPrior: () => void;
  close: () => void;
};

export const RegisterNavigator = ({pageIndex, goToPrior, close}: NavigatorProps) => {

  return (
    <View style={styles.appbarContainer}>
      {pageIndex > 0 ? (
        <TouchableOpacity
          onPress={() => {
            goToPrior();
          }}>
          <Image
            style={styles.appbarButton}
            source={require('../../assets/prior_button.png')}
          />
        </TouchableOpacity>
      ) : (
        <View style={styles.blackBox} /> // ← 자리를 맞추기 위한 빈 박스
      )}
      <TouchableOpacity>
        <Image
          style={styles.appbarButton}
          source={require('../../assets/cancel_buttom.png')}
        />
      </TouchableOpacity>
  </View>
  );
};

const styles = StyleSheet.create({
  appbarContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 30,
    marginTop: 80,
    height: 50,
  },
  appbarButton: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  blackBox: {
    width: 24,
  },
});
