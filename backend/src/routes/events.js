import {
  trackEvent,
  getTotalViews,
  getDailyViews,
  getDailyDurations,
  getTotalLikes,
} from '../services/events.js'
import { getPostById, likePost } from '../services/posts.js'

export function eventRoutes(app) {
  app.post('/api/v1/events', async (req, res) => {
    try {
      const { postId, session, action, likes } = req.body

      const post = await getPostById(postId)
      if (post === null) return res.status(400).end()

      // Handle like/unlike by updating Post.likes
      if (action === 'like' || action === 'unlike') {
        const result = await likePost(postId, action, session)
        if (!result) return res.status(400).end()
        return res.json({ session: result.session })
      }

      // Other events (startView, endView) just track
      const event = await trackEvent({ postId, session, action, likes })
      return res.json({ session: event.session })
    } catch (err) {
      console.error('error tracking action', err)
      return res.status(500).end()
    }
  })
  app.get('/api/v1/events/totalViews/:postId', async (req, res) => {
    try {
      const { postId } = req.params
      const post = await getPostById(postId)
      if (post === null) return res.status(400).end()
      const stats = await getTotalViews(post._id)
      return res.json(stats)
    } catch (err) {
      console.error('error getting stats', err)
      return res.status(500).end()
    }
  })
  app.get('/api/v1/events/dailyViews/:postId', async (req, res) => {
    try {
      const { postId } = req.params
      const post = await getPostById(postId)
      if (post === null) return res.status(400).end()
      const stats = await getDailyViews(post._id)
      return res.json(stats)
    } catch (err) {
      console.error('error getting stats', err)
      return res.status(500).end()
    }
  })
  app.get('/api/v1/events/dailyDurations/:postId', async (req, res) => {
    try {
      const { postId } = req.params
      const post = await getPostById(postId)
      if (post === null) return res.status(400).end()
      const stats = await getDailyDurations(post._id)
      return res.json(stats)
    } catch (err) {
      console.error('error getting stats', err)
      return res.status(500).end()
    }
  })
  app.get('/api/v1/events/likes/:postId', async (req, res) => {
    try {
      const { postId } = req.params
      const post = await getPostById(postId)
      if (post === null) return res.status(400).end()
      const stats = await getTotalLikes(post._id)
      return res.json(stats)
    } catch (err) {
      console.error('error getting likes', err)
      return res.status(500).end()
    }
  })
}
