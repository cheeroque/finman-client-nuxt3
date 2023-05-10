import { v4 as uuidv4 } from 'uuid'

export default defineNuxtPlugin(({ vueApp }) => {
  vueApp.directive('uid', {
    created(el) {
      el.setAttribute('id', el.id || uuidv4())
    },
    getSSRProps() {
      return {
        id: uuidv4(),
      }
    },
  })
})
