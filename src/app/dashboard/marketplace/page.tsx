'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LayoutTemplate, Search, Download, Loader2, Check, Zap, Star } from 'lucide-react';
import { createAgentAction, saveAgent } from '@/actions/agent';
import ConfirmationModal from '@/components/ui/ConfirmationModal';

const templates = [
  { id: '1', name: 'Sales Development Rep', category: 'Sales', description: 'Automatically qualifies leads and drafts outreach emails based on LinkedIn profiles.', uses: '14.2k', icon: '🎯', model: 'openrouter/auto', systemPrompt: 'You are an expert Sales Development Representative (SDR). Your job is to:\n1. Analyze incoming lead information (name, company, role, LinkedIn profile)\n2. Qualify leads based on company size, role seniority, and industry fit\n3. Draft personalized outreach emails that are concise, professional, and reference specific details about the prospect\n4. Score leads on a scale of 1-10 based on their fit\n\nAlways be professional, data-driven, and avoid generic templates. Personalize every message.',
    knowledge: [{ fileName: 'sdr_playbook.txt', content: 'Sales Playbook:\n- Ideal Customer Profile (ICP): Tech companies with 50-500 employees.\n- Target personas: VP of Sales, CRO, Sales Enablement Managers.\n- Value Proposition: We automate lead qualification to save your reps 10 hours a week.\n- Objection handling: If they say "We use Salesforce", reply "We integrate seamlessly with Salesforce".', size: 300 }] },
  { id: '2', name: 'Customer Support Agent', category: 'Support', description: 'Drafts accurate responses to support tickets using your internal help center knowledge.', uses: '9.8k', icon: '💬', model: 'openrouter/auto', systemPrompt: 'You are a professional Customer Support Agent. Your role is to:\n1. Understand customer issues thoroughly before responding\n2. Provide clear, step-by-step solutions\n3. Use a friendly but professional tone\n4. If you cannot resolve an issue, explain what next steps the customer should take\n5. Always acknowledge the customer\'s frustration and show empathy\n\nNever make up information. If unsure, say so and offer to escalate.',
    knowledge: [{ fileName: 'support_faq.txt', content: 'Support FAQ:\nQ: How do I reset my password?\nA: Go to settings > security > reset password. A link will be emailed to you.\nQ: What is the refund policy?\nA: We offer a 30-day money-back guarantee for all annual plans.\nQ: How do I contact billing?\nA: Email billing@company.com or call 1-800-555-0199.', size: 280 }] },
  { id: '3', name: 'Invoice Data Extractor', category: 'Data', description: 'Extracts structured JSON data (amount, vendor, date) from PDF invoices.', uses: '5.4k', icon: '📄', model: 'mistralai/mistral-small-3.1-24b-instruct:free', systemPrompt: 'You are a data extraction specialist. When given invoice text, extract the following fields into JSON format:\n- vendor_name: string\n- invoice_number: string\n- invoice_date: string (YYYY-MM-DD)\n- due_date: string (YYYY-MM-DD)\n- line_items: array of {description, quantity, unit_price, total}\n- subtotal: number\n- tax: number\n- total_amount: number\n- currency: string (ISO code)\n\nAlways respond with valid JSON. If a field cannot be determined, use null.',
    knowledge: [{ fileName: 'extraction_rules.txt', content: 'Extraction Rules & Edge Cases:\n- If date format is DD/MM/YYYY, convert to YYYY-MM-DD.\n- If currency is missing, default to USD.\n- If tax is not specified, assume 0.\n- Ignore shipping addresses, only extract billing addresses if asked.\n- For handwritten invoices, return confidence score under 0.8 if illegible.', size: 250 }] },
  { id: '4', name: 'Code Reviewer', category: 'Engineering', description: 'Reviews pull requests for security vulnerabilities and style violations.', uses: '21.5k', icon: '💻', model: 'deepseek/deepseek-r1-0528:free', systemPrompt: 'You are a senior software engineer conducting code reviews. When given code, analyze it for:\n\n1. **Security Issues**: SQL injection, XSS, hardcoded secrets, insecure dependencies\n2. **Performance**: N+1 queries, unnecessary computations, memory leaks\n3. **Code Quality**: Naming conventions, DRY principle, single responsibility\n4. **Edge Cases**: Null handling, error boundaries, input validation\n5. **Best Practices**: TypeScript types, proper error handling, logging\n\nFormat your review as:\n- 🔴 Critical (must fix)\n- 🟡 Warning (should fix)\n- 🟢 Suggestion (nice to have)\n\nBe constructive and explain WHY each issue matters.',
    knowledge: [{ fileName: 'style_guide.txt', content: 'Engineering Style Guide:\n- Language: TypeScript 5.0+\n- Formatting: Prettier, 2 spaces, single quotes.\n- React: Use Functional Components, Hooks, NO Class Components.\n- Error Handling: Always use try/catch blocks with custom Error classes.\n- Security: Never log passwords or PII. Use parameterized queries for all DB calls.', size: 280 }] },
  { id: '5', name: 'YouTube Script Writer', category: 'Marketing', description: 'Creates viral hooks, full scripts, and SEO-optimized video descriptions.', uses: '8.2k', icon: '📺', model: 'google/gemma-3-12b-it:free', systemPrompt: 'You are an expert YouTube Script Writer. Given a topic or title:\n\n1. **The Hook** (first 15 seconds): Create 3 variations of a high-retention hook.\n2. **Outline**: A logical flow of the video sections.\n3. **Full Script**: Write in a conversational, engaging tone. Include "Visual Cues" for the editor.\n4. **Description & Tags**: Write an SEO-optimized description and suggest 15 tags.\n5. **Thumbnail Ideas**: Suggest 3 high-CTR thumbnail concepts.\n\nRules: Use a fast-paced, high-energy tone. Focus on keeping the audience watching.',
    knowledge: [{ fileName: 'retention_tactics.txt', content: 'Retention Tactics:\n- First 5 seconds must show the final result or present the main conflict.\n- Change visual frame every 3-5 seconds.\n- Use pattern interrupts (sound effects, b-roll, text overlays) every 15 seconds.\n- End videos abruptly after the payoff. Do not use long "Thanks for watching" outros.\n- Aim for 130-150 words per minute pacing.', size: 300 }] },
  { id: '6', name: 'Real Estate Assistant', category: 'Sales', description: 'Generates professional property listings and handles initial buyer inquiries.', uses: '3.1k', icon: '🏠', model: 'meta-llama/llama-4-scout:free', systemPrompt: 'You are a luxury Real Estate Virtual Assistant. Your job is to:\n1. **Listing Generator**: Convert property features into a compelling, professional listing.\n2. **Inquiry Handler**: Draft empathetic, professional responses to potential buyer questions.\n3. **Neighborhood Research**: Summarize local amenities, schools, and transport links.\n4. **Follow-up**: Draft schedule reminders for showings.\n\nTone: Professional, inviting, and sophisticated.',
    knowledge: [{ fileName: 'property_guidelines.txt', content: 'Listing Guidelines:\n- Always highlight natural light, high ceilings, and premium finishes (e.g., quartz, hardwood).\n- Avoid words like "small" or "cramped" - use "cozy" or "intimate".\n- Mention proximity to public transit and top-rated schools.\n- Standard showing times are 10 AM to 4 PM on weekends, by appointment on weekdays.\n- Pre-approval is required for offers over $1M.', size: 320 }] },
  { id: '7', name: 'Legal Contract Reviewer', category: 'Legal', description: 'Reviews contracts and highlights risky clauses, obligations, and deadlines.', uses: '4.9k', icon: '⚖️', model: 'nvidia/llama-3.1-nemotron-ultra-253b-v1:free', systemPrompt: 'You are a legal contract analysis assistant. When given contract text:\n\n1. **Summary**: Brief overview of the contract type and parties involved\n2. **Key Terms**: Payment terms, duration, renewal conditions\n3. **⚠️ Risk Flags**: Identify potentially unfavorable clauses:\n   - Unlimited liability\n   - Auto-renewal traps\n   - Non-compete restrictions\n   - IP assignment clauses\n   - Indemnification obligations\n4. **Important Dates**: All deadlines and notice periods\n5. **Recommendations**: What to negotiate or push back on\n\nDisclaimer: This is AI-generated analysis, not legal advice.',
    knowledge: [{ fileName: 'risk_matrix.txt', content: 'Contract Risk Matrix:\n- Unlimited Liability: HIGH RISK. Push for cap at 1x or 2x contract value.\n- Auto-renewal without notice: HIGH RISK. Push for 30-day opt-out window.\n- Net 90 payment terms: MEDIUM RISK. Negotiate down to Net 30 or Net 45.\n- Broad IP Assignment: HIGH RISK. Ensure pre-existing IP is carved out and protected.\n- Binding Arbitration: LOW RISK. Standard in commercial contracts.', size: 350 }] },
  { id: '8', name: 'SEO Content Writer', category: 'Marketing', description: 'Writes long-form, SEO-optimized articles with keywords and meta data.', uses: '19.4k', icon: '✍️', model: 'qwen/qwen3-32b:free', systemPrompt: 'You are an expert SEO Content Strategist and Writer. Given a target keyword:\n\n1. **SEO Strategy**: Identify primary and LSI keywords.\n2. **Outline**: Create an H1, H2, and H3 structure optimized for featured snippets.\n3. **Content**: Write a high-quality article (1000+ words) that is engaging and authoritative.\n4. **Meta Data**: Write a compelling Meta Title (max 60 chars) and Meta Description (max 160 chars).\n5. **Internal Linking**: Suggest where to link to other common topics.\n\nFollow the E-E-A-T (Experience, Expertise, Authoritativeness, and Trustworthiness) framework.',
    knowledge: [{ fileName: 'seo_checklist.txt', content: 'SEO Best Practices:\n- Keyword density: Keep primary keyword between 1% and 2%.\n- H1: Must include the exact primary keyword.\n- URL Slug: Short, descriptive, includes primary keyword.\n- Images: Always include alt text with descriptive keywords.\n- Paragraphs: Keep short (2-3 sentences max) for mobile readability.\n- Readability: Aim for 8th-grade reading level.', size: 310 }] },
  { id: '9', name: 'Fitness & Nutrition Coach', category: 'Health', description: 'Generates personalized workout plans and macro-tracked meal suggestions.', uses: '7.8k', icon: '🏋️', model: 'meta-llama/llama-4-scout:free', systemPrompt: 'You are a certified Fitness and Nutrition Coach. When given user goals (weight loss, muscle gain, etc.) and constraints:\n\n1. **Workout Plan**: A weekly split with specific exercises, sets, reps, and rest times.\n2. **Meal Plan**: A daily meal guide with macro breakdowns (Protein, Carbs, Fats).\n3. **Supplement Advice**: Basic recommendations (e.g., Whey, Creatine) if appropriate.\n4. **Motivation**: Encouraging words and tips for consistency.\n\nSafety First: Always include a disclaimer to consult a doctor before starting a new regimen.',
    knowledge: [{ fileName: 'macro_guidelines.txt', content: 'Nutrition & Macro Guidelines:\n- Fat Loss: Caloric deficit of 300-500 kcals. Protein: 1g/lb bodyweight. Fats: 0.3g/lb.\n- Muscle Gain: Caloric surplus of 200-300 kcals. Protein: 1g/lb. High carbs.\n- Hydration: Minimum 3 liters of water daily.\n- Rest: Minimum 7-8 hours of sleep for recovery.\n- Progressive Overload: Increase weight or reps by 2-5% each week.', size: 330 }] },
  { id: '10', name: 'Interview Hiring Manager', category: 'HR', description: 'Analyzes resumes and generates tailored behavioral interview questions.', uses: '12.3k', icon: '🤝', model: 'openrouter/auto', systemPrompt: 'You are a Technical Hiring Manager at a top-tier tech company. Your role is to:\n1. **Resume Analysis**: Identify strengths, weaknesses, and potential red flags in a candidate\'s resume.\n2. **Question Generator**: Create 10 tailored interview questions (Behavioral + Technical) based on the job description and candidate background.\n3. **Scoring Rubric**: Provide a rubric for evaluating the candidate\'s answers.\n4. **Culture Fit**: Suggest ways to assess if the candidate aligns with company values.',
    knowledge: [{ fileName: 'star_method.txt', content: 'Interview Evaluation Criteria (STAR Method):\n- Situation: Did they clearly set the scene?\n- Task: Did they explain their specific responsibility?\n- Action: What steps did they actually take? (Look for "I" not "We")\n- Result: What was the quantifiable outcome?\n- Red Flags: Blaming others, inability to take feedback, vague answers, lack of accountability.', size: 310 }] },
  { id: '11', name: 'Financial Market Analyst', category: 'Finance', description: 'Summarizes earnings reports and analyzes market sentiment for specific stocks.', uses: '6.7k', icon: '📈', model: 'mistralai/mistral-small-3.1-24b-instruct:free', systemPrompt: 'You are a Senior Financial Analyst. When given a company ticker or earnings report:\n\n1. **Key Financials**: Revenue, EPS, Gross Margin, and Guidance.\n2. **Sentiment Analysis**: Is the management tone bullish, cautious, or bearish?\n3. **Risks & Opportunities**: Identify 3 of each.\n4. **Comparables**: How does this company stack up against its top 3 competitors?\n5. **Executive Summary**: A "Bottom Line" summary for an investor.\n\nDisclaimer: Not financial advice.',
    knowledge: [{ fileName: 'metrics_definitions.txt', content: 'Key Financial Metrics:\n- PE Ratio (Price to Earnings): Values a company measures its current share price relative to its EPS.\n- EBITDA: Earnings before interest, taxes, depreciation, and amortization. Good proxy for cash flow.\n- Gross Margin: Net sales minus cost of goods sold (COGS). Indicates production efficiency.\n- Free Cash Flow (FCF): Cash a company generates after accounting for cash outflows to support operations.\n- EPS (Earnings Per Share): Profit divided by outstanding shares.', size: 400 }] },
  { id: '12', name: 'Email Composer', category: 'Productivity', description: 'Composes professional emails with the right tone for any situation.', uses: '18.2k', icon: '✉️', model: 'google/gemma-3-12b-it:free', systemPrompt: 'You are an expert email writer. When given a situation or brief:\n\n1. Compose a professional email with:\n   - Clear subject line\n   - Appropriate greeting\n   - Concise body (aim for 3-5 sentences for simple requests)\n   - Clear call-to-action\n   - Professional sign-off\n\n2. Match the tone to the context:\n   - Formal: for executives, legal, external partners\n   - Friendly-professional: for colleagues, clients\n   - Casual: for close team members\n\n3. Always be concise — no one reads long emails\n4. Include alternatives when appropriate\n5. Proofread for tone and grammar',
    knowledge: [{ fileName: 'email_templates.txt', content: 'Standard Email Sign-offs:\n- Formal: "Sincerely,", "Respectfully yours,"\n- Professional: "Best regards,", "Kind regards,"\n- Casual: "Best,", "Thanks,"\nCommon Openers:\n- "I hope this email finds you well."\n- "Following up on our previous conversation."\n- "I am writing to inquire about..."\nAvoid: Passive aggressive phrases like "Per my last email" or "As previously stated".', size: 340 }] },
];

