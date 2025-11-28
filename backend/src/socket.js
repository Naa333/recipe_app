export function handleSocket(io) {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id)
    
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id)
    })
  })
}

export function notifyNewPost(io, post) {
  io.emit('post.created', {
    id: post._id,
    title: post.title,
    author: post.author,
    createdAt: post.createdAt,
  })
}
