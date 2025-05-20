import React, { Dispatch, SetStateAction, RefObject} from 'react';
import {View, StyleSheet} from 'react-native';
import PagerView from 'react-native-pager-view';
import RegisterNicknameView from './subpage/RegisterNicknameView.tsx';
import RegisterCarNumScreen from './subpage/RegisterCarNumScreen.tsx';
import RegisterDriveScreen from './subpage/RegisterDriveScreen.tsx';
import RegisterInterestScreen from './subpage/RegisterInterestScreen.tsx';
import {RegisterNavigator} from '../../components/Register/RegisterNavigator.tsx';
import {RegisterIndicator} from '../../components/Register/RegisterIndicator.tsx';

type RegisterProps = {
  pageIndex: number;
  nickname: string;
  drive: string;
  carNum: string;
  interest: string;
  setNickname: Dispatch<SetStateAction<string>>;
  setDrive: Dispatch<SetStateAction<string>>;
  setCarNum: Dispatch<SetStateAction<string>>;
  setInterest: Dispatch<SetStateAction<string>>;
  goToPrior: () => void;
  goToNext: () => void;
  close: () => void;
  pagerRef: RefObject<PagerView | null>;
}

export const RegisterScreen = ({
   pageIndex,
   nickname,
   drive,
   carNum,
   interest,
   setNickname,
   setDrive,
   setCarNum,
   setInterest,
   goToPrior,
   goToNext,
   close,
   pagerRef,
}: RegisterProps) => {
  return (
      <View style={styles.flexView}>
        <RegisterNavigator
          pageIndex={pageIndex}
          goToPrior={goToPrior}
          close={close}/>
        <RegisterIndicator
          pageIndex={pageIndex}
        />
        <PagerView style={styles.pagerView} initialPage={0} ref={pagerRef}>
          <View key="0" style={styles.page}>
            <RegisterNicknameView
              text={nickname}
              setText={setNickname}
              moveNext={() => {goToNext();}}
            />
          </View>
          <View key="1" style={styles.page}>
            <RegisterDriveScreen
              value={drive}
              setValues={setDrive}
              moveNext={() => {goToNext();}}
            />
          </View>
          <View key="2" style={styles.page}>
            <RegisterCarNumScreen
              text={carNum}
              setText={setCarNum}
              moveNext={() => {goToNext();}}
            />
          </View>
          <View key="3" style={styles.page}>
            <RegisterInterestScreen
              value={interest}
              setValue={setInterest}
              register={() => {console.log('register');}}
            />
          </View>
        </PagerView>
      </View>
    );
}

const styles = StyleSheet.create({
    flexView: {
      flex: 1,
    },
    pagerView: {
        flex: 1,
    },
    page: {
        marginTop: 120,
        alignItems: 'center',
    },
});

