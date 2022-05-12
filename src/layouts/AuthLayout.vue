<template>
  <q-layout view="hHh lpR fFf" class="shadow-0">
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue";
export default defineComponent({
  name: "AuthLayout",
});
</script>

<style >
</style>
