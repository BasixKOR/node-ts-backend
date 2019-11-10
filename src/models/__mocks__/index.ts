import { User, UserCreateInput, UserPromise } from '../prisma'
import { TypeUser } from '../../@types/models'
import cuid from 'cuid'

const users: User[] = []

export const createUser = async (input: UserCreateInput) => {
  if (await isUserExist(input.mailid))
    throw new Error('The user with same mailid already exists.')
  const user: User = {
    createdAt: new Date().toISOString(),
    ...input,
    averagePoint: input.averagePoint || 3.5,
    name: input.name || undefined,
    id: input.id ? input.id.toString() : cuid(),
  }
  users.push(user)
  return user
}

export const searchUser = (mailid: string) =>
  new Promise<User>((res, rej) => {
    const user = users.find(user => user.mailid === mailid)
    user ? res(user) : rej(Error('Cannot find the ' + mailid))
  })

export const isUserExist = (mailid: string) =>
  Promise.resolve(users.some(user => user.mailid === mailid))

export const appendUserData = (data: TypeUser) =>
  new Promise<User>((res, rej) => {
    const { mailid, ...others } = data
    const foundIndex = users.findIndex(user => user.mailid === mailid)
    if (foundIndex === -1)
      rej(new Error('Cannot find user with mailid: ' + mailid))
    users[foundIndex] = {
      ...users[foundIndex],
      ...others,
      name: others.name || undefined,
    }
    res(users[foundIndex])
  })