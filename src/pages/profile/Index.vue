<template>
  <q-page class="v-main">
    <div class="row q-px-none justify-center q-pt-md q-mx-none">
      <div class="col-md-10 col-12 q-px-md q-mx-none text-center">
        <q-toolbar-title class="text-black text-weight-bold text-h6">Profile</q-toolbar-title>
      </div>
    </div>

    <div class="row justify-center q-py-xs q-px-none q-mx-none">
      <div class="col-lg-4 col-md-6 col-12 q-px-sm self-center">
        <q-card class="card-profile q-pt-lg">
          <div class="q-mx-auto" style="width: 150px; height: 150px">
            <q-avatar size="150px">
              <q-img src="~assets/app/business_male_icon.png" />
            </q-avatar>
          </div>

          <q-card-section class="row q-px-lg">
            <div class="col text-center">
              <div class="text-h6">{{ username }}</div>
              <div class="text-subtitle2">{{ userphone }}</div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div class="row justify-center q-py-xs q-px-none q-mx-none">
      <div class="col-lg-4 col-md-6 col-12 q-px-sm self-center">
        <q-list>
          <q-item
            v-for="(item, i) in profile"
            :key="'links' + i"
            clickable
            v-ripple
            :active="active"
            class="list-item-profile"
            active-class="text-warning"
            @click.prevent="openDetail(item)"
          >
            <q-item-section avatar>
              <q-icon :name="item.icon" />
            </q-item-section>
            <q-item-section class="text-info text-h6 text-weight-bold q-py-sm">{{ item.title }}</q-item-section>
            <q-item-section side>
              <q-icon class="text-info" size="lg" name="chevron_right" />
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>
    <div class="row justify-center q-py-xs q-px-none q-mx-lg q-mt-lg q-mb-md">
      <div class="col-lg-4 col-md-6 col-12 q-mx-lg q-px-lg self-center">
        <q-btn
          @click.prevent="signOut()"
          class="bg-red full-width q-py-sm text-weight-bold"
          text-color="white"
          size="md"
        >SIGN OUT</q-btn>
      </div>
    </div>
  </q-page>
  <AddresssesDialog ref="addressesDialog"></AddresssesDialog>
</template>

<script>
import AddresssesDialog from 'src/components/dialogs/AddresssesDialog.vue';

export default {
  name: 'profile-component',
  components: {
    AddresssesDialog

  },
  data: () => ({
    loadSignout: false,
    profile: [
      {
        title: "My Addresses",
        icon: "",
        name: "My Addresses",
        link: "/addresses",
      },
      {
        title: "Transactions History",
        icon: "",
        name: "Transactions History",
        link: "/transactions",
      },
      {
        title: "Orders",
        icon: "",
        name: "Orders",
        link: "/orders",
      },
    ],
  }),
  mounted() {
    //this.openSuccess();
    //this.openError();
  },
  methods: {

    openDetail(item) {
      if (item.name === "My Addresses") {
        this.$refs.addressesDialog.open().then(res => {
          if (res) {

          }
        })
      } else {
        this.$router.push({ path: item.link })
      }
    },
    signOut() {
      this.loadSignout = true
      this.$store.dispatch("auth/signOut")
      this.$store.dispatch("auth/setLoggedIn", false)
      this.$router.push({ path: "/home" })
      this.loadSignout = false
    }
  },
  computed: {
    username() {
      return this.$store.getters["auth/getUsername"]
    },
    userphone() {
      return this.$store.getters["auth/getUserphone"]
    }
  }
};
</script>

<style>
.q-gutter-x-sm > *,
.q-gutter-sm > * {
  margin-left: 0px !important;
}
.card-profile {
  border-bottom-left-radius: 30px;
  border-bottom-right-radius: 30px;
}

.list-item-profile:after {
  position: absolute;
  content: "";
  border-bottom: 1px solid #401410;
  width: 70%;
  transform: translateX(-50%);
  bottom: 0px;
  left: 50%;
}
</style>
