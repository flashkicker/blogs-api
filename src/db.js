const users = [
	{
		id: "1",
		name: "Ujjval",
		email: "ujjkumaria@gmail.com",
		age: 24,
	},
	{
		id: "2",
		name: "Sam",
		email: "samkumaria@gmail.com",
	},
	{
		id: "3",
		name: "Mike",
		email: "mikekumaria@gmail.com",
	},
]

const posts = [
	{
		id: "1",
		title: "First post",
		body: "",
		published: true,
		author: "3",
	},
	{
		id: "2",
		title: "Second post",
		body: "",
		published: false,
		author: "1",
	},
	{
		id: "3",
		title: "Third post",
		body: "",
		published: true,
		author: "1",
	},
]

const comments = [
	{
		id: "1",
		text: "lol",
		author: "1",
		post: "1",
	},
	{
		id: "2",
		text: "lmfaoooo",
		author: "2",
		post: "1",
	},
	{
		id: "3",
		text: "looool",
		author: "1",
		post: "1",
	},
	{
		id: "4",
		text: "lmao",
		author: "3",
		post: "3",
	},
]

const db = {
	users,
	posts,
	comments,
}

export { db as default }
