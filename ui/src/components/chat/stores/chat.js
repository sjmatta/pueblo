import { ref, reactive, computed } from 'vue'
import { defineStore } from 'pinia'
import { ChatOpenAI } from '@langchain/openai'

import Chat from '@/components/chat/Chat.js'
import ChatInteraction from '@/components/chat/ChatInteraction.js'
import lotrData from './lotr.json'

const mode = 'local'

const model = new ChatOpenAI(
  { modelName: 'bedrock-claude-v3.5', openAIApiKey: 'x' },
  { basePath: 'http://localhost:4000' },
)

function createFullPrompt(chat, prompt) {
    // Aggregate all previous messages into a single string
    // Surely this whole thing is inefficient but it works for now
    // The challenge is ensuring that the model has the full context, but keeping model details away from the view
    // TODO: refactor this
    const chatHistory = chat.value
      .toReversed() // for view purposes, we've been prepending to the array
      .map(interaction => `User: ${interaction.prompt}\nAI: ${interaction.response}`)
      .join('\n')

   return `${chatHistory}\nUser: ${prompt}`
}

export const useChatStore = defineStore('chat', () => {
  const chatMap = ref(new Map())
  const chat = ref(new Chat('Untitled Chat'))
  const loading = ref(false)

  const chatList = computed(() => {
    return Array.from(chatMap.value.values()).map(chat => ({ id: chat.id, title: chat.title, lastUpdated: chat.lastUpdated }))
  });

  function resetChat() {
    if (!loading.value)
      chat.value = new Chat('Untitled Chat')
  }

  function saveChat() {
    chatMap.value.set(chat.value.id, chat.value)
  }

  function loadChat(id) {
    chat.value = chatMap.value.get(id)
  }

  async function submitPrompt(prompt) {
    // TODO: loading is not very safe- take another look (not urgent since the UI is blocked from submitting while loading)
    loading.value = true

    const interaction = reactive(new ChatInteraction(prompt))
    chat.value.unshift(interaction)

    if (mode !== 'local') {
      const fullPrompt = createFullPrompt(chat, prompt)
      const stream = await model.stream(fullPrompt)
      for await (const chunk of stream) {
        interaction.response += chunk.content
      }
    } else {
      await new Promise(resolve => setTimeout(resolve, 1_000))
      for (const chunk of lotrData) {
        await new Promise(resolve => setTimeout(resolve, 50))
        interaction.response += chunk.content
      }
    }

    chat.value.lastUpdated = new Date()
    interaction.loading = false
    loading.value = false
  }

  return { chatList, chat, loading, submitPrompt, resetChat, saveChat, loadChat }
})
