import React, { useState, useEffect, useCallback, useRef, useMemo, Fragment } from 'react'
import cs from 'classnames'
import Fuse from 'fuse.js'
import Highcharts from 'highcharts'
import Chartkick, { LineChart } from 'react-chartkick'
import { Stack } from '../utils/history_stacks'
import { useStoreActions, useStoreState } from '../utils/hooks'
import { IntEnumObjects, winSearchParams } from '../utils/assist'
import { Repository } from '../services/history.service'
import { InterfaceLanguage } from '../utils/language'
import css from './history.module.scss'
import Loader1 from './loader/loader1'

const fuseOptions: Fuse.FuseOptions<Stack> = {
  keys: ['name', 'repos'],
  threshold: 0.3,
  maxPatternLength: 8,
}

Chartkick.use(Highcharts)

const highchartsConfig = {
  tooltip: {
    xDateFormat: '%Y-%m-%d',
  },
  plotOptions: {
    series: {
      marker: {
        enabled: false,
      },
    },
  },
}

enum DisplayStacks {
  All,
  Public,
  Private,
}

const displayStacksOptions = IntEnumObjects(DisplayStacks)

interface Props {
  query: string
}

const History: React.FC<Props> = ({ query }: Props): JSX.Element => {
  const presetStacks = useStoreState<Array<Stack>>(state => state.history.presetStacks)
  const userStacks = useStoreState<Array<Stack>>(state => state.history.userStacks)
  const allStacks = useStoreState<Array<Stack>>(state => state.history.allStacks)
  const currentStack = useStoreState<Stack | null>(state => state.history.currentStack)
  const repositorys = useStoreState<Array<Repository>>(state => state.history.repositorys)
  const loading = useStoreState<boolean>(state => state.history.loading)
  const language = useStoreState<InterfaceLanguage | undefined>(state => state.storage.values.language)

  const addUserStack = useStoreActions(actions => actions.history.addUserStack)
  const removeUserStack = useStoreActions(actions => actions.history.removeUserStack)
  const addStackRepoAndData = useStoreActions(actions => actions.history.addStackRepoAndData)
  const removeStackRepo = useStoreActions(actions => actions.history.removeStackRepo)
  const selectStack = useStoreActions(actions => actions.history.selectStack)

  const [displayStacks, setDisplayStacks] = useState<DisplayStacks>(DisplayStacks.All)
  const [inputStackName, setInputStackName] = useState<string>('')
  const [inputRepoName, setInputRepoName] = useState<string>('')

  const [queryStacks, setQueryStacks] = useState(allStacks)

  const chartEl = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!query) {
      setQueryStacks(allStacks)
    } else {
      const fuse = new Fuse(allStacks, fuseOptions)
      const result = fuse.search<Stack, false, false>(query)
      setQueryStacks(result)
    }
  }, [allStacks, query])

  const submitRepo = useCallback(
    stackid => {
      if (inputRepoName) {
        addStackRepoAndData({ stackid, repo: inputRepoName })
        setInputRepoName('')
      }
    },
    [addStackRepoAndData, inputRepoName]
  )

  const Repositories = useCallback(
    (s: Stack) => {
      return (
        <div className={css.repos}>
          {s.repos.map(repo => (
            <p key={repo} className={css.repo}>
              <a href={`https://github.com/${repo}`} target='_blank' rel='noopener noreferrer'>
                {repo}
              </a>
              {!s.predefined && <i className='fa-close' onClick={() => removeStackRepo({ stackid: s.id, repo })} />}
            </p>
          ))}
          {!s.predefined && (
            <div className='field has-addons'>
              <p className='control is-expanded'>
                <input
                  className='input is-small'
                  type='text'
                  placeholder='username/repositorie'
                  value={inputRepoName}
                  onChange={e => setInputRepoName(e.target.value)}
                />
              </p>
              <p className='control'>
                <a className='button is-info is-small' onClick={() => submitRepo(s.id)}>
                  Add
                </a>
              </p>
            </div>
          )}
        </div>
      )
    },
    [inputRepoName, removeStackRepo, submitRepo]
  )

  const LineChartMemoized = useMemo(() => {
    return (
      <LineChart innerRef={chartEl} library={highchartsConfig} data={repositorys} height='800px' width='100%' ytitle='Stars' />
    )
  }, [repositorys])

  return (
    <div className={cs('columns', css.history)}>
      <div className={cs('column', 'is-one-quarter')}>
        <nav className='panel'>
          <p className='panel-heading'>Stacks</p>
          <p className='panel-tabs'>
            {displayStacksOptions.map(o => (
              <a
                key={o.value}
                className={cs({ 'is-active': displayStacks === o.value })}
                onClick={() => setDisplayStacks(o.value)}>
                {o.label}
              </a>
            ))}
          </p>
          {displayStacks === DisplayStacks.All &&
            queryStacks.map(s => (
              <Fragment key={s.id}>
                <a
                  className={cs('panel-block', css.stack, { 'is-active': s.id === currentStack?.id })}
                  onClick={() => selectStack(s)}>
                  <span className='panel-icon'>
                    <i className={cs({ 'fa-group': s.predefined, 'fa-user': !s.predefined })} aria-hidden='true' />
                  </span>
                  {s.name}
                  {!s.predefined && (
                    <i
                      className='fa-close'
                      onClick={e => {
                        e.stopPropagation()
                        removeUserStack(s.id)
                      }}
                    />
                  )}
                </a>
                {s.id === currentStack?.id && Repositories(s)}
              </Fragment>
            ))}
          {displayStacks === DisplayStacks.Public &&
            presetStacks.map(s => (
              <Fragment key={s.id}>
                <a
                  className={cs('panel-block', css.stack, { 'is-active': s.id === currentStack?.id })}
                  onClick={() => selectStack(s)}>
                  <span className='panel-icon'>
                    <i className='fa-group' aria-hidden='true' />
                  </span>
                  {s.name}
                </a>
                {s.id === currentStack?.id && Repositories(s)}
              </Fragment>
            ))}
          {displayStacks === DisplayStacks.Private &&
            userStacks.map(s => (
              <Fragment key={s.id}>
                <a
                  className={cs('panel-block', css.stack, { 'is-active': s.id === currentStack?.id })}
                  onClick={() => selectStack(s)}>
                  <span className='panel-icon'>
                    <i className='fa-user' aria-hidden='true' />
                  </span>
                  {s.name}
                  <i
                    className='fa-close'
                    onClick={e => {
                      e.stopPropagation()
                      removeUserStack(s.id)
                    }}
                  />
                </a>
                {s.id === currentStack?.id && Repositories(s)}
              </Fragment>
            ))}
          <div className='panel-block field has-addons'>
            <p className='control is-expanded'>
              <input
                className='input'
                type='text'
                placeholder='stack name'
                value={inputStackName}
                onChange={e => setInputStackName(e.target.value)}
              />
            </p>
            <p className={cs('control', css.button)}>
              <a className='button is-info' onClick={() => inputStackName && addUserStack(inputStackName)}>
                Create
              </a>
            </p>
          </div>
        </nav>
      </div>
      <div className={cs('column')}>
        {process.env.REACT_APP_REGION !== 'china' && language === InterfaceLanguage.中文 && (
          <div className='notification'>
            <span>
              starhistory 使用了 firebase 缓存数据。如果您正在使用中国互联网，请访问{' '}
              <a href='https://cn.socode.pro'>https://cn.socode.pro</a>。
            </span>
          </div>
        )}
        {loading && <Loader1 type={1} />}
        {LineChartMemoized}
        <p>
          inspired by{' '}
          <a href='https://stars.przemeknowak.com' target='_blank' rel='noopener noreferrer'>
            stars.przemeknowak.com
          </a>
        </p>
      </div>
    </div>
  )
}

export default History
