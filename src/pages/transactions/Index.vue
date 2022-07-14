<template>
  <q-page>
    <div class="row q-px-none justify-center q-pt-md q-mx-none">
      <div class="col-md-10 col-12 q-px-md q-mx-none text-center">
        <q-toolbar-title class="text-black text-weight-bold text-h6"
          >Smart Lock History</q-toolbar-title
        >
      </div>
      <div
        class="row justify-center q-py-xs q-px-none q-mx-none"
        v-if="!notfound"
      >
        <div
          class="col-lg-7 col-md-8 col-12 q-px-sm self-center"
          v-for="(offer, index) in offers"
          :key="'offer' + index"
        >
          <q-card
            square
            class="shadow-4 bg-white card-offer"
            @click.prevent="setOffer(offer)"
          >
            <q-card-section class="q-py-sm">
              <div class="row justify-between q-mt-md q-mb-none q-py-sm">
                <p
                  class="
                    col-6
                    text-weight-bold text-info text-subtitle1
                    q-my-none
                  "
                >
                  OFFER LOCK ID
                </p>
                <p class="col-6 text-info text-subtitle1 q-my-none">
                  : {{ offer.id }}
                </p>

                <p
                  class="
                    col-6
                    text-weight-bold text-info text-subtitle1
                    q-my-none
                  "
                >
                  Valid Date
                </p>
                <p class="col-6 text-info text-subtitle1 q-my-none">
                  : {{ offer.valid_date }}
                </p>

                <p
                  class="
                    col-6
                    text-weight-bold text-info text-subtitle1
                    q-my-none
                  "
                >
                  Shop Name
                </p>
                <p class="col-6 text-info text-subtitle1 q-my-none">
                  : {{ offer.store_name }}
                </p>

                <p
                  class="
                    col-6
                    text-weight-bold text-info text-subtitle1
                    q-my-none
                  "
                >
                  Address
                </p>
                <p class="col-6 text-info text-subtitle1 q-my-none">
                  : {{ offer.street }}
                </p>

                <p
                  class="
                    col-6
                    text-weight-bold text-info text-subtitle1
                    q-my-none
                  "
                >
                  Offer Details
                </p>
                <p class="col-6 text-info text-subtitle1 q-my-none">
                  : {{ offer.description }}
                </p>
              </div>
              <p
                class="
                  text-info text-normal
                  q-my-none
                  text-h6 text-subtitle1
                  line-h1
                "
              >
                {{ formatRupiah(offer.gram_price) }} Discount per gram
              </p>
              <p
                class="
                  text-info text-normal
                  q-my-none
                  text-h6 text-subtitle1
                  line-h1
                "
              >
                {{ offer.wastage }} % wastage
              </p>

              <div class="row justify-between q-my-none q-mb-none q-py-sm">
                <p
                  class="
                    col-6
                    text-weight-bold text-info text-subtitle1
                    q-my-none
                  "
                >
                  Order Status
                </p>
                <p class="col-6 text-info text-subtitle1 q-my-none">
                  : {{offer.status}}
                </p>
              </div>

              <div class="row justify-between q-my-none q-py-sm">
                <div class="text-info">
                  <q-btn
                    flat
                    round
                    size="lg"
                    icon="my_location"
                    color="primary"
                    @click.prevent="openMap(offer)"
                  ></q-btn>
                </div>
                <div class="text-info">
                  <q-btn
                    flat
                    round
                    size="lg"
                    icon="phone"
                    color="primary"
                    @click.prevent="callPhone(offer)"
                  ></q-btn>
                </div>
              </div>
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
          no-spinner
        ></q-img>
      </div>
      <div class="text-center" v-if="notfound">
        <p class="text-primary text-weight-bold text-h6">No Offers Found</p>
      </div>
    </div>
  </q-page>
  <q-overlay v-model="load" :no-scroll="true" :z-index="5000" cursor-type="inherit">
    <template #body>
      <div class="fullscreen row justify-evenly items-center">
        <div style="height: 80px; width: 80px">
          <q-img
            src="~assets/app/load.gif"
            alt="gif load"
            fit="contain"
            no-spinner
          ></q-img>
        </div>
      </div>
    </template>
  </q-overlay>
</template>

<script>
import axios from "axios";
import { QOverlay } from "@quasar/quasar-ui-qoverlay";
export default {
  name: "transactions-component",
  components: {
    QOverlay,
  },
  data: () => ({
    offers: [],
    load: false,
  }),
  mounted() {
        if (!this.$store.getters["auth/getOtp"]) {
      this.$store.dispatch("auth/setLoggedIn", false);
      this.$store.dispatch("auth/signOut");
    }
    this.getData();
  },
  methods: {
    getData() {
      this.load = true;
      let endpooint = "get-offer-lock-by-id.php";
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
      axios
        .post(url, data, {
          headers: headers,
        })
        .then((res) => {
          //console.log(res);
          if (res.data.success == true) {
            this.offers = res.data.data;
            this.notfound = false;
          } else {
            this.notfound = true;
          }

          this.load = false;
        })
        .catch((err) => {
          this.load = false;
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
    callPhone(offer){
      window.open('tel:+91'+offer.mobile);
    },
    openMap(offer){
        const url = "https://maps.google.com/?q=" + offer.latitude + "," + offer.longitude;


        window.open(url, '_blank');
    }
  },
};
</script>

<style scoped>
.card-offer {
  border-radius: 15px !important;
  border-left: 20px solid #f2cf8d;
  margin-bottom: 10px;
}

.q-gutter-x-sm > *,
.q-gutter-sm > * {
  margin-left: 0px !important;
}
</style>
