<script setup>
import { onMounted, onUnmounted } from 'vue'
import ChatMessage from '@/ChatMessage.vue'
import { useChatStore } from '@/stores/chat'

const store = useChatStore()
const interactions = store.interactions
const submitPrompt = store.submitPrompt

function handlePromptSubmit() {
    if (prompt.value.trim() === '') {
        return
    }
    submitPrompt(prompt.value)
    prompt.value = ''
}

let intervalId
onMounted(() => {
    intervalId = setInterval(() => {
        submitPrompt('text')
    }, 1_000)
})

onUnmounted(() => {
    clearInterval(intervalId)
})

const prompt = defineModel()
</script>

<template>
    <div class="grid grid-rows-2 auto-rows-min">
        <div ref="messageContainer" class="absolute w-full h-full flex flex-col-reverse overflow-y-scroll space-y-5">
            <ChatMessage v-for="interaction in interactions" :key="interaction.id" :interaction="interaction" />
        </div>
        <div ref="promptContainer" class="bottom-0 w-full bg-white p-4 shadow-lg flex items-center">
            <input v-model="prompt" @keyup.enter="handlePromptSubmit" class="flex-grow p-2 border rounded-lg"
                placeholder="Type your message..." />
            <button @click="handlePromptSubmit" class="ml-2 p-2 bg-blue-500 text-white rounded-lg">Send</button>
        </div>
    </div>
</template>
