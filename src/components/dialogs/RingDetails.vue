<template>
  <q-dialog
    persistent
    @keydown.esc="cancel"
    v-model="dialog"
    :max-width="options.width"
    :style="{ zIndex: options.zIndex }"
    full-height

    
  >
    <q-card square class="q-dialog-plugin bg-white ">
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

      <q-btn flat round class="cart-fixed" @click.prevent="openCart()">
        <q-icon color="primary" size="lg" name="shopping_bag"></q-icon>
        <q-badge v-if="quantityCart>0" style="background:#0277BD !important;" floating>{{quantityCart}}</q-badge>
      </q-btn>
      <div class="row justify-center q-mt-lg" style="height: 48px">
        <div class="col-12 text-center">
          <p
            class="text-h6 q-my-none"
            style="padding: 0px 70px 0px 70px; overflow: hidden;text-overflow: ellipsis;display: -webkit-box;line-clamp: 2;-webkit-box-orient: vertical; -webkit-line-clamp: 2; line-height: 1"
          >{{ product.name }}</p>
        </div>
      </div>
      <q-separator></q-separator>
      <q-card-section class="q-py-none scroll content-ring"  >
        <div class="row justify-center q-my-lg text-center">
          <q-img no-spinner fit="contain" :src="product.image" class="ring-img-dialog" />
        </div>
        <div class="row justify-center q-my-none text-center">
          <span class="text-secondary text-weight-bold">*Weight and Price may vary subject to the stock available.</span>
        </div>
        <q-separator color="info" class="q-mx-md" />
        <q-card-section class="q-pa-xs q-px-md">
          <p class="q-my-none">
            <span class="text-subtitle1 text-weight-bold">Sold By</span>
          </p>
          <p class="q-my-none">
            <span class="text-subtitle2  text-weight-bold" style="color:#0277BD !important">
              {{
                product.store_name
              }}
            </span>
          </p>
        </q-card-section>
        <q-separator color="info" class="q-mx-md" />

        <q-card-section class="q-pa-xs q-px-md">
          <p class="q-my-none">
            <span class="text-subtitle1 text-info">{{ product.name }}</span>
          </p>

          <p class="q-my-sm">
            <span class="text-subtitle1 text-info text-strike">
              {{
                formatRupiah(product.price)
              }}
            </span>
            <span class="text-subtitle1 q-ml-md text-weight-bold"  >
              {{
                formatRupiah(product.discounted_price)
              }}
            </span>
          </p>
        </q-card-section>

        <q-card-section class="q-pa-xs q-px-md q-ma-none">
          <q-chip outline color="orange" text-color="white" v-if="product.gender!=null">
           {{product.gender}}
          </q-chip>
          <q-chip outline color="orange" text-color="white">
           Gross weight {{product.weight}} gm
          </q-chip>
        </q-card-section>
                <q-card-section class="q-pa-xs q-px-md">
          <p class="q-my-none">
            <span class="text-subtitle1 text-info">
              {{
                product.description
              }}
            </span>
          </p>
        </q-card-section>
        <q-card-section align="start" class="q-py-md q-pt-sm row q-mt-md">
          <q-input
            bg-color="primary"
            input-class="text-center"
            color="info"
            class="text-info"
            readonly
            standout
            v-model="quantity"
          >
            <template v-slot:prepend>
              <q-btn
                size="lg"
                class="q-py-sm"
                text-color="info"
                dense
                flat
                icon="remove"
                @click.prevent="removeQuantity()"
              />
            </template>

            <template v-slot:append>
              <q-btn
                size="lg"
                class="q-py-sm"
                text-color="info"
                dense
                flat
                icon="add"
                @click.prevent="addQuantity()"
              />
            </template>
          </q-input>
        </q-card-section>
      </q-card-section>
      <q-separator></q-separator>
      <q-card-actions class="block q-px-md q-pb-md q-pt-none">
        <div class="row q-px-md q-py-md">
          <div class="col-6 text-start">
            <span class="text-secondary text-weight-bold text-subtitle1">Total price</span>
          </div>
          <div class="col-6 text-right">
            <span class="text-secondary text-weight-bold text-subtitle1">
              {{
                formatRupiah(totalPrice)
              }}
            </span>
          </div>
        </div>
        <div class="row q-px-md">
          <div class="col-12">
            <q-btn
              class="full-width"
              size="lg"
              color="primary"
              text-color="info"
              @click.prevent="addToCart()"
              :loading="loadCart"
            >ADD TO CART</q-btn>
          </div>
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import axios from "axios";
export default {
  name: 'ring-details-component',
  mounted() { },
  data: function () {
    return {
      size: null,
      color: null,
      loadCart: false,

      dialog: false,
      resolve: null,
      reject: null,

      product: { name: "" },
      quantity: 1,
      options: {
        color: "primary",
        width: 700,
        zIndex: 2000,
        noconfirm: false,
      },
    };
  },
  methods: {
    open(product, options) {
      this.$store.commit("cart/openCart", false);
      this.dialog = true;
      this.product = product;
      //console.log(product)
      this.quantity = 1;
      this.options = Object.assign(this.options, options);

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
    openCart() {
      this.dialog = false;
      this.$store.commit("cart/openCart", true);
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
    addQuantity() {
      this.quantity++;
    },
    removeQuantity() {
      if (this.quantity > 1) {
        this.quantity--;
      }
    },
    addToCart() {
      if (this.$store.getters["auth/getUserId"] != '' && this.$store.getters["auth/getUserId"] != null) {
        this.loadCart = true;
        let endpooint = "add_to_cart.php";
        let token =
          "eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2NDg1MDcwNTIsInN1YiI6ImVLYXJ0IEF1dGhlbnRpY2F0aW9uIiwiaXNzIjoiZUthcnQifQ.dcdE_rrGdj9jN4z-HmBu1lsO2PH3OkX1r0o63DvIkIo";

        const url = "https://smartgold.blazeaisolutions.com/api/" + endpooint;
        let data = new FormData();
        data.append("accesskey", "90336");
        data.append("product_id", this.product.id);
        data.append("user_id", this.$store.getters["auth/getUserId"]);
        data.append("quantity", this.quantity);
        //console.log(this.quantity)
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };
        axios
          .post(url, data, {
            headers: headers,
          })
          .then((response) => {

            this.loadCart = false;
            this.$store.dispatch("cart/updateCart", {
              user_id: this.$store.getters["auth/getUserId"]
            })
            this.$store.commit("cart/openCart", true);
            this.resolve(true);
            this.dialog = false;
          })
          .catch((err) => {
            this.loadCart = false;
          });
        return;
      }

      this.$router.push({ path: "/login" });
    },
  },
  computed: {
    totalPrice() {
      return this.quantity * this.product.discounted_price;
    },
    quantityCart(){
      return this.$store.getters["cart/getQuantityCart"]
    }
  },
};
</script>

<style scoped>
.content-ring{
  max-height: calc( 100% - 200px);
}

.q-dialog-plugin {
  width: 500px;
}
.q-dialog__inner--minimized {
  padding: 90px 0px 90px 0px !important;
}
@media (max-width: 600px) {
  .q-dialog-plugin {
     width: 100% !important;
     height: 100% !important;
  }
  .q-dialog__inner--minimized {
    padding: 0px 0px 0px 0px !important;
  }

} 
.ring-img-dialog {
  height: 160px;
  width: 100%;
}
.select-ring-size {
  max-width: 150px;
}
.close-fixed {
  position: absolute;
  top: 20px;
  left: 15px;
}
.cart-fixed {
  position: absolute;
  top: 15px;
  right: 15px;
}
</style>
