import { Post } from '../db/models/post.js'
import { User } from '../db/models/user.js'
import { trackEvent } from './events.js'

export async function createPost(userId, { title, contents, tags, image }) {
  const post = new Post({ title, author: userId, contents, tags, image })
  return await post.save()
}

async function listPosts(
  query = {},
  { sortBy = 'createdAt', sortOrder = 'descending' } = {},
) {
  const order = sortOrder === 'ascending' ? 1 : -1
  return await Post.find(query).sort({ [sortBy]: order })
}

export async function listAllPosts(options) {
  return await listPosts({}, options)
}

export async function listPostsByAuthor(authorUsername, options) {
  const user = await User.findOne({ username: authorUsername })
  if (!user) return []
  return await listPosts({ author: user._id }, options)
}

export async function listPostsByTag(tags, options) {
  return await listPosts({ tags }, options)
}

export async function getPostById(postId) {
  return await Post.findById(postId)
}

export async function updatePost(
  userId,
  postId,
  { title, contents, tags, image },
) {
  return await Post.findOneAndUpdate(
    { _id: postId, author: userId },
    { $set: { title, contents, tags, image } },
    { new: true },
  )
}

export async function deletePost(userId, postId) {
  return await Post.deleteOne({ _id: postId, author: userId })
}

export async function likePost(postId, action, session) {
  const delta = action === 'like' ? 1 : action === 'unlike' ? -1 : 0
  if (delta === 0) return null

  const post = await Post.findById(postId)
  if (!post) return null

  post.likes = Math.max(0, (post.likes || 0) + delta)

  const event = await trackEvent({
    postId,
    action,
    session,
    likes: post.likes,
  })

  await post.save()
  return { post, session: event.session }
}
