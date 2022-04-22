import { Fetcher } from 'openapi-typescript-fetch'

import { paths } from '@/gen/openapi'
import { CustomRequestInit, Fetch } from 'openapi-typescript-fetch/dist/cjs/types'
import store from './store'

const fetcher = Fetcher.for<paths>()

fetcher.configure({
  baseUrl: import.meta.env.VITE_BASE_URL,
  use: [(url: string, init: CustomRequestInit, next: Fetch) => {
    if (store.state.apiKey.length > 0) {
      init.headers.set('authorization', `Bearer ${store.state.apiKey}`)
    }
    return next(url, init)
  }]
})

export default fetcher
