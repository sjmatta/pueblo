import { ref, reactive, computed } from 'vue'
import { defineStore } from 'pinia'
import { ChatOpenAI } from '@langchain/openai'
import lotrData from './lotr.json'
import { v4 as uuidv4 } from 'uuid'

const mode = 'remote'

const model = new ChatOpenAI(
  { modelName: 'gpt-4', openAIApiKey: 'x' },
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
    const chat = ref({
      id: uuidv4(),
      title: null,
      interactions: [],
      lastUpdated: new Date(),
    })
    const chats = ref({})
    const loading = ref(false)

    const chatList = computed(() => {
      return Object.values(chats.value).map(c => ({
        id: c.id,
        title: c.title,
        lastUpdated: c.lastUpdated,
      }))
    })

    function resetChat() {
      if (!loading.value) {
        chat.value = {
          id: uuidv4(),
          title: null,
          interactions: [],
          lastUpdated: new Date(),
        }
      }
    }

    function saveChat() {
      chats.value[chat.value.id] = { ...chat.value }
    }

    function loadChat(id) {
      if (chats.value[id]) {
        chat.value = { ...chats.value[id] }
      }
    }

    function editChat(id, title) {
      if (chats.value[id]) {
        chats.value[id].title = title
      }
    }

    function deleteChat(id) {
      delete chats.value[id]
    }

    async function submitPrompt(prompt) {
      if (loading.value) return

      loading.value = true

      saveChat() // TODO: this is a hack for now, but it works

      const interaction = reactive({
        prompt,
        response: '',
        loading: true,
        createdTimestamp: new Date(),
      })
      chat.value.interactions.unshift(interaction)

      if (mode !== 'local') {
        if (!chat.value.title) {
            const titlePrompt = `Based on the following prompt, provide a two word title:\n\n${prompt}`
            const response = await model.invoke(titlePrompt)
            editChat(chat.value.id, response.content.replace(/['"]+/g, '').trim())
        }

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
      loadChat,
      editChat,
      deleteChat,
    }
  },
  { persist: true },
)
