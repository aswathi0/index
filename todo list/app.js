  document.addEventListener('DOMContentLoaded', () => {
       const todoForm = document.getElementById('todo-form');
       const todoInput = document.getElementById('todo-input');
       const todoList = document.getElementById('todo-list');

       // Fetch and display todos on load
       fetch('/api/todos')
           .then(response => response.json())
           .then(todos => {
               todos.forEach(todo => {
                   addTodoToList(todo);
               });
           });

       // Handle form submission
       todoForm.addEventListener('submit', event => {
           event.preventDefault();
           const task = todoInput.value.trim();

           if (task) {
               fetch('/api/todos', {
                   method: 'POST',
                   headers: {
                       'Content-Type': 'application/json'
                   },
                   body: JSON.stringify({ task })
               })
               .then(response => response.json())
               .then(todo => {
                   addTodoToList(todo);
                   todoInput.value = '';
               });
           }
       });

       // Add todo item to the DOM
       function addTodoToList(todo) {
           const li = document.createElement('li');
           li.textContent = todo.task;
           li.dataset.id = todo._id;

           if (todo.completed) {
               li.classList.add('completed');
           }

           li.addEventListener('click', () => {
               fetch(`/api/todos/${todo._id}`, {
                   method: 'PUT',
                   headers: {
                       'Content-Type': 'application/json'
                   },
                   body: JSON.stringify({ completed: !todo.completed })
               })
               .then(response => response.json())
               .then(updatedTodo => {
                   li.classList.toggle('completed', updatedTodo.completed);
               });
           });

           const deleteButton = document.createElement('button');
           deleteButton.textContent = 'Delete';
           deleteButton.style.marginLeft = '10px';
           deleteButton.addEventListener('click', event => {
               event.stopPropagation();
               fetch(`/api/todos/${todo._id}`, {
                   method: 'DELETE'
               })
               .then(() => {
                   li.remove();
               });
           });

           li.appendChild(deleteButton);
           todoList.appendChild(li);
       }
   });