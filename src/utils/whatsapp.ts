/**
 * Helper to construct WhatsApp URLs with prefilled messages
 */
export function getWhatsAppUrl(phone: string, message: string): string {
  // Strip non-numeric characters
  const cleanPhone = phone.replace(/\D/g, '');
  // Ensure country code 91 if 10-digit Indian number
  const formattedPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
  const encodedMsg = encodeURIComponent(message);
  return `https://wa.me/${formattedPhone}?text=${encodedMsg}`;
}

export function getProductWhatsAppMessage(productName: string, duration: string, price: number): string {
  if (productName.toLowerCase().includes('adobe')) {
    return `Hi, I want to purchase Adobe Pro Plus 4 Month plan for ₹${price.toLocaleString('en-IN')}.`;
  }
  if (productName.toLowerCase().includes('canva')) {
    return `Hi, I want to purchase Canva Pro 1 Year plan for ₹${price.toLocaleString('en-IN')}.`;
  }
  return `Hi, I want to purchase ${productName} (${duration}) plan for ₹${price.toLocaleString('en-IN')}.`;
}
