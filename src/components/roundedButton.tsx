import React from 'react';
import {Dimensions, StyleSheet, Text, TouchableOpacity} from 'react-native';

type Props = {
  title: string;
  onPress: () => void;
};

export const RoundedButton: React.FC<Props> = ({title, onPress}) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.container]}>
      <Text style={[styles.label]}>{title}</Text>
    </TouchableOpacity>
  );
};

const DEVICE_WIDTH = Dimensions.get('screen').width;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: DEVICE_WIDTH * 0.78,
    height: 42,
    backgroundColor: '#2187FF',
    borderRadius: 21,
    shadowColor: '#2187FF',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.24,
    shadowRadius: 3.6,
    elevation: 5,
  },
  label: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
