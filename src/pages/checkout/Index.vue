<template>
  <q-page class="v-main">
    <div class="row q-px-none justify-center q-pt-md q-mx-none">
      <div class="col-md-10 col-12 q-px-md q-mx-none text-center">
        <q-toolbar-title class="text-black text-weight-bold text-h6"
          >Checkout</q-toolbar-title
        >
      </div>
    </div>

    <div class="row justify-center q-py-xs q-px-none q-mx-none">
      <div class="col-lg-5 col-md-10 col-12 q-px-sm self-center">
        <div class="row q-col-gutter-x-md q-col-gutter-y-md">
          <div class="col-12">
            <q-card class="card-app" v-if="checkMethod == 2">
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
                    @click.prevent="openAddressDialog()"
                    >CHANGE OR ADD ADDRESS</q-btn
                  >
                </div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-12">
            <q-card class="card-app">
              <q-card-section>
                <p class="text-info text-normal q-my-xs text-h6 text-weight-bold">
                  Buy method
                </p>
                <div class="row">
                  <q-radio
                    v-model="checkMethod"
                    :val="1"
                    label="Pick up at the store"
                    @click="getCheckout()"
                  />
                  <q-radio
                    v-model="checkMethod"
                    :val="2"
                    label="Delivery at home"
                    @click="getCheckout()"
                  />
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </div>

    <div class="row justify-center q-pt-md q-px-none q-mx-none">
      <div class="col-lg-5 col-md-10 col-12 q-px-sm self-center">
        <q-card class="card-app">
          <q-card-section>
            <p class="text-info text-normal q-my-xs text-h6 text-weight-bold">
              Price details
            </p>
            <div class="row">
              <div class="col-6 text-weight-bold text-subtitle2">
                Total N° of Products
              </div>
              <div class="col-6 text-weight-bold text-subtitle2">
                <span style="float: right">
                  <span>{{ checkout.no_of_products }}</span>
                </span>
              </div>

              <div class="col-6 text-weight-bold text-subtitle2">Original Total</div>
              <div class="col-6 text-weight-bold text-subtitle2">
                <span style="float: right">
                  <span>{{ formatRupiah(checkout.totalprice) }}</span>
                </span>
              </div>
              <div class="col-6 text-weight-bold text-subtitle2">Discount</div>
              <div class="col-6 text-weight-bold text-subtitle2">
                <span style="float: right">
                  <span>{{ formatRupiah(checkout.saved) }}</span>
                </span>
              </div>
              <div class="col-6 text-weight-bold text-subtitle2">Delivery charges</div>
              <div class="col-6 text-weight-bold text-subtitle2">
                <span style="float: right">
                  <span>{{ formatRupiah(checkout.delivery_price) }}</span>
                </span>
              </div>
              <div class="col-6 text-weight-bold text-h6 q-py-md">Grand Total</div>
              <div class="col-6 text-weight-bold text-h6 q-py-md">
                <span style="float: right">
                  <span>{{ formatRupiah(checkout.grandtotal) }}</span>
                  <!--<span>{{ formatRupiah(checkout.no_of_products*(checkout.totalprice - checkout.saved ) + checkout.delivery_price) }}</span>-->
                </span>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <div class="row justify-center q-py-xs q-px-none q-mx-none">
      <div
        class="col-lg-5 col-md-10 col-12 justify-between align-center q-py-md flex q-px-sm"
      >
        <q-btn
          square
          size="md"
          class="bg-primary text-h6 q-mx-none q-pr-none q-pl-md full-width q-py-sm"
          @click.prevent="placeOrder()"
        >
          <span class="text-info text-normal text-weight-bold">PLACE ORDER</span>
        </q-btn>
      </div>
    </div>

    <!--button floating-->
    <!--<q-page-sticky position="bottom" :offset="[18, 18]">
      <q-btn
        size="md"
        align="center"
        class="btn-fixed-width text-normal size-btn"
        label="Smart buy"
        label-position="left"
        icon-right="shopping_bag"
        direction="right"
        color="primary"
      />
    </q-page-sticky>-->
  </q-page>
  <!--<LogoutAddressDialog ref="logoutAddressDialog"></LogoutAddressDialog>-->
  <LoggedInAddressesDialog ref="loggedInAddressesDialog"></LoggedInAddressesDialog>
  <PaymentSuccessfull ref="paymentSuccessfull"></PaymentSuccessfull>
  <PaymentFailed ref="paymentFailed"></PaymentFailed>
  <ConfirmPaymentDialog ref="confirmPaymentDialog"></ConfirmPaymentDialog>
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
import { Notify } from "quasar";
import ConfirmPaymentDialog from "../../components/dialogs/ConfirmPaymentDialog.vue";
//import LogoutAddressDialog from '../../components/dialogs/LogoutAddressDialog.vue';
import PaymentSuccessfull from "src/components/dialogs/PaymentSuccessfull.vue";
import PaymentFailed from "src/components/dialogs/PaymentFailed.vue";
import LoggedInAddressesDialog from "src/components/dialogs/LoggedInAddressesDialog.vue";
export default {
  name: "checkout-component",
  components: {
    QOverlay,
    ConfirmPaymentDialog,
    //LogoutAddressDialog,
    PaymentSuccessfull,
    PaymentFailed,
    LoggedInAddressesDialog,
  },
  data: () => ({
    load: false,
    address: "3517 W. Gray St. Utica, Pennsylvania 57867 (480) 555-0103",
    checkMethod: 1,
    options: [
      { id: 1, label: "Pick up at the store", value: "pick", color: "info" },
      { id: 2, label: "Delivery at home", value: "delivery", color: "info" },
    ],
    paid: false,
    //checkout: {}
  }),

  mounted() {
    if (!this.$store.getters["auth/getOtp"]) {
      this.$store.dispatch("auth/setLoggedIn", false);
      this.$store.dispatch("auth/signOut");
    }

    this.checkMethod = this.$store.state.checkout.checkMethod;
    this.getDefaultAddress();
  },
  methods: {
    openAddressDialog() {
      /*this.$refs.logoutAddressDialog.open().then((res) => {
        if (res) {
          //console.log(res);
        }
      });*/

      this.$refs.loggedInAddressesDialog.open();
    },
    getCheckout() {
      let endpooint2 = "check_out.php";
      let token =
        "eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2NDg1MDcwNTIsInN1YiI6ImVLYXJ0IEF1dGhlbnRpY2F0aW9uIiwiaXNzIjoiZUthcnQifQ.dcdE_rrGdj9jN4z-HmBu1lsO2PH3OkX1r0o63DvIkIo";

      const url2 = "https://smartgold.blazeaisolutions.com/api/" + endpooint2;
      let data2 = new FormData();
      data2.append("accesskey", "90336");
      data2.append("payment_method", this.checkMethod);
      data2.append("user_id", this.$store.getters["auth/getUserId"]);
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      axios
        .post(url2, data2, {
          headers: headers,
        })
        .then((res) => {
          if (res.data.success == true) {
            this.$store.dispatch("checkout/setCheckoutMethod", this.checkMethod);
            this.getDefaultAddress();
          }
        })
        .catch((err) => {});
    },
    getDefaultAddress() {
      this.load = true;
      let endpooint1 = "get_default_address.php";
      let endpooint2 = "check_out.php";
      let token =
        "eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2NDg1MDcwNTIsInN1YiI6ImVLYXJ0IEF1dGhlbnRpY2F0aW9uIiwiaXNzIjoiZUthcnQifQ.dcdE_rrGdj9jN4z-HmBu1lsO2PH3OkX1r0o63DvIkIo";

      const url1 = "https://smartgold.blazeaisolutions.com/api/" + endpooint1;
      const url2 = "https://smartgold.blazeaisolutions.com/api/" + endpooint2;
      let data1 = new FormData();
      data1.append("accesskey", "90336");
      data1.append("user_id", this.$store.getters["auth/getUserId"]);

      let data2 = new FormData();
      data2.append("accesskey", "90336");
      data2.append("payment_method", this.checkMethod);
      data2.append("user_id", this.$store.getters["auth/getUserId"]);
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      axios
        .all([
          axios.post(url1, data1, {
            headers: headers,
          }),
          axios.post(url2, data2, {
            headers: headers,
          }),
        ])
        .then(
          axios.spread((...responses) => {
            if (responses[0].data.success == true) {
              const address = responses[0].data.data;

              this.$store.dispatch("checkout/setAddressDefault", { address: address[0] });
            }
            if (responses[1].data.success == true) {
              //this.checkout = responses[1].data.data
              this.$store.dispatch("checkout/setCheckouts", {
                checkouts: responses[1].data.data,
              });
              //console.log(this.checkout)
            }

            this.load = false;
          })
        )
        .catch((err) => {
          console.log(err);
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
    async pay() {
      // Customer details and amount
      let self = this;
      const options = {
        key: "rzp_test_AthH2SEZ9x6phT", // Enter the Key ID generated from the Dashboard
        amount: this.checkout.grandtotal * 100,
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
        theme: {
          color: "#F2CF8D",
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
          const razorpay_payment_id = response.razorpay_payment_id;
          //const razorpay_order_id = response.razorpay_order_id;
          //const razorpay_signature = response.razorpay_signature;
          self.paid = true;
          self.placeOrderAfterRazorPay();
        },
        modal: {
          ondismiss: function () {
            //console.log("dismiss")
            self.$refs.paymentFailed.open(null, null, null).then((res) => {});
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

        self.$refs.paymentFailed.open(payment_id, order_id, reason).then((res) => {});
      });
      //  e.preventDefault();
      //}
    },
    placeOrderAfterRazorPay() {
      this.load = true;
      let endpooint = "place_order.php";
      let token =
        "eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2NDg1MDcwNTIsInN1YiI6ImVLYXJ0IEF1dGhlbnRpY2F0aW9uIiwiaXNzIjoiZUthcnQifQ.dcdE_rrGdj9jN4z-HmBu1lsO2PH3OkX1r0o63DvIkIo";
      const url = "https://smartgold.blazeaisolutions.com/api/" + endpooint;

      let data = new FormData();

      //console.log(this.$store.getters["checkout/getCheckMethod"])

      data.append("accesskey", "90336");
      data.append("user_id", this.$store.getters["auth/getUserId"]);
      data.append("buy_method", this.$store.getters["checkout/getCheckMethod"]);
      data.append("is_paid", this.paid);
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
            this.$refs.paymentSuccessfull.open().then((res) => {
              if (res) {
                this.$store.dispatch(
                  "cart/updateCart",
                  this.$store.getters["auth/getUserId"]
                );
              }
            });
          } else {
            this.$refs.PaymentFailed.open().then((res) => {
              if (res) {
                this.$store.dispatch(
                  "cart/updateCart",
                  this.$store.getters["auth/getUserId"]
                );
              }
            });
          }

          this.load = false;
          this.paid = false;
        })
        .catch((err) => {
          //console.log(err)
          this.paid = false;
          this.load = false;
        });
    },

    placeOrder() {
      if (this.$store.getters["cart/getQuantityCart"] > 0) {
        this.$refs.confirmPaymentDialog
          .open()
          .then((res) => {
            if (res) {
              //pay now
              this.pay();
            } else {
              //pay later
              this.load = true;
              let endpooint = "place_order.php";
              let token =
                "eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2NDg1MDcwNTIsInN1YiI6ImVLYXJ0IEF1dGhlbnRpY2F0aW9uIiwiaXNzIjoiZUthcnQifQ.dcdE_rrGdj9jN4z-HmBu1lsO2PH3OkX1r0o63DvIkIo";
              const url = "https://smartgold.blazeaisolutions.com/api/" + endpooint;

              let data = new FormData();

              //console.log(this.$store.getters["checkout/getCheckMethod"])

              data.append("accesskey", "90336");
              data.append("user_id", this.$store.getters["auth/getUserId"]);
              data.append("buy_method", this.$store.getters["checkout/getCheckMethod"]);
              data.append("is_paid", this.paid);
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
                    this.$refs.paymentSuccessfull.open().then((res) => {
                      if (res) {
                        this.$store.dispatch(
                          "cart/updateCart",
                          this.$store.getters["auth/getUserId"]
                        );
                      }
                    });
                  } else {
                    this.$refs.PaymentFailed.open().then((res) => {
                      if (res) {
                        this.$store.dispatch(
                          "cart/updateCart",
                          this.$store.getters["auth/getUserId"]
                        );
                      }
                    });
                  }

                  this.load = false;
                })
                .catch((err) => {
                  //console.log(err)
                  this.load = false;
                });
            }
          })
          .catch((err) => {
            this.load = false;
          });
      } else {
        this.load = false;
        Notify.create({
          message: "Oops! Your cart is empty",
          group: false,
        });
      }
    },
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
        return "";
      }
    },
    checkout() {
      console.log(this.$store.getters["checkout/getCheckout"]);
      return this.$store.getters["checkout/getCheckout"];
    },
  },
};
</script>

<style>
.q-gutter-x-sm > *,
.q-gutter-sm > * {
  margin-left: 0px !important;
}
</style>
