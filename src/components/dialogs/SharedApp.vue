<template>
  <q-dialog
    @keydown.esc="cancel"
    v-model="dialog"
    :max-width="options.width"
    :style="{ zIndex: options.zIndex }"
  >
    <q-card square class="bg-white q-pa-lg">
      <q-card-section class="q-pa-none shadow-0">
        <q-btn
          unelevated
          rounded
          size="md"
          color="primary"
          text-color="info"
          icon="share"
          @click.prevent="sharedLink()"
          icon-right="send"
          :label="type"
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: "share-social-component",
  mounted() {},
  data: function () {
    return {
      dialog: false,
      resolve: null,
      reject: null,

      title: "",
      message: "",
      url: "",
      options: {
        color: "white",
        width: 700,
        zIndex: 2000,
        noconfirm: false,
      },
      type: "Send Feedback",
    };
  },
  methods: {
    open(title, message, url, type = "Send Feedback", options) {
      this.type = type;
      this.url = url;
      this.title = title;
      this.message = message;
      this.options = Object.assign(this.options, options);

      this.dialog = true;
      return new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
      });
    },
    agree() {
      this.resolve(true);
      this.dialog = false;
    },
    cancel() {
      this.resolve(false);
      this.dialog = false;
    },
    async sharedLink() {
      const data = {
        url: this.url,
        title: this.title,
        text: this.message,
      };
      try {
        await navigator.share(data);
        console.log("shared data")
      } catch (err) {
         console.log(err)
      }
    },
  },
};
</script>

<style scoped></style>
