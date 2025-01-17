// import express from 'express';
// import cors from "cors";
// import 'dotenv/config'
// import './database.js'
// import { Todo } from "./models/index.js";



// const app = express();
// const port = 3000;

// const todos = [];
// let idNum = 1;

// app.use(express.json());
//   app.use(cors({ origin: ['http://localhost:5173', 'https://todo-mongo.surge.sh'] }))



// app.get('/', (req, res) => {
//     res.send('Hello World!');
// });




// app.get("/api/v1/todos", async (request, response) => {
//   try {

//     const todos = await Todo.find({},
//       { ip: 0, __v: 0, updatedAt: 0 } // projection (0 wale front per nhi aaye)
//       // { todoContent: 1 } saruf todoContent show hoga frontend per aur kuxh show nhi hoga
//       // { todoContent: 1, _id: 0 } // advance saruf id ma different keys use ho sagti hy like 0 and 1 
//     ).sort({ _id: -1 })

//     const message = !todos.length ? "todos empty" : "ye lo sab todos";

//     response.send({ data: todos, message: message });
//   } catch (err) {
//     response.status(500).send("Internal server error")
//   }
// });

// // naya todo bannae ko
// app.post("/api/v1/todo", async (request, response) => {
//   const obj = {
//     todo: request.body.todoContent,
//     ip: request.ip,
//   };

//   const result = await Todo.create(obj)

//   response.send({ message: "todo add hogya hy", data: result });
// });

// // ye todo ko update ya edit karne ki api ki
// app.patch("/api/v1/todo/:id", async (request, response) => {
//   const id = request.params.id;

//   const result = await Todo.findByIdAndUpdate(id,
//     { todoContent: request.body.todoContent }
//   )

//   console.log('result=>', result);

//   if (result) {
//     response.status(201).send({
//       data: result,
//       message: "todo updated successfully!",
//     });
//   } else {
//     response.status(200).send({ data: null, message: "todo not found" });
//   }
// });

// app.delete("/api/v1/todo/:id", async (request, response) => {
//   const id = request.params.id;

//   const result = await Todo.findByIdAndDelete(id)

//   if (result) {
//     response.status(201).send({
//       data: { todoContent: request.body.todoContent, id: id, },
//       message: "todo deleted successfully!",
//     });
//   } else {
//     response.status(200).send({ data: null, message: "todo not found" });
//   }
// });

// //

// app.use((request, response) => {
//   response.status(404).send({ message: "no route found!" });
// });

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`);
// });

import express from 'express';
import cors from "cors";
import 'dotenv/config';
import './database.js';
import { Todo } from "./models/index.js";

const app = express();
const port = process.env.PORT || 3001; // Use environment variable for port

app.use(express.json());
app.use(cors({ origin: ['http://localhost:5173', 'https://todo-mongo.surge.sh'] }));

// Default route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Get all todos
app.get("/api/v1/todos", async (request, response) => {
  try {
    const todos = await Todo.find({}, { ip: 0, __v: 0, updatedAt: 0 }).sort({ _id: -1 });
    const message = todos.length === 0 ? "todos empty" : "Here are your todos";
    response.send({ data: todos, message: message });
  } catch (err) {
    console.error(err);
    response.status(500).send("Internal server error");
  }
});

// Create a new todo
app.post("/api/v1/todo", async (request, response) => {
  try {
    const obj = {
      todoContent: request.body.todoContent,
      ip: request.ip || request.headers['x-forwarded-for'] || request.connection.remoteAddress, // Better handling of IP address
    };

    const result = await Todo.create(obj);
    response.send({ message: "Todo added successfully", data: result });
  } catch (err) {
    console.error(err);
    response.status(400).send("Error creating todo");
  }
});

// Update an existing todo
app.patch("/api/v1/todo/:id", async (request, response) => {
  const id = request.params.id;

  try {
    const result = await Todo.findByIdAndUpdate(id, { todoContent: request.body.todoContent }, { new: true });
    
    if (result) {
      response.status(200).send({ data: result, message: "Todo updated successfully!" });
    } else {
      response.status(404).send({ message: "Todo not found" });
    }
  } catch (err) {
    console.error(err);
    response.status(500).send("Error updating todo");
  }
});

// Delete a todo
app.delete("/api/v1/todo/:id", async (request, response) => {
  const id = request.params.id;

  try {
    const result = await Todo.findByIdAndDelete(id);
    
    if (result) {
      response.status(200).send({ data: { todoContent: result.todoContent, id: id }, message: "Todo deleted successfully!" });
    } else {
      response.status(404).send({ message: "Todo not found" });
    }
  } catch (err) {
    console.error(err);
    response.status(500).send("Error deleting todo");
  }
});

// Handle non-existent routes
app.use((request, response) => {
  response.status(404).send({ message: "Route not found!" });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});






