import { languages, spokenLanguages, fetchRepositories } from '@huchenme/github-trending'

export enum TrendingRange {
  daily,
  weekly,
  monthly,
}

export interface TrendingParam {
  spoken: string,
  language: string,
  since: TrendingRange,
}

export interface Repository {
  author: string,
  name: string,
  avatar: string,
  url: string,
  description: string,
  language: string,
  languageColor: string,
  stars: number,
  forks: number,
  currentPeriodStars: number,
  builtBy: {
    href: string,
    avator: string,
    username: string,
  }
}

export const fetch = async (param: TrendingParam): Promise<Repository|null> => {
  try {
    const repositories = await fetchRepositories(param)
    return repositories
  } catch (err) {
    console.error(err)
  }
  return null
}