<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'

import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { EllipsisHorizontalIcon, PlusIcon } from '@heroicons/vue/20/solid'

import { useChatStore } from '@/components/chat/stores/chat'

const store = useChatStore()
const { chatList } = storeToRefs(store)
const { resetChat, loadChat, editChat, deleteChat } = store

const buttonClasses = ["p-2", "rounded-lg"]

const sortedChatList = computed(() => {
    return chatList.value.slice().sort((a, b) => b.lastUpdated - a.lastUpdated)
})

function handleChatNameChange(chat) {
    const newTitle = window.prompt('Provide a new title for the chat', chat.title ? chat.title : '')
    if (newTitle && newTitle.trim() !== '') {
        editChat(chat.id, newTitle)
    }
}

function handleDeleteChat(chat) {
    if (window.confirm('Are you sure you want to delete this chat?')) {
        deleteChat(chat.id)
    }
}
</script>

<template>
    <div class="flex h-100vh">
        <div class="flex items-center justify-between p-4 bg-gray-100 rounded-lg shadow-md mb-4">
            <span class="text-md font-semibold text-gray-700">Chats</span>
            <button @click="resetChat" class="flex items-center text-white bg-blue-500 hover:bg-blue-600 p-2 rounded-lg shadow">
            <PlusIcon class="w-5 h-5 mr-1" />
            <span class="hidden sm:inline">New Chat</span>
            </button>
        </div>
        <div v-for="chat in sortedChatList" :key="chat.id" @click="loadChat(chat.id)"
            class="bg-green-200 text-green-800 p-3 rounded-lg flex justify-between items-center text-xs">
            <span class="cursor-pointer">{{ chat.title ? chat.title : 'Untitled Chat' }}</span>
            <span class="ml-auto">{{ chat.lastUpdated.toLocaleString() }}</span>
            <Menu as="div" class="relative ml-3">
                <MenuButton class="flex items-center p-2 rounded-full hover:bg-gray-200" @click.stop>
                    <EllipsisHorizontalIcon class="w-5 h-5" />
                </MenuButton>
                <MenuItems
                    class="absolute z-50 left-full top-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
                    <MenuItem v-slot="{ active }">
                    <button @click="handleChatNameChange(chat)" class="block w-full px-4 py-2 text-left text-sm"
                        :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', '']">
                        Edit
                    </button>
                    </MenuItem>
                    <MenuItem v-slot="{ active }">
                    <button @click="handleDeleteChat(chat)" class="block w-full px-4 py-2 text-left text-sm"
                        :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', '']">
                        Delete
                    </button>
                    </MenuItem>
                </MenuItems>
            </Menu>
        </div>
    </div>
</template>
