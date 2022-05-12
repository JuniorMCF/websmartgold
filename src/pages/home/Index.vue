<template>
  <q-page class="v-main q-py-md">
    <div class="row justify-center content-wrap q-pt-sm">
      <div class="col-md-10 col-12 q-px-sm">
        <q-input
          class="custom_input"
          color="orange"
          bg-color="light"
          outlined
          square
          v-model="text"
          label="Search..."
          @keydown.enter.prevent="search()"
        >
          <template v-slot:append>
            <q-avatar>
              <q-icon size="1.7em" color="info" name="search"></q-icon>
            </q-avatar>
          </template>
        </q-input>
        <q-card
          v-ripple
          class="cursor-pointer q-my-xs shadow-0"
          @click.prevent="openFilter()"
          style="height:56px; width:56px;float:right;margin-top:-56px"
        >
          <q-img src="~assets/app/filter_icon.png" fit="contain"></q-img>
        </q-card>
      </div>
    </div>

    <div class="row justify-center content-wrap">
      <div class="col-md-10 col-12 q-px-sm">
        <q-carousel
          autoplay
          class="custom-carousel"
          animated
          v-model="slide"
          arrows
          navigation
          infinite
        >
          <q-carousel-slide
            :name="index"
            class="column no-wrap flex-center q-px-none"
            v-for="(item, index) in banners"
            :key="'banner' + index"
          >
            <q-img :src="item.imgUrl" ratio="1"></q-img>
          </q-carousel-slide>
        </q-carousel>
      </div>
    </div>

    <div class="row q-px-none justify-center q-py-md content-wrap">
      <div class="col-12 col-md-10 q-px-none text-center q-px-sm">
        <q-btn
          size="md"
          square
          class="text-info q-px-lg bg-primary full-width q-py-sm"
          label="Buy a gold in a smart way"
          text-color="info"
          link
          to="/smart-shop"
        />
      </div>
    </div>

    <div class="row justify-center content-wrap">
      <div class="col-12 col-md-10">
        <span class="q-px-sm text-secondary text-h6">Shop by Category</span>
      </div>
    </div>

    <div class="row q-px-none justify-center q-py-md content-wrap">
      <div class="col-12 col-md-10 q-px-none">
        <q-tabs
          id="categorys"
          v-model="tab"
          inline-label
          mobile-arrows
          align="justify"
          class="bg-white text-primary shadow-0"
          v-touch-swipe.mouse.left="handleSwipeRight"
          v-touch-swipe.mouse.right="handleSwipeLeft"
        >
          <q-tab
            style="min-width:180px"
            class="q-mx-md bg-primary text-white q-pl-sm q-pr-md tab-start"
            v-for="(categoria, index) in categorias"
            :key="'categoria' + index"
            @click.prevent="goToCategory(categoria)"
          >
            <div
              style="
                height: 60px;
                width: 60px;
                background: white;
                border-radius: 10px;
              "
              class="q-mr-md"
            >
              <q-img style="border-radius: 10px" fit="contain" :src="categoria.image" ratio="1"></q-img>
            </div>

            <span class="text-weight-bold text-info text-normal">{{ categoria.name }}</span>
          </q-tab>
        </q-tabs>
      </div>
    </div>

    <div class="row justify-center q-my-md content-wrap">
      <div class="col-12 col-md-10">
        <span class="q-px-sm text-secondary text-h6">Shop by Store</span>
      </div>
    </div>

    <div class="row q-px-none justify-center q-py-md content-wrap">
      <div class="col-12 col-md-10 q-px-none">
        <div class="row q-col-gutter-x-md q-col-gutter-y-md">
          <div
            class="col-6 col-sm-4 col-md-4 col-lg-3"
            v-for="(store, index) in stores"
            :key="'store' + index"
          >
            <q-card
              v-ripple
              class="shadow-2 cursor-pointer q-hoverable"
              @click.prevent="openCategoryListAvailable(store)"
            >
              <q-img :src="store.logo" :alt="store.name" class="my-card-img" fit="contain"></q-img>

              <q-card-section
                class="q-px-lg text-center my-card-desc row justify-center align-center"
              >
                <span class="text-info text-weight-bold">{{ store.name }}</span>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </div>

    <!--button floating-->

    <div class="row q-px-none justify-center q-py-md content-wrap">
      <div class="col-12 col-md-10 q-px-none text-center q-px-sm">
        <q-btn
          size="md"
          square
          class="text-info q-px-lg bg-primary full-width"
          label="Find nearby stores"
          text-color="info"
          @click.prevent="openNearbyStores()"
        />
      </div>
    </div>

    <div class="row justify-center q-my-md content-wrap">
      <div class="col-12 col-md-10">
        <span class="q-px-sm text-secondary text-h6">All products</span>
      </div>
    </div>

    <div class="row q-px-none justify-center content-wrap">
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
              <q-img :src="product.image" :alt="product.name" class="my-card-img" fit="contain"></q-img>

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
    <CategoryListAvailable ref="categoryListAvailable"></CategoryListAvailable>
    <OpenFilters ref="openFilters"></OpenFilters>
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

