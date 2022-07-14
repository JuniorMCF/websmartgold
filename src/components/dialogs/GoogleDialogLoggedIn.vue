<template>
  <q-dialog
    persistent
    @keydown.esc="cancel"
    v-model="dialog"
    :max-width="options.width"
    :style="{ zIndex: options.zIndex }"
    full-height
  >
    <q-card square class="q-dialog-plugin bg-white q-py-none">
      <q-card square>
        <q-card-section>
          <div class="row justify-between">
            <GMapAutocomplete
              class="col"
              id="autocomplete"
              placeholder="Search"
              @place_changed="setPlace"
            >
            </GMapAutocomplete>
            <div class="col-1 self-center q-mx-none">
              <q-btn
                flat
                size="lg"
                icon="close"
                class="q-px-sm"
                @click.prevent="cancel"
              >
              </q-btn>
            </div>
          </div>
        </q-card-section>
      </q-card>

      <q-card-section class="q-px-md scroll section-map q-pt-none">
        <GMapMap
          class="my_map"
          :center="center"
          :zoom="10"
          :options="mapOptions"
          :map-type-id="map_type"
        >
          <!--<GMapAutocomplete
       placeholder="This is a placeholder"
       @place_changed="setPlace"
    >
  </GMapAutocomplete>-->
          <GMapMarker
            :key="index"
            v-for="(m, index) in markers"
            :position="m.position"
          />
        </GMapMap>

        <q-btn
          class="button-type-map"
          round
          color="white"
          text-color="primary"
          icon="satellite_alt"
          @click.prevent="changeTypeMap()"
        ></q-btn>

        <q-btn
          class="button-location"
          round
          color="white"
          text-color="primary"
          icon="my_location"
          @click.prevent="myLocation()"
        ></q-btn>
      </q-card-section>
      <q-card-section style="height: 90px">
        <div class="row justify-between">
          <div class="col-10 self-center">
            <p class="q-mb-none text-info text-weight-bold ellipsis">
              {{ addressCity }}
            </p>
            <p class="q-mb-none ellipsis">{{ city }}</p>
            <p class="q-mb-none ellipsis">{{ pin_code }}</p>
          </div>
          <div class="col-2 self-center">
            <q-btn
              class="float-right"
              round
              color="primary"
              glossy
              text-color="info"
              icon="check"
              @click.prevent="setAddress()"
            ></q-btn>
          </div>
        </div>
      </q-card-section>
      <!--<q-card-actions
        align="center"
        class="q-py-md q-px-md"
        style="position: absolute; bottom: 0; width: 100%"
      >
        <q-btn
          square
          color="primary"
          text-color="info"
          size="lg"
          block
          class="q-mx-auto full-width"
          @click.prevent="addAddress()"
        >Add address</q-btn>
      </q-card-actions>-->
    </q-card>
  </q-dialog>

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

  <!--<AddressDialog ref="addressDialog"></AddressDialog>-->
</template>

