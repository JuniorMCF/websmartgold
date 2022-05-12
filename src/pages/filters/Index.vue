<template>
  <q-page class="v-main">
    <div class="row q-px-none justify-center q-pt-md q-mx-none content-wrap">
      <div class="col-md-10 col-12 q-px-md q-mx-none">
        <q-toolbar-title class="text-black text-weight-bold text-h6">{{ name }}</q-toolbar-title>
      </div>
    </div>

    <div class="row justify-center q-py-md q-px-none q-mx-none content-wrap">
      <div class="col-md-10 col-12 q-px-sm self-center q-mx-md">
        <div class="row q-col-gutter-x-md q-col-gutter-y-md">
          <div
            class="col-6 col-md-4 col-lg-3 col-xl-3"
            v-for="(ring, i) in rings"
            :key="'ring' + i"
          >
            <q-card
              v-ripple
              class="my-card shadow-2 cursor-pointer q-hoverable"
              @click.prevent="showDetails(ring)"
            >
              <q-img :src="ring.image" :alt="ring.name" class="my-card-img" fit="contain"></q-img>

              <q-card-section class="text-start my-card-desc-2">
                <span class="text-info">{{ ring.name }}</span>
                <p class="text-weight-bold q-my-none">
                  <span>{{ formatRupiah(ring.discounted_price) }}</span>
                </p>
              </q-card-section>
            </q-card>
          </div>
        </div>
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
  <RingDetails ref="ringDetails"></RingDetails>
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

import RingDetails from "src/components/dialogs/RingDetails.vue";
import { ref } from "vue";
import { QOverlay } from "@quasar/quasar-ui-qoverlay";
import axios from "axios";
export default {
  name: 'filters-component',
  components: {
    RingDetails,
    QOverlay
  },
  data: () => ({
    load: false,
    name: "Results",
    rings: [],
  }),
  mounted() {
    //this.name = this.$route.params.category_id
    //console.log(this.$route.params.id);
    this.getData();
  },
  setup() {
    return {
      tab: ref("mails"),
    };
  },
  methods: {
    getURL(foto) {
      return foto;
    },
    openDetails() {
      this.$refs.ringDetails.open().then((res) => {
        if (res) {
          console.log("hola");
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
        .replace("Rp", "£");
    },
    getData() {
      this.load = true
      let endpooint = "filter_products.php";
      let token =
        "eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2NDg1MDcwNTIsInN1YiI6ImVLYXJ0IEF1dGhlbnRpY2F0aW9uIiwiaXNzIjoiZUthcnQifQ.dcdE_rrGdj9jN4z-HmBu1lsO2PH3OkX1r0o63DvIkIo";

      const url = "http://smartgold.blazeaisolutions.com/api/" + endpooint;
      let data = new FormData();
      data.append("accesskey", "90336");
      data.append("from_price_range", this.$route.params.price_min);
      data.append("to_price_range", this.$route.params.price_max);
      data.append("sort", this.$route.params.sort);
      data.append("category_id", this.$route.params.category_id);


      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,

      };
      axios
        .post(url, data, {
          headers: headers,
        })
        .then((response) => {
          if (response.data.success == true) {
            console.log(response.data);
            this.rings = response.data.data;
          }
          this.load = false
        })
        .catch((err) => {
          this.load = false
        });
    },
    showDetails(product) {
      //console.log(product);
      this.$refs.ringDetails.open(product).then((res) => {
        if (res) {
        }
      });
    },
  },

};
</script>

<style>
.my-card {
  width: 100%;
}
.my-card-img {
  height: 200px;
}

.my-card-desc-2 {
  height: 90px;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.2;
  padding: 16px;
}
</style>
