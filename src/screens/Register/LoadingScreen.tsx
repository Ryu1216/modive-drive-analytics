import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';

export default function LoadingScreen() {
    return (
        <View>
            <Image
                style={styles.image}
                source={require('../../assets/modive_logo3.png')}
            />
            <View style={styles.textContainer}>
                <Text style={styles.text}> 운전의 패턴을 읽고, 데이터로 말하다.</Text>
                <Text style={styles.text}> 운전 MoBTI는 무엇일까요?</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
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
});
