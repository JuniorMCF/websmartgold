<template>
  <q-layout view="hHh lpR fFf" class="shadow-0">
    <q-header class="bg-white q-py-none shadow-2">
      <q-toolbar>
        <q-btn
          v-if="isMobile"
          flat
          @click="drawerLeft = !drawerLeft"
          round
          dense
          icon="menu"
          class="text-info"
        />
        <q-toolbar-title class="text-info text-weight-bold text-h5 q-ml-md">Smart Gold</q-toolbar-title>
        <q-space v-if="!isMobile"></q-space>
        <q-tabs v-model="tab" dense class="bg-white" v-if="!isMobile">
          <q-tab
            :name="link.name"
            :icon="link.icon"
            :label="link.title"
            v-for="(link, index) in linksLogout"
            :key="'logouts' + index"
            @click="openLink(link)"
            class="text-info text-weight-bold bg-white"
          >
            <q-badge
              v-if="link.name === 'shopping_bag' && quantityCart > 0"
              color="red"
              floating
            >{{ quantityCart }}</q-badge>
          </q-tab>
        </q-tabs>
        <q-space v-if="!isMobile"></q-space>
        <q-space v-if="!isMobile"></q-space>
        <div style="width: 48px" class="q-mr-lg-md">
          <q-img src="~assets/app/logo.png" height="48" width="48" :ratio="1" />
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="drawerLeft"
      :width="300"
      :breakpoint="700"
      overlay
      class="bg-white text-secondary shadow-none"
    >
      <q-scroll-area class="fit">
        <q-list>
          <q-item-label header class="row justify-center">
            <q-img src="~assets/app/logo.png" height="200px" width="200px" :ratio="1" />
          </q-item-label>

          <q-list bordered separator>
            <div></div>
            <q-item
              v-for="(item, i) in essentialLinks"
              :key="'links' + i"
              clickable
              v-ripple
              :active="active"
              active-class="text-warning"
              @click="openLink(item)"
            >
              <q-item-section avatar>
                <q-icon :name="item.icon" />
              </q-item-section>
              <q-item-section class="text-info">{{ item.title }}</q-item-section>
              <q-item-section side>
                <q-icon class="text-warning" name="chevron_right" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <Cart></Cart>
  </q-layout>
</template>

<script>
const linksList = [
  {
    title: "Home",
    icon: "home",
    name: "home",
    link: "/home",
    isAuth: false,
  },
  {
    title: "Smart shop",
    icon: "storefront",
    name: "smart_shop",
    link: "/smart-shop",
    isAuth: true,
  },


  {
    title: "Cart",
    icon: "shopping_bag",
    name: "shopping_bag",
    link: "/cart",
    isAuth: false,
  },
  {
    title: "Profile",
    icon: "person",
    name: "profile",
    link: "/profile",
    isAuth: false,
  },
  /*{
    title: "FAQs",
    icon: "question_mark",
    name: "faqs",
    link: "/faqs",
    isAuth: true,
  },*/
  /*{
    title: "Terms",
    icon: "gavel",
    name: "terms",
    link: "/terms",
    isAuth: true,
  },*/
  /*{
    title: "Privacy",
    icon: "security",
    name: "privacy",
    link: "/privacy",
    isAuth: true,
  },*/
];

const linksLogout = [
  {
    title: "Home",
    icon: "home",
    name: "home",
    link: "/home",
    isAuth: false,
  },
  {
    title: "Smart shop",
    icon: "storefront",
    name: "smart_shop",
    link: "/smart-shop",
    isAuth: true,
  },


  {
    title: "Cart",
    icon: "shopping_bag",
    name: "shopping_bag",
    link: "/cart",
    isAuth: false,
  },
  {
    title: "Profile",
    icon: "person",
    name: "profile",
    link: "/profile",
    isAuth: false,
  },
];

import { defineComponent, ref } from "vue";
import Cart from "../components/cart/Cart.vue";
export default defineComponent({
  components: {
    Cart,
  },
  name: "MainLayout",
  data: () => ({
    active: false,
    isMobile: false
  }),
  mounted() {
    this.onResize();
    window.addEventListener("resize", this.onResize);
  },
  computed: {
    close: {
      get() {
        return this.$store.state.cart.opened;
      },
      set(val) {
        this.$store.commit("cart/openCart", val);
      },
    },
  },
  methods: {
    onResize() {
      if (window.innerWidth > 960) {
        this.isMobile = false
      } else {
        this.isMobile = true
      }
    },
    openLink(item) {
      if (item.title == "Cart") {
        if (this.$store.state.cart.opened) {
          this.$store.commit("cart/openCart", false);
        } else {
          this.$store.commit("cart/openCart", true);
        }
        this.drawerLeft = false
      } else {
        this.$router.push({ path: item.link });
        this.drawerLeft = false
        this.$store.commit("cart/openCart", false);
      }
      if (window.innerWidth < 960) {
        this.drawerLeft = false;
      }

    },
  },
  setup() {
    const leftDrawerOpen = ref(false);

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      drawerLeft: ref(false),
      linksLogout: linksLogout,
      tab: ref('home')
    };

  },
  computed: {
    quantityCart() {

      return this.$store.getters["cart/getQuantityCart"]
    }
  }
});
</script>

<style >
.q-drawer-container .q-drawer__backdrop {
  background-color: rgba(138, 111, 109, 0.4) !important;
}
</style>
