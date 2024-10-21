<script setup>
import { BulletListLoader } from 'vue-content-loader'
import ChatInteraction from '@/ChatInteraction'
import { computed } from 'vue'

const { interaction } = defineProps({
    interaction: ChatInteraction,
})

const formattedTimestamp = computed(() => interaction.createdTimestamp.toLocaleString())
</script>

<template>
    <div class="flex flex-col max-w-md mx-auto">
        <div>
            {{ interaction.prompt }}
            <span class="text-gray-500 text-sm ml-2">{{ formattedTimestamp }}</span>
        </div>
        <div class="bg-gray-200 text-gray-800 p-3 rounded-lg self-start max-w-sm">
            <!-- TODO: why do I have to use width, height here? -->
            <span v-if="interaction.loading"><BulletListLoader width="300" height="100"/></span>
            <span v-else>{{ interaction.response }}</span>
        </div>
    </div>
</template>
