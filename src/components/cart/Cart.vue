<template>
  <q-drawer
    overlay
    elevated
    side="right"
    v-model="drawerRight"
    :width="width"
    :breakpoint="700"
    class="bg-white"
  >
    <q-scroll-area class="fit">
      <q-card class="no-border-radius no-box-shadow">
        <div class="row">
          <div class="col-12 text-center q-py-md">
            <span class="text-black text-h6">My Cart</span>
          </div>
        </div>
        <q-btn
          flat
          outlined
          size="sm"
          color="white"
          class="bg-primary close-fixed q-px-sm q-py-sm text-center shadow-0"
          @click.prevent="closeCart()"
        >
          <q-icon class="q-ml-sm" name="arrow_back_ios"></q-icon>
        </q-btn>
      </q-card>
      <q-card class="card_cart no-box-shadow no-border-radius">
        <q-card
          class="shadow-0 q-px-md q-my-md"
          v-for="(item, index) in cart"
          :key="'cart' + index"
        >
          <q-card-section horizontal>
            <div class="bg-white">
              <q-img
                fit="contain"
                :src="item.image"
                height="110"
                width="110"
                ratio="1"
                class="img-cart bg-white"
              />
            </div>

            <div class="sold_out" v-if="item.status == 'Not Available'">
              <q-img src="~assets/app/out_of_stock.png" fit="contain"></q-img>
            </div>

            <q-card-section class="q-py-none content-cart row justify-between">
              <p class="col-10 text-subtitle1 text-weight-bold text-info q-my-xs name_cart">
                <span>{{ item.name }}</span>
              </p>
              <span
                class="col-12 text-secondary text-weight-bold text-subtitle2"
              >{{ formatRupiah(item.discounted_price) }}</span>
              <div class="col-12 q-pa-none">
                <div class="row justify-between q-mt-md">
                  <q-field
                    hide-bottom-space
                    dense
                    readonly
                    borderless
                    v-model="item.quantity"
                    class="input-cart"
                  >
                    <template v-slot:before>
                      <q-btn
                        round
                        outline
                        size="xs"
                        color="secondary"
                        icon="remove"
                        @click.prevent="removeToCart(item)"
                      />
                    </template>

                    <template v-slot:control>
                      <div
                        class="text-center text-secondary full-width no-outline text-caption text-weight-bold"
                        tabindex="0"
                      >{{ item.quantity }}</div>
                    </template>

                    <template v-slot:after>
                      <q-btn
                        round
                        outline
                        size="xs"
                        color="secondary"
                        icon="add"
                        @click.prevent="addToCart(item)"
                      />
                    </template>
                  </q-field>

                  <q-btn round flat size="sm" @click.prevent="deleteCart(item)">
                    <q-icon color="secondary" size="xs" name="delete"></q-icon>
                  </q-btn>
                </div>
              </div>
            </q-card-section>
          </q-card-section>
        </q-card>
      </q-card>
      <q-card class="no-border no-shadow card-footer q-px-md">
        <q-card-section>
          <div class="row">
            <div class="col self-center">
              <span class="text-secondary text-subtitle1 text-weight-bold">Cart Total</span>
            </div>
            <div class="col">
              <span
                style="float: right"
                class="text-secondary text-weight-bold text-subtitle1"
              >{{ formatRupiah(total) }}</span>
            </div>
          </div>
        </q-card-section>
      </q-card>
      <div class="row">
        <div class="col-12 justify-center align-center text-center q-pa-md">
          <q-btn
            color="primary"
            class="primary-text text-h6 full-width"
            @click.prevent="openCheckout()"
          >
            <span class="text-info text-normal text-h6">Proceed to Checkout</span>

            <q-icon class="q-py-xs q-ml-md" color="info" size="xs" name="arrow_forward_ios"></q-icon>
          </q-btn>
        </div>
      </div>
    </q-scroll-area>
  </q-drawer>
  <q-overlay v-model="loadCart" :no-scroll="true" :z-index="5000">
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
import axios from "axios";
import { QOverlay } from "@quasar/quasar-ui-qoverlay";
import { Notify } from "quasar";

