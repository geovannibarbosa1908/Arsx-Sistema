export interface Testimonial {
  name: string
  role: string
  company: string
  country: string
  text: string
  initials: string
  color: string
}

export const INDUSTRIES = [
  'Technology', 'Finance & Banking', 'Healthcare', 'Manufacturing',
  'Retail & E-commerce', 'Real Estate', 'Education', 'Marketing & Advertising',
  'Legal Services', 'Consulting', 'Construction', 'Food & Beverage',
  'Energy', 'Media & Entertainment', 'Agriculture',
]

export const COUNTRIES = [
  'USA', 'Brazil', 'United Kingdom', 'Germany', 'France',
  'Canada', 'Australia', 'India', 'Mexico', 'Argentina',
  'Colombia', 'Netherlands', 'Spain', 'Italy', 'Portugal',
]

export const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Carlos Mendonça',
    role: 'CEO',
    company: 'Meridian Solutions',
    country: 'Brazil',
    text: 'Open Networking connected us with partners in North America that we could never have found on our own. Within three months we closed two recurring contracts.',
    initials: 'CM',
    color: '#1B3068',
  },
  {
    name: 'Priya Anand',
    role: 'Head of Procurement',
    company: 'Nexus Global',
    country: 'USA',
    text: 'As a buyer, I needed vetted partners fast. The directory gave me exactly that — every company has already been screened and approved. It saved our team weeks of due diligence.',
    initials: 'PA',
    color: '#C41717',
  },
  {
    name: 'Rafael Souza',
    role: 'Commercial Director',
    company: 'TechBridge Brasil',
    country: 'Brazil',
    text: 'We received our first inquiry through the platform 48 hours after our profile went live. The quality of the leads is much higher than generic directories.',
    initials: 'RS',
    color: '#2A8B22',
  },
  {
    name: 'Andrea Müller',
    role: 'Operations Manager',
    company: 'EuroBridge GmbH',
    country: 'Germany',
    text: 'Expanding into new markets requires trusted local partners. Open Networking gave us direct access to verified companies. The platform is clean, the contacts are real.',
    initials: 'AM',
    color: '#F08C00',
  },
]

export const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    color: 'border-gray-200',
    features: [
      'Company profile visible in directory',
      'Basic contact info (name, country, industry)',
      'Receive connection requests',
    ],
    cta: 'Sign Up Free',
    highlight: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 29,
    color: 'border-blue-500',
    features: [
      'Full access to the directory',
      'View contact details of all members',
      'Send and receive messages',
      'Pro member badge',
    ],
    cta: 'Get Pro',
    highlight: false,
  },
  {
    id: 'business',
    name: 'Business',
    price: 79,
    color: 'border-navy',
    features: [
      'Everything in Pro',
      'Featured listing — top search results',
      'Advanced analytics',
      'Priority support',
      'Business member badge',
    ],
    cta: 'Go Business',
    highlight: true,
  },
]
