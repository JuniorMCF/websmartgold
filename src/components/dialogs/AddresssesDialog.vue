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
      <p class="text-info text-normal q-my-xs text-h6 text-center text-weight-bold">My Address</p>

      <q-card-section class="q-pa-md scroll section-address">
        <div class="row">
          <div class="col-12" v-for="(address, index) in addresses" :key="'address' + index">
            <q-card
              v-ripple
              square
              class="cursor-pointer shadow-0 bg-white"
              @click.prevent="setAddress(address)"
            >
              <q-card-section>
                <p class="text-info text-normal q-my-xs text-h6 text-weight-bold">{{ address.name }}</p>
                <p
                  class="text-subtitle1 q-py-none q-my-none"
                >{{ address.address + ", " + address.area + ", " }}</p>
                <p
                  class="text-subtitle1 q-py-none q-mb-sm"
                >{{ address.city + ", " + address.pincode }}</p>
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
          square
          color="primary"
          text-color="info"
          size="lg"
          block
          class="q-mx-auto full-width"
          @click.prevent="addAddress()"
        >Add address</q-btn>
      </q-card-actions>
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
  <AddressDialog ref="addressDialog"></AddressDialog>
</template>

<script>
import axios from 'axios'
import { QOverlay } from "@quasar/quasar-ui-qoverlay";
import AddressDialog from './AddressDialog.vue';
export default {
  components: {
    QOverlay,
    AddressDialog
  },
  name: 'addresses-component',
  mounted() { },
  data: function () {
    return {
      load: false,
      dialog: false,
      resolve: null,
      reject: null,
      addresses: [],
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
      this.getAddresses()
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
      this.resolve(false);
      this.dialog = false;
    },
    setAddress(address) {

      this.$store.dispatch("checkout/setAddressDefault", { address: address })
      this.resolve(true);
      this.dialog = false;
    },
    getAddresses() {
      this.load = true
      let endpooint = "address-list.php";
      let token =
        "eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2NDg1MDcwNTIsInN1YiI6ImVLYXJ0IEF1dGhlbnRpY2F0aW9uIiwiaXNzIjoiZUthcnQifQ.dcdE_rrGdj9jN4z-HmBu1lsO2PH3OkX1r0o63DvIkIo";

      const url = "http://smartgold.blazeaisolutions.com/api/" + endpooint;
      let data = new FormData();
      data.append("accesskey", "90336");

      data.append("user_id", this.$store.getters["auth/getUserId"]);
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      axios.post(url, data, {
        headers: headers,
      }).then(res => {

        if (res.data.success == true) {
          this.addresses = res.data.data

        }
        this.load = false
      }).catch(err => {
        this.load = false
      })
    },
    addAddress() {
      this.$refs.addressDialog.open().then(res => {
        if (res) {
          this.getAddresses()
        }
      }).catch(err => {

      })
    }
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

.section-address {
  height: 660px;
}
@media (max-width: 960px) {
  .q-dialog-plugin {
    width: 100% !important;
  }
  .q-dialog__inner--minimized {
    padding: 0px 0px 0px 0px !important;
  }
  .section-address {
    height: 500px;
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
