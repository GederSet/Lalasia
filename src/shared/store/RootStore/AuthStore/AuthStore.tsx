import { API_ENDPOINTS } from '@shared/config/api'
import { Meta } from '@shared/config/meta'
import { action, computed, makeObservable, observable, runInAction } from 'mobx'
import type RootStore from '../RootStore'

export type UserType = {
  id: number
  documentId: string
  username: string
  email: string
}

type LoginDto = {
  identifier: string
  password: string
}

type RegisterDto = {
  username: string
  email: string
  password: string
}

type PrivateFields = '_currentUser' | '_token' | '_meta'

export interface IAuthStore {
  currentUser: UserType | null
  token: string | null
  meta: Meta
  isAuthenticated: boolean

  initFromStorage(): void
  login(data: LoginDto): Promise<void>
  register(data: RegisterDto): Promise<void>
  logout(): void
  destroy(): void
  setMeta(meta: Meta): void
  setUser(user: UserType | null): void
  setToken(token: string | null): void
}

export default class AuthStore implements IAuthStore {
  private _rootStore: RootStore

  private _currentUser: UserType | null = null
  private _token: string | null = null
  private _meta: Meta = Meta.initial

  constructor(rootStore: RootStore) {
    this._rootStore = rootStore

    makeObservable<this, PrivateFields>(this, {
      _currentUser: observable,
      _token: observable,
      _meta: observable,

      currentUser: computed,
      token: computed,
      meta: computed,
      isAuthenticated: computed,

      login: action,
      register: action,
      logout: action,
      setMeta: action,
      setUser: action,
      setToken: action,
    })
  }

  get currentUser() {
    return this._currentUser
  }

  get token() {
    return this._token
  }

  get meta() {
    return this._meta
  }

  get isAuthenticated() {
    return !!this._token
  }

  initFromStorage() {
    if (typeof window === 'undefined') return

    const savedToken = localStorage.getItem('_token')
    const savedUser = localStorage.getItem('_currentUser')

    if (savedToken && savedUser) {
      this.setToken(savedToken)
      this.setUser(JSON.parse(savedUser))
    }
  }

  setMeta(meta: Meta) {
    this._meta = meta
  }

  setUser(user: UserType | null) {
    this._currentUser = user
    if (user) localStorage.setItem('_currentUser', JSON.stringify(user))
    else localStorage.removeItem('_currentUser')
  }

  setToken(token: string | null) {
    this._token = token
    if (token) localStorage.setItem('_token', token)
    else localStorage.removeItem('_token')
  }

  logout() {
    this.setUser(null)
    this.setToken(null)
    this.setMeta(Meta.initial)
    this._rootStore.cart.clearCart()
  }

  destroy() {
    this.logout()
  }

  async login(data: LoginDto) {
    this.setMeta(Meta.loading)
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_BASE_URL + API_ENDPOINTS.LOGIN,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }
      )

      if (!response.ok) throw new Error('Login failed')
      const result = await response.json()
      const { jwt, user } = result

      runInAction(() => {
        this.setToken(jwt)
        this.setUser({
          id: user.id,
          documentId: user.documentId,
          username: user.username,
          email: user.email,
        })
        this.setMeta(Meta.success)
      })

      await this._rootStore.cart.getCartProducts()
    } catch (err) {
      runInAction(() => this.setMeta(Meta.error))
      throw err
    }
  }

  async register(data: RegisterDto) {
    this.setMeta(Meta.loading)
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_BASE_URL + API_ENDPOINTS.REGISTER,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }
      )

      if (!response.ok) throw new Error('Register failed')
      const result = await response.json()
      const { jwt, user } = result

      runInAction(() => {
        this.setToken(jwt)
        this.setUser({
          id: user.id,
          documentId: user.documentId,
          username: user.username,
          email: user.email,
        })
        this.setMeta(Meta.success)
      })
    } catch (err) {
      runInAction(() => this.setMeta(Meta.error))
      throw err
    }
  }
}
