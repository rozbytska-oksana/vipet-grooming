<template>
  <div class="base-container">
    <slot />
  </div>
</template>

<style scoped lang="scss">
.base-container {
  width: min(100%, var(--container-max));
  margin-inline: auto;
  padding-inline: var(--container-gutter);
}
</style>
