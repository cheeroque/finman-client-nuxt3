/* IMPORTANT NOTE! Due to the Vue limitations, this composable is not reactive.
 * If you need to dynamically update something in your component based on this
 * composable returned value, you'll have to recreate that component by using
 * a key prop */

import { Comment, Text } from 'vue'
import type { Slot, VNode } from 'vue'

export function useSlotHasContent(slot: Slot | undefined, slotProps = {}): boolean {
  if (!slot) return false

  return slot(slotProps).some((vnode: VNode) => {
    if (vnode.type === Comment) {
      return false
    }

    if (Array.isArray(vnode.children) && !vnode.children.length) {
      return false
    }

    return vnode.type !== Text || (typeof vnode.children === 'string' && vnode.children.trim() !== '')
  })
}
