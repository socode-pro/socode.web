import React, { useEffect } from "react"
import { useStoreActions } from "./Store"
import Search from "./components/search"
import Drawer from "./components/drawer"
import ExtArrow from "./components/extarrow"
import { isInStandaloneMode } from "./utils/assist"

const Home: React.FC = () => {
  const judgeRegion = useStoreActions((actions) => actions.storage.judgeRegion)
  const judgeOusideFirewall = useStoreActions((actions) => actions.storage.judgeOusideFirewall)
  const injectParams = useStoreActions((actions) => actions.profile.injectParams)
  const loadProfile = useStoreActions((actions) => actions.profile.loadProfile)
  const initialMetas = useStoreActions((actions) => actions.devdocs.initialMetas)

  useEffect(() => {
    judgeRegion()
    judgeOusideFirewall()
    injectParams()
    loadProfile()
    initialMetas()
  }, [judgeRegion, judgeOusideFirewall, injectParams, loadProfile, initialMetas])

  return (
    <>
      <Search />
      <Drawer />
      {!isInStandaloneMode && <ExtArrow />}
    </>
  )
}

export default Home
