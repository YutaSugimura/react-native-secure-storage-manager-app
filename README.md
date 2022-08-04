# Securely manage private keys using React-native-keychain

Sample application to securely manage wallet mnemonic and private keys.

## Use

- [react-native-keychain](https://github.com/oblador/react-native-keychain)
- [react-native-quick-crypto](https://github.com/margelo/react-native-quick-crypto)

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
  USE_FABRIC=1 RCT_NEWARCH_ENABLED=1 pod install
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

- react-native@0.69.3
- react-native-keychain@8.1.1
- react-native-mmkv@2.4.3
- react-native-quick-crypto@0.4.5

## issues

- [iOS 15 setInternetCredentials throwing "The user name or passphrase you entered is not correct" error](https://github.com/oblador/react-native-keychain/issues/509)

## LICENSE

MIT