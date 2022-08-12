import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

export const hapticFeedback = (
  type: ReactNativeHapticFeedback.HapticFeedbackTypes,
) => {
  ReactNativeHapticFeedback.trigger(type, options);
};
