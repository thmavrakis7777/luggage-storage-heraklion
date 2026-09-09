import { z } from 'zod';
import { LUGGAGE_SIZES } from './pricing';
import { isValidTimeSlot } from './hours';
import { locales } from '@/i18n/config';

const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'invalid_date');
const timeSchema = z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'invalid_time');

export const luggageItemsSchema = z
  .object({
    backpack: z.number().int().min(0).max(50),
    cabin: z.number().int().min(0).max(50),
    large: z.number().int().min(0).max(50),
  })
  .refine((items) => LUGGAGE_SIZES.some((size) => items[size] > 0), {
    message: 'no_items',
  })
  .refine((items) => LUGGAGE_SIZES.reduce((sum, size) => sum + items[size], 0) <= 50, {
    message: 'too_many_items',
  });

/** Shared validation for the booking form (client) and the /api/book route (server, authoritative). */
export const bookingInputSchema = z
  .object({
    customerName: z.string().trim().min(2).max(100),
    customerPhone: z
      .string()
      .trim()
      .min(6)
      .max(20)
      .regex(/^[+\d][\d\s()-]{5,19}$/, 'invalid_phone'),
    dropoffDate: dateSchema,
    pickupDate: dateSchema,
    dropoffTime: timeSchema,
    pickupTime: timeSchema,
    items: luggageItemsSchema,
    language: z.enum(locales),
    /** Honeypot field — must stay empty. Bots that fill every input trip this. */
    website: z.string().max(0).optional().default(''),
  })
  .refine((data) => data.pickupDate >= data.dropoffDate, {
    message: 'pickup_before_dropoff_date',
    path: ['pickupDate'],
  })
  .refine((data) => data.pickupDate !== data.dropoffDate || data.pickupTime > data.dropoffTime, {
    message: 'pickup_before_dropoff_time',
    path: ['pickupTime'],
  })
  .refine((data) => isValidTimeSlot(data.dropoffDate, data.dropoffTime), {
    message: 'dropoff_time_outside_hours',
    path: ['dropoffTime'],
  })
  .refine((data) => isValidTimeSlot(data.pickupDate, data.pickupTime), {
    message: 'pickup_time_outside_hours',
    path: ['pickupTime'],
  });

export type BookingInput = z.infer<typeof bookingInputSchema>;
