import axios from 'axios'
export function someAction(context) {

}
export function setAddressDefault(context, payload) {
  context.commit("setAddress", payload)
}
export function setLatitude(context, payload) {
  context.commit("setLatitude", payload)
}

export function setLongitude(context, payload) {
  context.commit("setLongitude", payload)
}


export function setCheckoutMethod(context, check) {
  context.commit("setCheckoutMethod", check)
}
export function setCheckouts(context, payload) {
  context.commit("setCheckouts", payload)
}

export function setCheckoutUpdate(context, payload) {

  const user_id = payload.user_id
  const checkMethod = payload.checkMethod

  let endpooint2 = "check_out.php";
  let token =
    "eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2NDg1MDcwNTIsInN1YiI6ImVLYXJ0IEF1dGhlbnRpY2F0aW9uIiwiaXNzIjoiZUthcnQifQ.dcdE_rrGdj9jN4z-HmBu1lsO2PH3OkX1r0o63DvIkIo";

  const url2 = "https://smartgold.blazeaisolutions.com/api/" + endpooint2;

  let data2 = new FormData();
  data2.append("accesskey", "90336");
  data2.append("payment_method", checkMethod)
  data2.append("user_id", user_id);
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  axios.post(url2, data2, {
    headers: headers,
  })

    .then(res => {
      if (res.data.success == true) {
        const checkouts = res.data.data
        console.log(checkouts)
        context.commit("setCheckouts", {checkouts:checkouts})
      }
    }).catch(err => {
      console.log(err)
    })






}