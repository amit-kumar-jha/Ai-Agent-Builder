export const PRICING = {
  plans: {
    free: {
      name: 'Free',
      price: 0,
      agents: 3,
      executionsPerMonth: 100,
      teamMembers: 1,
      marketplaceAccess: false,
      apiAccess: false,
      features: ['Basic builder', 'UI testing', '3 agents', '100 executions/mo'],
    },
    starter: {
      name: 'Starter',
      price: 49,
      agents: 20,
      executionsPerMonth: 10000,
      teamMembers: 3,
      marketplaceAccess: false,
      apiAccess: true,
      features: ['Everything in Free', 'API access', 'Webhooks', 'Basic monitoring', '20 agents'],
    },
    pro: {
      name: 'Pro',
      price: 199,
      agents: -1,
      executionsPerMonth: 100000,
      teamMembers: 10,
      marketplaceAccess: true,
      apiAccess: true,
      features: ['Everything in Starter', 'Multi-agent workflows', 'Advanced monitoring', 'Priority support', 'Unlimited agents'],
    },
    enterprise: {
      name: 'Enterprise',
      price: 'custom' as const,
      agents: -1,
      executionsPerMonth: -1,
      teamMembers: -1,
      marketplaceAccess: true,
      apiAccess: true,
      features: ['Everything in Pro', 'Dedicated support', 'Custom integrations', 'SLA', 'SSO'],
    },
  },

  executionCost: 0.001,
  teamMemberCost: 5,

  marketplaceRevenueSplit: {
    creator: 0.70,
    platform: 0.30,
  },
};
