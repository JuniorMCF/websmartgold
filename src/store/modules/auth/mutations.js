//export function someMutation(/* state */) {}

export const setAuth = (state, payload) => {

  state.user_id = payload.userId
  state.name = payload.name
  state.email = payload.email
  state.mobile = payload.mobile
}

export const setLoggedIn = (state, isLogged) => {
  state.isLoggedIn = isLogged
}

export const signOut = (state) => {
  state.user_id = ""
  state.name = ""
  state.email = ""
  state.mobile = ""
}
