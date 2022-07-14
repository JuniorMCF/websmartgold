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
      <q-card-section class="q-pb-none scroll" style="max-height: 574px">
        <div class="row justify-center q-py-xs q-px-none q-mx-none">
          <div class="col-12 q-px-sm self-center">
            <div class="row q-my-md">
              <div class="col-12">
                <p class="text-h6 text-weight-bold">Select Range upto</p>
              </div>
              <div class="col-12 q-px-lg">
                <q-slider
                  class="q-mt-xl"
                  v-model="range"
                  label-always
                  color="primary"
                  :marker-labels="fnMarkerLabel"
                  track-color="primary"
                  inner-track-color="grey lighten-5"
                  :min="5"
                  :max="200"
                  :step="5"
                  label
                ></q-slider>
              </div>
            </div>
          </div>
          <div class="col-12">
            <q-card class="bg-white">
              <q-card-section class="c-pointer">
                <div
                  class="row full-width justify-between items-center"
                  @click.prevent="openAddressDialog()"
                >
                  <p class="q-my-none text-weight-bold" style="max-width: 80%;">{{ getAddressCity }}</p>
                  <q-btn
                    color="primary"
                    text-color="primary"
                    size="md"
                    flat
                    dense
                    round
                    icon="edit_location_alt"
                    class="q-ml-auto q-py-sm"
                  >
                  </q-btn>
                </div>
              </q-card-section>
            </q-card>
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
          @click.prevent="apply()"
          >apply</q-btn
        >
      </q-card-actions>
    </q-card>
  </q-dialog>
  <GoogleDialog ref="googleDialog"></GoogleDialog>

  <!--<AddressDialog ref="addressDialog"></AddressDialog>-->
</template>

<script>
import axios from "axios";
import GoogleDialog from "./GoogleDialog.vue";
//import AddressDialog from './AddressDialog.vue';
import { Notify } from "quasar";
export default {
  components: {
    GoogleDialog,
  },
  name: "nearby-filter-component",
  mounted() {},
  data: function () {
    return {
      getAddressCity: "Select Location",
      address: null,
      latitude: null,
      longitude: null,
      dialog: false,
      resolve: null,
      reject: null,
      fnMarkerLabel: { 5: "5kms", 200: "200kms" },
      range: 5,
      options: {
        color: "white",
        width: 700,
        zIndex: 2000,
        noconfirm: false,
      },
    };
  },
  methods: {
    open() {
      this.dialog = true;

      //address-list
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
      const response = {
        to: this.range,
        address: this.address,
        addressCity :this.getAddressCity,
        success: false,
      };
      this.resolve(response);
      this.dialog = false;
    },
    openAddressDialog() {
      this.$refs.googleDialog
        .open()
        .then((res) => {
          if (res.success == true) {
            /**recibimos el objeto res y guardamos los datos */
            this.getAddressCity = res.addressCity,
            this.address = res;
            this.latitude = res.latitude;
            this.longitude = res.longitude;
          }
        })
        .catch((err) => {});
    },
    apply() {
      if (this.address == null) {
        Notify.create({
          message: "Select your location",
          group: false,
        });
        return;
      }

      const response = {
        to: this.range,
        latitude:this.latitude,
        longitude:this.longitude,
        address: this.address,
        addressCity :this.getAddressCity,
        success: true,
      };

      this.resolve(response);
      this.dialog = false;
    },
  },
};
</script>

<style>
</style>
