<template>
  <q-dialog
    persistent
    @keydown.esc="cancel"
    v-model="dialog"
    :max-width="options.width"
    :style="{ zIndex: options.zIndex }"
    full-height
  >
    <q-card square class="q-dialog-plugin bg-white q-pt-md">
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
      <p class="text-info text-normal q-my-xs text-h6 text-center text-weight-bold">
        Add an address
      </p>
      <q-separator class="q-mt-sm" />

      <q-card-section class="q-px-md q-pb-none section-address-2 scroll">
        <q-form ref="form_address">
          <div class="row q-pb-md">
            <div class="col">
              <q-input
                square
                outlined
                v-model="name"
                label="Name"
                :rules="[(val) => (val && val.length > 0) || 'Invalid name']"
                hide-bottom-space
              />
            </div>
          </div>
          <div class="row q-pb-md">
            <div class="col">
              <q-input
                square
                outlined
                v-model="address"
                label="House N°, Building Name"
                :rules="[(val) => (val && val.length > 0) || 'Invalid Address']"
                hide-bottom-space
              />
            </div>
          </div>
          <div class="row q-pb-md">
            <div class="col">
              <q-input
                square
                outlined
                v-model="address_second"
                label="Landmark (optional)"
              />
            </div>
          </div>
          <div class="row q-pb-md">
            <div class="col">
              <q-input
                square
                outlined
                v-model="area"
                label="Area"
                :rules="[(val) => (val && val.length > 0) || 'Invalid area']"
                hide-bottom-space
              />
            </div>
          </div>
          <div class="row q-pb-md">
            <div class="col">
              <q-input
                square
                outlined
                v-model="city"
                label="City"
                :rules="[(val) => (val && val.length > 0) || 'Invalid city']"
                hide-bottom-space
              />
            </div>
          </div>
          <div class="row q-pb-md">
            <div class="col">
              <q-input
                square
                outlined
                v-model="pin_code"
                label="Pin code"
                :rules="[(v) => v >= 100000 || 'Invalid pincode']"
                hide-bottom-space
              />
            </div>
          </div>
        </q-form>
      </q-card-section>

      <q-separator />
      <q-card-actions align="center" class="q-py-none q-px-md">
        <q-btn
          square
          color="primary"
          text-color="white"
          size="md"
          block
          class="q-mx-auto full-width q-my-md"
          align="center"
          label="Select location"
          icon="my_location"
          :loading="loadLocation"
          @click.prevent="getCurrentLocation()"
        ></q-btn>

        <q-btn
          v-if="!isEdit"
          square
          color="primary"
          text-color="white"
          size="md"
          block
          type="submit"
          :loading="load"
          class="q-mx-auto full-width"
          @click.prevent="addLocation()"
          >Add address</q-btn
        >

        <q-btn
          v-else
          square
          color="primary"
          text-color="white"
          size="md"
          block
          type="submit"
          :loading="load"
          class="q-mx-auto full-width"
          @click.prevent="updateLocation()"
          >Submit</q-btn
        >
      </q-card-actions>
    </q-card>
  </q-dialog>
  <GoogleDialogLoggedIn ref="gdli"></GoogleDialogLoggedIn>
</template>

<script>
import axios from "axios";
import { Notify } from "quasar";

