import { ref, reactive } from 'vue'
import { defineStore } from 'pinia'
import { LoremIpsum } from 'lorem-ipsum'
import ChatInteraction from '@/ChatInteraction.js'

const loremIpsum = new LoremIpsum()

function createInteraction(prompt) {
  return reactive(new ChatInteraction(prompt));
}

export const useChatStore = defineStore('chat', () => {
  const interactions = ref([])

  async function submitPrompt(prompt) {
    const interaction = createInteraction(prompt)
    interactions.value.unshift(interaction)

    await new Promise(r => setTimeout(r, 2000))

    const response = loremIpsum.generateSentences(2)
    interaction.loading = false
    interaction.response = response
  }

  return { interactions, submitPrompt }
})
