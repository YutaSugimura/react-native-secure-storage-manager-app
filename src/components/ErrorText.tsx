import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

type Props = {
  errorMessage: string;
};

export const ErrorText: React.FC<Props> = ({errorMessage}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>{errorMessage}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: '100%',
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 4,
    paddingRight: 4,
  },
  message: {
    color: 'red',
    fontSize: 15,
  },
});
