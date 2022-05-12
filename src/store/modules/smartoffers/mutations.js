//export function someMutation(/* state */) {}

export const setBudgetId = (state, budgetId) => {
  state.budget_id = budgetId
}

export const setLongitude = (state, longitude) => {
  state.longitude = longitude
}

export const setLatitude = (state, latitude) => {
  state.latitude = latitude
}
export const setRangeTo = (state, rangeTo) => {
  state.range_to = rangeTo
}
