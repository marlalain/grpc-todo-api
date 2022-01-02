const grpc = require("@grpc/grpc-js")
const protoLoader = require("@grpc/proto-loader")

const packageDefinition = protoLoader.loadSync("schemas/todo.proto", {})
const grpcObject = grpc.loadPackageDefinition(packageDefinition)
const todoPackage = grpcObject.todoPackage;

const client = new todoPackage.Todo("0.0.0.0:8000", grpc.ChannelCredentials.createInsecure())

const title = process.argv[2]

// the code bellow is just for testing
// it **is** ugly.

if (title !== "id" && title !== "del") {
	if (!!title) {
		client.create({
			"id": -1,
			"title": title
		}, (err, res) => {
			if (!!res) console.log(JSON.stringify(res))
			if (!!err) console.error(err.details)
		})
	} else {
		client.readAll(null, (err, res) => {
			if (!!res) console.log(JSON.stringify(res.items))
			if (!!err) console.error(err.details)
		})
	}
} else if (title === "del") {
	client.delete({
		"id": process.argv[3]
	}, (err, res) => {
		if (!!res) console.log(JSON.stringify(res))
		if (!!err) console.error(err.details)
	})
} else {
	client.read({
		"id": process.argv[3]
	}, (err, res) => {
		if (!!res) console.log(JSON.stringify(res))
		if (!!err) console.error(err.details)
	})
}
