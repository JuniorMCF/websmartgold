<template>
  <q-page class="v-main">
    <div class="row q-px-none justify-center q-py-md q-mx-none content-wrap">
      <div class="col-md-10 col-12 q-px-md q-mx-none text-center">
        <q-btn
          flat
          outlined
          size="md"
          color="white"
          class="bg-primary q-px-sm q-py-sm text-center shadow-0 q-my-sm"
          @click.prevent="back()"
          style="float: left"
        >
          <q-icon class="q-ml-sm" name="arrow_back_ios"></q-icon>
        </q-btn>
        <q-card
          v-ripple
          class="image-nearby cursor-pointer q-mt-xs shadow-0"
          @click.prevent
          style="float: right"
        >
          <q-img
            src="~assets/app/filter_icon.png"
            class="image-nearby"
            fit="contain"
            no-spinner
            @click.prevent="openFilter()"
          ></q-img>
        </q-card>
        <q-toolbar-title
          class="text-black text-weight-bold text-h6 q-py-sm q-mt-xs"
          >Nearby Stores</q-toolbar-title
        >
      </div>
    </div>
    <div class="row q-px-none justify-center q-pt-md q-mx-none content-wrap">
      <div class="col-md-10 col-12 q-px-md q-mx-none text-center">
        <div class="row q-mb-lg">
          <q-input
            class="full-width"
            color="orange"
            bg-color="light"
            outlined
            square
            v-model="search"
            label="Search..."
            @keydown.enter.prevent="search()"
          >
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
        <div class="row q-col-gutter-x-md q-col-gutter-y-md">
          <div
            class="col-6 col-sm-4 col-md-4 col-lg-3"
            v-for="(store, index) in stores"
            :key="'store' + index"
          >
            <q-card
              v-ripple
              class="my-card shadow-2 cursor-pointer q-hoverable"
              @click.prevent="openProductsByCategory(store)"
            >
              <q-img
                :src="store.logo"
                :alt="store.name"
                class="my-card-img"
                fit="contain"
                no-spinner
              ></q-img>

              <q-card-section
                class="
                  q-px-lg
                  text-center
                  my-card-desc
                  row
                  justify-center
                  align-center
                "
              >
                <span class="text-info text-weight-bold">{{ store.store_name }}</span>
              </q-card-section>
            </q-card>
          </div>
        </div>
        
      </div>
    </div>
  </q-page>
  <CategoryListAvailable ref="categoryListAvailable"></CategoryListAvailable>

  <NearbyFilter ref="nearbyFilter"></NearbyFilter>
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
import CategoryListAvailable from "src/components/dialogs/CategoryListAvailable.vue";
import { QOverlay } from "@quasar/quasar-ui-qoverlay";
import NearbyFilter from "../../components/dialogs/NearbyFilter.vue";
export default {
  name: "nearbystores-component",
  components: {
    CategoryListAvailable,
    QOverlay,
    NearbyFilter
},
  data: () => ({
    load: false,
    stores: [],
    stores_fixed: [],
    search: null,
    latitude:'',
    longitude:'',
    range_to:''
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
      let endpooint = "getsellers.php";
      const url = "https://smartgold.blazeaisolutions.com/api/" + endpooint;
      const data = new FormData();
      data.append("accesskey", "90336");
      data.append("latitude", this.latitude);
      data.append("longitude", this.longitude);
      data.append("range_to", this.range_to);
      let token =
        "eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2NDg1MDcwNTIsInN1YiI6ImVLYXJ0IEF1dGhlbnRpY2F0aW9uIiwiaXNzIjoiZUthcnQifQ.dcdE_rrGdj9jN4z-HmBu1lsO2PH3OkX1r0o63DvIkIo";
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      axios
        .post(url, data, {
          headers: headers,
        })
        .then((res) => {
          this.stores = res.data.data;
          this.stores_fixed = res.data.data;
          this.load = false;
        })
        .catch((errors) => {
          this.load = false;
        });
    },
    openFilter() {
      this.$refs.nearbyFilter.open().then(res=>{
        console.log(res)
        if(res.success==true){
          this.latitude = res.latitude
          this.longitude = res.longitude
          this.range_to = res.to
          this.getData()
        }
      }).catch(err=>{

      })
    },
    /*openCategoryListAvailable(store) {
      this.$refs.categoryListAvailable.open(store).then((res) => {
        if (res) {
        }
      });
    },*/
        openProductsByCategory(store){
         this.$router.push({ name: "store-products" ,params:{
           id:store.id,
           store_name:store.name
         }});
    },
    back() {
      this.$router.push({ path: "/home" });
    },
  },
  watch: {
    search(value) {
      //console.log(value);

      if (value == "" || value == null) {
        this.stores = this.stores_fixed;
        return;
      }

      const result = this.stores.filter((s) => {
        return (
          !value.length ||
          s.store_name.toLowerCase().includes(value.toLowerCase()) ||
          (s.store_name ? s.store_name : "")
            .toLowerCase()
            .includes(value.toLowerCase())
        );
      });

      if(result != null){
        this.stores = result
      }else{
        this.stores = this.stores_fixed;
      }
    },
  },
};
</script>

<style>
.q-gutter-x-sm > *,
.q-gutter-sm > * {
  margin-left: 0px !important;
}
.image-nearby {
  display: inline-flex;
  height: 50px;
  width: 50px;
  border-radius: 5px;
}
.my-card {
  width: 100%;
  max-width: 300px;
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
