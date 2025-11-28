import { getUserInfoById } from '../services/users.js'
export const postSchema = `#graphql
type Post {
id: ID!
title: String!
author: User
contents: String
image: String!
tags: [String!]
createdAt: Float
updatedAt: Float
likes: Int!
}
`
export const postResolver = {
  Post: {
    author: async (post) => {
      return await getUserInfoById(post.author)
    },
  },
}
