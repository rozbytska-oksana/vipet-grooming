import type { CoatLength, PetType, WeightBand } from '../types/content';
import type { BookingFields } from './validateBooking';

// Mirrors the fields required by public/api/booking.php.
export interface BookingPayload extends BookingFields {
  requestId: string;
  petType: PetType;
  serviceId: string;
  website: string;
  weightBand: WeightBand | '';
  coatLength: CoatLength | '';
  extraIds: string[];
}

export type BookingResult = { ok: true; reference: string } | { ok: false; message: string };

export interface BookingPayloadInput extends BookingFields {
  requestId: string;
  petType: PetType;
  serviceId: string;
  website: string;
  weightBand?: WeightBand | null;
  coatLength?: CoatLength | null;
  extraIds: readonly string[];
}

type RandomSource = Pick<Crypto, 'getRandomValues'> & { randomUUID?: () => string };

export const bookingUncertainMessage =
  'Не вдалося підтвердити доставку. Зв’яжіться із салоном, щоб перевірити отримання заявки.';
const bookingFailedMessage = 'Заявку не надіслано. Спробуйте пізніше або зв’яжіться із салоном.';
const bookingRateLimitMessage =
  'Забагато спроб. Спробуйте через 10 хвилин або зв’яжіться із салоном.';

export function createRequestId(source: RandomSource): string {
  if (typeof source.randomUUID === 'function') return source.randomUUID();
  const bytes = source.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6]! & 0x0f) | 0x40;
  bytes[8] = (bytes[8]! & 0x3f) | 0x80;
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export function resolveBookingUrl(baseURL: string, endpoint: string): string | null {
  const value = endpoint.trim();
  if (value.startsWith('//')) return null;
  const path = value.replace(/^\//, '');
  // The PHP handler accepts only same-origin requests, so absolute URLs are a misconfiguration.
  if (!path || !/^[a-zA-Z0-9_\-./]+$/.test(path) || path.split('/').includes('..')) return null;
  return `${baseURL.endsWith('/') ? baseURL : `${baseURL}/`}${path}`;
}

export function buildBookingPayload(input: BookingPayloadInput): BookingPayload {
  return {
    requestId: input.requestId,
    customerName: input.customerName.trim(),
    petName: input.petName.trim(),
    petType: input.petType,
    breedId: input.breedId,
    serviceId: input.serviceId,
    channel: input.channel,
    contact: input.contact.trim(),
    comment: input.comment.trim(),
    website: input.website,
    weightBand: input.weightBand ?? '',
    coatLength: input.coatLength ?? '',
    extraIds: [...input.extraIds],
  };
}

export function readBookingResponse(status: number, body: unknown): BookingResult {
  const data = body && typeof body === 'object' ? (body as Record<string, unknown>) : null;
  if (
    status === 200 &&
    data?.ok === true &&
    typeof data.reference === 'string' &&
    /^[A-F0-9]{12}$/.test(data.reference)
  ) {
    return { ok: true, reference: data.reference };
  }
  if (data?.ok === false && typeof data.message === 'string') {
    const message = data.message.trim();
    if (message && message.length <= 300) return { ok: false, message };
  }
  if (status === 429) return { ok: false, message: bookingRateLimitMessage };
  if (status >= 400 && status < 500) return { ok: false, message: bookingFailedMessage };
  // A 2xx/5xx without a clear JSON answer may still have reached Telegram.
  return { ok: false, message: bookingUncertainMessage };
}
