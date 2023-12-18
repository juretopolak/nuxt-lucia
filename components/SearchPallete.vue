<script setup lang='ts'>
import type { RouteLocationRaw } from 'vue-router'

const toast = useToast()
const isOpen = ref(false)
const router = useRouter()
const commandPaletteRef = ref()

const { metaSymbol } = useShortcuts()

defineShortcuts({
  meta_k: {
    usingInput: true,
    handler: () => {
      isOpen.value = !isOpen.value
    },
  },
})

function onSelect(option: { click: () => void, to: RouteLocationRaw, href: string | URL | undefined }) {
  if (option.click)
    option.click()
  else if (option.to)
    router.push(option.to)
  else if (option.href)
    window.open(option.href, '_blank')
}

const users = [
  { id: 'benjamincanac', label: 'benjamincanac', href: 'https://github.com/benjamincanac', target: '_blank', avatar: { src: 'https://avatars.githubusercontent.com/u/739984?v=4' } },
  { id: 'Atinux', label: 'Atinux', href: 'https://github.com/Atinux', target: '_blank', avatar: { src: 'https://avatars.githubusercontent.com/u/904724?v=4' } },
  { id: 'smarroufin', label: 'smarroufin', href: 'https://github.com/smarroufin', target: '_blank', avatar: { src: 'https://avatars.githubusercontent.com/u/7547335?v=4' } },
]
const actions = [
  { id: 'new-file', label: 'Add new file', icon: 'i-heroicons-document-plus', click: () => toast.add({ title: 'New file added!' }), shortcuts: ['⌘', 'N'] },
  { id: 'new-folder', label: 'Add new folder', icon: 'i-heroicons-folder-plus', click: () => toast.add({ title: 'New folder added!' }), shortcuts: ['⌘', 'F'] },
  { id: 'hashtag', label: 'Add hashtag', icon: 'i-heroicons-hashtag', click: () => toast.add({ title: 'Hashtag added!' }), shortcuts: ['⌘', 'H'] },
  { id: 'label', label: 'Add label', icon: 'i-heroicons-tag', click: () => toast.add({ title: 'Label added!' }), shortcuts: ['⌘', 'L'] },
]
const groups = computed(() => {
  return (commandPaletteRef.value?.query)
    ? [
        {
          key: 'users',
          label: 'Users',
          commands: users,
        },
      ]
    : [
        {
          key: 'actions',
          label: 'Actions',
          commands: actions,
        },
      ]
})
</script>

<template>
  <div>
    <UTooltip
      text="Search everything"
      :shortcuts="[metaSymbol, 'K']"
    >
      <UButton
        icon="i-heroicons-magnifying-glass"
        color="gray"
        variant="ghost"
        aria-label="Theme"
        @click="isOpen = !isOpen"
      />
    </UTooltip>
    <UModal
      v-model="isOpen"
      :ui="{
        container: 'items-start md:items-start pt-14 md:pt-14',
      }"
    >
      <UCommandPalette
        ref="commandPaletteRef"
        :groups="groups"
        @update:model-value="onSelect"
      >
        <template #empty-state>
          <div>Nothing found!</div>
        </template>
      </UCommandPalette>
    </UModal>
  </div>
</template>
