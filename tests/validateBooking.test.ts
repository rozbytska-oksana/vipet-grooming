import { describe, expect, it } from 'vitest';
import {
  validateBooking,
  type BookingFields,
  type BookingChannel,
} from '../app/utils/validateBooking';

const valid: BookingFields = {
  customerName: 'Мар’яна',
  petName: 'Тея',
  breedId: 'maltipoo',
  channel: 'telegram',
  contact: '@pet_owner',
  comment: '',
};
const breeds = ['maltipoo'];

describe('booking validation', () => {
  it('accepts Ukrainian names and a valid selected breed', () => {
    expect(validateBooking(valid, breeds)).toEqual({});
  });
  it('marks all missing required fields and permits an empty optional comment', () => {
    expect(
      Object.keys(
        validateBooking(
          { ...valid, customerName: ' ', petName: '', breedId: '', contact: '' },
          breeds,
        ),
      ).sort(),
    ).toEqual(['breedId', 'contact', 'customerName', 'petName']);
  });
  it('rejects a breed from the previous pet type', () => {
    expect(validateBooking(valid, ['cat-general']).breedId).toBeTruthy();
  });
  it('rejects an unknown breed outside the available options', () => {
    expect(validateBooking({ ...valid, breedId: 'other' }, breeds).breedId).toBeTruthy();
  });
  it.each([
    ['telegram', '+380 (63) 123-45-67'],
    ['telegram', 'https://t.me/pet_owner'],
    ['viber', '0631234567'],
    ['viber', '+48 123 456 789'],
    ['instagram', '@pet.owner'],
    ['instagram', 'https://www.instagram.com/pet.owner/'],
    ['facebook', 'https://www.facebook.com/profile.php?id=12345'],
    ['facebook', 'pet.owner'],
  ] as [BookingChannel, string][])('accepts contact for %s: %s', (channel, contact) => {
    expect(validateBooking({ ...valid, channel, contact }, breeds).contact).toBeUndefined();
  });
  it.each([
    ['viber', '@pet_owner'],
    ['viber', '+380123'],
    ['telegram', 'invalid user!'],
    ['instagram', 'https://instagram.com.evil.example/pet'],
    ['facebook', 'https://facebook.com@evil.example/pet'],
    ['facebook', 'javascript:alert(1)'],
  ] as [BookingChannel, string][])('rejects incorrect contact for %s: %s', (channel, contact) => {
    expect(validateBooking({ ...valid, channel, contact }, breeds).contact).toBeTruthy();
  });
  it('rejects names without letters and oversized comments', () => {
    const errors = validateBooking(
      { ...valid, customerName: '..', comment: 'a'.repeat(1501) },
      breeds,
    );
    expect(errors.customerName).toBeTruthy();
    expect(errors.comment).toBeTruthy();
  });
});
