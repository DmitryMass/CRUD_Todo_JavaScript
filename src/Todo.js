import { create, deleteTodo, getTodoList, updateTodo } from './Api.js';

const CLASSES = {
  DELETE_BTN: 'deleteBtn',
  TODO_ITEM: 'list__item',
  DONE_COLOR: 'green',
  EDIT_BTN: 'editBtn',
};
const SELECTORS = {
  TODO_ITEM: '.list__item',
};
const list = document.querySelector('.list');
const input = document.querySelector('#input');
const form = document.querySelector('.form');

form.addEventListener('submit', onFormSubmit);
list.addEventListener('click', onListClick);

let listTodo = [];
let editTodoId = null;

init();
async function init() {
  try {
    const data = await getTodoList();
    setListTodo(data);
    renderTodoList(data);
  } catch (e) {
    handleError(e);
  }
}

//

function onFormSubmit(event) {
  event.preventDefault();

  const newTodo = getNewTodo();

  if (!isValidTodo(newTodo)) {
    showError();
    return;
  }

  if (newTodo.id) {
    updateCurrentTodo(newTodo);
  } else {
    createNewTodo(newTodo);
  }

  clearInput();
}

function onListClick(e) {
  const target = e.target;
  const todoItem = getItem(target);
  if (todoItem) {
    if (target.classList.contains(CLASSES.EDIT_BTN)) {
      editTodo(todoItem);
    }
    if (target.classList.contains(CLASSES.DELETE_BTN)) {
      removeItem(todoItem);
    }
    if (target.classList.contains(CLASSES.TODO_ITEM)) {
      addDoneColor(todoItem);
    }
  }
}

function setListTodo(list) {
  listTodo = list;
}

function listTodoAddItem(todo) {
  listTodo.push(todo);
}

function getItem(target) {
  return target.closest(SELECTORS.TODO_ITEM);
}

async function updateCurrentTodo(newTodo) {
  try {
    const data = await updateTodo(newTodo.id, newTodo);
    init();
  } catch (e) {
    handleError(e);
  }
}

async function createNewTodo(newTodo) {
  try {
    const result = await create(newTodo);
    addTodo(result);
    listTodoAddItem(result);
  } catch (e) {
    handleError(e);
  }
}

function getNewTodo() {
  const todo = getTodoById(editTodoId);

  return {
    status: false,
    ...todo,
    title: input.value,
  };
}

function renderTodoList(todoList) {
  const html = todoList.map(generateTodoHtml).join('');

  list.innerHTML = html;
}

function addTodo(todo) {
  const html = generateTodoHtml(todo);

  list.insertAdjacentHTML('beforeend', html);
}

function generateTodoHtml(todo) {
  const done = todo.status ? CLASSES.DONE_COLOR : '';

  return `
      <li class='${CLASSES.TODO_ITEM} ${done}' data-id=${todo.id} >
          ${todo.title}
          <span>
            <button class=${CLASSES.DELETE_BTN}>Delete</button>
            <button class=${CLASSES.EDIT_BTN}>Edit</button>
          </span>
      </li>
    `;
}

function editTodo(todoEl) {
  const id = getTodoId(todoEl);
  const todo = getTodoById(id);

  editTodoId = id;
  input.value = todo.title;
}

async function removeItem(todoEl) {
  const id = getTodoId(todoEl);
  try {
    const deletedTodo = await deleteTodo(id);
    todoEl.remove();
  } catch (e) {
    handleError(e);
  }
}

async function addDoneColor(todoEl) {
  const id = getTodoId(todoEl);
  const todo = getTodoById(id);
  const status = !todo.status;
  try {
    const updatedTodo = await updateTodo(id, { status: status });
    todoEl.classList.toggle(CLASSES.DONE_COLOR);
  } catch (e) {
    handleError(e);
  }
}

function getTodoId(el) {
  return el.dataset.id;
}

function isValidTodo(todo) {
  return todo.title !== '';
}

function showError() {
  return alert('Пустое поле');
}

function clearInput() {
  editTodoId = null;
  input.value = '';
}

function handleError(e) {
  alert(e.message);
}

function getTodoById(id) {
  return listTodo.find((todo) => todo.id === id);
}
