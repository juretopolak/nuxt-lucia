<template>
  <header
    class="bg-background/75 backdrop-blur border-b -mb-px sticky top-0 z-50 border-primary-200/75 dark:border-primary-900/50">
    <div class="flex justify-start mx-auto px-4 py-2 sm:px-6 lg:px-8 max-w-7xl h-12">
      <div class="flex-1">
        <div class="h-full">
          <Logo class="h-8" />
        </div>
      </div>
      <div class="flex items-center justify-end lg:flex-1 gap-1.5">
        <ColorModeButton />
        <ColorPicker />
        <SearchPallete />
      </div>
    </div>
  </header>
  <main class="mx-auto mt-4 px-4 sm:px-6 lg:px-8 max-w-7xl">
    <div class="grid lg:grid-cols-10 lg:gap-8">
      <div class="lg:col-span-2">
        <MainMenu />
      </div>
      <div class="lg:col-span-8">
        <slot />
      </div>
    </div>
  </main>
  <NuxtLoadingIndicator />
  <UNotifications />
</template>
