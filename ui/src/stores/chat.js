import { ref, reactive } from 'vue'
import { defineStore } from 'pinia'
import { ChatOpenAI } from '@langchain/openai'

import ChatInteraction from '@/ChatInteraction.js'
import lotrData from '@/stores/lotr.json'

const mode = 'local'

const model = new ChatOpenAI(
  { modelName: 'bedrock-claude-v3.5', openAIApiKey: 'x' },
  { basePath: 'http://localhost:4000' },
)

function createInteraction(prompt) {
  return reactive(new ChatInteraction(prompt))
}

export const useChatStore = defineStore('chat', () => {
  const interactions = ref([])
  const loading = ref(false)

  async function submitPrompt(prompt) {
    // TODO: loading is not very safe- take another look
    loading.value = true

    const interaction = createInteraction(prompt)
    interactions.value.unshift(interaction)

    if (mode !== 'local') {
      const stream = await model.stream(prompt)
      for await (const chunk of stream) {
        interaction.response += chunk.content
      }
    } else {
      for (const chunk of lotrData) {
        await new Promise(resolve => setTimeout(resolve, 100)) // artificial delay
        interaction.response += chunk.content
      }
    }

    interaction.loading = false
    loading.value = false
  }

  return { interactions, loading, submitPrompt }
})