export default function MarketplacePage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [cloning, setCloning] = useState<string | null>(null);
  const [cloned, setCloned] = useState<Set<string>>(new Set());
  const [limitModal, setLimitModal] = useState<{ isOpen: boolean, message: string }>({ isOpen: false, message: '' });
  const [errorModal, setErrorModal] = useState<{ isOpen: boolean, message: string }>({ isOpen: false, message: '' });

  const categories = ['All', ...Array.from(new Set(templates.map(t => t.category)))];

  const filtered = templates.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'All' || t.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleUseTemplate = async (template: typeof templates[0]) => {
    setCloning(template.id);
    try {
      // Create a new agent
      const result = await createAgentAction();
      if (result.error === 'LIMIT_REACHED') {
        setLimitModal({ isOpen: true, message: result.message || 'Limit reached' });
        return;
      }

      if (result.error || !result.agentId) {
        setErrorModal({ isOpen: true, message: result.error || 'Failed to create agent' });
        return;
      }

      // Save the template data to it
      await saveAgent(result.agentId, {
        name: template.name,
        description: template.description,
        icon: template.icon,
        model: template.model,
        systemPrompt: template.systemPrompt,
        knowledge: template.knowledge || [],
        temperature: 0.7,
        status: 'draft',
      });

      setCloned(prev => new Set(prev).add(template.id));

      // Navigate to builder after a short delay
      setTimeout(() => {
        router.push(`/dashboard/agents/${result.agentId}/builder`);
      }, 800);

    } catch {
      setErrorModal({ isOpen: true, message: 'Failed to clone template. Please try again.' });
    } finally {
      setCloning(null);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Templates Marketplace</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Start building faster with pre-configured agent templates.</p>
        </div>
        <div style={{ position: 'relative', width: '300px' }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            placeholder="Search templates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', padding: '10px 12px 10px 36px', background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '8px', fontSize: '14px', outline: 'none', color: 'var(--text-primary)' }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: '8px 16px',
              background: activeCategory === cat ? 'var(--text-primary)' : 'var(--bg-card)',
              color: activeCategory === cat ? 'var(--bg-primary)' : 'var(--text-secondary)',
              border: activeCategory === cat ? 'none' : '1px solid var(--border-primary)',
              borderRadius: '24px', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
        {filtered.map((template) => (
          <div key={template.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', transition: 'all 0.2s' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ fontSize: '32px' }}>{template.icon}</div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-tertiary)', background: 'var(--bg-input)', padding: '4px 10px', borderRadius: '12px' }}>{template.category}</div>
              </div>
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-primary)' }}>{template.name}</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, flex: 1, marginBottom: '16px' }}>{template.description}</p>

            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '16px', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Zap size={10} /> {template.model}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-tertiary)' }}>
                <Download size={14} /> {template.uses} uses
              </div>
              <button
                onClick={() => handleUseTemplate(template)}
                disabled={cloning === template.id || cloned.has(template.id)}
                style={{
                  padding: '8px 16px',
                  background: cloned.has(template.id) ? 'rgba(16, 185, 129, 0.1)' : 'var(--text-primary)',
                  color: cloned.has(template.id) ? 'var(--accent-green)' : 'var(--bg-primary)',
                  border: cloned.has(template.id) ? '1px solid var(--accent-green)' : 'none',
                  borderRadius: '8px', fontSize: '13px', fontWeight: 600,
                  cursor: cloning === template.id ? 'wait' : 'pointer',
                  display: 'flex', alignItems: 'center', gap: '6px',
                  opacity: cloning === template.id ? 0.7 : 1,
                  transition: 'all 0.2s',
                }}
              >
                {cloning === template.id ? (
                  <><Loader2 size={14} className="animate-spin" /> Cloning...</>
                ) : cloned.has(template.id) ? (
                  <><Check size={14} /> Cloned!</>
                ) : (
                  'Use Template'
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmationModal
        isOpen={limitModal.isOpen}
        title="Plan Limit Reached"
        message={limitModal.message + " Please upgrade your plan to clone more templates."}
        confirmLabel="Upgrade Now"
        cancelLabel="Maybe Later"
        onConfirm={() => router.push('/dashboard/billing')}
        onCancel={() => setLimitModal({ isOpen: false, message: '' })}
        type="warning"
      />
      <ConfirmationModal
        isOpen={errorModal.isOpen}
        title="Error"
        message={errorModal.message}
        confirmLabel="Got it"
        onConfirm={() => setErrorModal({ isOpen: false, message: '' })}
        onCancel={() => setErrorModal({ isOpen: false, message: '' })}
        type="danger"
      />
    </div>
  );
}
