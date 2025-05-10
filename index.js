function createTodo(task, completed) {
  return {
    todoname: task,
    iscompleted: completed
  }
}

const todos = new Map(); //will use Date.now() for key and value as object

class Todos {
  displayTodos() {
    const newDiv = document.getElementById("todo_template");
    if (todos.size == 0) {
      const emptymsg = document.createElement('div');
      emptymsg.textcontent = 'No todos. tap the + icon to create one';
    }
    else {
      todos.forEach((value, key) => {
        const todoEntry = document.createElement('div');
        todoEntry.id = key;
        const completedCheckbox = document.createElement('input');
        completedCheckbox.type = 'checkbox';
        document.todoEntry.appendChild(completedCheckbox);

      })
    }
  }
}
const tdodos = new Todos();
tdodos.displayTodos();
