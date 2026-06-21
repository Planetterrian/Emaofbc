// Membership pricing configuration (in cents CAD)
export const MEMBERSHIP_TIERS = {
  corporate: {
    name: 'Corporate',
    priceCents: 55000, // $550
    description: 'Multi-person teams in corporate organizations',
  },
  sole_proprietor: {
    name: 'Sole Proprietor',
    priceCents: 37500, // $375
    description: 'Independent consultants and small firms',
  },
  ngo: {
    name: 'Non-Profit / NGO',
    priceCents: 25000, // $250
    description: 'Environmental organizations and not-for-profits',
  },
} as const;

export type MembershipTier = keyof typeof MEMBERSHIP_TIERS;

// Calculate proration for mid-year joins
// Membership year is Jan 1 - Dec 31
export function calculateProration(tierKey: MembershipTier, joinDate: Date): number {
  const year = joinDate.getFullYear();
  const yearStart = new Date(year, 0, 1);
  const yearEnd = new Date(year, 11, 31);

  // Days remaining in year (inclusive of join date)
  const daysRemaining = Math.ceil((yearEnd.getTime() - joinDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  const totalDaysInYear = Math.ceil((yearEnd.getTime() - yearStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  const fullPrice = MEMBERSHIP_TIERS[tierKey].priceCents;
  const proratedPrice = Math.ceil((fullPrice * daysRemaining) / totalDaysInYear);

  return proratedPrice;
}

// Calculate membership expiry (Dec 31 of current year for full-year purchases)
export function getMembershipExpiry(_tier: MembershipTier, purchaseDate: Date): Date {
  return new Date(purchaseDate.getFullYear(), 11, 31);
}
