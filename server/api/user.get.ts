/* Get user from context, then return it to the client */

export default defineEventHandler((event) => {
  return event.context.user
})
