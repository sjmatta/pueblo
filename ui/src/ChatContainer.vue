<script setup>
import { storeToRefs } from 'pinia'

import ChatMessage from '@/ChatMessage.vue'
import { useChatStore } from '@/stores/chat'

const store = useChatStore()
const { interactions, loading } = storeToRefs(store)
const { submitPrompt } = store

function handlePromptSubmit() {
    if (loading.value || prompt.value.trim() === '') {
        return
    }
    submitPrompt(prompt.value)
    prompt.value = ''
}

const prompt = defineModel()

const vFocus = {
    mounted: (el) => el.focus()
}
</script>

<template>
    <div class="flex h-screen">
        <div class="w-1/4 bg-gray-100 p-4">
        </div>

        <div class="flex flex-col w-3/4">
            <div class="relative flex-grow bg-white">
                <div class="absolute w-full h-full flex flex-col-reverse overflow-y-scroll p-20">
                    <ChatMessage v-for="interaction in interactions" :key="interaction.id" :interaction="interaction" />
                </div>
            </div>

            <div class="border-t border-gray-300 p-4 bg-gray-50 flex">
                <input v-model="prompt" @keyup.enter="handlePromptSubmit" v-focus class="grow p-2 border rounded-lg"
                    placeholder="Type your message..." />
                <button @click="handlePromptSubmit"
                class="ml-2 p-2 text-white rounded-lg enabled:bg-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
                :disabled="loading"
                >Send</button>
            </div>
        </div>
    </div>
</template>
