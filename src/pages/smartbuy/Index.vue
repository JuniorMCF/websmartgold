<template>
  <q-page class="v-main">
    <div class="row q-px-none justify-center q-pt-md q-mx-none">
      <div class="col-md-10 col-12 q-px-md q-mx-none text-center">
        <q-toolbar-title class="text-black text-weight-bold text-h6">{{
          title
        }}</q-toolbar-title>
      </div>
    </div>
    <div class="row justify-center q-py-xs q-px-none q-mx-none">
      <div class="col-lg-5 col-md-10 col-12 q-px-sm self-center">
        <div class="row q-my-md">
          <div class="col-12">
            <p class="text-h6 text-weight-bold">Select your budget</p>
          </div>
          <div class="col-12">
            <q-select
              square
              outlined
              v-model="budget"
              :options="budges"
              option-label="budget"
            />
          </div>
        </div>

        <div class="row q-my-md">
          <div class="col-12">
            <p class="text-h6 text-weight-bold">Select Range upto</p>
          </div>
          <div class="col-12 q-px-lg">
            <q-slider
              class="q-mt-xl"
              v-model="upto"
              label-always
              color="primary"
              :marker-labels="fnMarkerLabel"
              :min="5"
              :max="200"
              :step="5"
              label
            />
          </div>
        </div>

        <div class="row q-my-md">
          <div class="col-12">
            <q-card class="bg-white" v-if="checkLoggedIn == false">
              <q-card-section class="c-pointer">
                <div
                  class="row full-width justify-center items-center"
                  @click.prevent="openAddressDialog()"
                >
                  <p class="q-my-none text-weight-bold">{{ getAddressCity }}</p>
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

            <!--if logged in-->
            <q-card class="card-app" v-else>
              <q-card-section>
                <p class="text-info text-normal q-my-xs text-h6 text-weight-bold">
                  {{ getAddress }}
                </p>
                <p class="text-subtitle1 q-py-none q-my-none">{{ getAddressDetail }}</p>
                <p class="text-subtitle1 q-py-none q-mb-sm">{{ getAddressCity }}</p>
                <div class="row">
                  <q-btn
                    color="primary"
                    text-color="info"
                    size="md"
                    square
                    unelevated
                    class="text-normal q-mx-auto full-width q-py-sm"
                    @click.prevent="openAddressDialogLoggedIn()"
                    >CHANGE OR ADD ADDRESS</q-btn
                  >
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
        <div class="row justify-center q-py-xs q-px-none q-mx-none">
          <div class="col-12 justify-between align-center q-py-sm flex q-px-none">
            <q-btn
              square
              size="md"
              :loading="load_button"
              class="bg-primary text-h6 q-mx-none q-pr-none q-pl-md full-width q-py-sm"
              @click.prevent="apply()"
            >
              <span class="text-white text-normal text-weight-bold">APPLY</span>
            </q-btn>
          </div>
        </div>
      </div>
    </div>
  </q-page>
  <LogoutAddressDialog ref="addressesDialog"></LogoutAddressDialog>
  <PaymentSuccessfull ref="success"></PaymentSuccessfull>
  <PaymentFailed ref="failed"></PaymentFailed>
  <LoggedInAddressesDialog ref="loggedInAddressesDialog"></LoggedInAddressesDialog>
  <q-overlay v-model="load" :no-scroll="true" :z-index="5000" cursor-type="inherit">
    <template #body>
      <div class="fullscreen row justify-evenly items-center">
        <div style="height: 80px; width: 80px">
          <q-img no-spinner src="~assets/app/load.gif" alt="gif load" fit="contain"></q-img>
        </div>
      </div>
    </template>
  </q-overlay>
</template>

<script>
import PaymentSuccessfull from "../../components/dialogs/PaymentSuccessfull.vue";
import PaymentFailed from "../..//components/dialogs/PaymentFailed.vue";
import LogoutAddressDialog from "../../components/dialogs/LogoutAddressDialog.vue";

