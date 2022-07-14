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
        <q-btn
          flat
          outlined
          size="sm"
          color="white"
          class="bg-primary q-px-sm q-py-sm text-center shadow-0"
          style="position: absolute; top: 15px; margin-left: 0px"
          @click.prevent="openSmartOffers()"
        >
          <q-icon class="q-ml-sm" name="arrow_back_ios"></q-icon>
        </q-btn>
        <p class="text-h6 text-weight-bold text-info q-my-md">
          Selected Offer from a shop nearby...
        </p>
        <div class="row">
          <p class="q-my-none text-info col-12">{{ availableProducts }}</p>
          <p class="q-my-none text-info col-12">{{ discountPrice }}</p>
          <p class="q-my-none text-info col-12">{{ discountWastage }}</p>
        </div>

        <p class="text-h6 text-weight-bold text-secondary q-my-md">Note:</p>
        <div class="row">
          <p class="q-my-none text-secondary col-12">{{ priceRs }}</p>
          <p class="q-my-none text-secondary col-12">{{ lokedForDay }}</p>
          <p class="q-my-none text-secondary col-12">{{ lookingCost }}</p>
        </div>

        <p class="text-h6 text-weight-bold text-info q-my-md">Discount</p>
        <div class="row">
          <q-chip outline color="orange" text-color="white">
            {{ priceCard }}
          </q-chip>
          <q-chip outline color="orange" text-color="white">
            {{ wastageCard }}
          </q-chip>
        </div>
        <div class="row">
          <q-chip outline color="orange" text-color="white"> Assured seller </q-chip>
        </div>

        <p class="text-h6 text-weight-bold text-info q-my-md">Offer details</p>
        <div class="row">
          <p class="q-my-none text-info col-12">{{ offerDetails }}</p>
        </div>

        <div class="row justify-center q-py-xs q-px-none q-mx-none q-mt-lg">
          <div class="col-12 justify-between align-center q-py-sm flex q-px-none">
            <q-btn
              square
              size="md"
              :loading="load_button"
              class="bg-primary text-h6 q-mx-none q-pr-none q-pl-md full-width q-py-sm"
              @click.prevent="lookOffer()"
            >
              <span class="text-info text-normal text-weight-bold"
                >LOOK THE SMART OFFER</span
              >
            </q-btn>
          </div>
        </div>
      </div>
    </div>
  </q-page>
  <SmartGoldSuccesfully ref="smartoffersuccesfully"></SmartGoldSuccesfully>
  <PaymentSuccessfull ref="paymentSuccessfull"></PaymentSuccessfull>
  <PaymentFailed ref="paymentFailed"></PaymentFailed>
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
import { ref } from "vue";
import axios from "axios";
import { QOverlay } from "@quasar/quasar-ui-qoverlay";
import SmartGoldSuccesfully from "src/components/dialogs/SmartGoldSuccesfully.vue";
import PaymentSuccessfull from "src/components/dialogs/PaymentSuccessfull.vue";
import PaymentFailed from "src/components/dialogs/PaymentFailed.vue";
export default {
  name: "smartoffers-details-component",
  components: {
    QOverlay,
    SmartGoldSuccesfully,
    PaymentSuccessfull,
    PaymentFailed,
  },
  data: () => ({
    title: "Smart Buy",
    load: false,
    priceRs: null,
    lokedForDay: null,
    priceTotal: 0,
   
    lookingCost:
      "Locking cost will be refunded if item is not purchased after visiting the store.",
  }),
  mounted() {
    if (!this.$store.getters["auth/getOtp"]) {
      this.$store.dispatch("auth/setLoggedIn", false);
      this.$store.dispatch("auth/signOut");
    }
    //this.openSuccess();
    this.getData();
  },
  methods: {
    openSmartOffers() {
      this.$router.push({ path: "/smart-offers" });
    },
    getData() {
      this.load = true;
      let endpooint = "price-duration.php";
      let token =
        "eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2NDg1MDcwNTIsInN1YiI6ImVLYXJ0IEF1dGhlbnRpY2F0aW9uIiwiaXNzIjoiZUthcnQifQ.dcdE_rrGdj9jN4z-HmBu1lsO2PH3OkX1r0o63DvIkIo";
      const url = "https://smartgold.blazeaisolutions.com/api/" + endpooint;

      let data = new FormData();
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
          if (res.data.success == true) {
            const { days, price } = res.data.data;
            //console.log(days,price)

            this.priceRs = "Lock the price by paying price Rs: " + price;
            this.priceTotal = price;
            if (days == 1) {
              this.lokedForDay = "Items can be locked for " + days + " day";
            } else {
              this.lokedForDay = "Items can be locked for " + days + " days";
            }
          }

          this.load = false;
        })
        .catch((err) => {
          this.load = false;
        });
    },
    lookOffer() {
      

      if (this.$store.getters["auth/isLoggedIn"]) {
        this.pay();
      } else {
        this.$router.push({ name: "login" });
      }
    },
    async pay() {
      this.load = true;
      // Customer details and amount
      let self = this;
      const options = {
        key: "rzp_test_AthH2SEZ9x6phT", // Enter the Key ID generated from the Dashboard
        amount: self.priceTotal * 100,
        currency: "INR",
        description: "Smart Gold",
        
        prefill: {
          email: this.$store.getters["auth/getEmail"],
          contact: "+91" + this.$store.getters["auth/getUserphone"],
        },
        options: {
          checkout: {
            theme: {
              hide_topbar: true,
              
            },
          },
        },
        theme:{
          color:'#F2CF8D'
        },
        config: {
          display: {
            blocks: {
              /*hdfc: { //name for HDFC block
                name: "Pay using HDFC Bank",
                instruments: [
                  {
                    method: "card",
                    issuers: ["Mastercard", "Visa", "RuPay", "Maestro"]
                  },
                  {
                    method: "netbanking",
                    banks: ["HDFC"]
                  },
                ]
              },*/
              other: {
                //  name for other block
                name: "CARDS, UPI & MORE",
                instruments: [
                  {
                    method: "card",
                    issuers: ["Visa", "Mastercard"],
                  },
                  {
                    method: "upi",
                  },
                  {
                    method: "netbanking",
                  },
                  {
                    method: "wallet",
                  },
                  {
                    method: "paylater",
                  },
                ],
              },
            },
            hide: [
              {
                method: "upi",
              },
            ],
            sequence: ["block.hdfc", "block.other"],
            preferences: {
              show_default_blocks: false, // Should Checkout show its default blocks?
            },
          },
        },
        handler: function (response) {
          //console.log(response)
          const razorpay_payment_id = response.razorpay_payment_id;
          const razorpay_order_id = response.razorpay_order_id;
          const razorpay_signature = response.razorpay_signature;
          self.load = false
          self.successRazorPay();
        },
        modal: {
          ondismiss: function () {
            //console.log("dismiss")
            //self.$refs.paymentFailed.open(null, null, null).then((res) => {});
            self.load = false
          },
        },
      };
      let rzp1 = new Razorpay(options);
      //document.getElementById('rzp-button1').onclick = function (e) {
      rzp1.open();

      rzp1.on("payment.failed", function (response) {
        const code = response.error.code;
        const description = response.error.description;
        const source = response.error.source;
        const step = response.error.step;
        const reason = response.error.reason;
        const order_id = response.metadata.reason;
        const payment_id = response.metadata.payment_id;

        //console.log(response);
        self.$refs.paymentFailed.open(payment_id, order_id, reason).then((res) => {});
        self.load = false
      });
      //  e.preventDefault();
      //}
    },
    successRazorPay() {
      let endpooint = "offer-lock.php";
      let token =
        "eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2NDg1MDcwNTIsInN1YiI6ImVLYXJ0IEF1dGhlbnRpY2F0aW9uIiwiaXNzIjoiZUthcnQifQ.dcdE_rrGdj9jN4z-HmBu1lsO2PH3OkX1r0o63DvIkIo";
      const url = "https://smartgold.blazeaisolutions.com/api/" + endpooint;

      let data = new FormData();
      data.append("accesskey", "90336");
      data.append("user_id", this.$store.getters["auth/getUserId"]);

      const offer = this.$store.getters["smartoffers/getOffer"];
      console.log(offer)

      data.append("seller_id", offer.seller_id);
      data.append("offer_id", offer.id);
      data.append("paid_amt", this.priceTotal);

      //console.log(this.$store.getters["auth/getUserId"])

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      axios
        .post(url, data, {
          headers: headers,
        })
        .then((res) => {
          if (res.data.success == true) {
            this.$refs.smartoffersuccesfully
              .open(res.data.data)
              .then((res) => {})
              .catch((err) => {});
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
  },
  computed: {
    availableProducts() {
      const offer = this.$store.getters["smartoffers/getOffer"];
      if (offer != null) {
        return ". " + offer.total_products + " Products available in this store";
      }
      return "";
    },
    discountPrice() {
      const offer = this.$store.getters["smartoffers/getOffer"];
      if (offer != null) {
        return ". Discount price per gram: " + this.formatRupiah(offer.gram_price);
      }
      return "";
    },
    discountWastage() {
      const offer = this.$store.getters["smartoffers/getOffer"];
      if (offer != null) {
        return ". Discount on wastage: " + offer.wastage + "%";
      }
      return "";
    },
    offerDetails() {
      const offer = this.$store.getters["smartoffers/getOffer"];
      if (offer != null) {
        return offer.offer_details;
      }
      return "";
    },
    priceCard() {
      const offer = this.$store.getters["smartoffers/getOffer"];
      if (offer != null) {
        return this.formatRupiah(offer.gram_price) + " per gram";
      }
      return "";
    },
    wastageCard() {
      const offer = this.$store.getters["smartoffers/getOffer"];
      if (offer != null) {
        return offer.wastage + " % on wastage";
      }
      return "";
    },
  },
  setup() {
    return {
      step: ref(1),
    };
  },
};
</script>

<style scoped>
.card-offer {
  border-radius: 15px !important;
  border-left: 20px solid #f2cf8d;
}

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