import axios from "axios";
import RingDetails from "src/components/dialogs/RingDetails.vue";
import CategoryListAvailable from "src/components/dialogs/CategoryListAvailable.vue";
import { QOverlay } from "@quasar/quasar-ui-qoverlay";
import OpenFilters from "src/components/dialogs/OpenFilters.vue";
export default {
  name: 'home-component',
  components: { RingDetails, CategoryListAvailable, QOverlay, OpenFilters },
  data: () => ({
    text: '',
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
  }),
  mounted() {
    //console.log(this.$store.getters["auth/getUserId"]);
    this.getData();
  },
  methods: {
    handleSwipeRight({ evt, ...newInfo }) {

    },
    handleSwipeLeft({ evt, ...newInfo }) {

    },
    getData() {
      this.load = true
      let endpooint1 = "banner-list.php";
      let endpooint2 = "categorylist.php";
      let endpooint3 = "getsellers.php";
      let endpooint4 = "allproducts.php";
      const url1 = "http://smartgold.blazeaisolutions.com/api/" + endpooint1;
      const url2 = "http://smartgold.blazeaisolutions.com/api/" + endpooint2;
      const url3 = "http://smartgold.blazeaisolutions.com/api/" + endpooint3;
      const url4 = "http://smartgold.blazeaisolutions.com/api/" + endpooint4;

      const data1 = new FormData();
      data1.append("accesskey", "90336");

      const data3 = new FormData();
      data3.append("accesskey", "90336");
      data3.append("latitude", "");
      data3.append("longitude", "");
      data3.append("range_to", "");
      let token =
        "eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2NDg1MDcwNTIsInN1YiI6ImVLYXJ0IEF1dGhlbnRpY2F0aW9uIiwiaXNzIjoiZUthcnQifQ.dcdE_rrGdj9jN4z-HmBu1lsO2PH3OkX1r0o63DvIkIo";
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      axios
        .all([
          axios.post(url1, data1, {
            headers: headers,
          }),
          axios.post(url2, data1, {
            headers: headers,
          }),
          axios.post(url3, data3, {
            headers: headers,
          }),
          axios.post(url4, data1, {
            headers: headers,
          }),
        ])
        .then(
          axios.spread((...responses) => {
            const res1 = responses[0].data;
            this.banners = res1.data;

            const res2 = responses[1].data;
            this.categorias = res2.data;

            const res3 = responses[2].data;
            this.stores = res3.data;

            const res4 = responses[3].data;
            this.products = res4.data;
            this.load = false
          })
        )
        .catch((errors) => {
          this.load = false
        });
    },
    search() {
      this.load = true
      let endpooint = "search_products.php";
      let token =
        "eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2NDg1MDcwNTIsInN1YiI6ImVLYXJ0IEF1dGhlbnRpY2F0aW9uIiwiaXNzIjoiZUthcnQifQ.dcdE_rrGdj9jN4z-HmBu1lsO2PH3OkX1r0o63DvIkIo";

      const url = "http://smartgold.blazeaisolutions.com/api/" + endpooint;
      let data = new FormData();
      data.append("accesskey", "90336");
      data.append("search_term", this.text);


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
          if (response.data.success == true) {
            //console.log(response.data);
            this.products = response.data.data;
          }
          this.load = false
        })
        .catch((err) => {
          this.load = false
        });
    },
    openFilter() {
      this.$refs.openFilters.open(this.categorias).then(res => {
        if (res) {

        }
      });
    },
    openNearbyStores() {
      this.$router.push({ path: "nearby-stores" })
    },
    goToCategory(category) {
      this.$store.dispatch("products/setCategory", { category: category });
      this.$router.push({
        name: "category",
        params: { id: category.id },
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
    openCategoryListAvailable(store) {
      this.$refs.categoryListAvailable.open(store).then((res) => {
        if (res) {
        }
      });
    }
  },
  setup() {
    return {
      slide: ref(1),
      tab: ref("active"),
    };
  },
};
</script>

<style>
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