import { ref } from "vue";
import { QOverlay } from "@quasar/quasar-ui-qoverlay";
import { Notify } from "quasar";
import axios from "axios";
import LoggedInAddressesDialog from "../../components/dialogs/LoggedInAddressesDialog.vue";
export default {
  name: "smartbuy-component",
  components: {
    PaymentSuccessfull,
    PaymentFailed,
    QOverlay,
    LogoutAddressDialog,
    LoggedInAddressesDialog,
  },
  data: () => ({
    fnMarkerLabel: { 5: "5km", 200: "200km" },
    title: "Smart Buy",
    options: [{}],
    upto: 100,
    load: false,
    budges: [],
    budget: null,
    latitude: null,
    longitude: null,
    search: false,
    load_button: false,
  }),
  mounted() {
        if (!this.$store.getters["auth/getOtp"]) {
      this.$store.dispatch("auth/setLoggedIn", false);
      this.$store.dispatch("auth/signOut");
    }
    //this.openSuccess();
    //this.openError();
    this.getData();
  },
  methods: {
    async apply() {
      //if (this.$store.getters["auth/isLoggedIn"]) {
        /**obtener la posicion de la direccion elegida */
        this.load_button = true;

        const address = this.$store.getters["checkout/getAddress"];

        if (address == null || address == undefined) {
          Notify.create({
            message: "Oops! Location unknown",
            group: false,
          });
          this.load_button = false;
          return
        }

        let address_details = address.address + " , " + address.area + " , ";
        let pincode_city = address.city + " - " + address.pin_code;
        let formated_address = address_details + pincode_city;

        let self = this;
        let promise = new Promise((resolve, reject) => {
          const geocoder = new google.maps.Geocoder();
          geocoder.geocode({ address: formated_address }, function (results, status) {
            if (status == "OK") {
              self.latitude = results[0].geometry.location.lat();
              self.longitude = results[0].geometry.location.lng();
              self.search = true;
              resolve(true);
            } else {
              self.search = false;
              resolve(false);
            }
          });
        });

        let result = await promise;

        if (result == true) {
          this.$store.commit("smartoffers/setBudgetId", this.budget.id);
          this.$store.commit("smartoffers/setLongitude", this.longitude);
          this.$store.commit("smartoffers/setLatitude", this.latitude);
          this.$store.commit("smartoffers/setRangeTo", this.upto);

          this.$router.push({ path: "smart-offers" });
          this.load_button = false;
        } else {
          
          this.load_button = false;
          Notify.create({
            message: "Oops! Location unknown",
            group: false,
          });
          
        }
      //} else {
      //  this.$router.push({ path: "/login" });
      //}
    },

    openSuccess() {
      this.$refs.success.open().then((res) => {
        if (res) {
          //console.log(res);
        }
      });
    },
    openError() {
      this.$refs.failed.open().then((res) => {
        if (res) {
          //console.log(res);
        }
      });
    },
    openAddressDialog() {
      this.$refs.addressesDialog.open().then((res) => {
        if (res) {
          //console.log(res);
        }
      });
    },
    openAddressDialogLoggedIn() {
      this.$refs.loggedInAddressesDialog.open();
    },
    getData() {
      this.load = true;
      let endpooint = "budget-range.php";
      let token =
        "eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2NDg1MDcwNTIsInN1YiI6ImVLYXJ0IEF1dGhlbnRpY2F0aW9uIiwiaXNzIjoiZUthcnQifQ.dcdE_rrGdj9jN4z-HmBu1lsO2PH3OkX1r0o63DvIkIo";
      const url = "https://smartgold.blazeaisolutions.com/api/" + endpooint;

      let data = new FormData();

      //console.log(this.$store.getters["checkout/getCheckMethod"])

      data.append("accesskey", "90336");

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
          if (res.data.success == true) {
            this.budges = res.data.data;
            this.budget = this.budges[0];
          }

          this.load = false;
        })
        .catch((err) => {
          this.load = false;
        });
    },
  },
  setup() {
    return {
      step: ref(1),
    };
  },
  computed: {
    getAddress() {
      const address = this.$store.getters["checkout/getAddress"];

      if (address != null && address != undefined) {
        return address.name;
      } else {
        return "";
      }
    },
    getAddressDetail() {
      const address = this.$store.getters["checkout/getAddress"];

      if (address != null && address != undefined) {
        return address.address + ", " + address.area + ", ";
      } else {
        return "";
      }
    },
    getAddressCity() {
      const address = this.$store.getters["checkout/getAddress"];
      if (address != null && address != undefined) {
        return address.city + ", " + address.pincode;
      } else {
        return "Select an address";
      }
    },
    checkLoggedIn() {
      return this.$store.getters["auth/isLoggedIn"];
    },
  },
};
</script>

<style>
.q-gutter-x-sm > *,
.q-gutter-sm > * {
  margin-left: 0px !important;
}
.q-slider__marker-labels-container {
  font-size: 1.1rem;
  color: #f2cf8d;
  font-weight: bold;
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 24px;
  min-width: 24px;
}
</style>
