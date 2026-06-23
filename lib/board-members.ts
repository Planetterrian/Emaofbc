// Static board roster sourced from the public EMA of BC website (emaofbc.com).
// Board members are elected by the membership at the annual general meeting.
// Update this list after each AGM, or migrate to the `users` table (role-based)
// once board members have portal accounts.

export interface BoardMember {
  name: string;
  title: string;
  company: string;
}

export const executiveBoard: BoardMember[] = [
  { name: 'Bryan Shaw', title: 'President', company: 'ClearTech Industries Inc.' },
  { name: 'Karen Pyne', title: 'Vice President / Vice Chair', company: 'Metro Vancouver' },
  { name: 'Jennifer Nyland', title: 'Secretary', company: 'Lawson Lundell LLP' },
  { name: 'Rob Drummond', title: 'Treasurer', company: 'Hatfield Consultants' },
  { name: 'Katrina Kalashnikova', title: 'VP Marketing', company: 'Bureau Veritas' },
  { name: 'Richard Pope', title: 'VP Membership', company: 'Dillon Consulting Limited' },
  { name: 'Luke Dineley', title: 'VP Communications', company: 'Borden Ladner Gervais LLP' },
];

export const directorsAtLarge: BoardMember[] = [
  {
    name: 'Aman Nagra',
    title: 'Business Development – Site Assessment and Remediation',
    company: 'Bureau Veritas',
  },
  {
    name: 'Caitlyn Peddigrew',
    title: 'Environmental Engineer-in-Training / Project Manager',
    company: 'SLR Consulting (Canada) Ltd.',
  },
  {
    name: 'Katelyn Ocampo',
    title: 'Environmental Program Lead',
    company: 'FortisBC Energy Inc.',
  },
  {
    name: 'Anna Howard',
    title: 'Environmental Consultant',
    company: 'PGL Environmental Planning Group',
  },
  {
    name: 'Miranda Lewis',
    title: 'Project Manager & Senior Environmental Scientist',
    company: 'Hatfield Consultants',
  },
  {
    name: 'Irish Guzman',
    title: 'Business Development Representative',
    company: 'AGAT Laboratories',
  },
  {
    name: 'Mat Kavanagh',
    title: 'Sustainability & Environment Manager',
    company: 'Lafarge Canada Inc.',
  },
];
