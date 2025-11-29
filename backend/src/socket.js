export function handleSocket(io) {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id)

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id)
    })
  })
}

//broadcast new post event to all connected clients
export function notifyNewPost(io, post) {
  io.emit('post.created', {
    id: post._id,
    title: post.title,
    author: post.author._id || post.author,
    authorUsername: post.author.username || 'Unknown',
    createdAt: post.createdAt,
  })
}
