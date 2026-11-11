export type BookingChannel = 'telegram' | 'viber' | 'instagram' | 'facebook';
export interface BookingFields {
  customerName: string;
  petName: string;
  breedId: string;
  channel: BookingChannel;
  contact: string;
  comment: string;
}
export type BookingField = keyof BookingFields;
export type BookingErrors = Partial<Record<BookingField, string>>;

const phone = (value: string) =>
  /^(?:0\d{9}|\+?[1-9]\d{7,14})$/.test(value.replace(/[\s().-]/g, ''));
const profilePath = (value: string, hosts: readonly string[]) => {
  try {
    const url = new URL(value.includes('://') ? value : `https://${value}`);
    return (
      ['https:', 'http:'].includes(url.protocol) &&
      !url.username &&
      !url.password &&
      hosts.includes(url.hostname.toLowerCase()) &&
      url.pathname.length > 1
    );
  } catch {
    return false;
  }
};
export function validateBooking(fields: BookingFields, breedIds: readonly string[]): BookingErrors {
  const errors: BookingErrors = {};
  const name = fields.customerName.trim();
  if (
    name.length < 2 ||
    name.length > 100 ||
    !/\p{L}/u.test(name) ||
    !/^[\p{L}\p{M}\s’'ʼ.\-]+$/u.test(name)
  ) {
    errors.customerName = 'Вкажіть ваше ім’я — від 2 до 100 символів.';
  }
  if (!fields.petName.trim() || fields.petName.trim().length > 100)
    errors.petName = 'Вкажіть ім’я улюбленця — до 100 символів.';
  if (!breedIds.includes(fields.breedId)) errors.breedId = 'Оберіть породу.';
  const value = fields.contact.trim();
  const handle = value.replace(/^@/, '');
  let valid = false;
  switch (fields.channel) {
    case 'telegram':
      valid =
        phone(value) ||
        /^[a-zA-Z][a-zA-Z0-9_]{2,31}$/.test(handle) ||
        profilePath(value, ['t.me', 'telegram.me']);
      break;
    case 'viber':
      valid = phone(value);
      break;
    case 'instagram':
      valid =
        (/^[a-zA-Z0-9_.]{1,30}$/.test(handle) && /[a-zA-Z0-9_]/.test(handle)) ||
        profilePath(value, ['instagram.com', 'www.instagram.com']);
      break;
    case 'facebook':
      valid =
        /^[a-zA-Z0-9][a-zA-Z0-9.]{2,99}$/.test(handle) ||
        profilePath(value, [
          'facebook.com',
          'www.facebook.com',
          'm.facebook.com',
          'fb.com',
          'www.fb.com',
        ]);
      break;
    default:
      errors.channel = 'Оберіть канал зв’язку.';
  }
  if (!value || value.length > 200 || !valid)
    errors.contact =
      fields.channel === 'viber'
        ? 'Вкажіть номер телефону, наприклад +380 63 123 45 67.'
        : 'Вкажіть коректний нікнейм або посилання на профіль' +
          (fields.channel === 'telegram' ? ', або номер телефону.' : '.');
  if (fields.comment.length > 1500)
    errors.comment = 'Коментар має містити не більше 1500 символів.';
  return errors;
}
