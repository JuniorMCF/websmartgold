<template>
  <q-page class="v-main q-py-md">
    <div class="row q-px-none justify-center q-pt-md q-mx-none content-wrap">
      <div class="col-md-10 col-12 q-px-md q-mx-none">
        <q-toolbar-title class="text-black text-weight-bold text-h6">{{store_name}}</q-toolbar-title>
      </div>
    </div>
    <div class="row q-px-none justify-center content-wrap q-pt-md " v-show="empty" :class="empty === true ? 'empty_order':''">
      <div class="col-12 col-md-10 q-px-none">
        <q-img
            fit="contain"
            src="~assets/app/empty_order.jpg"
         
            class="empty_order"
            no-spinner
          ></q-img>
          <p class="text-primary text-center text-h6 text-weight-bold">No Products Found</p>
      </div>
    </div>

    <div class="row q-px-none justify-center content-wrap q-pt-md">
      <div class="col-12 col-md-10 q-px-none">
        <div class="row q-col-gutter-x-md q-col-gutter-y-md">
          <div
            class="col-6 col-sm-4 col-md-4 col-lg-3"
            v-for="(product, index) in products"
            :key="'store' + index"
          >
            <q-card
              v-ripple
              class="shadow-2 cursor-pointer q-hoverable"
              @click.prevent="showDetails(product)"
            >
              <q-img
                :src="product.image"
                :alt="product.name"
                class="my-card-img"
                fit="contain"
                no-spinner
              ></q-img>

              <q-card-section class="text-start my-card-desc-2">
                <span class="text-info">{{ product.name }}</span>
                <p class="text-weight-bold q-my-none">
                  <span>{{ formatRupiah(product.discounted_price) }}</span>
                </p>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </div>
    <RingDetails ref="ringDetails"></RingDetails>
   

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
import { ref } from "vue";

import axios from "axios";
import RingDetails from "src/components/dialogs/RingDetails.vue";

import { QOverlay } from "@quasar/quasar-ui-qoverlay";

export default {
  name: "store-products-component",
  components: { RingDetails, QOverlay },
  data: () => ({
    empty:false,
    product: null,
    text: "",
    settings: {
      itemsToShow: 1,
      snapAlign: "center",
    },
    breakpoints: {
      // 700px and up
      700: {
        itemsToShow: 5,
        snapAlign: "center",
      },
      // 1024 and up
      1024: {
        itemsToShow: 7,
        snapAlign: "center",
      },
    },
    load: false,
    categorias: [],
    banners: [],
    stores: [],
    products: [],
    store_name:""
  }),
  mounted() {
    if (!this.$store.getters["auth/getOtp"]) {
      this.$store.dispatch("auth/setLoggedIn", false);
      this.$store.dispatch("auth/signOut");
    }
    //console.log(this.$store.getters["auth/getUserId"]);
    this.getData();
    this.store_name = this.$route.params.store_name
  },
  methods: {
    getData() {
      this.load = true;
      //let endpooint1 = "banner-list.php";
      //let endpooint2 = "categorylist.php";
      //let endpooint3 = "getsellers.php";
      let endpooint4 = "productlist-seller.php";
      //const url1 = "https://smartgold.blazeaisolutions.com/api/" + endpooint1;
      //const url2 = "https://smartgold.blazeaisolutions.com/api/" + endpooint2;
      //const url3 = "https://smartgold.blazeaisolutions.com/api/" + endpooint3;
      const url4 = "https://smartgold.blazeaisolutions.com/api/" + endpooint4;

      const data1 = new FormData();
      data1.append("accesskey", "90336");
       data1.append("seller_id", this.$route.params.id);
      /*
      const data3 = new FormData();
      data3.append("accesskey", "90336");
      data3.append("latitude", "");
      data3.append("longitude", "");
      data3.append("range_to", "");*/
      let token =
        "eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2NDg1MDcwNTIsInN1YiI6ImVLYXJ0IEF1dGhlbnRpY2F0aW9uIiwiaXNzIjoiZUthcnQifQ.dcdE_rrGdj9jN4z-HmBu1lsO2PH3OkX1r0o63DvIkIo";
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      axios
        .all([
          /*axios.post(url1, data1, {
            headers: headers,
          }),
          axios.post(url2, data1, {
            headers: headers,
          }),*/
          /*axios.post(url3, data3, {
            headers: headers,
          }),*/
          axios.post(url4, data1, {
            headers: headers,
          }),
        ])
        .then(
          axios.spread((...responses) => {
            /*const res1 = responses[0].data;
            this.banners = res1.data;

            const res2 = responses[1].data;
            this.categorias = res2.data;*/

            /*const res3 = responses[2].data;
            this.stores = res3.data;
            */
            const res4 = responses[0].data;
            this.products = res4.data;

            if(this.products.length == 0){
              this.empty = true
            }

            this.load = false;
          })
        )
        .catch((errors) => {
          this.empty = true
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
    showDetails(product) {
      //console.log(product);
      this.$refs.ringDetails.open(product).then((res) => {
        if (res) {
        }
      });
    },
  },
  watch: {
    product(newValue, oldValue) {
      this.$refs.ringDetails.open(newValue);
    },
  },

  setup() {
    return {
      slide: ref(1),
      tab: ref("active"),
    };
  },
};
</script>

<style scoped>
.carousel {
  max-height: 520px !important;
}
.carousel__prev,
.carousel__next {
  background: white !important;
  color: #401410;
}

.my-card {
  width: 100%;
}
.my-card-img {
  height: 200px;
}
.my-card-desc {
  height: 50px;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1;
}
.my-card-desc-2 {
  height: 90px;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.2;
  padding: 16px;
}
.card_img {
  width: 300px;
}
.carousel__slide > .carousel__item {
  transform: scale(1);
  opacity: 0.5;
  transition: 0.5s;
}
.carousel__slide--visible > .carousel__item {
  opacity: 1;
  transform: rotateY(0);
}
.carousel__slide--next > .carousel__item {
  transform: scale(0.9) translate(-10px);
}
.carousel__slide--prev > .carousel__item {
  transform: scale(0.9) translate(10px);
}
.carousel__slide--active > .carousel__item {
  transform: scale(1.01);
}

.q-field--outlined .q-field__control {
  border-radius: 15px;
  padding: 0 20px;
}
.custom_input {
  max-width: calc(100% - 68px);
  background: #f8f3ef;
  box-shadow: 3px 3px rgba(0, 0, 0, 0.16);
  border-radius: 0px;
}
.img_tab {
  height: 80px;
  width: 80px;
  margin: 0 auto;
}
.tab-start {
  justify-content: start !important;
}
.custom-carousel {
  height: 500px;
}
.empty_order {
  height: 400px;
}
@media screen and (max-width: 960px) {
  .empty_order {
    height: 400px;
  }
}

@media screen and (max-width: 960px) {
  .custom-carousel {
    height: 220px;
  }

  .carousel__prev,
  .carousel__next {
    background: white !important;
    color: #401410;
    display: none !important;
  }
  .img_tab {
    height: 60px;
    width: 60px;
    margin: 0 auto;
  }
  .my-card-img {
    height: 150px;
  }
  .my-card-desc {
    height: 50px;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1;
    padding: 10px !important;
  }

  .my-card-desc-2 {
    height: 90px;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.2;
    padding: 10px;
  }
}

.q-tab__label {
  font-size: 1.1rem;
  text-transform: none;
}
.q-tab--inactive {
  color: #f2b5a7;
}
.size-btn {
  width: 361px;
  font-size: 1.2rem !important;
}

.my-card {
  width: 100% !important;
}
</style>
