<template>
  <router-view />
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "App",
});
</script>
<style>
body.modal-open {
    overflow: hidden;
    position: fixed;
}
</style>
