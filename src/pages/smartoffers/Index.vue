<template>
  <q-page class="v-main">
    <div class="row q-px-none justify-center q-pt-md q-mx-none">
      <div class="col-md-10 col-12 q-px-md q-mx-none text-center">
        <q-toolbar-title class="text-black text-weight-bold text-h6">{{ title }}</q-toolbar-title>
      </div>
    </div>
    <div class="row justify-center q-py-xs q-px-none q-mx-none">
      <div class="col-lg-5 col-md-10 col-12 q-px-sm self-center">
        <q-btn
          flat
          outlined
          size="sm"
          color="white"
          class="bg-primary q-px-sm q-py-sm text-center shadow-0"
          style="position:absolute;top:15px;margin-left:0px"
          @click.prevent="openSmartBuy()"
        >
          <q-icon class="q-ml-sm" name="arrow_back_ios"></q-icon>
        </q-btn>
        <p
          class="text-h6 text-weight-bold text-info"
          v-if="!notfound"
        >Selected Offer from a shop nearby...</p>

        <div class="row" v-if="!notfound">
          <div class="col-12" v-for="(offer, index) in offers" :key="'offer' + index">
            <q-card
              v-ripple
              square
              class="cursor-pointer shadow-0 bg-white"
              @click.prevent="setOffer(offer)"
            >
              <q-card-section>
                <p class="text-info text-normal q-my-xs text-h6 text-weight-bold">{{ offer.name }}</p>
              </q-card-section>
            </q-card>
          </div>
        </div>

        <div class="empty_order q-my-lg q-py-lg" v-if="notfound">
          <q-img
            fit="contain"
            src="~assets/app/empty_order.jpg"
            v-if="notfound"
            class="empty_order"
          ></q-img>
        </div>
        <div class="text-center" v-if="notfound">
          <p class="text-primary text-weight-bold text-h6">No Offers Found</p>
        </div>
      </div>
    </div>
  </q-page>
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

import { ref } from "vue";
import axios from 'axios'
import { QOverlay } from "@quasar/quasar-ui-qoverlay";
export default {
  name: 'smartoffers-component',
  components: {
    QOverlay
  },
  data: () => ({

    title: "Smart Buy",
    offers: [],
    value: 100,
    load: false,
    notfound: true,
  }),
  mounted() {
    //this.openSuccess();
    this.getData();
  },
  methods: {

    openSmartBuy() {
      this.$router.push({ path: '/smart-buy' })
    },
    getData() {
      this.load = true
      let endpooint = "smart-offers.php";
      let token =
        "eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2NDg1MDcwNTIsInN1YiI6ImVLYXJ0IEF1dGhlbnRpY2F0aW9uIiwiaXNzIjoiZUthcnQifQ.dcdE_rrGdj9jN4z-HmBu1lsO2PH3OkX1r0o63DvIkIo";
      const url = "http://smartgold.blazeaisolutions.com/api/" + endpooint;

      let data = new FormData();

      console.log(this.$store.getters["checkout/getCheckMethod"])

      data.append("accesskey", "90336");
      data.append("budget_range_id", this.$store.getters["smartoffers/getBudgetId"]);
      data.append("latitude", this.$store.getters["smartoffers/getLatitude"]);
      data.append("longitude", this.$store.getters["smartoffers/getLongitude"]);
      data.append("range_to", this.$store.getters["smartoffers/getRangeTo"]);

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      axios
        .post(url, data, {
          headers: headers,
        }
        )
        .then(res => {
          console.log(res)
          if (res.data.success == true) {
            this.offers = res.data.data
            this.notfound = false

          } else {
            this.notfound = true
          }

          this.load = false
        }).catch(err => {
          this.load = false
        })
    }
  },
  setup() {
    return {
      step: ref(1),
    };
  },
};
</script>

<style>
.q-gutter-x-sm > *,
.q-gutter-sm > * {
  margin-left: 0px !important;
}
.empty_order {
  height: 400px;
}
@media screen and (max-width: 960px) {
  .empty_order {
    height: 400px;
  }
}
</style>
