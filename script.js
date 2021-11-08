let allTasks = JSON.parse(localStorage.getItem('tasks'))|| [];
let valueInput = '';
let input = null;

window.onload = function init() {
  input = document.getElementById('add-task');
  input.addEventListener('change', updateValue)
  localStorage.setItem('tasks', JSON.stringify(allTasks));
  render();
}

onClickButton = () => {
  allTasks.push({
    text: valueInput,
    isCheck: false  
  }); 
  localStorage.setItem('tasks', JSON.stringify(allTasks));
  valueInput = '';
  input.value = '';
  
  render();
}

updateValue = (event) => {
  valueInput = event.target.value;
}
render = () => {
  const content = document.getElementById('content-page');
  while (content.firstChild) {
    content.removeChild(content.firstChild);
  }
  allTasks.sort((a, b) => a.isCheck - b.isCheck);


  allTasks.map((item, index) => {
    const container = document.createElement('div');
    container.id = `task-${index}`;
    container.className = 'task-container'
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = item.isCheck;
    checkbox.onchange = function () {
      onChangeCheckBox(index);
    };
    container.appendChild(checkbox);
    const text = document.createElement('p');
    text.innerText = item.text;
    text.className = item.isCheck ? 'text-task done-text' : 'text-task';
    container.appendChild(text);

    const imageEdit = document.createElement('img');
    imageEdit.src = "Редактирование.svg";
    container.appendChild(imageEdit);
    allTasks.forEach(event => {
    if (text.className === 'text-task') {
    imageEdit.onclick = () => {
      const inputTask = document.createElement('input');
      inputTask.type = 'text';
      inputTask.value = text.innerText;
      container.replaceChild(inputTask, text);
      imageEdit.onclick = () => {
        item.text = inputTask.value;
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
const deleteValue = (index) => {
  allTasks  = allTasks.filter((item, index1) => (index1 !== index));
  localStorage.setItem('tasks', JSON.stringify(allTasks));
  render();
};

onChangeCheckBox = (index) => {
  allTasks[index].isCheck = !allTasks[index].isCheck;
  localStorage.setItem('tasks', JSON.stringify(allTasks));
  render();
}
 
onClickButtonClear = () => {
  window.localStorage.clear();
  location.reload();
}

onClickButtonDelete = () => {
  window.localStorage.removeItem('tasks')
  location.reload();
}

