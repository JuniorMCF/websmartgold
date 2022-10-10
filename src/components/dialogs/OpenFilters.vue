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
        <q-img no-spinner src="~assets/app/logo.png"></q-img>
      </div>
      <div class="row justify-center q-mt-lg" style="height: 48px">
        <div class="col-12 text-center">
          <p
            class="text-h6 q-my-none"
            style="padding: 0px 80px 0px 80px; overflow: hidden; line-height: 1"
          >
            Filter
          </p>
        </div>
      </div>
      <q-separator></q-separator>
      <q-card-section class="q-py-none scroll" style="max-height: 540px">
        <div class="row justify-center q-py-xs q-px-none q-mx-none">
          <div class="col-12 q-px-sm self-center">
            <div class="row q-my-md">
              <div class="col-12">
                <p class="text-h6 text-weight-bold">Categories</p>
              </div>
              <div class="col-12">
                <q-select
                  square
                  outlined
                  v-model="category"
                  :options="categorys"
                  option-label="name"
                />
              </div>
            </div>

            <div class="row q-my-md">
              <div class="col-12">
                <p class="text-h6 text-weight-bold">Price</p>
              </div>
              <div class="col-12 q-px-lg">
                <q-range
                  class="q-mt-xl"
                  v-model="price"
                  label-always
                  color="primary"
                  :marker-labels="fnMarkerLabel"
                  :inner-min="0"
                  track-color="primary"
                  inner-track-color="grey lighten-5"
                  :min="0"
                  :max="1000000"
                  :step="10000"
                  label
                  drag-range
                ></q-range>
              </div>
            </div>
            <div class="row q-my-md">
              <div class="col-12">
                <p class="text-h6 text-weight-bold">Gender</p>
              </div>
              <div class="col-12">
                <q-select
                  square
                  outlined
                  v-model="gender"
                  :options="genders"
                 
                />
              </div>
            </div>
            <div class="row q-my-md">
              <div class="col-12">
                <p class="text-h6 text-weight-bold">Sort</p>
              </div>
              <div class="col-12">
                <q-select
                  square
                  outlined
                  v-model="order_by"
                  :options="orders"
                  option-label="name"
                />
              </div>
            </div>
          </div>
        </div>
      </q-card-section>
      
      <q-card-actions
        align="center"
        class="q-py-md q-px-md"
        style="position: absolute; bottom: 0; width: 100%"
      >
        <q-btn
          text-color="info"
          size="md"
          block
          flat
          square
          class="q-mx-auto full-width bg-primary"
          @click.prevent="search()"
          >Search</q-btn
        >
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import axios from "axios";
import { Notify } from "quasar";
export default {
  name: "openfilters-component",
  mounted() {},
  data: function () {
    return {
      size: null,
      color: null,
      loadCart: false,
      genders: ["Female", "Male", "Unisex", "Kids"],
      gender:"Female",
      dialog: false,
      resolve: null,
      reject: null,
      fnMarkerLabel: { 0: "₹0", 1000000: "₹1000000" },
      price: { min: 50000, max: 1000000 },
      categorys: [],
      category: null,
      orders: [
        {
          id: 1,
          name: "Price: Low to High",
        },
        {
          id: 2,
          name: "Price: High to Low",
        },
      ],
      order_by: {
        id: 1,
        name: "Price: Low to High",
      },
      options: {
        color: "primary",
        width: 700,
        zIndex: 2000,
        noconfirm: false,
      },
    };
  },
  methods: {
    open(categorys, options) {
      this.dialog = true;
      this.categorys = categorys;
      if (this.categorys.length > 0) {
        this.category = this.categorys[0];
      }

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
    search() {
      if (this.price.max - this.price.min >= 20000) {
        this.$router.push({
          name: "category-by-filter",
          params: {
            category_id: this.category.id,
            price_min: this.price.min,
            price_max: this.price.max,
            gender:this.gender,
            sort: this.order_by.id,
          },
        });
      } else {
        Notify.create({
          message: "The price range must be a minimum of 20000",
          group: false,
        });
      }
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
@media (max-width: 600px) {
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
</style>
