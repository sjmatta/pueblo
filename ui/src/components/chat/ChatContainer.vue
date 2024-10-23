<script setup>
import { storeToRefs } from 'pinia'

import ChatList from './ChatList.vue'
import ChatMessage from './ChatMessage.vue'
import { useChatStore } from '@/components/chat/stores/chat'
import vFocus from '@/directives/v-focus'

const store = useChatStore()
const { chat, loading } = storeToRefs(store)
const { submitPrompt } = store

function handlePromptSubmit() {
    if (loading.value || prompt.value.trim() === '') {
        return
    }
    submitPrompt(prompt.value)
    prompt.value = ''
}

const prompt = defineModel()

const buttonClasses = ["p-2", "rounded-lg", "transition", "ease-in-out", "delay-50", "hover:scale-105"]
</script>

<template>
    <div class="flex h-screen">
        <ChatList class="w-1/5 bg-gray-100 p-4 flex flex-col space-y-1" />

        <div class="flex flex-col w-4/5">
            <div class="relative flex-grow bg-white">
                <div class="absolute w-full h-full flex flex-col-reverse overflow-y-scroll p-20">
                    <ChatMessage v-for="interaction in chat.interactions" :key="interaction.id" :interaction="interaction" />
                </div>
            </div>

            <div class="border-t border-gray-300 p-4 bg-gray-50 flex">
                <input v-model="prompt" @keyup.enter="handlePromptSubmit" v-focus class="grow p-2 border rounded-lg"
                    placeholder="Type your message..." />
                <!-- TODO: spinning the button wasn't intended initially, but it was funny enough for now -->
                <button @click="handlePromptSubmit"
                    class="ml-2 text-white enabled:bg-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed disabled:animate-spin"
                    :class="buttonClasses" :disabled="loading">Send</button>
            </div>
        </div>
    </div>
</template>
