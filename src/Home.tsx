import React, { useEffect } from "react"
import { useStoreActions, useStoreState } from "./utils/hooks"
import Search from "./components/search"
import Drawer from "./components/drawer"
import ExtArrow from "./components/extarrow"
import { isInStandaloneMode } from "./utils/assist"
import "./styles/app.global.scss"

const Home: React.FC = () => {
  const judgeRegion = useStoreActions((actions) => actions.storage.judgeRegion)
  const judgeOusideFirewall = useStoreActions((actions) => actions.storage.judgeOusideFirewall)

  useEffect(() => {
    judgeRegion()
    judgeOusideFirewall()
  }, [judgeRegion, judgeOusideFirewall])

  return (
    <>
      <Search />
      <Drawer />
      {!isInStandaloneMode && <ExtArrow />}
    </>
  )
}

export default Home
