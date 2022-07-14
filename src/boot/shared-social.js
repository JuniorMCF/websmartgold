import { boot } from 'quasar/wrappers';
import VueSocialSharing from 'vue-social-sharing'

export default boot(({ app }) => {
  app.use(VueSocialSharing, { // 🤿 Vue App. Please install Vue Google Maps
    networks: {
      //gmail: 'https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=&su=@title&body=@url&ui=2&tf=1&pli=1',
      //outlook:'https://outlook.live.com/mail/0/deeplink/compose?to=&su=@title&body=@url'
    }
  });
});