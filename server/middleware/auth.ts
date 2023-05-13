export default defineEventHandler((event) => {
  const token = getCookie(event, 'apollo:default.token')
  const url = event.node.req.url

  if (token && url === '/auth/login') {
    return sendRedirect(event, '/', 302)
  }
})
