import axios from 'axios'
export function someAction(context) {

}


export function updateCart(context, payload) {
  let endpooint = "cart_list.php";
  let token =
    "eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2NDg1MDcwNTIsInN1YiI6ImVLYXJ0IEF1dGhlbnRpY2F0aW9uIiwiaXNzIjoiZUthcnQifQ.dcdE_rrGdj9jN4z-HmBu1lsO2PH3OkX1r0o63DvIkIo";

  const url = "http://smartgold.blazeaisolutions.com/api/" + endpooint;
  let data = new FormData();
  data.append("accesskey", "90336");
  data.append("user_id", payload.user_id);
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  axios
    .post(url, data, {
      headers: headers,
    })
    .then((response) => {

      context.commit("updateCart", { cart: response.data.data })
    })
    .catch((err) => { });
}
