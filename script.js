let allTasks = JSON.parse(localStorage.getItem('tasks')) || [];
let valueInput = '';
let input = null;

window.onload = init = async () => {
  input = document.getElementById('add-task');
  input.addEventListener('change', updateValue);
  const resp = await fetch('http://localhost:8000/allTasks', {
    method: 'GET'
  });
  const result = await resp.json();
  allTasks = result.data;
  localStorage.setItem('tasks', JSON.stringify(allTasks));
  render();
}

const onClickButton = async () => {
  const resp = await fetch('http://localhost:8000/createTask', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      text: valueInput,
      isCheck: false
    })
  });
  const result = await resp.json();
  allTasks.push(result.data);
  localStorage.setItem('tasks', JSON.stringify(allTasks));
  valueInput = '';
  input.value = '';
  render();  
  if(!result.data) {
    alert(`An error has occurred!`)
  };
};

const updateValue = (event) => {
  valueInput = event.target.value;
}

const render = () => {
  const content = document.getElementById('content-page');
  while (content.firstChild) {
    content.removeChild(content.firstChild);
  }
  allTasks.sort((a, b) => a.isCheck - b.isCheck);
  allTasks.map((item, index) => {
    const { text, isCheck, id } = item;
    const container = document.createElement('div')
    container.id = `task-${index}`;
    container.className = 'task-container';
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = item.isCheck;
    checkbox.onchange = () => {
      onChangeCheckBox(index);
    };
    container.appendChild(checkbox);
    const text1 = document.createElement('p');
    text1.innerText = text;
    text1.className = isCheck ? 'text-task done-text' : 'text-task';
    container.appendChild(text1);
    const imageEdit = document.createElement('img');
    imageEdit.src = "edit.svg";
    container.appendChild(imageEdit);
    allTasks.forEach(object => {
      if (text1.className === 'text-task') {
        imageEdit.onclick = () => {
          const inputTask = document.createElement('input');
          inputTask.type = 'text';
          inputTask.value = text;
          container.replaceChild(inputTask, text1);
          imageEdit.onclick = async () => {
            allTasks[index].text = inputTask.value;
            const resp = await fetch('http://localhost:8000/updateTask', {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'Access-Control-Allow-Origin': '*'
              },
              body: JSON.stringify(allTasks[index])
            });
            localStorage.setItem('tasks', JSON.stringify(allTasks));
            render();
          }
          imageDelete.onclick = () => {
            render();
          }
        }
      }
    });

    const imageDelete = document.createElement('img');
    imageDelete.src = "delete.svg";
    container.appendChild(imageDelete);
    imageDelete.onclick = () => {
      deleteValue(index);
    }
    content.appendChild(container);
  });
}

const deleteValue = async (index) => {
  const id = allTasks[index]._id
  const resp = await fetch(`http://localhost:8000/deleteTask?_id=${id}`, {
    method: 'DELETE'
  });

  const result = await resp;
  if (result.status === 200) {
    allTasks = allTasks.filter((item, index1) => (index1 !== index));
    localStorage.setItem('tasks', JSON.stringify(allTasks));
    render();
  } else {
    alert(`An error has occurred!`)
  }
};

const onChangeCheckBox = (index) => {
  allTasks[index].isCheck = !allTasks[index].isCheck;
  localStorage.setItem('tasks', JSON.stringify(allTasks));
  render();
}

const onClickButtonDelete = () => {
  window.localStorage.removeItem('tasks');
  allTasks = [];
  render();
}

const onClickButtonClear = () => {
  window.localStorage.clear();
  allTasks = [];
  render();
}

