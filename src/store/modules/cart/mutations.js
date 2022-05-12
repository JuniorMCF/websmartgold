//export function someMutation(/* state */) {}


export const openCart = (state, opened) => {

  state.opened = opened
}


export const updateCart = (state, payload) => {
  state.cart = payload.cart

}
