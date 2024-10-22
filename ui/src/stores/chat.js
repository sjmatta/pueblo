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

const interactions = ref([])
const loading = ref(false)

function createInteraction(prompt) {
  return reactive(new ChatInteraction(prompt))
}

function createFullPrompt(interactions, prompt) {
    // Aggregate all previous messages into a single string
    // Surely this whole thing is inefficient but it works for now
    // The challenge is ensuring that the model has the full context, but keeping model details away from the view
    // TODO: refactor this
    const chatHistory = interactions.value
      .toReversed() // for view purposes, we've been prepending to the array
      .map(interaction => `User: ${interaction.prompt}\nAI: ${interaction.response}`)
      .join('\n')

   return `${chatHistory}\nUser: ${prompt}`
}

export const useChatStore = defineStore('chat', () => {
  async function submitPrompt(prompt) {
    // TODO: loading is not very safe- take another look
    loading.value = true

    const interaction = createInteraction(prompt)
    interactions.value.unshift(interaction)

    if (mode !== 'local') {
      const fullPrompt = createFullPrompt(interactions, prompt)
      console.log(fullPrompt)
      const stream = await model.stream(fullPrompt)
      for await (const chunk of stream) {
        interaction.response += chunk.content
      }
    } else {
      for (const chunk of lotrData) {
        await new Promise(resolve => setTimeout(resolve, 100))
        interaction.response += chunk.content
      }
    }

    interaction.loading = false
    loading.value = false
  }

  return { interactions, loading, submitPrompt }
})
