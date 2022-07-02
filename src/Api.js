const URL = 'https://62c063fdc134cf51cece6b18.mockapi.io/api';

const request = async (url, method = 'GET', body = null) => {
  const res = await fetch(`${URL}${url}`, {
    method,
    body: body ? JSON.stringify(body) : null,
    headers: {
      'Content-type': 'application/json',
    },
  });

  if (res.ok) {
    return res.json();
  }
  throw new Error('Sorry / Api error');
};

export async function getTodoList() {
  try {
    const data = await request('/todo');
    console.log(data);
    return data;
  } catch (e) {
    throw new Error('Не могу получить список дел');
  }
}

export async function getOneTodos(id) {
  try {
    const res = await fetch(`/todo/${id}`);
    return res;
  } catch (e) {
    throw new Error(`Не могу получить id ${id}`);
  }
}

export async function create(todo) {
  try {
    const res = await request('/todo', 'POST', todo);
    return res;
  } catch (e) {
    throw new Error('Не могу создать новый туду');
  }
}

export async function updateTodo(id, todo) {
  try {
    const data = await request(`/todo/${id}`, 'PUT', todo);
    return data;
  } catch (e) {
    throw new Error('Не могу обновить новый туду');
  }
}

export async function deleteTodo(id) {
  try {
    const res = await request(`/todo/${id}`, 'DELETE');
    return res;
  } catch (e) {
    throw new Error(`Не могу удалить туду ${id}`);
  }
}