export default {
  name: 'cart-component',
  components: {
    QOverlay,
  },
  data: () => ({
    loadCart: false,
    width: 500,
    //drawerRight: false,

  }),


  methods: {
    onResize() {
      if (window.innerWidth > 960) {
        this.width = 500;
      } else {
        this.width = window.innerWidth;
      }
    },
    closeCart() {
      this.$store.commit("cart/openCart", false);
    },
    openCheckout() {
      if (this.cart.some(item => item.status === "Not Available")) {
        Notify.create({
          message: "Oops! Some of Products are currently unavailable",
          group: false,
        });

        return
      }
      if (this.cart.length == 0) {
        Notify.create({
          message: "Oops! Cart is Empty",
          group: false,
        });
        return
      }
      if (this.$store.getters["auth/isLoggedIn"] === false) {
        this.$router.push({ path: "/login" })
        return
      }


      this.$store.commit("cart/openCart", false);
      this.$router.push("checkout");
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

    addToCart(item) {
      this.loadCart = true;
      let endpooint = "add_to_cart.php";
      let token =
        "eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2NDg1MDcwNTIsInN1YiI6ImVLYXJ0IEF1dGhlbnRpY2F0aW9uIiwiaXNzIjoiZUthcnQifQ.dcdE_rrGdj9jN4z-HmBu1lsO2PH3OkX1r0o63DvIkIo";

      const url = "http://smartgold.blazeaisolutions.com/api/" + endpooint;
      let data = new FormData();
      data.append("accesskey", "90336");
      data.append("user_id", this.$store.getters["auth/getUserId"]);
      data.append("product_id", item.product_id);
      data.append("quantity", parseInt(item.quantity) + 1);
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      axios
        .post(url, data, {
          headers: headers,
        })
        .then((response) => {
          this.$store.dispatch("cart/updateCart", {
            user_id: this.$store.getters["auth/getUserId"]
          })
          this.loadCart = false;
        })
        .catch((err) => {
          this.loadCart = false;
        });
    },
    removeToCart(item) {
      if (item.quantity > 1) {
        this.loadCart = true;
        let endpooint = "add_to_cart.php";
        let token =
          "eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2NDg1MDcwNTIsInN1YiI6ImVLYXJ0IEF1dGhlbnRpY2F0aW9uIiwiaXNzIjoiZUthcnQifQ.dcdE_rrGdj9jN4z-HmBu1lsO2PH3OkX1r0o63DvIkIo";

        const url = "http://smartgold.blazeaisolutions.com/api/" + endpooint;
        let data = new FormData();
        data.append("accesskey", "90336");
        data.append("user_id", this.$store.getters["auth/getUserId"]);
        data.append("product_id", item.product_id);
        data.append("quantity", parseInt(item.quantity) - 1);
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };
        axios
          .post(url, data, {
            headers: headers,
          })
          .then((response) => {
            this.$store.dispatch("cart/updateCart", {
              user_id: this.$store.getters["auth/getUserId"]
            })
            this.loadCart = false;
          })
          .catch((err) => {
            this.loadCart = false;
          });
      }
    },

    deleteCart(item) {
      if (item.quantity > 0) {
        this.loadCart = true;
        let endpooint = "remove_cart_item.php";
        let token =
          "eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2NDg1MDcwNTIsInN1YiI6ImVLYXJ0IEF1dGhlbnRpY2F0aW9uIiwiaXNzIjoiZUthcnQifQ.dcdE_rrGdj9jN4z-HmBu1lsO2PH3OkX1r0o63DvIkIo";

        const url = "http://smartgold.blazeaisolutions.com/api/" + endpooint;
        let data = new FormData();
        data.append("accesskey", "90336");
        data.append("user_id", this.$store.getters["auth/getUserId"]);
        data.append("cart_id", item.id);

        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };
        axios
          .post(url, data, {
            headers: headers,
          })
          .then((response) => {
            console.log(response)
            this.$store.dispatch("cart/updateCart", {
              user_id: this.$store.getters["auth/getUserId"]
            })
            this.loadCart = false;
          })
          .catch((err) => {
            this.loadCart = false;
          });
      }
    },
  },
  mounted() {
    //this.drawerRight = this.$store.getters["cart/getStateOpenCart"]
    this.onResize();
    window.addEventListener("resize", this.onResize);


  },
  computed: {
    total() {
      return this.cart.reduce((sum, value) => sum + value.discounted_price, 0);
    },
    cart() {
      return this.$store.getters["cart/getCart"];
    },
    drawerRight() {
      return this.$store.getters["cart/getStateOpenCart"]
    }
  },

};
</script>
<style src="@quasar/quasar-ui-qoverlay/dist/index.css"></style>
<style>
.card_cart {
  height: 68vh;
  max-height: 68vh;
  overflow: auto;
}
.card-footer {
  border-bottom-left-radius: 0px;
  border-bottom-right-radius: 0px;
  height: 60px;
}
.img-cart {
  height: 100% !important;
  width: 110px !important;
  border-radius: 5px;
  box-shadow: 0 1px 1px rgb(0 0 0 / 10%), 0px 1px 0px rgb(0 0 0 / 10%),
    0 1px 1px 0px rgb(0 0 0 / 10%), 0 0px 1px 1px rgb(0 0 0 / 10%);
}
.content-cart {
  width: calc(100% - 110px) !important;
}
.input-cart {
  margin: 0px 0px 0px 0px;
  max-width: 75px;
}
.close-fixed {
  position: absolute;
  top: 15px;
  left: 15px;
}
.sold_out {
  height: 50px;
  width: 50px;
  position: absolute;
  top: 0;
  right: 10px;
}
.name_cart {
  max-width: 260px;
  line-height: 1;
  max-height: 2;
  overflow: hidden;
  display: block;
  display: -webkit-box;

  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
}
@media screen and (max-width: 600px) {
  .sold_out {
    height: 40px !important;
    width: 40px !important;
    position: absolute;
    top: 0;
    right: 5px;
  }
  .name_cart {
    max-width: 170px;
    line-height: 1;
    max-height: 2;
    overflow: hidden;
    display: block;
    display: -webkit-box;

    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
  }
}
</style>
