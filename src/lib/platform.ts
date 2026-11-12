import { Capacitor } from '@capacitor/core';

export const canUseWebPayments = (native = Capacitor.isNativePlatform()): boolean => !native;
export const canOpenPaymentRoute = (path: string, native = Capacitor.isNativePlatform()): boolean =>
  canUseWebPayments(native) || !['/premium', '/support'].includes(path.replace(/\/$/, ''));