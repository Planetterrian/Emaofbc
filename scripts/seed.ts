import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

// Real EMA member organization names from public directory
const memberOrganizations = [
  {
    name: 'Active Earth',
    type: 'ngo' as const,
    domain: 'activeearth.ca',
    focus: 'Sustainable Development',
  },
  {
    name: 'AGAT Laboratories',
    type: 'corporate' as const,
    domain: 'agatlabs.com',
    focus: 'Environmental Testing',
  },
  {
    name: 'Applied Environmental Sciences',
    type: 'corporate' as const,
    domain: 'aesenv.com',
    focus: 'Impact Assessment',
  },
  {
    name: 'BV Labs',
    type: 'corporate' as const,
    domain: 'bvlabs.ca',
    focus: 'Environmental Consulting',
  },
  {
    name: 'CARO Consulting',
    type: 'corporate' as const,
    domain: 'caroconsulting.ca',
    focus: 'Environmental Strategy',
  },
  {
    name: 'Dillon Consulting',
    type: 'corporate' as const,
    domain: 'dillon.ca',
    focus: 'Multi-discipline Engineering',
  },
  {
    name: 'Earth Analytics Inc',
    type: 'corporate' as const,
    domain: 'earthanalytics.ca',
    focus: 'Data & Analysis',
  },
  {
    name: 'Ecosphere Sciences',
    type: 'corporate' as const,
    domain: 'ecosphere.ca',
    focus: 'Ecological Consulting',
  },
  {
    name: 'Enviro-Analytics',
    type: 'sole_proprietor' as const,
    domain: 'enviroanalytics.ca',
    focus: 'Environmental Compliance',
  },
  {
    name: 'Environmental Resources Management',
    type: 'corporate' as const,
    domain: 'ermcanada.com',
    focus: 'Global Environmental Services',
  },
  {
    name: 'Evergreen Canada',
    type: 'ngo' as const,
    domain: 'evergreen.ca',
    focus: 'Green Infrastructure',
  },
  {
    name: 'GHD Engineering',
    type: 'corporate' as const,
    domain: 'ghd.com',
    focus: 'Multi-discipline Engineering',
  },
  {
    name: 'Golder Associates',
    type: 'corporate' as const,
    domain: 'golder.com',
    focus: 'Earth & Environment Services',
  },
  {
    name: 'Hatfield Consultants',
    type: 'corporate' as const,
    domain: 'hatfieldconsultants.com',
    focus: 'Environmental & Fisheries',
  },
  {
    name: 'HiRain Consulting',
    type: 'corporate' as const,
    domain: 'hirainconsulting.com',
    focus: 'Water & Environmental',
  },
  {
    name: 'Kainaiwa/Bloodtribe',
    type: 'corporate' as const,
    domain: 'kainaiwa.ca',
    focus: 'Indigenous Conservation',
  },
  {
    name: 'Keystone Wildlife Research',
    type: 'corporate' as const,
    domain: 'keystonewildlife.com',
    focus: 'Wildlife Management',
  },
  {
    name: 'KWL Environmental',
    type: 'corporate' as const,
    domain: 'kwlenv.ca',
    focus: 'Environmental Consulting',
  },
  {
    name: 'Lawson Lundell',
    type: 'corporate' as const,
    domain: 'lawsonlundell.com',
    focus: 'Environmental Law',
  },
  {
    name: 'Lotus Consulting',
    type: 'sole_proprietor' as const,
    domain: 'lotusconsulting.ca',
    focus: 'Sustainability Consulting',
  },
  {
    name: 'Metro Vancouver',
    type: 'corporate' as const,
    domain: 'metrovancouver.org',
    focus: 'Regional Planning',
  },
  {
    name: 'Pacific Environmental Science',
    type: 'corporate' as const,
    domain: 'pacificenvscience.ca',
    focus: 'Environmental Science',
  },
  {
    name: 'Pitt Meadows Environmental',
    type: 'ngo' as const,
    domain: 'pittmeadowsenv.ca',
    focus: 'Wetland Conservation',
  },
  {
    name: 'Port of Vancouver',
    type: 'corporate' as const,
    domain: 'portofvancouver.ca',
    focus: 'Port Operations & Environment',
  },
  {
    name: 'Q Staffing',
    type: 'corporate' as const,
    domain: 'qstaffing.ca',
    focus: 'Environmental Staffing',
  },
  {
    name: 'Relic Artefacts & Consulting',
    type: 'sole_proprietor' as const,
    domain: 'relicart.ca',
    focus: 'Cultural & Environmental',
  },
  {
    name: 'Scalar Environmental',
    type: 'corporate' as const,
    domain: 'scalarenv.ca',
    focus: 'Environmental Consulting',
  },
  {
    name: 'Seaspan',
    type: 'corporate' as const,
    domain: 'seaspan.com',
    focus: 'Maritime & Environment',
  },
  {
    name: 'Sensus',
    type: 'corporate' as const,
    domain: 'sensus.ca',
    focus: 'Water Management',
  },
  {
    name: 'SLR Consulting',
    type: 'corporate' as const,
    domain: 'slrconsulting.com',
    focus: 'Environmental & Social',
  },
  {
    name: 'Stantec',
    type: 'corporate' as const,
    domain: 'stantec.com',
    focus: 'Professional Services',
  },
  {
    name: 'Swallow Environmental',
    type: 'sole_proprietor' as const,
    domain: 'swallowenv.ca',
    focus: 'Environmental Impact',
  },
  {
    name: 'Tetra Tech',
    type: 'corporate' as const,
    domain: 'tetratechcorp.com',
    focus: 'Multi-discipline Engineering',
  },
  {
    name: 'The Freshwater Trust',
    type: 'ngo' as const,
    domain: 'thefreshwatertrust.org',
    focus: 'Water Conservation',
  },
  {
    name: 'TransLink',
    type: 'corporate' as const,
    domain: 'translink.ca',
    focus: 'Sustainable Transportation',
  },
  {
    name: 'UBC',
    type: 'corporate' as const,
    domain: 'ubc.ca',
    focus: 'Research & Education',
  },
  {
    name: 'Vancouver Coastal Health',
    type: 'corporate' as const,
    domain: 'vch.ca',
    focus: 'Public Health & Environment',
  },
  {
    name: 'West Coast Environmental Law',
    type: 'ngo' as const,
    domain: 'wcel.org',
    focus: 'Environmental Law',
  },
  {
    name: 'YVR (Vancouver Airport)',
    type: 'corporate' as const,
    domain: 'yvr.ca',
    focus: 'Airport Operations & Environment',
  },
  {
    name: 'Arcus Consulting',
    type: 'corporate' as const,
    domain: 'arcusconsulting.ca',
    focus: 'Environmental Consulting',
  },
  {
    name: 'BGC Engineering',
    type: 'corporate' as const,
    domain: 'bgcengineering.ca',
    focus: 'Geotechnical & Environmental',
  },
  {
    name: 'Cascade Environmental',
    type: 'sole_proprietor' as const,
    domain: 'cascadeenv.ca',
    focus: 'Environmental Services',
  },
  {
    name: 'EcoTrust Canada',
    type: 'ngo' as const,
    domain: 'ecotrust.ca',
    focus: 'Conservation & Community',
  },
  {
    name: 'Environmental Impact',
    type: 'corporate' as const,
    domain: 'envimpact.ca',
    focus: 'Impact Assessment',
  },
  {
    name: 'Frazer Consultants',
    type: 'corporate' as const,
    domain: 'frazerconsultants.ca',
    focus: 'Environmental Planning',
  },
  {
    name: 'Hydrotech Solutions',
    type: 'corporate' as const,
    domain: 'hydrotechsolutions.ca',
    focus: 'Water Technology',
  },
  {
    name: 'Innovation Environmental',
    type: 'corporate' as const,
    domain: 'innovationenv.ca',
    focus: 'Green Technology',
  },
  {
    name: 'JDEI Environmental',
    type: 'corporate' as const,
    domain: 'jdeienv.ca',
    focus: 'Environmental Services',
  },
  {
    name: 'Kerr Wood Leidal',
    type: 'corporate' as const,
    domain: 'kwl.ca',
    focus: 'Consulting Engineers',
  },
  {
    name: 'Lanarc Consulting',
    type: 'corporate' as const,
    domain: 'lanarc.com',
    focus: 'Planning & Design',
  },
  {
    name: 'Marbletree Associates',
    type: 'corporate' as const,
    domain: 'marbletree.ca',
    focus: 'Environmental & Engineering',
  },
  {
    name: 'Northern Star Environmental',
    type: 'sole_proprietor' as const,
    domain: 'northernstarenv.ca',
    focus: 'Environmental Consulting',
  },
  {
    name: 'Opus One Energy',
    type: 'corporate' as const,
    domain: 'opusone.ca',
    focus: 'Renewable Energy',
  },
];

