import { useMutation as useGraphQLMutation } from '@apollo/client/react/index.js'
import { useState } from 'react'
import {
  CREATE_POST,
  GET_POSTS,
  GET_POSTS_BY_AUTHOR,
} from '../api/graphql/posts.js'
import { useAuth } from '../contexts/AuthContext.jsx'
import { Link } from 'react-router-dom'
import slug from 'slug'

export function CreatePost() {
  const [token] = useAuth()
  const [title, setTitle] = useState('')
  const [image, setImage] = useState('')
  const [contents, setContents] = useState('')

  const [createPost, { loading, data }] = useGraphQLMutation(CREATE_POST, {
    variables: { title, contents, image },
    context: {
      headers: { Authorization: `Bearer ${token}` },
    },
    refetchQueries: [GET_POSTS, GET_POSTS_BY_AUTHOR],
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    createPost()
  }
  if (!token) return <div>Please log in to create new posts.</div>
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor='create-title'>Title: </label>
        <input
          type='text'
          name='create-title'
          id='create-title'
          value={title}
          size='50'
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <br />
      <textarea
        value={image}
        name='textarea'
        rows='5'
        cols='40'
        placeholder='Image URL'
        onChange={(e) => setImage(e.target.value)}
        style={{ resize: 'vertical', overflow: 'auto' }}
      />
      <br />
      <br />
      <textarea
        value={contents}
        name='textarea'
        rows='10'
        cols='50'
        placeholder='Ingredients and Method'
        onChange={(e) => setContents(e.target.value)}
        style={{ resize: 'vertical', overflow: 'auto' }}
      />
      <br />

      <input
        type='submit'
        value={loading ? 'Creating...' : 'Create'}
        disabled={!title || loading}
      />
      {data?.createPost ? (
        <>
          <br />
          Post{' '}
          <Link
            to={`/posts/${data.createPost.id}/${slug(data.createPost.title)}`}
          >
            {data.createPost.title}
          </Link>{' '}
          created successfully!
        </>
      ) : null}
    </form>
  )
}
