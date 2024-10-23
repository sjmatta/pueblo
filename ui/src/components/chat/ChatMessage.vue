<script setup>
import { BulletListLoader } from 'vue-content-loader'
import { computed } from 'vue'

const { interaction } = defineProps({
    interaction: Object,
})

const showLoadingSpinner = computed(() => interaction.response.length === 0)
const formattedTimestamp = computed(() => interaction.createdTimestamp.toLocaleString())
</script>

<template>
    <div class="flex flex-col py-3">
        <div class="bg-blue-100 text-blue-800 p-3 rounded-lg self-start max-w-xlg mb-2 ml-auto">
            {{ interaction.prompt }}
            <span class="text-gray-500 text-sm ml-2">{{ formattedTimestamp }}</span>
        </div>
        <div class="bg-gray-200 text-gray-800 p-3 rounded-lg self-start max-w-xlg">
            <!-- TODO: why do I have to use width, height here? -->
            <span v-if="showLoadingSpinner" class="h-16 w-full">
                <BulletListLoader class="h-max w-full"/><br/>
                <span class="text-xs text-slate-400 animate-pulse">Loading...</span>
            </span>
            <span v-else class="whitespace-pre-wrap animate-">{{ interaction.response }}</span>
        </div>
    </div>
</template>
