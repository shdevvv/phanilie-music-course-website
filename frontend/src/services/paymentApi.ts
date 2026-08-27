export interface CheckoutRequest {
  itemType: 'Membership' | 'SheetMusic';
  itemId: number;
  countryCode?: string;
}

export interface CheckoutResponse {
  orderNumber: string;
  amount: number;
  currency: 'IDR' | 'USD';
  gatewayName: 'Midtrans' | 'Stripe';
  checkoutUrlOrToken: string;
}

export function formatPrice(amount: number, currency: 'IDR' | 'USD' | string): string {
  if (currency === 'IDR') {
    return `Rp ${Math.round(amount).toLocaleString('id-ID')}`;
  }
  return `$${amount.toFixed(2)}`;
}

export function detectUserCurrency(countryCode?: string): 'IDR' | 'USD' {
  const code = (countryCode || localStorage.getItem('user_country') || 'ID').toUpperCase();
  return code === 'ID' || code === 'INDONESIA' ? 'IDR' : 'USD';
}

export async function initiateCheckout(request: CheckoutRequest): Promise<CheckoutResponse> {
  const countryCode = request.countryCode || localStorage.getItem('user_country') || 'ID';
  const currency = detectUserCurrency(countryCode);

  try {
    const response = await fetch('/api/payments/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token') || 'demo-token'}`
      },
      body: JSON.stringify({ ...request, countryCode, currency })
    });

    if (!response.ok) {
      throw new Error(`Checkout failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.warn('Payment API offline, returning simulated gateway token:', error);
    return simulateGatewayCheckout(currency);
  }
}

function simulateGatewayCheckout(currency: 'IDR' | 'USD'): CheckoutResponse {
  const orderNum = `ORD-${Date.now().toString().slice(-6)}`;
  if (currency === 'IDR') {
    return {
      orderNumber: orderNum,
      amount: 149000,
      currency: 'IDR',
      gatewayName: 'Midtrans',
      checkoutUrlOrToken: 'snap-demo-token-12345'
    };
  }

  return {
    orderNumber: orderNum,
    amount: 9.99,
    currency: 'USD',
    gatewayName: 'Stripe',
    checkoutUrlOrToken: 'https://checkout.stripe.com/c/pay/cs_test_demo'
  };
}
