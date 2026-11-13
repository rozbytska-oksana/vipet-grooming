import { describe, expect, it } from 'vitest';
import {
  bookingUncertainMessage,
  buildBookingPayload,
  createRequestId,
  readBookingResponse,
  resolveBookingUrl,
} from '../app/utils/bookingRequest';

const uuidV4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

describe('booking request id', () => {
  it('uses randomUUID when available', () => {
    const source = {
      randomUUID: () => '11111111-2222-4333-8444-555555555555',
      getRandomValues: <T extends ArrayBufferView | null>(array: T) => array,
    };
    expect(createRequestId(source)).toBe('11111111-2222-4333-8444-555555555555');
  });
  it('builds a version 4 UUID accepted by the PHP handler without randomUUID', () => {
    const source = {
      getRandomValues: <T extends ArrayBufferView | null>(array: T) => {
        (array as unknown as Uint8Array).fill(0xff);
        return array;
      },
    };
    const id = createRequestId(source);
    expect(id).toMatch(uuidV4);
    expect(id).toBe('ffffffff-ffff-4fff-bfff-ffffffffffff');
  });
});

describe('booking endpoint url', () => {
  it('resolves the endpoint relative to the app base path', () => {
    expect(resolveBookingUrl('/', 'api/booking.php')).toBe('/api/booking.php');
    expect(resolveBookingUrl('/vipet/', '/api/booking.php')).toBe('/vipet/api/booking.php');
  });
  it.each(['', 'https://example.com/api/booking.php', '//example.com/x.php', '../booking.php'])(
    'rejects unsafe or empty endpoint %s',
    (endpoint) => {
      expect(resolveBookingUrl('/', endpoint)).toBeNull();
    },
  );
});

describe('booking payload', () => {
  it('sends every field the PHP handler requires with empty optional values', () => {
    const payload = buildBookingPayload({
      requestId: 'id',
      customerName: ' Мар’яна ',
      petName: ' Тея ',
      petType: 'dog',
      breedId: 'maltipoo',
      serviceId: '',
      channel: 'telegram',
      contact: ' @pet_owner ',
      comment: '  ',
      website: '',
      extraIds: [],
    });
    expect(payload).toEqual({
      requestId: 'id',
      customerName: 'Мар’яна',
      petName: 'Тея',
      petType: 'dog',
      breedId: 'maltipoo',
      serviceId: '',
      channel: 'telegram',
      contact: '@pet_owner',
      comment: '',
      website: '',
      weightBand: '',
      coatLength: '',
      extraIds: [],
    });
  });
  it('keeps calculator parameters', () => {
    const payload = buildBookingPayload({
      requestId: 'id',
      customerName: 'Олена',
      petName: 'Бім',
      petType: 'dog',
      breedId: 'husky',
      serviceId: 'complex',
      channel: 'viber',
      contact: '+380631234567',
      comment: '',
      website: '',
      weightBand: null,
      coatLength: 'long',
      extraIds: ['extra'],
    });
    expect(payload).toMatchObject({ weightBand: '', coatLength: 'long', extraIds: ['extra'] });
  });
});

describe('booking response', () => {
  it('reports success only for a confirmed reference', () => {
    expect(readBookingResponse(200, { ok: true, reference: 'ABCDEF123456' })).toEqual({
      ok: true,
      reference: 'ABCDEF123456',
    });
    expect(readBookingResponse(200, { ok: true })).toEqual({
      ok: false,
      message: bookingUncertainMessage,
    });
  });
  it('treats an HTML fallback or unreadable answer as uncertain delivery', () => {
    expect(readBookingResponse(200, null).ok).toBe(false);
    expect(readBookingResponse(502, null)).toEqual({ ok: false, message: bookingUncertainMessage });
  });
  it('shows the server message for rejected requests', () => {
    expect(readBookingResponse(422, { ok: false, message: 'Перевірте поля заявки.' })).toEqual({
      ok: false,
      message: 'Перевірте поля заявки.',
    });
  });
  it('falls back to readable messages without a server message', () => {
    expect(readBookingResponse(429, null)).toMatchObject({ ok: false });
    expect(readBookingResponse(429, null)).not.toEqual(readBookingResponse(500, null));
    expect(readBookingResponse(403, { ok: false, message: '' })).toMatchObject({ ok: false });
  });
});
