import { boot } from 'quasar/wrappers';
import VueGoogleMaps from '@fawmi/vue-google-maps';

export default boot(({ app }) => {
  app.use(VueGoogleMaps, { // 🤿 Vue App. Please install Vue Google Maps
    load: {
      //key: 'AIzaSyB109lpUN1h-3pn42zqp4TcLIqnM_0W0QY', // 🤿 I don't have a google key, so leave it blank for now
      key: 'AIzaSyB6sTrxyXA_2fKGdWr8mvJKOFy0ysbxv-8',
      libraries: "places"
    },
  });
});