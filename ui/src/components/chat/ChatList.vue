<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'

import { useChatStore } from '@/components/chat/stores/chat'

const store = useChatStore()
const { chatList } = storeToRefs(store)
const { resetChat, saveChat, loadChat } = store

const buttonClasses = ["p-2", "rounded-lg", "transition", "ease-in-out", "delay-50", "hover:scale-105"]

const sortedChatList = computed(() => {
    return chatList.value.slice().sort((a, b) => b.lastUpdated - a.lastUpdated)
})
</script>

<template>
    <div>
        <button @click="saveChat" class="text-white bg-blue-500 hover:bg-blue-600" :class="buttonClasses">Save Chat</button>
        <button @click="resetChat" class="text-white bg-pink-400 hover:bg-pink-500" :class="buttonClasses">Reset Chat</button>
        <div class="text-gray-500 text-sm pt-10">Chats:</div>
        <button v-for="chat in sortedChatList" :key="chat.id" @click="loadChat(chat.id)"
            class="bg-green-200 text-green-800 p-3 rounded-lg flex justify-between" :class="buttonClasses">
            <span>{{ chat.title }}</span><span class="ml-auto">{{ chat.lastUpdated.toLocaleString() }}</span>
        </button>
    </div>
</template>
