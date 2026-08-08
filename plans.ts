export type BillingCycle = 'mensal' | 'anual';

export interface Plan {
  id: string;
  name: string;
  sub: string;
  audience: string;
  cta: string;
  featured?: boolean;
  tag?: string;
  items: string[];
  priceMensal: string;
  periodMensal: string;
  priceAnual: string;
  periodAnual: string;
  equivalentMensalAnual?: string;
}

export const PLANS: Plan[] = [
  {
    id: "essencial",
    name: "Essencial",
    sub: "O Ponto de Entrada",
    audience: "Para criadores solo e iniciantes no estrategismo.",
    cta: "Começar Agora",
    featured: false,
    priceMensal: "67",
    periodMensal: "/mês",
    priceAnual: "670",
    periodAnual: "/ano",
    equivalentMensalAnual: "R$ 55/mês · Economia de R$ 134/ano",
    items: [
      "10 Arquiteturas Editoriais por mês",
      "Formulário Estratégico Guiado",
      "Exportação em PDF Padrão",
      "Acesso a 3 Presets Básicos",
      "Suporte via E-mail",
    ],
  },
  {
    id: "elite",
    name: "Elite",
    sub: "O Padrão de Agência",
    audience: "Para estrategistas, social medias e agências boutique.",
    cta: "Tornar-me Elite",
    featured: true,
    tag: "RECOMENDADO",
    priceMensal: "197",
    periodMensal: "/mês",
    priceAnual: "1.970",
    periodAnual: "/ano",
    equivalentMensalAnual: "R$ 164/mês · Economia de R$ 394/ano",
    items: [
      "Gerações Ilimitadas",
      "Exportação PDF A3 Estratégico",
      "12+ Presets de Luxo (Classic Gold, Dark Onyx…)",
      "Branding: Marca d'água + Assinatura Tripla",
      "Histórico de até 10 Projetos Ativos",
      "Suporte Prioritário",
    ],
  },
  {
    id: "master",
    name: "Master Black",
    sub: "Alta Consultoria",
    audience: "Para consultores premium, grandes agências e educadores.",
    cta: "Entrar para o Master Black",
    featured: false,
    priceMensal: "297",
    periodMensal: "/mês",
    priceAnual: "2.490",
    periodAnual: "/ano",
    equivalentMensalAnual: "R$ 207/mês · Economia de R$ 1.074/ano",
    items: [
      "Tudo do Plano Elite",
      "Modo White-Label (sem marca Studio OS)",
      "Suporte VIP via WhatsApp",
      "Presets Exclusivos e Customizados",
      "Mentoria Trimestral em Grupo",
    ],
  },
];

export const getPlanById = (id?: string | null): Plan | null => {
  if (!id) return null;
  const found = PLANS.find(p => p.id.toLowerCase() === id.toLowerCase());
  return found || null;
};
