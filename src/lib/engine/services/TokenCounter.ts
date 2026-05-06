import { LLM_MODELS } from '../constants/models';

export class TokenCounter {
  countTokens(text: string, _model = 'gpt-4'): number {
    if (!text) return 0;
    return Math.ceil(text.length / 4);
  }

  count(prompt: string, completion: string, model = 'gpt-4') {
    return {
      prompt: this.countTokens(prompt, model),
      completion: this.countTokens(completion, model),
      total: this.countTokens(prompt, model) + this.countTokens(completion, model),
    };
  }

  estimateCost(tokensUsed: { prompt: number; completion: number }, model = 'gpt-4'): number {
    const modelConfig = LLM_MODELS[model];
    if (!modelConfig) return 0;

    const inputCost = (tokensUsed.prompt / 1_000_000) * modelConfig.costPerMillionInput;
    const outputCost = (tokensUsed.completion / 1_000_000) * modelConfig.costPerMillionOutput;

    return parseFloat((inputCost + outputCost).toFixed(8));
  }
}
