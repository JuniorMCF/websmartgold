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
export function setOtp(context,data){
  context.commit("setOtp",data)
}
export function setName(context,name){
  context.commit("setName",name)
}
export function setEmail(context,email){
  context.commit("setEmail",email)
}

export async function signIn(context, payload) {
  return new Promise((resolve, reject) => {
    let endpooint = "login.php";
    let token =
      "eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2NDg1MDcwNTIsInN1YiI6ImVLYXJ0IEF1dGhlbnRpY2F0aW9uIiwiaXNzIjoiZUthcnQifQ.dcdE_rrGdj9jN4z-HmBu1lsO2PH3OkX1r0o63DvIkIo";

    const url = "https://smartgold.blazeaisolutions.com/api/" + endpooint;
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
      
      if (res.data.success === true) {
        resolve(res.data)
        
        
        /**save data and send message phone */
        //console.log(res.data.data[0])
        let payload = {
          userId: res.data.data[0].id,
          name: res.data.data[0].name,
          email: res.data.data[0].email,
          mobile: res.data.data[0].mobile
        }
        context.commit("setAuth", payload)
        context.commit("setLoggedIn", true)
        
      } else {
        resolve(res.data)
      }

    }).catch(err => {
      reject(err)
    })
  })
}

export async function signUp(context, payload) {
  return new Promise((resolve, reject) => {
    let endpooint = "register.php";
    let token =
      "eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2NDg1MDcwNTIsInN1YiI6ImVLYXJ0IEF1dGhlbnRpY2F0aW9uIiwiaXNzIjoiZUthcnQifQ.dcdE_rrGdj9jN4z-HmBu1lsO2PH3OkX1r0o63DvIkIo";

    const url = "https://smartgold.blazeaisolutions.com/api/" + endpooint;
    let data = new FormData();
    data.append("accesskey", "90336");
    data.append("mobile", payload.phone);
    data.append("name", payload.name);
    data.append("email", payload.email);
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
          userId: res.data.data[0].id,
          name: res.data.data[0].name,
          email: res.data.data[0].email,
          mobile: res.data.data[0].mobile
        }
        context.commit("setAuth", payload)
        context.commit("setLoggedIn", true)

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

export function setTimer(context) {
  context.commit("setTimer")
}