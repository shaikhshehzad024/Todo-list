function createTodo(task, completed = false) {
  return {
    todoname: task,
    iscompleted: completed
  };
}

const TodoList = (function() {
  const todos = new Map();
  let onChangeCallback = null;

  function add(task) {
    const key = Date.now(); // unique ID for each todo
    todos.set(key, createTodo(task));
    notifyChange();
  }

  function remove(key) {
    todos.delete(key);
    notifyChange();
  }

  function updateText(key, newText) {
    todos.get(key).todoname = newText;
    notifyChange();
  }

  function toggleComplete(key, completed) {
    todos.get(key).iscompleted = completed;
    notifyChange();
  }

  function getAll() {
    return Array.from(todos.entries());
  }

  function onChange(callback) {
    onChangeCallback = callback;
  }

  function notifyChange() {
    if (onChangeCallback) onChangeCallback();
  }

  return {
    add,
    remove,
    updateText,
    toggleComplete,
    getAll,
    onChange
  };
})();

const listContainer = document.getElementById("list_container");
const addbtn = document.getElementById("add-item");

addbtn.addEventListener('click', function() {
  // Check if there's already an input box to avoid multiple inputs
  const existingInput = document.getElementById('new-task-input');
  if (existingInput) {
    existingInput.focus();
    return; // prevent adding multiple input boxes
  }

  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Enter your task here...';
  input.id = 'new-task-input';
  input.style.marginRight = '10px';

  const addTaskBtn = document.createElement('button');
  addTaskBtn.textContent = 'Save Todo';

  listContainer.prepend(addTaskBtn);
  listContainer.prepend(input);

  input.focus();

  function saveTask() {
    const task = input.value.trim();

    if (task === '') {
      alert('Please enter a task!');
      input.focus();
      return;
    }

    TodoList.add(task); // add to map
    input.remove();
    addTaskBtn.remove();
  }

  addTaskBtn.addEventListener('click', saveTask);
  input.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') saveTask();
  });
});
TodoList.onChange(displayTodos);

function displayTodos() {
  listContainer.innerHTML = '';
  const todos = TodoList.getAll();

  if (todos.length === 0) {
    const emptymsg = document.createElement('p');
    emptymsg.textContent = 'No todos. Tap the "Add Todo" button to create one.';
    listContainer.appendChild(emptymsg);
    return;
  }

  todos.forEach(([key, value]) => {
    createEntry(value, key);
  });
}

function createEntry(value, key) {
  const todoEntry = document.createElement('div');
  todoEntry.className = 'list-template';

  const todoText = document.createElement('p');
  todoText.textContent = value.todoname.trim() !== '' ? value.todoname : '(Click to edit)';
  todoText.style.display = 'inline';
  todoText.style.marginRight = '10px';
  todoText.style.cursor = 'pointer'; // make it look clickable

  todoText.addEventListener('click', function() {
    const input = document.createElement('input');
    input.type = 'text';
    input.value = value.todoname;
    input.style.marginRight = '10px';

    function saveEdit() {
      const newText = input.value.trim();
      if (newText === '') {
        alert('Todo cannot be empty!');
        input.focus();
        return;
      }
      TodoList.updateText(key, newText);
    }

    input.addEventListener('blur', saveEdit);
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') input.blur();
    });

    todoEntry.replaceChild(input, todoText);
    input.focus();
  });

  const completedCheckbox = document.createElement('input');
  completedCheckbox.type = 'checkbox';
  completedCheckbox.checked = value.iscompleted;
  completedCheckbox.addEventListener('change', () => {
    TodoList.toggleComplete(key, completedCheckbox.checked);
  });

  const deleteItem = document.createElement('button');
  deleteItem.textContent = 'Delete';
  deleteItem.addEventListener('click', function() {
    TodoList.remove(key);
  });

  todoEntry.appendChild(completedCheckbox);
  todoEntry.appendChild(todoText);
  todoEntry.appendChild(deleteItem);

  listContainer.prepend(todoEntry);
}
displayTodos();