const boardMembers = [
  { name: 'Dr. Sarah Mitchell', title: 'President', affiliation: 'UBC' },
  { name: 'James Wong', title: 'Vice President', affiliation: 'Stantec' },
  { name: 'Maria Garcia', title: 'Treasurer', affiliation: 'Dillon Consulting' },
  { name: 'Robert Chen', title: 'Secretary', affiliation: 'SLR Consulting' },
  {
    name: 'Dr. Patricia Thompson',
    title: 'Director-at-Large',
    affiliation: 'UBC',
  },
  { name: 'Michael Johnson', title: 'Director-at-Large', affiliation: 'Metro Vancouver' },
  { name: 'Lisa Anderson', title: 'Director-at-Large', affiliation: 'AGAT' },
  { name: 'David Kumar', title: 'Director-at-Large', affiliation: 'Golder Associates' },
  { name: 'Emma Davis', title: 'Director-at-Large', affiliation: 'West Coast Environmental Law' },
  {
    name: 'Christopher Black',
    title: 'Past President',
    affiliation: 'Tetra Tech',
  },
];

async function seed() {
  console.log('Starting seed...\n');

  try {
    // 1. Clear existing data
    console.log('Clearing existing data...');
    await supabase.from('content').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('sponsorships').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('awards').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('pd_credits').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('registrations').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('events').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('memberships').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('users').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('organizations').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    // 2. Insert organizations
    console.log('Inserting organizations...');
    const orgRows = memberOrganizations.map((org) => ({
      id: uuidv4(),
      name: org.name,
      type: org.type,
      email_domain: org.domain,
      focus: org.focus,
      status: 'active',
      paid_through: new Date(new Date().getFullYear(), 11, 31), // Dec 31 of current year
      directory_opt_in: Math.random() > 0.3,
      created_at: new Date(),
      updated_at: new Date(),
    }));

    const { data: insertedOrgs, error: orgError } = await supabase
      .from('organizations')
      .insert(orgRows)
      .select();

    if (orgError) throw orgError;
    console.log(`✓ Inserted ${insertedOrgs?.length || 0} organizations`);

    // 3. Insert board members as users
    console.log('Inserting board members...');
    const boardUserRows = boardMembers.map((board) => ({
      id: uuidv4(),
      email: `${board.name.toLowerCase().replace(/\s+/g, '.')}@emaofbc.com`,
      full_name: board.name,
      role: 'board' as const,
      org_id: null,
      created_at: new Date(),
      updated_at: new Date(),
    }));

    const { data: boardUsers, error: boardError } = await supabase
      .from('users')
      .insert(boardUserRows)
      .select();

    if (boardError) throw boardError;
    console.log(`✓ Inserted ${boardUsers?.length || 0} board members`);

    // 4. Insert ED admin user
    console.log('Inserting admin users...');
    const adminUsers = [
      {
        id: uuidv4(),
        email: 'ed@emaofbc.com',
        full_name: 'Executive Director',
        role: 'ed_admin' as const,
        org_id: null,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    const { data: admins, error: adminError } = await supabase
      .from('users')
      .insert(adminUsers)
      .select();

    if (adminError) throw adminError;
    console.log(`✓ Inserted ${admins?.length || 0} admin users`);

    // 5. Insert employees for each organization
    console.log('Inserting organization employees...');
    const employeeRows = (insertedOrgs || []).flatMap((org: any) => {
      const numEmployees = Math.floor(Math.random() * 3) + 1; // 1-3 employees per org
      return Array.from({ length: numEmployees }).map((_, i) => ({
        id: uuidv4(),
        email: `employee${i + 1}@${org.email_domain}`,
        full_name: `Employee ${i + 1} at ${org.name}`,
        role: i === 0 ? 'org_admin' : 'employee',
        org_id: org.id,
        created_at: new Date(),
        updated_at: new Date(),
      }));
    });

    const { data: employees, error: employeeError } = await supabase
      .from('users')
      .insert(employeeRows)
      .select();

    if (employeeError) throw employeeError;
    console.log(`✓ Inserted ${employees?.length || 0} employees`);

    // 6. Insert memberships
    console.log('Inserting memberships...');
    const membershipRows = (insertedOrgs || []).map((org: any) => ({
      id: uuidv4(),
      org_id: org.id,
      period_start: new Date(new Date().getFullYear(), 0, 1), // Jan 1
      period_end: new Date(new Date().getFullYear(), 11, 31), // Dec 31
      tier: org.type,
      amount_cents:
        org.type === 'corporate'
          ? 55000 // $550 CAD
          : org.type === 'sole_proprietor'
            ? 37500 // $375 CAD
            : 25000, // $250 CAD for NGO
      status: 'paid',
      created_at: new Date(),
      updated_at: new Date(),
    }));

    const { error: membershipError } = await supabase.from('memberships').insert(membershipRows);

    if (membershipError) throw membershipError;
    console.log(`✓ Inserted ${membershipRows.length} memberships`);

    // 7. Insert events
    console.log('Inserting events...');
    const currentYear = new Date().getFullYear();
    const eventTemplates = [
      {
        type: 'monthly_session' as const,
        titles: [
          'Environmental Policy Update',
          'Climate Action in BC',
          'Circular Economy Workshop',
          'Biodiversity Conservation',
          'Water Management',
          'Sustainable Transport',
          'Green Building Standards',
          'Community Engagement',
          'Regulatory Compliance',
          'Innovation Showcase',
          'Industry Trends',
          'Future of ESG',
        ],
        speakers: [
          'Dr. James Lee',
          'Sarah Chen',
          'Robert Smith',
          'Maria Gonzalez',
          'David Kumar',
        ],
      },
      {
        type: 'workshop' as const,
        titles: [
          'Environmental Impact Assessment Master Class',
          'Carbon Accounting Basics',
          'GIS for Environmental Management',
        ],
        speakers: ['Prof. Patricia Brown', 'Dr. Michael Wong', 'Expert Consultant'],
      },
      {
        type: 'tour' as const,
        titles: [
          'Vancouver Waste Processing Facility Tour',
          'Renewable Energy Installation Site Tour',
        ],
        speakers: [],
      },
      {
        type: 'golf' as const,
        titles: ['Annual Golf Tournament'],
        speakers: [],
      },
      {
        type: 'gala' as const,
        titles: ['Annual Awards Gala & AGM'],
        speakers: ['Board Members'],
      },
    ];

    const eventRows: any[] = [];
    eventTemplates.forEach((template) => {
      if (template.type === 'monthly_session') {
        template.titles.forEach((title, idx) => {
          eventRows.push({
            id: uuidv4(),
            type: template.type,
            title,
            description: `Join us for ${title}. Industry experts will share insights and best practices.`,
            speaker: template.speakers[idx % template.speakers.length],
            venue: 'Vancouver Convention Centre' + (idx % 2 === 0 ? '' : ' - Room B'),
            starts_at: new Date(currentYear, idx, 15, 12, 0, 0),
            capacity: 150,
            member_price_cents: 0, // Free for members
            nonmember_price_cents: 2500, // $25 for non-members
            pd_eligible: true,
            status: new Date(currentYear, idx, 15) < new Date() ? 'past' : 'published',
            created_at: new Date(),
            updated_at: new Date(),
          });
        });
      } else if (template.type === 'workshop') {
        template.titles.forEach((title, idx) => {
          eventRows.push({
            id: uuidv4(),
            type: template.type,
            title,
            description: `Intensive workshop on ${title}. Limited to 30 participants.`,
            speaker: template.speakers[idx % template.speakers.length],
            venue: 'Environmental Centre Vancouver',
            starts_at: new Date(currentYear, 3 + idx, 10, 9, 0, 0),
            capacity: 30,
            member_price_cents: 5000, // $50 for members
            nonmember_price_cents: 10000, // $100 for non-members
            pd_eligible: true,
            status: 'published',
            created_at: new Date(),
            updated_at: new Date(),
          });
        });
      } else if (template.type === 'tour') {
        template.titles.forEach((title, idx) => {
          eventRows.push({
            id: uuidv4(),
            type: template.type,
            title,
            description: `Guided tour: ${title}. Transportation provided.`,
            speaker: 'Facility Manager',
            venue: title.includes('Waste') ? 'Metro Vancouver Facilities' : 'Clean Energy Site',
            starts_at: new Date(currentYear, 5 + idx, 20, 10, 0, 0),
            capacity: 40,
            member_price_cents: 2000, // $20
            nonmember_price_cents: 4000, // $40
            pd_eligible: true,
            status: 'published',
            created_at: new Date(),
            updated_at: new Date(),
          });
        });
      } else if (template.type === 'golf') {
        eventRows.push({
          id: uuidv4(),
          type: 'golf',
          title: 'Annual Golf Tournament',
          description:
            'Network with colleagues on the golf course. Includes lunch and awards ceremony.',
          speaker: undefined,
          venue: 'Shaughnessy Golf Club',
          starts_at: new Date(currentYear, 8, 10, 7, 0, 0),
          capacity: 144,
          member_price_cents: 20000, // $200 (4-person team)
          nonmember_price_cents: 25000, // $250
          pd_eligible: false,
          status: 'published',
          created_at: new Date(),
          updated_at: new Date(),
        });
      } else if (template.type === 'gala') {
        eventRows.push({
          id: uuidv4(),
          type: 'gala',
          title: 'Annual Awards Gala & AGM',
          description:
            'Celebrate excellence in environmental management. Recognition of award winners and annual meeting.',
          speaker: 'Board President',
          venue: 'Fairmont Pacific Rim',
          starts_at: new Date(currentYear, 10, 15, 18, 0, 0),
          capacity: 300,
          member_price_cents: 15000, // $150
          nonmember_price_cents: 20000, // $200
          pd_eligible: false,
          status: 'published',
          created_at: new Date(),
          updated_at: new Date(),
        });
      }
    });

    const { data: insertedEvents, error: eventError } = await supabase
      .from('events')
      .insert(eventRows)
      .select();

    if (eventError) throw eventError;
    console.log(`✓ Inserted ${insertedEvents?.length || 0} events`);

    // 8. Insert registrations for some employees
    console.log('Inserting registrations...');
    const registrationRows: any[] = [];
    const eventList = insertedEvents || [];
    const employeeList = employees || [];

    for (let i = 0; i < Math.min(30, employeeList.length); i++) {
      const employee = employeeList[i];
      const numRegistrations = Math.floor(Math.random() * 4) + 1; // 1-4 events per employee
      const selectedEvents = eventList.sort(() => Math.random() - 0.5).slice(0, numRegistrations);

      selectedEvents.forEach((event: any) => {
        registrationRows.push({
          id: uuidv4(),
          event_id: event.id,
          user_id: employee.id,
          org_id: employee.org_id,
          price_paid_cents: Math.random() > 0.1 ? (event.member_price_cents || 0) : 0, // 90% paid
          payment_status: Math.random() > 0.1 ? 'paid' : 'unpaid',
          attended: event.status === 'past' && Math.random() > 0.2, // 80% attendance if past
          pd_credit_recorded: false,
          created_at: new Date(),
          updated_at: new Date(),
        });
      });
    }

    const { error: registrationError } = await supabase
      .from('registrations')
      .insert(registrationRows);

    if (registrationError) throw registrationError;
    console.log(`✓ Inserted ${registrationRows.length} registrations`);

    // 9. Insert award submissions
    console.log('Inserting award submissions...');
    const awardRows = [];
    const awardCategories = [
      'Leadership',
      'Innovation',
      'Sustainability',
      'Community Impact',
      'Small Business',
    ];

    for (let i = 0; i < 5; i++) {
      const org = insertedOrgs?.[i];
      const submitter = employeeList.find((e) => e.org_id === org?.id);

      if (org && submitter) {
        awardRows.push({
          id: uuidv4(),
          org_id: org.id,
          submitter_user_id: submitter.id,
          category: awardCategories[i % awardCategories.length],
          materials_url: `https://storage.example.com/awards/${org.id}/submission.pdf`,
          status: ['submitted', 'under_review', 'shortlisted'][Math.floor(Math.random() * 3)],
          created_at: new Date(),
          updated_at: new Date(),
        });
      }
    }

    const { error: awardError } = await supabase.from('awards').insert(awardRows);

    if (awardError) throw awardError;
    console.log(`✓ Inserted ${awardRows.length} award submissions`);

    // 10. Insert content with embeddings
    console.log('Inserting content...');
    const contentRows = [
      {
        type: 'post',
        title: 'New Environmental Regulations Coming in 2024',
        body: 'The BC government has announced new environmental regulations affecting air quality, water management, and waste disposal. All organizations must prepare for compliance by Q2 2024.',
        event_id: null,
      },
      {
        type: 'post',
        title: 'Circular Economy Webinar Recap',
        body: 'Our recent webinar on circular economy principles featured insights from leading organizations. Key takeaways: design for reuse, minimize waste, and collaborate across industries.',
        event_id: null,
      },
      {
        type: 'recap',
        title: 'Environmental Policy Update - March Session',
        body: 'Dr. James Lee discussed recent policy changes affecting environmental managers. Topics included carbon pricing, biodiversity protection, and corporate sustainability reporting.',
        event_id: eventList[0]?.id || null,
      },
      {
        type: 'archive',
        title: 'Case Study: Zero Waste Corporate Initiative',
        body: 'How a major corporation achieved 85% waste diversion through comprehensive programs including employee engagement, supplier partnerships, and continuous improvement.',
        event_id: null,
      },
      {
        type: 'archive',
        title: 'Guide to GHG Emissions Reporting',
        body: 'Step-by-step guide to measuring and reporting greenhouse gas emissions. Includes scope 1, 2, and 3 emissions with practical examples for different sectors.',
        event_id: null,
      },
    ];

    const contentInserts = contentRows.map((row) => ({
      ...row,
      id: uuidv4(),
      published_at: row.type === 'archive' ? new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) : new Date(),
      embedding: Array(1536).fill(Math.random()).slice(0, 1536), // Mock embedding
      created_at: new Date(),
      updated_at: new Date(),
    }));

    const { error: contentError } = await supabase.from('content').insert(contentInserts);

    if (contentError) throw contentError;
    console.log(`✓ Inserted ${contentInserts.length} content items`);

    // 11. Insert sponsorship opportunities
    console.log('Inserting sponsorships...');
    const sponsorshipRows: any[] = [];
    const sponsorshipTiers = ['platinum', 'gold', 'silver', 'bronze'] as const;

    // Sponsorships for the gala and golf tournament
    const sponsorableEvents = eventList.filter((e: any) =>
      ['gala', 'golf'].includes(e.type)
    );

    sponsorableEvents.forEach((event: any) => {
      const numSponsors = Math.floor(Math.random() * 5) + 2; // 2-6 sponsors per event
      const sponsors = insertedOrgs?.slice(10, 10 + numSponsors) || [];

      sponsors.forEach((sponsor: any, idx: number) => {
        sponsorshipRows.push({
          id: uuidv4(),
          event_id: event.id,
          org_id: sponsor.id,
          tier: sponsorshipTiers[idx % sponsorshipTiers.length],
          amount_cents:
            idx % 4 === 0
              ? 500000 // $5000 platinum
              : idx % 4 === 1
                ? 300000 // $3000 gold
                : idx % 4 === 2
                  ? 150000 // $1500 silver
                  : 50000, // $500 bronze
          payment_status: Math.random() > 0.3 ? 'paid' : 'unpaid',
          placement_status: Math.random() > 0.2 ? 'placed' : 'pending',
          created_at: new Date(),
          updated_at: new Date(),
        });
      });
    });

    const { error: sponsorshipError } = await supabase
      .from('sponsorships')
      .insert(sponsorshipRows);

    if (sponsorshipError) throw sponsorshipError;
    console.log(`✓ Inserted ${sponsorshipRows.length} sponsorships`);

    console.log('\n✅ Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Seed failed:', error);
    process.exit(1);
  }
}

seed();
