<script setup>
import { computed } from "vue";
import { RouterView } from "vue-router";
import { useTokenStore } from "./stores/token";

const tokenStore = useTokenStore();
const requestConfig = computed(() => {
  return tokenStore.requestConfig;
});

const links = computed(() => {
  if (requestConfig.value) {
    return [
      {
        title: "Książki",
        to: "books",
      },
      {
        title: "Autorzy",
        to: "authors",
      },
      {
        title: "Kategorie",
        to: "categories",
      },
    ];
  } else {
    return [
      {
        title: "Logowanie",
        to: "/",
      },
      {
        title: "Rejestracja",
        to: "register",
      },
    ];
  }
});
</script>

<template>
  <header>
    <van-tabs color="#42b883">
      <!-- <van-tab title="Login" is-link to="/" />
      <van-tab title="Rejestracja" is-link to="register" /> -->
      <van-tab v-for="link in links" :key="link.to" :title="link.title" is-link :to="link.to" />
    </van-tabs>
  </header>
  <div class="main-comntainer">
    <RouterView />
  </div>
</template>

<style>
@import "@/assets/base.css";
.main-comntainer {
  padding: 80px 20px;
  max-width: 1000px;
  margin: 0 auto;
}
.van-toast__text {
  word-break: normal !important;
}
</style>
