import React from 'react'
import cs from 'classnames'
import { RegionData } from '../models/storage'
import { useStoreState } from '../utils/hooks'
import css from './region.module.scss'

const Region: React.FC = (): JSX.Element => {
  const data = useStoreState<RegionData>((state) => state.storage.region)

  return (
    <table className={cs(css.region, 'table', 'is-striped')}>
      <tbody>
        <tr>
          <th>IP</th>
          <td>{data.ip}</td>
        </tr>
        <tr>
          <th>Country</th>
          <td>{data.country_name}</td>
        </tr>
        <tr>
          <th>City</th>
          <td>{data.city}</td>
        </tr>
      </tbody>
    </table>
  )
}

export default Region