<script>
import axios from "axios";
import { QOverlay } from "@quasar/quasar-ui-qoverlay";
//import AddressDialog from './AddressDialog.vue';
import { Notify } from "quasar";
export default {
  components: {
    QOverlay,
    //AddressDialog
  },
  name: "addresses-component",
  mounted() {
    //this.myLocation();
  },
  data: function () {
    return {
      map_type: "roadmap",
      mapOptions: {
        zoomControl: false,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false,
        disableDefaultUi: false,
      },
      center: { lat: 11.0116775, lng: 76.8271484 },
      markers: [
        {
          position: {
            lat: 11.0116775,
            lng: 76.8271484,
          },
        },
      ],
      latitude: null,
      longitude: null,
      addressCity: null,
      address: null,
      area: null,
      city: null,
      pin_code: null,
      load: false,
      dialog: false,
      resolve: null,
      reject: null,
      addresses: [],
      options: {
        color: "white",
        width: 700,
        zIndex: 2400,
        noconfirm: false,
      },
    };
  },
  methods: {
    open(options) {
      console.log("abriendo mapa")
      this.dialog = true;
      this.options = Object.assign(this.options, options);
      this.myLocation();
      //address-list
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
      const address = {
        addressCity: this.addressCity,
        name: this.address,
        area: this.area,
        pincode: this.pin_code,
        city: this.city,
        latitude: this.latitude,
        longitude: this.longitude,
        success: false,
      };
      this.resolve(address);
      this.dialog = false;
    },
    extractFromAdress(components, type) {
      for (var i = 0; i < components.length; i++)
        for (var j = 0; j < components[i].types.length; j++)
          if (components[i].types[j] == type) return components[i].long_name;
      return "";
    },
    setPlace(place) {
      if (place != null) {
        this.markers[0].position = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };

        this.center = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
        this.updateAddress(
          place.geometry.location.lat(),
          place.geometry.location.lng()
        );

        //this.$store.dispatch('checkout/setAddressDefault', { address: place })
      }
    },
    setAddress() {
      if (this.addressCity != null && this.addressCity != undefined) {
        const address = {
          addressCity: this.addressCity,
          name: this.address,
          area: this.area,
          pincode: this.pin_code,
          city: this.city,
          latitude: this.latitude,
          longitude: this.longitude,
          success: true,
        };

        this.resolve(address);
        this.dialog = false;
      }
    },

    changeTypeMap() {
      if (this.map_type == "satellite") {
        this.map_type = "roadmap";
        return;
      }
      this.map_type = "satellite";
    },
    myLocation() {
      let self = this;

      if (navigator.geolocation) {
        /* la geolocalización está disponible */

        navigator.geolocation.getCurrentPosition(
          function (position) {
            self.markers[0].position = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };

            self.center = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            self.updateAddress(
              position.coords.latitude,
              position.coords.longitude
            );
          },
          function showError(error) {
            switch (error.code) {
              case error.PERMISSION_DENIED:
                self.resolve(false);
                self.dialog = false;
                Notify.create({
                  message:
                    "Geolocation is not enabled. Please enable to use this feature",
                  group: false,
                });
                break;
              case error.POSITION_UNAVAILABLE:
                Notify.create({
                  message: "Position not available",
                  group: false,
                });
                break;
              case error.TIMEOUT:
                Notify.create({
                  message: "Error timeout",
                  group: false,
                });
                break;
              case error.UNKNOWN_ERROR:
                Notify.create({
                  message: "Internet error",
                  group: false,
                });
                break;
            }
          }
        );
      } else {
        /* la geolocalización NO está disponible */
        this.resolve(false);
        this.dialog = false;
        Notify.create({
          message: "Geolocation is not supported by this device",
          group: false,
        });
      }
    },
    updateAddress(lat, lng) {
      let latlng = new google.maps.LatLng(lat, lng);
      const geocoder = new google.maps.Geocoder();
      let self = this;
      geocoder.geocode(
        {
          latLng: latlng,
        },
        function (results, status) {
          if (status === google.maps.GeocoderStatus.OK) {
            //console.log(results);
            if (results[1]) {
              //console.log(results[1]);
              self.addressCity = results[1].formatted_address;
              self.address = results[1].formatted_address;
              self.latitude = lat;
              self.longitude = lng;

              if (results[0]) {
                const postCode = self.extractFromAdress(
                  results[0].address_components,
                  "postal_code"
                );
                const town = self.extractFromAdress(
                  results[0].address_components,
                  "locality"
                );
                const country = self.extractFromAdress(
                  results[0].address_components,
                  "country"
                );

                self.area = country;
                self.city = town;
                self.pin_code = postCode;
              }
            } else {
            }
          } else {
          }
        }
      );
    },
  },
};
</script>

<style scoped>


.pac-target-input {
  padding: 10px;
}

.button-location {
  position: absolute;
  right: 18px;
  bottom: 36px;
}
.button-type-map {
  position: absolute;
  right: 18px;
  bottom: 90px;
}

.q-dialog-plugin {
  width: 500px;
}
.q-dialog__inner--minimized {
  padding: 90px 0px 90px 0px !important;
}

.section-map {
  height: calc(100% - 180px);
}
.my_map {
  height: calc(100% - 2px);
}
@media (max-width: 960px) {
  .q-dialog-plugin {
    width: 100% !important;
  }
  .q-dialog__inner--minimized {
    padding: 0px 0px 0px 0px !important;
  }
  .section-map {
    height: calc(100% - 180px);
  }
  .my_map {
    height: calc(100% - 2px);
  }
}
.ring-img-dialog {
  height: 250px;
  width: 250px;
}
.select-ring-size {
  max-width: 150px;
}
.close-fixed {
  position: absolute;
  top: 15px;
  left: 15px;
}
.cart-fixed {
  position: absolute;
  top: 15px;
  right: 15px;
}
</style>
