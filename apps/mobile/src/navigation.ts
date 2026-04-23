import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { Currency } from './types';

export type RootStackParamList = {
  Login: undefined;
  CurrencyList: undefined;
  EditCurrency: { currency: Currency };
};

export type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;
export type CurrencyListScreenProps = NativeStackScreenProps<RootStackParamList, 'CurrencyList'>;
export type EditCurrencyScreenProps = NativeStackScreenProps<RootStackParamList, 'EditCurrency'>;
