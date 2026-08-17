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
    text: 'A ARSX nos conectou com parceiros na América do Norte que nunca teríamos encontrado sozinhos. Em três meses fechamos dois contratos recorrentes.',
    initials: 'CM',
    color: '#1B3068',
  },
  {
    name: 'Priya Anand',
    role: 'Head of Procurement',
    company: 'Nexus Global',
    country: 'USA',
    text: 'Como compradora, eu precisava de parceiros verificados rapidamente. O diretório me entregou exatamente isso — cada empresa já foi analisada e aprovada. Economizamos semanas de due diligence.',
    initials: 'PA',
    color: '#C41717',
  },
  {
    name: 'Rafael Souza',
    role: 'Commercial Director',
    company: 'TechBridge Brasil',
    country: 'Brazil',
    text: 'Recebemos nossa primeira consulta pela plataforma 48 horas após o perfil ir ao ar. A qualidade dos leads é muito superior à de diretórios genéricos.',
    initials: 'RS',
    color: '#2A8B22',
  },
  {
    name: 'Andrea Müller',
    role: 'Operations Manager',
    company: 'EuroBridge GmbH',
    country: 'Germany',
    text: 'Expandir para novos mercados exige parceiros locais confiáveis. A ARSX nos deu acesso direto a empresas verificadas. A plataforma é limpa e os contatos são reais.',
    initials: 'AM',
    color: '#F08C00',
  },
]

export const PLANS = [
  {
    id: 'free',
    name: 'Gratuito',
    price: 0,
    color: 'border-gray-200',
    features: [
      'Perfil da empresa visível no diretório',
      'Informações básicas de contato (nome, país, setor)',
      'Receba solicitações de conexão',
    ],
    cta: 'Cadastrar Grátis',
    highlight: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 29,
    color: 'border-blue-500',
    features: [
      'Acesso completo ao diretório',
      'Ver dados de contato de todos os membros',
      'Enviar e receber mensagens',
      'Selo de membro Pro',
    ],
    cta: 'Assinar Pro',
    highlight: false,
  },
  {
    id: 'business',
    name: 'Business',
    price: 79,
    color: 'border-arsx',
    features: [
      'Tudo do plano Pro',
      'Listagem em destaque — topo dos resultados',
      'Analytics avançado',
      'Suporte prioritário',
      'Selo de membro Business',
    ],
    cta: 'Assinar Business',
    highlight: true,
  },
]
