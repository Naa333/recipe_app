import PropTypes from 'prop-types'
import { User } from './User.jsx'
import { Link } from 'react-router-dom'
import slug from 'slug'
import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { postTrackEvent, getTotalLikes } from '../api/events.js'
import { useAuth } from '../contexts/AuthContext.jsx'
import ReactMarkdown from 'react-markdown'

// Post component with image, content, and like button
export function Post({
  title,
  contents,
  author,
  id,
  image,
  fullPost = false,
  session,
}) {
  const queryClient = useQueryClient()
  const [liked, setLiked] = useState(false)
  const [token] = useAuth()

  // Get total likes for this post
  const {
    data: totalLikesData,
    isLoading: likesLoading,
    isError: likesError,
  } = useQuery({
    queryKey: ['totalLikes', id],
    queryFn: () => getTotalLikes(id),
  })

  // Like/unlike mutation
  const likeMutation = useMutation({
    mutationFn: (action) => postTrackEvent({ postId: id, action, session }),
    onSuccess: () => {
      queryClient.invalidateQueries(['totalLikes', id])
    },
  })

  function toggleLike() {
    const action = liked ? 'unlike' : 'like'
    setLiked(!liked)
    likeMutation.mutate(action)
  }

  return (
    <article style={{ marginBottom: 32 }}>
      {image && (
        <div style={{ margin: '90px 90px' }}>
          {fullPost ? (
            <img
              src={image}
              alt={title}
              style={{
                width: '40em',
                height: '40em',
                display: 'block',
                objectFit: 'cover',
              }}
              loading='lazy'
            />
          ) : (
            <Link to={`/posts/${id}/${slug(title)}`}>
              <img
                src={image}
                alt={title}
                style={{
                  width: 120,
                  height: 120,
                  objectFit: 'cover',
                  display: 'block',
                }}
                loading='lazy'
              />
            </Link>
          )}
        </div>
      )}

      {fullPost ? (
        <>
          <h3 style={{ display: 'inline-block', marginRight: 12 }}>{title}</h3>
          <button
            onClick={toggleLike}
            disabled={!token || likeMutation.isLoading}
          >
            {liked ? 'Unlike' : 'Like'}
          </button>
          {!token && (
            <small style={{ marginLeft: 8, color: '#666' }}>
              Log in to like posts
            </small>
          )}
        </>
      ) : (
        <Link to={`/posts/${id}/${slug(title)}`}>
          <h3>{title}</h3>
        </Link>
      )}

      <div style={{ marginTop: 8 }}>
        {likesLoading && <small>Loading likes...</small>}
        {likesError && <small>Could not load likes</small>}
        {!likesLoading && !likesError && (
          <small>
            {totalLikesData?.likes ?? 0}{' '}
            {totalLikesData?.likes === 1 ? 'like' : 'likes'}
          </small>
        )}
      </div>

      {fullPost && (
        <div style={{ marginTop: 12 }}>
          <ReactMarkdown>{contents}</ReactMarkdown>
        </div>
      )}

      {author && (
        <em>
          {fullPost && liked && <br />}
          Written by <User {...author} />
        </em>
      )}
    </article>
  )
}

Post.propTypes = {
  title: PropTypes.string.isRequired,
  contents: PropTypes.string,
  author: PropTypes.shape(User.propTypes),
  id: PropTypes.string.isRequired,
  image: PropTypes.string,
  fullPost: PropTypes.bool,
  session: PropTypes.string,
}
