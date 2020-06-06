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

  useEffect(() => {
    judgeRegion()
    judgeOusideFirewall()
    injectParams()
  }, [judgeRegion, judgeOusideFirewall, injectParams])

  return (
    <>
      <Search />
      <Drawer />
      {!isInStandaloneMode && <ExtArrow />}
    </>
  )
}

export default Home
