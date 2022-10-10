<template>
  <q-dialog
    persistent
    @keydown.esc="cancel"
    v-model="dialog"
    :max-width="options.width"
    :style="{ zIndex: options.zIndex }"
    full-height
  >
    <q-card square class="q-dialog-plugin bg-white q-py-md">
      <div class="cart-fixed">
        <q-img no-spinner src="~assets/app/logo.png"></q-img>
      </div>
      <p class="text-info text-normal q-my-xs text-h6 text-center text-weight-bold">Payment Failed</p>

      <q-card-section class="q-pa-md">
        <div class="row q-py-md">
          <div class="col-12">
            <div style="width: 258px; height: 250px" class="q-mx-auto">
              <q-img no-spinner src="~assets/app/failed.png"></q-img>
            </div>
          </div>
          <div class="col-12 text-center q-my-md">
            <p
              class="text-h5 text-weight-bold text-error"
            >The payment process was canceled or encountered a problem.</p>
          </div>
        </div>
      </q-card-section>
      <q-card-actions
        align="center"
        class="q-py-md q-px-md"
        style="position: absolute; bottom: 0; width: 100%"
      >
        <q-btn
          text-color="white"
          size="md"
          block
          class="text-normal q-mx-auto full-width bg-primary"
          @click.prevent="agree()"
        >CONTINUE SHOPPING</q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  mounted() { },
  data: function () {
    return {
      dialog: false,
      resolve: null,
      reject: null,
      razorpay_payment_id: null,
      razorpay_order_id: null,
      razorpay_signature: null,
      options: {
        color: "white",
        width: 700,
        zIndex: 2000,
        noconfirm: false,
      },
    };
  },
  methods: {
    open(razorpay_payment_id, razorpay_order_id, razorpay_signature, options) {

      this.options = Object.assign(this.options, options);
      this.razorpay_payment_id = razorpay_payment_id;
      this.razorpay_order_id = razorpay_order_id;
      this.razorpay_signature = razorpay_signature;
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
  },
  watch: {
    dialog: function() {
      if(this.dialog){
        document.documentElement.style.overflow = 'hidden'
        return
      }

      document.documentElement.style.overflow = 'auto'
    }
  }
};
</script>

<style>
.q-dialog-plugin {
  width: 500px;
}
.q-dialog__inner--minimized {
  padding: 90px 0px 90px 0px !important;
}
@media (max-width: 960px) {
  .q-dialog-plugin {
    width: 100% !important;
  }
  .q-dialog__inner--minimized {
    padding: 0px 0px 0px 0px !important;
  }
}
.ring-img-dialog {
  height: 250px;
  width: 250px;
}
.select-ring-size {
  max-width: 150px;
}
.close-fixed {
  position: absolute;
  top: 15px;
  left: 15px;
}
.cart-fixed {
  position: absolute;
  top: 15px;
  right: 15px;
}
.bg-error {
  background-color: #fb3003;
}
.text-error {
  color: #fb3003;
}
.cart-fixed {
  position: absolute;
  width: 50px;
  height: 50px;
  top: 15px;
  right: 15px;
}
</style>
