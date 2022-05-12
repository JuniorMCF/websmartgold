//export function someMutation(/* state */) {}


export const setAddress = (state, payload) => {
  state.address = payload.address
}


export const setCheckoutMethod = (state, check) => {
  state.checkMethod = check
}
