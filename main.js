const grpc = require("@grpc/grpc-js")
const protoLoader = require("@grpc/proto-loader")

const packageDefinition = protoLoader.loadSync("schemas/todo.proto", {})
const grpcObject = grpc.loadPackageDefinition(packageDefinition)
const todoPackage = grpcObject.todoPackage;

const server = new grpc.Server()
server.bindAsync("0.0.0.0:8000", grpc.ServerCredentials.createInsecure(), start)
server.addService(todoPackage.Todo.service, {
	"create": createTodo,
	"readAll": readTodos,
	"read": readTodo,
	"delete": deleteTodo
})

function start() {
	server.start()
}

const todos = []

function createTodo(call, callback) {
	const item = {
		"id": todos.length + 1,
		"title": call.request.title
	}
	todos.push(item)

	console.log(`Create todo item #${item.id}: ${item.title}`)
	callback(null, item)
}

function readTodos(call, callback) {
	callback(null, {
		"items": todos
	})
}

function readTodo(call, callback) {
	let result = findById(call.request.id)
	callback(null, result)
}

function findById(id) {
	let result = {}
	todos.forEach(todo => {
		if (todo.id === id) {
			result = todo
		}
	})
	return result
}

function deleteTodo(call, callback) {
	if (!!call.request.id) doDelete(findById(call.request.id))
	callback(null, {})
}

function doDelete(todo) {
	todos.splice(todos.indexOf(todo), 1)
}