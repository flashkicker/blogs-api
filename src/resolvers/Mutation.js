import { v4 as uuidv4 } from "uuid"

const Mutation = {
	createUser(parent, args, { db }, info) {
		const emailTaken = db.users.some((user) => user.email === args.data.email)

		if (emailTaken) throw new Error("Email taken")

		const user = {
			id: uuidv4(),
			...args.data,
		}

		db.users.push(user)

		return user
	},
	deleteUser(parent, args, { db }, info) {
		const userIndex = db.users.findIndex((user) => user.id === args.id)

		if (userIndex < 0) throw new Error("User not found")

		const deletedUser = db.users.splice(userIndex, 1)

		db.posts = db.posts.filter((post) => {
			const match = post.author === args.id

			if (match) {
				db.comments = db.comments.filter((comment) => comment.post !== post.id)
			}

			return !match
		})

		db.comments = db.comments.filter((comment) => comment.author !== args.id)

		return deletedUser[0]
	},
	updateUser(parent, args, { db }, info) {
		const user = db.users.find((user) => user.id === args.id)

		if (!user) throw new Error("User not found")

		if (typeof args.data.email === "string") {
			const emailTaken = db.users.some((user) => user.email === args.data.email)

			if (emailTaken) throw new Error("Email taken")

			user.email = args.data.email
		}

		if (typeof args.data.name === "string") {
			user.name = args.data.name
		}

		if (typeof args.data.age !== "undefined") {
			user.age = args.data.age
		}

		return user
	},
	createPost(parent, args, { pubsub, db }, info) {
		const userExists = db.users.some((user) => user.id === args.data.author)

		if (!userExists) throw new Error("User not found")

		const post = {
			id: uuidv4(),
			...args.data,
		}

		db.posts.push(post)
		if (post.published) {
			pubsub.publish("post", {
				post: {
					mutation: "CREATED",
					data: post,
				},
			})
		}

		return post
	},
	deletePost(parent, args, { db, pubsub }, info) {
		const postIndex = db.posts.findIndex((post) => post.id === args.id)

		if (postIndex < 0) throw new Error("Post not found")

		const [deletedPost] = db.posts.splice(postIndex, 1)

		db.comments = db.comments.filter((comment) => comment.post !== args.id)

		if (deletedPost.published) {
			pubsub.publish("post", {
				post: {
					mutation: "DELETED",
					data: deletedPost,
				},
			})
		}

		return deletedPost
	},
	updatePost(parent, { id, data }, { db, pubsub }, info) {
		const post = db.posts.find((post) => post.id === id)
		const originalPost = { ...post }

		if (!post) throw new Error("Post not found")

		if (typeof data.title === "string") {
			post.title = data.title
		}

		if (typeof data.body === "string") {
			post.body = data.body
		}

		if (typeof data.published === "boolean") {
			post.published = data.published

			if (originalPost.published && !post.published) {
				//deleted
				pubsub.publish("post", {
					post: {
						mutation: "DELETED",
						data: originalPost,
					},
				})
			} else if (!originalPost.published && post.published) {
				pubsub.publish("post", {
					post: {
						mutation: "CREATED",
						data: post,
					},
				})
			}
		} else if (post.published) {
			//updated
			pubsub.publish("post", {
				post: {
					mutation: "UPDATED",
					data: post,
				},
			})
		}

		return post
	},
	createComment(parent, args, { pubsub, db }, info) {
		const userExists = db.users.some((user) => user.id === args.data.author)
		const postExists = db.posts.some(
			(post) => post.id === args.data.post && post.published
		)

		if (!userExists) throw new Error("User not found")
		if (!postExists) throw new Error("Post not found")

		const comment = {
			id: uuidv4(),
			...args.data,
		}

		db.comments.push(comment)
		pubsub.publish(`comment ${args.data.post}`, {
			comment: {
				mutation: "CREATED",
				data: comment,
			},
		})

		return comment
	},
	deleteComment(parent, { data, id }, { pubsub, db }, info) {
		const commentIndex = db.comments.findIndex((comment) => comment.id === id)

		if (commentIndex < 0) throw new Error("Comment not found")

		const [deletedComment] = db.comments.splice(commentIndex, 1)

		pubsub.publish(`comment ${deletedComment.post}`, {
			comment: {
				mutation: "DELETED",
				data: deletedComment,
			},
		})

		return deletedComment
	},
	updateComment(parent, { id, data }, { pubsub, db }, info) {
		const comment = db.comments.find((comment) => comment.id === id)

		if (!comment) throw new Error("Comment not found")

		if (typeof data.text === "string") {
			comment.text = data.text
		}

		pubsub.publish(`comment ${comment.post}`, {
			comment: {
				mutation: "UPDATED",
				data: comment,
			},
		})

		return comment
	},
}

export { Mutation as default }
