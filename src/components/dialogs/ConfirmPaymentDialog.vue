<template>
  <q-dialog
    
    @keydown.esc="cancel"
    v-model="dialog"
    :max-width="options.width"
    :style="{ zIndex: options.zIndex }"
  >
    <q-card square class="q-dialog-plugin bg-white q-pa-md">
      <q-card-section class="q-pa-md">
        <p class="text-weight-bold text-subtitle1">Are you sure?</p>
        <p class="text-subtitle2">To Place this order</p>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat text-color="primary" @click.prevent="payLater()">Pay later</q-btn>
        <q-btn
          class="q-ml-md"
          id="rzp-button1"
          flat
          text-color="primary"
          @click.prevent="payNow()"
        >Pay now</q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'confirm-payment-component',
  mounted() { },
  data: function () {
    return {
      dialog: false,
      resolve: null,
      reject: null,

      options: {
        color: "white",
        width: 700,
        zIndex: 2000,
        noconfirm: false,
      },
    };
  },
  methods: {
    open(options) {
      this.dialog = true;
      this.options = Object.assign(this.options, options);

      return new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
      });
    },
    payNow() {
      this.resolve(true);
      this.dialog = false;
    },
    payLater() {
      this.resolve(false);
      this.dialog = false;
    },
  },
};
</script>

<style>
</style>
