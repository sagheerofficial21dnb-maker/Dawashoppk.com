import { Product, Review } from '../types.ts';

interface RomanUrduTemplate {
  maleNames: { name: string; city: string; mask: string }[];
  femaleNames: { name: string; city: string; mask: string }[];
  maleComments: string[];
  femaleComments: string[];
  generalComments: string[];
}

const TEMPLATES: RomanUrduTemplate = {
  maleNames: [
    { name: 'Kamran A.', city: 'Lahore', mask: '0321-***458' },
    { name: 'Tariq M.', city: 'Karachi', mask: '0300-***782' },
    { name: 'Muhammad U.', city: 'Rawalpindi', mask: '0333-***194' },
    { name: 'Zubair S.', city: 'Faisalabad', mask: '0345-***901' },
    { name: 'Bilal R.', city: 'Multan', mask: '0312-***663' },
  ],
  femaleNames: [
    { name: 'Sana M.', city: 'Lahore', mask: '0322-***312' },
    { name: 'Ayesha R.', city: 'Karachi', mask: '0301-***845' },
    { name: 'Hira K.', city: 'Islamabad', mask: '0334-***920' },
    { name: 'Fatima N.', city: 'Rawalpindi', mask: '0346-***157' },
    { name: 'Zainab B.', city: 'Faisalabad', mask: '0315-***738' },
  ],
  maleComments: [
    'Bhai 100% original product hai! Timing mein wazeh farq aya hai, kam az kam 35-40 minutes extend hua. Koi jalan ya sar dard nahi hua, best result mila.',
    'Packing bilkul secret plain brown parcel mein thi, family k samne receive kiya kisi ko shak nahi hua. Leopard COD delivery 2 din mein ho gayi.',
    'Pehle thora shak tha k fake na ho lekin seal aur packaging verify ki to genuine nikla. Result bohot zabardast hai, recommended.',
    'WhatsApp pe order confirm kiya tha, customer support bohot cooperative hai. Timing aur control dono mein full satisfaction mili hai.',
    'Bhai quality 10/10 hai! Paisay wasool ho gaye hain. Ab regular customer hoon DawaShop PK ka.',
  ],
  femaleComments: [
    'Bohot acha result mila hai, 2 hafte se use kar rahi hoon wazeh farq aya hai. Skin pe koi allergy ya reaction nahi hua, 100% natural formulation hai.',
    'Packing bilkul plain aur safe thi, Leopard courier wale ne call kar k deliver kiya. Meri taraf se fully recommended hai!',
    'Maine pehle dusri jagah se liya tha farq nahi pada tha, lekin DawaShop se original mila hai. Result bohat zabardast hai.',
    'Bohat achi quality hai, daily use k baad skin bohat soft aur firm ho gayi hai. Shukriya DawaShop PK.',
    'Delivery bohat fast thi, 2 din mein parcel mil gaya tha. Packaging discreet thi kisi ko kuch pata nahi chala.',
  ],
  generalComments: [
    'Original product mila hai, Leopard courier se 2 din mein deliver ho gaya tha. Bohot zabardast cheez hai.',
    'Packing bilkul confidential thi, bahar se koi pehchan nahi sakta tha. Quality 100% genuine hai.',
    'Bohot acha experience raha DawaShop PK k sath. Result wazeh hai aur packaging bohat safe thi.',
    'Customer care bohat responsive hai, genuine stock deliver kiya hai. Shukriya!',
    'Pehle use karne k baad yaqeen ho gaya, 10/10 service aur authentic formulation.',
  ],
};

/**
 * Determines whether a product is female-oriented, male-oriented, or general
 */
export function getProductGenderTarget(product: Product): 'female' | 'male' | 'general' {
  const combined = `${product.title} ${product.category} ${(product.tags || []).join(' ')}`.toLowerCase();

  const isFemale =
    combined.includes('female') ||
    combined.includes('breast') ||
    combined.includes('woman') ||
    combined.includes('women') ||
    combined.includes('beauty') ||
    combined.includes('hair loss') ||
    combined.includes('shampoo') ||
    combined.includes('whitening');

  if (isFemale) return 'female';

  const isMale =
    combined.includes('delay') ||
    combined.includes('spray') ||
    combined.includes('timing') ||
    combined.includes('mrdana') ||
    combined.includes('male') ||
    combined.includes('honey') ||
    combined.includes('pump') ||
    combined.includes('stamina') ||
    combined.includes('viga') ||
    combined.includes('procomil') ||
    combined.includes('tada') ||
    combined.includes('cenforce');

  if (isMale) return 'male';

  return 'general';
}

/**
 * Automatically generates 4 to 5 relevant Roman Urdu reviews with gender-appropriate names,
 * hidden private details, and status: 'approved' so they publish automatically.
 */
export function generateAutoRomanUrduReviews(product: Product): Review[] {
  const gender = getProductGenderTarget(product);
  const names = gender === 'female' ? TEMPLATES.femaleNames : TEMPLATES.maleNames;
  const comments =
    gender === 'female'
      ? TEMPLATES.femaleComments
      : gender === 'male'
      ? TEMPLATES.maleComments
      : TEMPLATES.generalComments;

  // Generate 5 authentic Roman Urdu reviews with hidden private details
  return names.slice(0, 5).map((user, idx) => ({
    id: `AUTO-REV-${product.id}-${idx + 1}`,
    productId: product.id,
    productTitle: product.title,
    author: `${user.name}***`, // Hidden private surname/contact
    city: `${user.city} • Verified Buyer`,
    rating: idx === 3 ? 4 : 5, // Natural ratings (mostly 5s, occasionally a 4)
    comment: comments[idx % comments.length],
    status: 'approved', // Auto-published!
  }));
}

/**
 * Combines existing user reviews (only approved ones) with auto-generated Roman Urdu reviews
 * to ensure every product always has at least 4-5 high-quality Roman Urdu reviews.
 */
export function getProductApprovedReviews(product: Product, allReviews: Review[]): Review[] {
  const manualApproved = allReviews.filter(
    (r) =>
      (r.productId === product.id || r.productId === product.slug) &&
      r.status === 'approved'
  );

  // Auto-generate 5 relevant Roman Urdu reviews for this product
  const autoReviews = generateAutoRomanUrduReviews(product);

  // If there are manual approved reviews, put them first, then fill with autoReviews up to at least 5
  const combined = [...manualApproved];
  const existingComments = new Set(manualApproved.map((r) => r.comment.trim()));

  for (const autoRev of autoReviews) {
    if (!existingComments.has(autoRev.comment.trim())) {
      combined.push(autoRev);
    }
  }

  return combined.slice(0, Math.max(5, manualApproved.length + 2));
}
