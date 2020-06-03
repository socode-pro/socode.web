import { Action, action, Computed, computed, ActionOn, actionOn } from "easy-peasy"
import dayjs from "dayjs"
import { StoreModel } from "./index"
import { IsExpandWidthViewKey } from "../utils/searchkeys"

const defaultDisplaySubtitle = (): boolean => {
  const value = localStorage.getItem("displaySubtitle")
  if (value === null) {
    const time = localStorage.getItem("displaySubtitleFirstTime")
    if (!time) {
      localStorage.setItem("displaySubtitleFirstTime", dayjs().toJSON())
    } else {
      return dayjs(time).add(10, "minute").isAfter(dayjs())
    }
  }
  return value !== "false"
}

export interface DisplayModel {
  displayKeys: boolean
  setDisplayKeys: Action<DisplayModel, boolean>

  expandView: boolean
  setExpandView: Action<DisplayModel, boolean>

  displaySubtitle: boolean
  setDisplaySubtitle: Action<DisplayModel, boolean>

  wapperTop: Computed<DisplayModel, number, StoreModel>

  expandWidthView: boolean
  setExpandWidthView: Action<DisplayModel, boolean>

  onCurrentKey: ActionOn<DisplayModel, StoreModel>
}

const displayModel: DisplayModel = {
  displayKeys: localStorage.getItem("displayKeys") !== "false" && !new URLSearchParams(window.location.search).has("k"),
  setDisplayKeys: action((state, payload) => {
    state.displayKeys = payload
    localStorage.setItem("displayKeys", payload.toString())
    state.expandWidthView = false
  }),

  expandView: false,
  setExpandView: action((state, payload) => {
    state.expandView = payload
  }),

  displaySubtitle: defaultDisplaySubtitle(),
  setDisplaySubtitle: action((state, payload) => {
    state.displaySubtitle = payload
    localStorage.setItem("displaySubtitle", payload.toString())
  }),

  wapperTop: computed(
    [
      (state) => state.expandView,
      (state) => state.displaySubtitle,
      (state, storeState) => storeState.search.result,
      (state, storeState) => storeState.search.npmResult,
    ],
    (expandView, displaySubtitle, result, npmResult) => {
      return expandView || (result?.results.length || npmResult?.results.length || 0) > 0? -6: displaySubtitle? 150: 130
    }
  ),

  expandWidthView: false,
  setExpandWidthView: action((state, payload) => {
    state.expandWidthView = payload
  }),

  onCurrentKey: actionOn(
    (actions, storeActions) => storeActions.searchKeys.setCurrentKey,
    (state, target) => {
      state.displayKeys = false
      if (!target.payload.devdocs && !IsExpandWidthViewKey(target.payload)) {
        state.expandView = false
      }
      if (!IsExpandWidthViewKey(target.payload)) {
        state.expandWidthView = false
      }
    }
  ),
}

export default displayModel
