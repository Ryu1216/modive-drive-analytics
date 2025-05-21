import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

interface FeedbackMessageProps {
  message: string;
}

const FeedbackMessage: React.FC<FeedbackMessageProps> = ({ message }) => {
  return (
    <View style={styles.feedbackContainer} accessibilityLabel="피드백 메시지">
      <Image
        source={require('../../assets/modive_robot1.png')}
        style={styles.robotImage}
        resizeMode="contain"
      />
      <Text style={styles.feedbackText}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  feedbackContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5FF',
    borderRadius: 15,
    padding: 15,
    marginVertical: 20,
  },
  robotImage: {
    width: 50,
    height: 50,
    marginRight: 12,
  },
  feedbackText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
  },
});

export default FeedbackMessage;