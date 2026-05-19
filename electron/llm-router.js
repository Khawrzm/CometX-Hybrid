const { getLlama, LlamaChatSession } = require('node-llama-cpp');
const path = require('path');

class LLMRouter {
  constructor() { this.local = null; }
  
  async ask(prompt, context) {
    if (context.useLocal) return await this.askLocal(prompt);
    return await this.askRemote(prompt, context.provider);
  }

  async askLocal(prompt) {
    if (!this.local) {
      const llama = await getLlama();
      const model = await llama.loadModel({ modelPath: path.join(__dirname, '../models/local/model.gguf') });
      const ctx = await model.createContext();
      this.local = new LlamaChatSession({ contextSequence: ctx.getSequence() });
    }
    return await this.local.prompt(prompt);
  }

  async askRemote(prompt, provider) {
    // Adapter موحد عشان ما تشتري wrapper لكل شركة
    const endpoints = {
      openai: 'https://api.openai.com/v1/chat/completions',
      anthropic: 'https://api.anthropic.com/v1/messages'
    };
    const response = await fetch(endpoints[provider], {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${process.env.AI_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'gpt-4o', messages: [{ role: 'user', content: prompt }] })
    });
    return await response.json();
  }
}
module.exports = new LLMRouter();
