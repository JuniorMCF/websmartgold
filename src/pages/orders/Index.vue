<template>
  <q-page>
    <div class="row q-px-none justify-center q-pt-md q-mx-none">
      <div class="col-lg-4 col-md-6 col-12 q-px-md q-mx-none text-center">
        <q-toolbar-title class="text-black text-weight-bold text-h6">Order history</q-toolbar-title>
      </div>
    </div>
    <div class="row q-px-none justify-center q-pt-md q-mx-none">
      <div class="col-lg-4 col-md-6 col-12 q-px-md q-mx-none">
        <q-card class="no-box-shadow no-border-radius">
          <q-card
            class="shadow-0 q-px-md q-my-md"
            v-for="(item, index) in orders"
            :key="'cart' + index"
            @click.prevent="openDetail(item)"
          >
            <q-card-section class="q-px-none">
              <span class="text-info text-weight-bold text-subtitle1">ORDER ID :</span>
              <span class="q-pl-md">{{ item.id }}</span>
            </q-card-section>
            <q-card-section horizontal>
              <div class="bg-white">
                <q-img
                  :src="item.image"
                  no-spinner
                  height="110"
                  width="110"
                  ratio="1"
                  fit="contain"
                  class="img-cart bg-white"
                />
              </div>

              <q-card-section class="q-py-none content-cart row justify-between">
                <p
                  class="col-12 text-subtitle1 text-weight-bold text-info q-my-none name_cart q-py-none"
                >
                  <span>{{ item.name }}</span>
                </p>
                <span
                  class="col-12 text-secondary text-weight-bold text-subtitle2 q-my-none q-py-none"
                >
                  {{
                    formatRupiah(item.discounted_price)
                  }}
                </span>
                <div class="col-12 q-pa-none text-secondary">Quantity: {{ item.quantity }}</div>
                <div class="col-12 q-pa-none text-secondary">{{ evaluatePickUp(item.buy_method) }}</div>

                <div class="col-12 q-pa-none text-secondary">Payment Status: {{ item.payment_status }}</div>
                 <div class="col-12 q-pa-none text-secondary">Order Status: {{ item.status }}</div>
              </q-card-section>
            </q-card-section>
          </q-card>
        </q-card>
      </div>
    </div>
  </q-page>
  <RingDetailsWithId ref="ringDetailsWithId"></RingDetailsWithId>
  <q-overlay v-model="load" :no-scroll="true" :z-index="5000" cursor-type="inherit">
    <template #body>
      <div class="fullscreen row justify-evenly items-center">
        <div style="height: 80px; width: 80px">
          <q-img src="~assets/app/load.gif" alt="gif load" fit="contain" no-spinner></q-img>
        </div>
      </div>
    </template>
  </q-overlay>
</template>

<script>
import axios from 'axios'
import RingDetailsWithId from "src/components/dialogs/RingDetailsWithId.vue";
import { QOverlay } from "@quasar/quasar-ui-qoverlay";
export default {
  name: 'orders-component',
  components: {
    QOverlay,
    RingDetailsWithId
  },
  data: () => ({
    load: false,
    orders: []
  }),
  mounted() {
        if (!this.$store.getters["auth/getOtp"]) {
      this.$store.dispatch("auth/setLoggedIn", false);
      this.$store.dispatch("auth/signOut");
    }
    this.getData()
  },
  methods: {
    getData() {
      this.load = true
      let endpooint = "orders_list.php";
      let token =
        "eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2NDg1MDcwNTIsInN1YiI6ImVLYXJ0IEF1dGhlbnRpY2F0aW9uIiwiaXNzIjoiZUthcnQifQ.dcdE_rrGdj9jN4z-HmBu1lsO2PH3OkX1r0o63DvIkIo";

      const url = "https://smartgold.blazeaisolutions.com/api/" + endpooint;
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
          //console.log(res.data.data)
          this.orders = res.data.data
        }
        this.load = false
      }).catch(err => {
        this.load = false
      })
    },
    openDetail(item){
      this.$refs.ringDetailsWithId.open(item).then((res) => {
        if (res) {
        }
      });
    },
    formatRupiah(money) {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      })
        .format(money)
        .replace("Rp", "₹");
    },
    evaluatePickUp(buy_method) {
      if (buy_method == "1") {
        return "Pickup at store";
      } else {
        return "Delivery at Home";
      }
    }
  },
};
</script>

<style>
.q-gutter-x-sm > *,
.q-gutter-sm > * {
  margin-left: 0px !important;
}
.img-cart {
  height: 100% !important;
  width: 110px !important;
  border-radius: 5px;
  box-shadow: 0 1px 1px rgb(0 0 0 / 10%), 0px 1px 0px rgb(0 0 0 / 10%),
    0 1px 1px 0px rgb(0 0 0 / 10%), 0 0px 1px 1px rgb(0 0 0 / 10%);
}
</style>
