import { getBoxCodeById } from '@/services/boxService'
import { getUserById } from '@/services/userService'

export async function returnUserNameWithId(id: string): Promise<string | null> {
  const user = await getUserById(id)
  if (user) {
    return user.user_name
  }
  return null
}

export async function returnBoxCodeById(Id: string): Promise<string | null> {
  if (!Id) return '-'
  const resul = await getBoxCodeById(Id)
  if (resul) return resul.box_code
  return null
}
