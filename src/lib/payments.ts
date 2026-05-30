export type PaymentMethod = "BANK" | "CARD" | "CASH_VOUCHER";

export function getBankDetails(): string {
  return process.env.BANK_DETAILS ?? "Bank details not configured";
}

export function getAdvancePercent(): number {
  return parseInt(process.env.ADVANCE_PERCENT ?? "40", 10);
}

export function calcAdvanceAmount(total: number): number {
  return Math.ceil((total * getAdvancePercent()) / 100);
}

export function generateVoucherNumber(bookingId: string): string {
  return `KCH-${bookingId.slice(-8).toUpperCase()}`;
}

// Stub: in prod, redirect to Safepay/PayFast hosted checkout
export async function initiateCardPayment(bookingId: string, amount: number) {
  return { redirectUrl: `/account/bookings/${bookingId}?payment=stub_success`, bookingId, amount };
}
