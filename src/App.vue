<script setup></script>
<template>
  <router-view v-slot="{ Component }">
    <transition>
      <keep-alive include="MyCatalogue">
        <component :is="Component" :key="$route.name" />
      </keep-alive>
    </transition>
  </router-view>
</template>
<style></style>
