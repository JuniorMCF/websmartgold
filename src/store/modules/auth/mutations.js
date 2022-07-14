//export function someMutation(/* state */) {}

export const setAuth = (state, payload) => {

  state.user_id = payload.userId
  state.name = payload.name
  state.email = payload.email
  state.mobile = payload.mobile
}
export const setName = (state,name)=>{
  state.name = name
}
export const setEmail = (state,email)=>{
  state.email = email
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
export const initTimer =(state)=>{
  state.time = 60
}
export const setTimer = (state) => {

  if(state.time > 0){
    state.time = state.time - 1
  }
}
export const setOtp = (state,data)=>{
  state.otp = data
}