<template>
  <q-dialog
    persistent
    @keydown.esc="cancel"
    v-model="dialog"
    :max-width="options.width"
    :style="{ zIndex: options.zIndex }"
    full-height
  >
    <q-card square class="q-dialog-plugin bg-whit">
      <q-btn
        flat
        outlined
        size="sm"
        color="white"
        class="bg-primary close-fixed q-px-sm q-py-sm text-center shadow-0"
        @click.prevent="cancel"
      >
        <q-icon class="q-ml-sm" name="arrow_back_ios"></q-icon>
      </q-btn>

      <div class="cart-fixed">
        <q-img src="~assets/app/logo.png"></q-img>
      </div>
      <div class="row justify-center q-mt-lg" style="height: 48px">
        <div class="col-12 text-center">
          <p
            class="text-h6 q-my-none"
            style="padding: 0px 80px 0px 80px; overflow: hidden; line-height: 1"
          >{{ store.store_name }}</p>
        </div>
      </div>
      <q-separator></q-separator>
      <q-card-section class="q-pb-none scroll" style="max-height: 574px">
        <div class="row q-col-gutter-x-md q-col-gutter-y-md">
          <div
            class="col-6 q-px-sm"
            v-for="(categoria, index) in categorys"
            :key="'categoria' + index"
          >
            <q-card
              v-ripple
              class="bg-primary row items-center q-pa-sm cursor-pointer"
              style=" border-radius: 10px;"
              @click.prevent="goToCategory(categoria)"
            >
              <div
                style="
                height: 60px;
                width: 60px;
                background: white;
                border-radius: 10px;
              "
                class="q-mr-md"
              >
                <q-img style="border-radius: 10px" fit="contain" :src="categoria.image" ratio="1"></q-img>
              </div>

              <span class="text-weight-bold text-info">{{ categoria.name }}</span>
            </q-card>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
  <q-overlay v-model="load" :no-scroll="true" :z-index="5000">
    <template #body>
      <div class="fullscreen row justify-evenly items-center">
        <div style="height: 80px; width: 80px">
          <q-img src="~assets/app/load.gif" alt="gif load" fit="contain"></q-img>
        </div>
      </div>
    </template>
  </q-overlay>
</template>

<script>
import axios from "axios";
import { QOverlay } from "@quasar/quasar-ui-qoverlay";
export default {
  name: 'categorylist-available-component',
  components: {
    QOverlay
  },
  mounted() { },
  data: function () {
    return {
      size: null,
      color: null,
      load: false,

      dialog: false,
      resolve: null,
      reject: null,

      store: { name: "" },
      categorys: [],
      options: {
        color: "primary",
        width: 700,
        zIndex: 2000,
        noconfirm: false,
      },
    };
  },
  methods: {
    open(store, options) {
      this.dialog = true;
      this.store = store;
      console.log(store)

      this.options = Object.assign(this.options, options);
      this.loadAvailables()
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
    goToCategory(category) {
      this.$store.dispatch("products/setCategory", { category: category });
      this.$router.push({
        name: "category",
        params: { id: category.id },
      });
      this.resolve(true);
      this.dialog = false;
    },

    loadAvailables() {

      this.load = true;
      let endpooint = "categorylist-seller.php";
      let token =
        "eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2NDg1MDcwNTIsInN1YiI6ImVLYXJ0IEF1dGhlbnRpY2F0aW9uIiwiaXNzIjoiZUthcnQifQ.dcdE_rrGdj9jN4z-HmBu1lsO2PH3OkX1r0o63DvIkIo";

      const url = "http://smartgold.blazeaisolutions.com/api/" + endpooint;
      let data = new FormData();
      data.append("accesskey", "90336");
      data.append("seller_id", this.store.id);

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      axios
        .post(url, data, {
          headers: headers,
        })
        .then((response) => {
          console.log(response)
          this.categorys = response.data.data
          this.load = false;
        })
        .catch((err) => {
          this.load = false;
        });


    },
  },

};
</script>

<style>
.q-dialog-plugin {
  width: 500px;
}
.q-dialog__inner--minimized {
  padding: 90px 0px 90px 0px !important;
}
@media (max-width: 600px) {
  .q-dialog-plugin {
    width: 100% !important;
  }
  .q-dialog__inner--minimized {
    padding: 0px 0px 0px 0px !important;
  }
}

.close-fixed {
  position: absolute;
  top: 15px;
  left: 15px;
}
.cart-fixed {
  position: absolute;
  width: 50px;
  height: 50px;
  top: 15px;
  right: 15px;
}
</style>
