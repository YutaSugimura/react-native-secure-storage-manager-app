# Securely manage private keys using React-native-keychain

Sample application to securely manage wallet mnemonic and private keys.

## ToDo

- [x] Support Biometry
- [x] Change Password
- [ ] Authentication without login required

## Use

- [react-native-keychain](https://github.com/oblador/react-native-keychain)
- [react-native-quick-crypto](https://github.com/margelo/react-native-quick-crypto)
- [react-navigation](https://reactnavigation.org/)
- [react-native-haptic-feedback](https://github.com/junina-de/react-native-haptic-feedback)

```zsh
  yarn add react-native-keychain
  yarn add react-native-quick-crypto
```

## Get Started

1. install

```zsh
  yarn install
  npx pod-install

  # or (use new architecture on iOS)
  cd ios
  RCT_NEW_ARCH_ENABLED=1 pod install
```

- When using new architecture on Android Change newArchEnabled to true in android/gradle.properties https://reactnative.dev/blog/2022/03/15/an-update-on-the-new-architecture-rollout#the-new-architecture-template

2. start node

```zsh
yarn start
```

3. start Emulators

```zsh
  yarn ios
  # or
  yarn android
```

## Versions

- react-native@0.69.5
- react-native-keychain@8.1.1
- react-native-mmkv@2.4.3
- react-native-quick-crypto@0.4.5
- @react-navigation/native@6.0.11
- react-native-hapticfeedback@1.14.0

## issues

- [iOS 15 setInternetCredentials throwing "The user name or passphrase you entered is not correct" error](https://github.com/oblador/react-native-keychain/issues/509)
- [Different from OpenSSL-universal versin used by flipper](https://github.com/margelo/react-native-quick-crypto/issues/77#issuecomment-1201192055)

## LICENSE

MIT
