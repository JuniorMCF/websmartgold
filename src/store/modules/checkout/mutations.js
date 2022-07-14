//export function someMutation(/* state */) {}


export const setAddress = (state, payload) => {
  state.address = payload.address
}
export  const setLatitude = (state, payload) => {
  state.latitude = payload.latitude
}
export  const setLongitude = (state, payload) => {
  state.longitude = payload.longitude
}
export const setCheckoutMethod = (state, check) => {
  state.checkMethod = check
}
export const setCheckouts = (state,payload)=>{
  state.checkouts  = payload.checkouts
}

