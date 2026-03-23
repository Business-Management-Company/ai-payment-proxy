const HIGHNOTE_API_URL = process.env.HIGHNOTE_ENV === 'production'
  ? 'https://api.highnote.com/graphql'
  : 'https://api.sandbox.highnote.com/graphql';

export async function createHighnoteCard(limitCents: number, memo: string) {
  const query = `
    mutation CreatePaymentCard($input: CreatePaymentCardInput!) {
      createPaymentCard(input: $input) {
        ... on PaymentCard {
          id
          last4
          expirationDate
        }
      }
    }
  `;

  const response = await fetch(HIGHNOTE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${Buffer.from(process.env.HIGHNOTE_API_KEY! + ':').toString('base64')}`,
    },
    body: JSON.stringify({
      query,
      variables: {
        input: {
          cardProductId: process.env.HIGHNOTE_PRODUCT_ID,
          spendingLimitAmount: { value: limitCents, currencyCode: 'USD' },
          memo: memo?.slice(0, 50) || 'AI Agent Card',
        }
      }
    })
  });

  const data = await response.json();
  return data?.data?.createPaymentCard;
}
