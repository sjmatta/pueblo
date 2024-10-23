import { ref, reactive, computed } from 'vue'
import { defineStore } from 'pinia'
import { ChatOpenAI } from '@langchain/openai'
import lotrData from './lotr.json'

const mode = 'local'

const model = new ChatOpenAI(
  { modelName: 'bedrock-claude-v3.5', openAIApiKey: 'x' },
  { basePath: 'http://localhost:4000' },
)

// Refactored to work with plain objects
function createFullPrompt(chat, prompt) {
  const chatHistory = chat.value.interactions
    .slice()
    .reverse()
    .map(
      interaction => `User: ${interaction.prompt}\nAI: ${interaction.response}`,
    )
    .join('\n')

  return `${chatHistory}\nUser: ${prompt}`
}

export const useChatStore = defineStore(
  'chat',
  () => {
    const chats = ref([])
    const chat = ref({
      id: Date.now(),
      title: 'Untitled Chat',
      interactions: [],
      lastUpdated: null,
    })
    const loading = ref(false)

    const chatList = computed(() => {
      return chats.value.map(c => ({
        id: c.id,
        title: c.title,
        lastUpdated: c.lastUpdated,
      }))
    })

    function resetChat() {
      if (!loading.value) {
        chat.value = {
          id: Date.now(),
          title: 'Untitled Chat',
          interactions: [],
          lastUpdated: null,
        }
      }
    }

    function saveChat() {
      const existingChatIndex = chats.value.findIndex(
        c => c.id === chat.value.id,
      )
      if (existingChatIndex !== -1) {
        chats.value[existingChatIndex] = { ...chat.value }
      } else {
        chats.value.push({ ...chat.value })
      }
    }

    function loadChat(id) {
      const existingChat = chats.value.find(c => c.id === id)
      if (existingChat) {
        chat.value = { ...existingChat }
      }
    }

    async function submitPrompt(prompt) {
      if (loading.value) return

      loading.value = true

      const interaction = reactive({
        prompt,
        response: '',
        loading: true,
        createdTimestamp: new Date(),
      })
      chat.value.interactions.unshift(interaction)

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

    return {
      chats,
      chatList,
      chat,
      loading,
      submitPrompt,
      resetChat,
      saveChat,
      loadChat,
    }
  },
  { persist: true },
)
