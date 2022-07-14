<template>
  <q-page class="v-main">
    <div class="row q-px-none justify-center q-py-none q-mx-none">
      <div class="col-md-10 col-12 q-px-md q-mx-none text-center">
        <q-toolbar-title class="text-black text-weight-bold text-h6">{{ title }}</q-toolbar-title>
      </div>
    </div>
    <div class="row justify-center q-py-xs q-px-none q-mx-none">
      <div class="col-lg-5 col-md-10 col-12 q-px-sm self-center">
        <q-card class="card-shop">
          <div class="row">
            <div class="col q-pl-md q-pt-md">
              <div class="bg-white img_gold">
                <q-img no-spinner src="~assets/app/logo.png"></q-img>
              </div>
            </div>
            <!--<div class="col self-center text-right q-pr-md q-pt-md">
              <p class="text-white text-subtitle1 text-weight-bold q-ma-none">Market price</p>
              <p class="text-white text-subtitle1 text-weight-bold q-ma-none">₹5.081 + 3% GST</p>
            </div>-->
          </div>
          <q-card-section class="q-py-lg q-my-lg">
            <q-img no-spinner src="~assets/app/gold_build.jpeg"></q-img>
          </q-card-section>
          <q-card-section class="q-pb-lg">
            <div class="row">
              <div class="col-12 text-center">
                <p class="text-white text-weight-bold text-subtitle1">Start Investing in Gold</p>
              </div>
            </div>
            <div class="row">
              <div class="col-12 text-center">
                <q-btn
                  class="bg-white q-px-md text-weight-bold"
                  size="md"
                  rounded
                  text-color="secondary"
                  flat
                  @click.prevent="openSmartBuy()"
                >SMART BUY</q-btn>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>

import { ref } from "vue";
export default {
  name: 'smartshop-component',
  components: {

  },
  data: () => ({
    fnMarkerLabel: { 5: "5km", 200: "200km" },
    title: "",
    options: [{}],
    value: 100,
  }),
  mounted() {
        if (!this.$store.getters["auth/getOtp"]) {
      this.$store.dispatch("auth/setLoggedIn", false);
      this.$store.dispatch("auth/signOut");
    }
    //this.openSuccess();
    //this.openError();
  },
  methods: {

    openSmartBuy() {
      this.$router.push({ path: '/smart-buy' })
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
.card-shop {
  background: #0277bd;
}
.img_gold {
  height: 100px;
  width: 100px;
}
@media screen and (max-width: 960px) {
  .img_gold {
    height: 80px;
    width: 80px;
  }
}
</style>
