const HIGHNOTE_API_URL = process.env.HIGHNOTE_ENV === 'production'
  ? 'https://api.us.highnote.com/graphql'
  : 'https://api.us.test.highnote.com/graphql';

async function highnoteRequest(query: string, variables: Record<string, unknown>) {
  const response = await fetch(HIGHNOTE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${Buffer.from(process.env.HIGHNOTE_API_KEY! + ':').toString('base64')}`,
    },
    body: JSON.stringify({ query, variables }),
  });
  const data = await response.json();
  if (data.errors?.length) throw new Error(data.errors[0].message);
  return data.data;
}

// Step 1: Create an AccountHolder (once per user, store the returned ID)
export async function createHighnoteAccountHolder(params: {
  givenName: string;
  familyName: string;
  email: string;
  phone: string; // 10-digit US number
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  dateOfBirth: string; // YYYY-MM-DD
  ssn: string; // 9 digits, test: "111111111"
  ipAddress: string;
}) {
  const data = await highnoteRequest(`
    mutation CreateHolder($input: CreateUSPersonAccountHolderInput!) {
      createUSPersonAccountHolder(input: $input) {
        ... on USPersonAccountHolder { id email }
        ... on UserError { errors { code description } }
      }
    }
  `, {
    input: {
      personAccountHolder: {
        name: { givenName: params.givenName, familyName: params.familyName },
        email: params.email,
        phoneNumber: { countryCode: '1', number: params.phone, label: 'MOBILE' },
        billingAddress: {
          streetAddress: params.streetAddress,
          locality: params.city,
          region: params.state,
          postalCode: params.postalCode,
          countryCodeAlpha3: 'USA',
        },
        dateOfBirth: params.dateOfBirth,
        identificationDocument: {
          socialSecurityNumber: {
            number: params.ssn,
            countryCodeAlpha3: 'USA',
            taxIdentificationNumberType: 'SSN',
          },
        },
      },
    },
  });

  const result = data?.createUSPersonAccountHolder;
  if (result?.errors) throw new Error(result.errors[0].description);
  return result?.id as string;
}

// Step 2: Apply for card product (once per user, store the returned applicationId)
export async function applyForHighnoteCardProduct(accountHolderId: string, ipAddress: string) {
  const data = await highnoteRequest(`
    mutation Apply($input: CreateAccountHolderCardProductApplicationInput!) {
      createAccountHolderCardProductApplication(input: $input) {
        ... on AccountHolderCardProductApplication { id applicationState { status } }
        ... on UserError { errors { code description } }
      }
    }
  `, {
    input: {
      accountHolderId,
      cardProductId: process.env.HIGHNOTE_PRODUCT_ID,
      cardHolderAgreementConsent: {
        primaryAuthorizedPersonId: accountHolderId,
        consentTimestamp: new Date().toISOString(),
        consentIpAddress: { v4: ipAddress },
      },
    },
  });

  const result = data?.createAccountHolderCardProductApplication;
  if (result?.errors) throw new Error(result.errors[0].description);
  return result?.id as string; // applicationId
}

// Step 3: Issue a virtual card (called each time an agent needs a card)
export async function issueHighnoteCard(params: {
  applicationId: string;
  externalId: string;
  memo?: string;
}) {
  // Card expires 3 years from now
  const expiry = new Date();
  expiry.setFullYear(expiry.getFullYear() + 3);
  expiry.setMonth(11, 31); // Dec 31
  const expirationDate = expiry.toISOString().replace(/\.\d{3}Z$/, 'Z');

  const data = await highnoteRequest(`
    mutation IssueCard($input: IssuePaymentCardForApplicationInput!) {
      issuePaymentCardForApplication(input: $input) {
        ... on PaymentCard { id last4 expirationDate status }
        ... on UserError { errors { code description } }
      }
    }
  `, {
    input: {
      applicationId: params.applicationId,
      externalId: params.externalId,
      options: {
        activateOnCreate: true,
        expirationDate,
      },
    },
  });

  const result = data?.issuePaymentCardForApplication;
  if (result?.errors) throw new Error(result.errors[0].description);
  return result as { id: string; last4: string; expirationDate: string; status: string };
}

// Cancel a card
export async function cancelHighnoteCard(cardId: string) {
  const data = await highnoteRequest(`
    mutation Cancel($input: ClosePaymentCardInput!) {
      closePaymentCard(input: $input) {
        ... on PaymentCard { id status }
        ... on UserError { errors { code description } }
      }
    }
  `, { input: { paymentCardId: cardId } });

  return data?.closePaymentCard;
}
