export function someGetter(/* state */) { }

export function getStateOpenCart(state) {
  return state.opened
}

export function getCart(state) {
  return state.cart != null ? state.cart : []
}

export function getQuantityCart(state) {
  return state.cart != null ? state.cart.length : 0
}
