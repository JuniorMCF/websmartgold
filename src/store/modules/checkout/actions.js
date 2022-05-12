
export function someAction(context) {

}
export function setAddressDefault(context, payload) {
  context.commit("setAddress", payload)
}


export function setCheckoutMethod(context, check) {
  context.commit("setCheckoutMethod", check)
}
