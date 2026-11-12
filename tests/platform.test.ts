import { describe, expect, it } from 'bun:test';
import { canUseWebPayments, canOpenPaymentRoute } from '../src/lib/platform';

describe('Android free release', () => {
  it('disables website checkout on native devices', () => expect(canUseWebPayments(true)).toBe(false));
  it('preserves checkout on the website', () => expect(canUseWebPayments(false)).toBe(true));
  it('blocks native premium checkout routes', () => expect(canOpenPaymentRoute('/premium', true)).toBe(false));
  it('blocks native supporter payment routes', () => expect(canOpenPaymentRoute('/support', true)).toBe(false));
  it('allows native account settings', () => expect(canOpenPaymentRoute('/profile', true)).toBe(true));
});