<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'

import ChatMessage from './ChatMessage.vue'
import { useChatStore } from '@/components/chat/stores/chat'
import vFocus from '@/directives/v-focus'

const store = useChatStore()
const { chatList, chat, loading } = storeToRefs(store)
const { submitPrompt, resetChat, saveChat, loadChat } = store

function handlePromptSubmit() {
    if (loading.value || prompt.value.trim() === '') {
        return
    }
    submitPrompt(prompt.value)
    prompt.value = ''
}

const prompt = defineModel()

const buttonClasses = ["p-2", "rounded-lg", "transition", "ease-in-out", "delay-50", "hover:scale-105"]

const sortedChatList = computed(() => {
    return chatList.value.slice().sort((a, b) => b.lastUpdated - a.lastUpdated)
})
</script>

<template>
    <div class="flex h-screen">
        <div class="w-1/5 bg-gray-100 p-4 flex flex-col space-y-1">
            <button @click="saveChat" class="text-white bg-blue-500" :class="buttonClasses">Save Chat</button>
            <button @click="loadChat" class="text-white bg-blue-500" :class="buttonClasses">Load Chat</button>
            <button @click="resetChat" class="text-white bg-red-500" :class="buttonClasses">Reset Chat</button>
            <div class="text-gray-500 text-sm pt-10">Chats:</div>
            <button v-for="chat in sortedChatList" :key="chat.id" @click="loadChat(chat.id)"
                class="bg-blue-100 text-blue-800 p-3 rounded-lg flex justify-between" :class="buttonClasses">
                <span>{{ chat.title }}</span><span class="ml-auto">{{ chat.lastUpdated.toLocaleString() }}</span>
            </button>
        </div>

        <div class="flex flex-col w-4/5">
            <div class="relative flex-grow bg-white">
                <div class="absolute w-full h-full flex flex-col-reverse overflow-y-scroll p-20">
                    <ChatMessage v-for="interaction in chat" :key="interaction.id" :interaction="interaction" />
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
