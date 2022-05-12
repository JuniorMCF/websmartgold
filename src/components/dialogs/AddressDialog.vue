<template>
  <q-dialog
    persistent
    @keydown.esc="cancel"
    v-model="dialog"
    :max-width="options.width"
    :style="{ zIndex: options.zIndex }"
    full-height
  >
    <q-card square class="q-dialog-plugin bg-white q-pt-md">
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
      <p class="text-info text-normal q-my-xs text-h6 text-center text-weight-bold">Add an address</p>

      <q-form @submit="addLocation">
        <q-card-section class="q-px-md q-pb-none scroll section-address-2">
          <div class="row q-pb-md">
            <div class="col">
              <q-input
                square
                outlined
                v-model="name"
                label="Name"
                :rules="[val => val && val.length > 0 || 'Invalid name']"
                hide-bottom-space
              />
            </div>
          </div>
          <div class="row q-pb-md">
            <div class="col">
              <q-input
                square
                outlined
                v-model="address"
                label="House N°, Building Name"
                :rules="[val => val && val.length > 0 || 'Invalid Address']"
                hide-bottom-space
              />
            </div>
          </div>
          <div class="row q-pb-md">
            <div class="col">
              <q-input square outlined v-model="address_second" label="Landmark (optional)" />
            </div>
          </div>
          <div class="row q-pb-md">
            <div class="col">
              <q-input
                square
                outlined
                v-model="area"
                label="Area"
                :rules="[val => val && val.length > 0 || 'Invalid area']"
                hide-bottom-space
              />
            </div>
          </div>
          <div class="row q-pb-md">
            <div class="col">
              <q-input
                square
                outlined
                v-model="city"
                label="City"
                :rules="[val => val && val.length > 0 || 'Invalid city']"
                hide-bottom-space
              />
            </div>
          </div>
          <div class="row q-pb-md">
            <div class="col">
              <q-input
                square
                outlined
                v-model="pin_code"
                label="Pin code"
                maxlength="6"
                :rules="[val => val && val.length == 6 || 'Invalid pincode']"
                hide-bottom-space
              />
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="center" class="q-py-none q-px-md">
          <q-btn
            square
            color="primary"
            text-color="info"
            size="lg"
            block
            class="q-mx-auto full-width q-my-md"
            align="center"
            label="get current location"
            icon="my_location"
            :loading="loadLocation"
            @click.prevent="getCurrentLocation()"
          ></q-btn>

          <q-btn
            square
            color="primary"
            text-color="info"
            size="lg"
            block
            type="submit"
            :loading="load"
            class="q-mx-auto full-width"
          >Add address</q-btn>
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script>
import axios from 'axios'
import { Notify } from "quasar";
export default {
  name: 'address-component',
  mounted() { },
  data: function () {
    return {
      dialog: false,
      resolve: null,
      reject: null,

      name: '',
      address: '',
      address_second: '',
      area: '',
      city: '',
      pin_code: '',
      load: false,
      loadLocation: false,
      options: {
        color: "white",
        width: 700,
        zIndex: 2002,
        noconfirm: false,
      },
    };
  },
  methods: {
    open(options) {
      this.dialog = true;
      this.options = Object.assign(this.options, options);

      return new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
      });
    },
    addLocation() {
      if (this.name != '' && this.address != '' && this.area != '' && this.city != '' && this.pin_code != '') {
        this.load = true
        let endpooint = "add-address.php";
        let token =
          "eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2NDg1MDcwNTIsInN1YiI6ImVLYXJ0IEF1dGhlbnRpY2F0aW9uIiwiaXNzIjoiZUthcnQifQ.dcdE_rrGdj9jN4z-HmBu1lsO2PH3OkX1r0o63DvIkIo";

        const url = "http://smartgold.blazeaisolutions.com/api/" + endpooint;
        let data = new FormData();
        data.append("accesskey", "90336");

        data.append("user_id", this.$store.getters["auth/getUserId"]);
        data.append("name", this.name);
        data.append("address", this.address);
        data.append("landmark", this.address_second);
        data.append("city", this.city);
        data.append("area", this.area);
        data.append("pincode", this.pin_code);

        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };
        axios.post(url, data, {
          headers: headers,
        }).then(res => {
          console.log(res)
          this.load = false
          this.resolve(true);
          this.dialog = false;
        }).catch(err => {
          this.load = false
        })
      }
    },
    getCurrentLocation() {
      const self = this
      navigator.geolocation.getCurrentPosition(function (sucess) {
        if ("geolocation" in navigator) {
          navigator.permissions
            .query({ name: "geolocation" })
            .then(function (result) {

              if (result.state === "granted") {
                /* la geolocalización está disponible */

                navigator.geolocation.getCurrentPosition(function (position) {
                  const lat = position.coords.latitude;
                  const lng = position.coords.longitude;

                  const latlng = new google.maps.LatLng(
                    lat,
                    lng
                  );
                  const geocoder = new google.maps.Geocoder();
                  geocoder.geocode(
                    {
                      latLng: latlng,
                    },
                    function (results, status) {
                      console.log(status)
                      if (status === 'OK') {

                        if (results[1]) {
                          self.address = results[1].formatted_address;
                          if (results[0]) {
                            const postCode = self.extractFromAdress(results[0].address_components, "postal_code");
                            const town = self.extractFromAdress(results[0].address_components, "locality");
                            const country = self.extractFromAdress(results[0].address_components, "country");

                            self.area = country
                            self.city = town
                            self.pin_code = postCode
                          }
                        } else {
                          Notify.create({
                            message: "Not results found",
                            group: false,
                          });
                          console.log("No results found");
                        }
                      } else {
                        console.log("Geocoder failed due to: " + status);
                      }
                    }
                  );

                })
              }
            })
        } else {
          console.log("not support")
        }

      }, function (error) {
        // El segundo parámetro es la función de error
        switch (error.code) {
          case error.PERMISSION_DENIED:
            // El usuario denegó el permiso para la Geolocalización.
            break;
          case error.POSITION_UNAVAILABLE:
            // La ubicación no está disponible.
            break;
          case error.TIMEOUT:
            // Se ha excedido el tiempo para obtener la ubicación.
            break;
          case error.UNKNOWN_ERROR:
            // Un error desconocido.
            break;
        }
      });

    },
    extractFromAdress(components, type) {
      for (var i = 0; i < components.length; i++)
        for (var j = 0; j < components[i].types.length; j++)
          if (components[i].types[j] == type) return components[i].long_name;
      return "";
    },

    cancel() {
      this.resolve(false);
      this.dialog = false;
    },
  },

};
</script>

<style>
.q-dialog-plugin {
  width: 500px;
}
.q-dialog__inner--minimized {
  padding: 90px 0px 90px 0px !important;
}
.section-address-2 {
  height: 550px;
}
@media (max-width: 960px) {
  .q-dialog-plugin {
    width: 100% !important;
  }
  .q-dialog__inner--minimized {
    padding: 0px 0px 0px 0px !important;
  }
  .section-address-2 {
    height: 465px;
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
