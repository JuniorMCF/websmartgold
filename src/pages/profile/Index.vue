<template>
  <q-page class="v-main">
    <div class="row q-px-none justify-center q-pt-md q-mx-none">
      <div class="col-md-10 col-12 q-px-md q-mx-none text-center">
        <q-toolbar-title class="text-black text-weight-bold text-h6"
          >Profile</q-toolbar-title
        >
      </div>
    </div>

    <div class="row justify-center q-py-xs q-px-none q-mx-none">
      <div class="col-lg-4 col-md-6 col-12 q-px-sm self-center">
        <q-card class="card-profile q-pt-lg">
          <div class="q-mx-auto" style="width: 150px; height: 150px">
            <q-avatar size="150px">
              <q-img src="~assets/app/business_male_icon.png" no-spinner />
            </q-avatar>
          </div>

          <q-card-section class="row q-px-lg">
            <div class="col text-center">
              <div class="text-h6">{{ username }}</div>
              <div class="text-subtitle2">{{ userphone }}</div>
            </div>
            
            <q-btn @click.prevent="editProfile()" v-if="isLoggedIn == true" icon="edit" unelevated round color="primary"  style="position:absolute;right:20px;bottom:20px"/>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div class="row justify-center q-py-xs q-px-none q-mx-none">
      <div class="col-lg-4 col-md-6 col-12 q-px-sm self-center">
        <q-list v-if="isLoggedIn == true">
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
            <q-item-section class="text-info text-h6 text-weight-bold q-py-sm">{{
              item.title
            }}</q-item-section>
            <q-item-section side>
              <q-icon class="text-info" size="lg" name="chevron_right" />
            </q-item-section>
          </q-item>
        </q-list>

        <q-list v-else>
          <q-item
            v-for="(item, i) in profile_logout"
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
            <q-item-section class="text-info text-h6 text-weight-bold q-py-sm">{{
              item.title
            }}</q-item-section>
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
          v-if="isLoggedIn == true"
          @click.prevent="signOut()"
          class="bg-red full-width q-py-sm text-weight-bold"
          text-color="white"
          size="md"
          >SIGN OUT</q-btn
        >

        <q-btn
          v-else
          @click.prevent="signIn()"
          class="bg-red full-width q-py-sm text-weight-bold"
          text-color="white"
          size="md"
          >PROCEED TO LOGIN</q-btn
        >
      </div>
    </div>
  </q-page>
  <LogoutAddressDialog ref="addressesDialog"></LogoutAddressDialog>
  <LoggedInAddressesDialog ref="loggedInAddressesDialog"></LoggedInAddressesDialog>
  <SharedApp ref="sharedApp"></SharedApp>
  <EditProfile ref="editProfile"></EditProfile>
</template>

<script>
import LogoutAddressDialog from "src/components/dialogs/LogoutAddressDialog.vue";
import SharedApp from "src/components/dialogs/SharedApp.vue";
import LoggedInAddressesDialog from "src/components/dialogs/LoggedInAddressesDialog.vue";
import EditProfile from 'src/components/dialogs/EditProfile.vue'
export default {
  name: "profile-component",
  components: {
    LogoutAddressDialog,
    SharedApp,
    LoggedInAddressesDialog,
    EditProfile
  },
  data: () => ({
    loadSignout: false,
    profile: [
      {
        title: "My Addresses",
        icon: "",
        name: "My Addresses",
        link: "/addresses",
        logged: true,
      },
      {
        title: "Smart Lock History",
        icon: "",
        name: "Transactions History",
        link: "/transactions",
        logged: true,
      },
      {
        title: "Order History",
        icon: "",
        name: "Orders",
        link: "/orders",
        logged: true,
      },
      {
        title: "Share",
        icon: "",
        name: "Share",
        link: "/share",
        logged: false,
      },
      /*{
        title: "Scan & Play",
        icon: "",
        name: "Scan & Play",
        link: "/scan",
        logged: false,
      },*/
      {
        title: "Send Feedback",
        icon: "",
        name: "Send Feedback",
        link: "/send-feedback",
        logged: false,
      },
    ],
    profile_logout: [
      {
        title: "Share",
        icon: "",
        name: "Share",
        link: "/share",
        logged: false,
      },
      /*{
        title: "Scan & Play",
        icon: "",
        name: "Scan & Play",
        link: "/scan",
        logged: false,
      },*/
      {
        title: "Send Feedback",
        icon: "",
        name: "Send Feedback",
        link: "/send-feedback",
        logged: false,
      },
    ],
  }),
  mounted() {
    if (!this.$store.getters["auth/getOtp"]) {
      this.$store.dispatch("auth/setLoggedIn", false);
      this.$store.dispatch("auth/signOut");
    }
    //this.openSuccess();
    //this.openError();
  },
  methods: {
    async openDetail(item) {
      if (item.name === "My Addresses") {
        this.$refs.loggedInAddressesDialog.open();
      } else if (item.name === "Share") {
        const title = "Smart Gold";
        const message = "Let me recommend you this application\n";
        const url =
          "https://play.google.com/store/apps/details?id=com.greymatter.smartgold";
        //this.$refs.sharedApp.open(title, message, url);
        const data = {
          url: url,
          title: title,
          text: message,
        };
        try {
          await navigator.share(data);
          //sconsole.log("shared data");
        } catch (err) {
          console.log(err);
        }
      } else if (item.name === "Send Feedback") {
        const title = "Smart Gold";
        const message = "SmartGold Feedback";
        const url = "customerservice@smartgoldmart.com";

        const data = {
          url: url,
          title: title,
          text: message,
        };
        try {
          await navigator.share(data);
          //console.log("shared data");
        } catch (err) {
          console.log(err);
        }
        //this.$refs.sharedApp.open(title, message, url);
      } else {
        this.$router.push({ path: item.link });
      }
    },
    signOut() {
      this.loadSignout = true;
      this.$store.dispatch("auth/signOut");
      this.$store.dispatch("auth/setLoggedIn", false);
      this.$store.dispatch("auth/setOtp", false);
      this.$router.push({ path: "/home" });
      this.loadSignout = false;
    },
    signIn() {
      this.$router.push({ path: "/login" });
    },
    editProfile(){
        this.$refs.editProfile.open().then(res=>{
          
        })
    }
  },
  computed: {
    username() {
      return this.$store.getters["auth/getUsername"] == ""
        ? "Guest User"
        : this.$store.getters["auth/getUsername"];
    },
    userphone() {
      return this.$store.getters["auth/getUserphone"];
    },
    isLoggedIn() {
      return this.$store.getters["auth/isLoggedIn"];
    },
  },
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
