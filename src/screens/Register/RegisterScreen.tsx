import React, { useState, useRef } from 'react';
import {View, StyleSheet, TouchableOpacity, Image, Text} from 'react-native';
import StepIndicator from 'react-native-step-indicator';
import PagerView from 'react-native-pager-view';
import RegisterNicknameScreen from './subpage/RegisterNicknameScreen.tsx';
import RegisgerCarNumScreen from './subpage/RegisgerCarNumScreen.tsx';
import RegisterDriveScreen from './subpage/RegisterDriveScreen.tsx';
import RegisterInterestScreen from "./subpage/RegisterInterestScreen.tsx";

export default function RegisterScreen() {

    const [pageIndex, setPageIndex] = useState(0);

    const [nickname, setNickname] = useState('');
    const [drive, setDrive] = useState('');
    const [carNum, setCarNum] = useState('');
    const [interest, setInterest] = useState('');

    const pagerRef = useRef<PagerView | null>(null);

    const goToPrior = () => {
        pagerRef.current?.setPage(pageIndex - 1);
        setPageIndex(pageIndex - 1);
    }

    const goToNext = () => {
        pagerRef.current?.setPage(pageIndex + 1);
        setPageIndex(pageIndex + 1);
    };

    return (
        <View style={{flex: 1}}>
            <View style={styles.appbarContainer}>
                {(pageIndex > 0) ? (<TouchableOpacity onPress={() => {goToPrior();}}>
                    <Image
                        style={styles.appbarButton}
                        source={require('../../assets/prior_button.png')}/>
                </TouchableOpacity>) : (
                    <View style={{ width: 24 }} /> // ← 자리를 맞추기 위한 빈 박스
                )}
                <TouchableOpacity>
                    <Image
                        style={styles.appbarButton}
                        source={require('../../assets/cancel_buttom.png')}/>
                </TouchableOpacity>
            </View>
            <View style={styles.container}>
                <StepIndicator
                    customStyles={stpperStyles}
                    currentPosition={pageIndex}
                    labels={[]}
                    stepCount={4}
                />
            </View>
            <PagerView style={styles.pagerView} initialPage={0} ref={pagerRef}>
                <View key="0" style={styles.page}>
                    <RegisterNicknameScreen
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
                    <RegisgerCarNumScreen
                        text={carNum}
                        setText={setCarNum}
                        moveNext={() => {goToNext();}}
                    />
                </View>
                <View key="3" style={styles.page}>
                    <RegisterInterestScreen
                        value={interest}
                        setValue={setInterest}
                        register={() => {
                            console.log('register');
                        }}
                    />
                </View>
            </PagerView>
        </View>
    );
}


const stpperStyles = {
    stepIndicatorSize: 30,
    currentStepIndicatorSize: 30,
    currentStepStrokeWidth: 3,
    stepStrokeCurrentColor: '#3B5BFF',
    stepStrokeWidth: 3,
    stepStrokeFinishedColor: '#3B5BFF',
    stepStrokeUnFinishedColor: '#F1F5FD',
    separatorFinishedColor: '#3B5BFF',
    separatorUnFinishedColor: '#F1F5FD',
    stepIndicatorFinishedColor: '#3B5BFF',
    stepIndicatorUnFinishedColor: '#F1F5FD',
    stepIndicatorCurrentColor: '#3B5BFF',
    stepIndicatorLabelFontSize: 20,
    currentStepIndicatorLabelFontSize: 20,
    stepIndicatorLabelCurrentColor: '#ffffff',
    stepIndicatorLabelFinishedColor: '#ffffff',
    stepIndicatorLabelUnFinishedColor: '#000000',
    labelColor: '#999999',
    labelSize: 12,

    currentStepLabelColor: '#3B5BFF',
};

const styles = StyleSheet.create({

    appbarContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin:30,
        marginTop: 80,
        height:50,
    },

    appbarButton: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
    },

    container: {
        margin: 'auto',
        marginTop: -20,
        width: 240,
        paddingHorizontal: 20,
    },
    pagerView: {
        flex: 1,
    },
    page: {
        marginTop: 120,
        alignItems: 'center',
    },
    text: {
        marginTop: 20,
        fontSize: 16,
        textAlign: 'center'
    }
});

