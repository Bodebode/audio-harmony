import { expect, it } from 'bun:test';
import { readFileSync } from 'node:fs';
import config from '../capacitor.config';

it('uses the approved Android application ID', () => expect(config.appId).toBe('com.alkeplay.app'));
it('targets Android API 36 for current Google Play submissions', () => {
  const variables = readFileSync('android/variables.gradle', 'utf8');
  expect(Number(variables.match(/targetSdkVersion = (\d+)/)?.[1])).toBe(36);
});
it('releases Android version 1.0.0', () => {
  const gradle = readFileSync('android/app/build.gradle', 'utf8');
  expect(gradle.match(/versionName "([^"]+)"/)?.[1]).toBe('1.0.0');
});