import GoogleDialogLoggedIn from "./GoogleDialogLoggedIn.vue";
export default {
  name: "address-component",
  components: {
    GoogleDialogLoggedIn,
  },
  mounted() {},
  data: function () {
    return {
      dialog: false,
      resolve: null,
      reject: null,
      id:null,
      name: "",
      address: "",
      address_second: "",
      area: "",
      city: "",
      pin_code: "",
      load: false,
      loadLocation: false,
      isEdit: false,
      options: {
        color: "white",
        width: 700,
        zIndex: 2002,
        noconfirm: false,
      },
    };
  },
  methods: {
    open(
      address = {
        id:null,
        name: "",
        address: "",
        landmark: "",
        area: "",
        city: "",
        pincode: "",
      },
      isEdit = false,
      options
    ) {
      this.id = address.id
      this.name = address.name;
      this.address = address.address;
      this.address_second = address.landmark;
      this.area = address.area;
      this.city = address.city;
      this.pin_code = address.pincode;
      this.isEdit = isEdit;
      this.dialog = true;
      this.options = Object.assign(this.options, options);

      return new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
      });
    },
    addLocation() {
      if (!this.$refs.form_address.validate()) {
        return;
      }
      if (this.pin_code < 100000) {
        return;
      }

      if (
        this.name != "" &&
        this.address != "" &&
        this.area != "" &&
        this.city != "" &&
        this.pin_code != ""
      ) {
        this.load = true;
        let endpooint = "add-address.php";
        let token =
          "eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2NDg1MDcwNTIsInN1YiI6ImVLYXJ0IEF1dGhlbnRpY2F0aW9uIiwiaXNzIjoiZUthcnQifQ.dcdE_rrGdj9jN4z-HmBu1lsO2PH3OkX1r0o63DvIkIo";

        const url = "https://smartgold.blazeaisolutions.com/api/" + endpooint;
        let data = new FormData();
        data.append("accesskey", "90336");

        data.append("user_id", this.$store.getters["auth/getUserId"]);
        data.append("name", this.name);
        data.append("address", this.address);
        data.append("landmark", this.address_second);
        data.append("city", this.city);
        data.append("area", this.area);
        data.append("pincode", this.pin_code);

        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };
        axios
          .post(url, data, {
            headers: headers,
          })
          .then((res) => {
            //console.log(res)
            this.load = false;
            this.resolve(true);
            this.dialog = false;
          })
          .catch((err) => {
            this.resolve(false);
            //console.log(false)
            this.load = false;
          });
      }
    },
    updateLocation(){
      //
      if (!this.$refs.form_address.validate()) {
        return;
      }
      if (this.pin_code < 100000) {
        return;
      }

      if (
        this.name != "" &&
        this.address != "" &&
        this.area != "" &&
        this.city != "" &&
        this.pin_code != ""
      ) {
        this.load = true;
        let endpooint = "edit-address.php";
        let token =
          "eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2NDg1MDcwNTIsInN1YiI6ImVLYXJ0IEF1dGhlbnRpY2F0aW9uIiwiaXNzIjoiZUthcnQifQ.dcdE_rrGdj9jN4z-HmBu1lsO2PH3OkX1r0o63DvIkIo";

        const url = "https://smartgold.blazeaisolutions.com/api/" + endpooint;
        let data = new FormData();
        data.append("accesskey", "90336");

        data.append("user_id", this.$store.getters["auth/getUserId"]);
        data.append("name", this.name);
        data.append("address_id",this.id)
        data.append("address", this.address);
        data.append("landmark", this.address_second);
        data.append("city", this.city);
        data.append("area", this.area);
        data.append("pincode", this.pin_code);

        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };
        axios
          .post(url, data, {
            headers: headers,
          })
          .then((res) => {
            //console.log(res)
            this.load = false;
            this.resolve(true);
            this.dialog = false;
          })
          .catch((err) => {
            this.resolve(false);
            //console.log(false)
            this.load = false;
          });
      }
    },
    getCurrentLocation() {
      /**open dialog Google */
      this.$refs.gdli
        .open()
        .then((res) => {
          if (res.success == true) {
            this.address = res.addressCity;

            this.area = res.area;
            this.city = res.city;
            this.pin_code = res.pincode;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    extractFromAdress(components, type) {
      for (var i = 0; i < components.length; i++)
        for (var j = 0; j < components[i].types.length; j++)
          if (components[i].types[j] == type) return components[i].long_name;
      return "";
    },

    cancel() {
      this.resolve(false);
      this.dialog = false;
    },
  },
};
</script>

<style scoped>
.q-dialog-plugin {
  width: 500px;
}
.q-dialog__inner--minimized {
  padding: 90px 0px 90px 0px !important;
}
.section-address-2 {
  min-height: calc(100% - 180px);
  max-height: calc(100% - 180px);
}
@media (max-width: 960px) {
  .q-dialog-plugin {
    width: 100% !important;
  }
  .q-dialog__inner--minimized {
    padding: 0px 0px 0px 0px !important;
  }
  .section-address-2 {
    min-height: calc(100% - 180px);
    max-height: calc(100% - 180px);
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
