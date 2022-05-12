import axios from 'axios'

export function setCategory(context, payload) {
  context.commit('setCategory', payload)
}

export function setAuth(context, payload) {
  context.commit('setAuth', payload)
}
export function setLoggedIn(context, isLogged) {
  context.commit('setLoggedIn', isLogged)
}

export function signOut(context) {
  context.commit("signOut")
}
export async function signIn(context, payload) {
  return new Promise((resolve, reject) => {
    let endpooint = "login.php";
    let token =
      "eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2NDg1MDcwNTIsInN1YiI6ImVLYXJ0IEF1dGhlbnRpY2F0aW9uIiwiaXNzIjoiZUthcnQifQ.dcdE_rrGdj9jN4z-HmBu1lsO2PH3OkX1r0o63DvIkIo";

    const url = "http://smartgold.blazeaisolutions.com/api/" + endpooint;
    let data = new FormData();
    data.append("accesskey", "90336");
    data.append("mobile", payload.mobile);
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    axios.post(url, data, {
      headers: headers,
    }).then(res => {
      if (res.data.success == true) {
        resolve(res.data)
        /**save data and send message phone */
        let payload = {
          userId: res.data.data[0].userId,
          name: res.data.data[0].userId,
          email: res.data.data[0].userId,
          mobile: res.data.data[0].userId
        }
        context.commit("setAuth", payload)
        //context.commit("setLoggedIn", true)

      } else {
        resolve(res.data)
      }

    }).catch(err => {
      reject(err)
    })
  })
}
export function sendMessagePhone(context, payload) {

}
