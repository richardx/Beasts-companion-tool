<template>
  <button
    :class="[
      'inline-flex items-center justify-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition',
      variant === 'ghost'
        ? 'text-gray-700 hover:bg-gray-100'
        : 'bg-red-600 text-white hover:bg-red-700',
    ]"
  >
    <slot />
  </button>
</template>

<script setup>
defineProps({
  variant: { type: String, default: 'primary' }, // “ghost” eller “primary”
})
</script>
