import express from 'express';
import cors from "cors";
import 'dotenv/config'
import './database.js'
import { Todo } from "./models/index.js";



const app = express();
const port = 3000;

const todos = [];
let idNum = 1;

app.use(express.json());
app.use(cors({ origin: ['http://localhost:5173', 'https://todo-frontend.surge.sh'] }))


app.get('/', (req, res) => {
    res.send('Hello World!');
});

// app.get('/api/v1/todos', (req, res) => {
//     res.send(todos);
// });

// // Corrected POST API
// app.post("/api/v1/todo", (req, res) => {
//     const todoObj = {
//         todo: req.body.todo, 
//         id: idNum++,
//     };

//     todos.push(todoObj); 

//     res.send({ message: "Todo added successfully", data: todoObj }); 
// });

// app.patch('/api/v1/todo/:id', (req, res) => {
//     const id = parseInt(req.params.id); 
//     let isFound = false;

//     for (let i = 0; i < todos.length; i++) {
//         if (todos[i].id === id) {
//             todos[i].todo = req.body.todo;
//             isFound = true;
//             break;
//         }
//     }

//     if (isFound) {
//         res.status(201).send({
//             data: { todo: req.body.todo, id: id },
//             message: "Todo updated successfully!",
//         });
//     } else {
//         res.status(200).send({ data: null, message: "Todo not found" });
//     }
// });

// app.delete('/api/v1/todo/:id', (req, response) => {

//   const id = parseInt(req.params.id); 

//   let isFound = false;
//   for (let i = 0; i < todos.length; i++) {
//     if (todos[i].id === id) {

//       todos.splice(i, 1);

//       isFound = true;
//       break;
//     }
//   }

//   if (isFound) {
//     response.status(201).send({
//       message: "todo deleted successfully!",
//     });
//   } else {
//     response.status(200).send({ data: null, message: "todo not found" });
//   }


// });

// app.listen(port, () => {
//     console.log(`Server is running on http://localhost:${port}`);
// });



app.get("/api/v1/todos", async (request, response) => {
  try {

    const todos = await Todo.find({},
      { ip: 0, __v: 0, updatedAt: 0 } // projection (0 wale front per nhi aaye)
      // { todoContent: 1 } saruf todoContent show hoga frontend per aur kuxh show nhi hoga
      // { todoContent: 1, _id: 0 } // advance saruf id ma different keys use ho sagti hy like 0 and 1 
    ).sort({ _id: -1 })

    const message = !todos.length ? "todos empty" : "ye lo sab todos";

    response.send({ data: todos, message: message });
  } catch (err) {
    response.status(500).send("Internal server error")
  }
});

// naya todo bannae ko
app.post("/api/v1/todo", async (request, response) => {
  const obj = {
    todoContent: request.body.todo,
    ip: request.ip,
  };

  const result = await Todo.create(obj)

  response.send({ message: "todo add hogya hy", data: result });
});

// ye todo ko update ya edit karne ki api ki
app.patch("/api/v1/todo/:id", async (request, response) => {
  const id = request.params.id;

  const result = await Todo.findByIdAndUpdate(id,
    { todoContent: request.body.todoContent }
  )

  console.log('result=>', result);

  if (result) {
    response.status(201).send({
      data: result,
      message: "todo updated successfully!",
    });
  } else {
    response.status(200).send({ data: null, message: "todo not found" });
  }
});

app.delete("/api/v1/todo/:id", async (request, response) => {
  const id = request.params.id;

  const result = await Todo.findByIdAndDelete(id)

  if (result) {
    response.status(201).send({
      // data: { todoContent: request.body.todoContent, id: id, },
      message: "todo deleted successfully!",
    });
  } else {
    response.status(200).send({ data: null, message: "todo not found" });
  }
});

//

app.use((request, response) => {
  response.status(404).send({ message: "no route found!" });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
