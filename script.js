
let list;
let modal;
let modalClose; 
let modalClose2;
let editList;
let mainInput;
let addItem;
let form;

let currentItem;
let loader;

function main() {
  prepareDOMElements();
  prepareDOMEvents();
  getTodosFromServer();
}

function prepareDOMElements() {
  
  list = document.getElementById('list');
  modal = document.querySelector(".modal");
  modalClose = document.querySelector(".close"); 
  modalClose2 = document.querySelector("#cancelTodo");
  editList = document.querySelector("#acceptTodo");
  mainInput = document.getElementById('myInput');
  addItem = document.getElementById('addTodo'); 
  form = document.getElementById('addForm');
  loader = document.querySelector('.loaderBox');
}

function prepareDOMEvents() {
  
  list.addEventListener('click', listClickManager);
  form.addEventListener('submit', addNewItemViaForm);
  modalClose.addEventListener('click', modalClosed);
  modalClose2.addEventListener('click', modalClosed2);
  editList.addEventListener('click', editAccept);
}

function addNewItemViaForm (e) {
  e.preventDefault();
  addNewTodo();
}

function addNewTodo(title,id,extra) {
  if (mainInput.value.trim() !== ''){
    createElement(title, id, extra)
    axios.post('http://195.181.210.249:3000/todo/', 
    {title: mainInput.value})
      .then((response) => {
      if (response.status === 200) {
      getTodosFromServer();
      mainInput.value = '';
    }
  });
  }
}

function getTodosFromServer () {
  showLoader();
  list.innerHTML = ""; //cleaning added when reloading list after new element added
  axios.get('http://195.181.210.249:3000/todo/')
  .then((response) =>  {
    response.data.forEach((todo) => {
      addNewElementToList(todo.title, todo.id, todo.extra);
    });
  }).catch((e) => {
    console.log(`mamy error: ${e}`)
    const message = document.getElementById('errorMessage')
    message.classList.add('error')
    message.innerText = `Failed to: ${e}`
    
  }).finally(() => {
    hideLoader(); 
  });
}

function addNewElementToList(title, id, extra) {
  const newElement = createElement(title, id, extra);
  list.appendChild(newElement);
}

function createElement(title, id, extra) {
 
  let newElement = document.createElement('li');
  newElement.dataset.id = id;
  const titleElement = document.createElement('div');
  titleElement.innerText = title;
  titleElement.classList.add('task-style')
  newElement.appendChild(titleElement);
  

  const divBtns = document.createElement('div');
  divBtns.classList.add('buttons-style')
  newElement.appendChild(divBtns)

  const newButton = document.createElement('button'); 
  newButton.innerHTML = 'EDIT'; 
  newButton.classList.add('edit','btn','btn-primary','btn-sm')
  divBtns.appendChild(newButton);  
  
  const newButton2 = document.createElement('button'); 
  newButton2.innerHTML = 'DELETE'; 
  newButton2.classList.add('delete','btn','btn-danger','btn-sm')
  divBtns.appendChild(newButton2); 
  
  const newButton3 = document.createElement('button'); 
  newButton3.innerHTML = 'DONE'; 
  newButton3.classList.add('done','btn','btn-secondary','btn-sm')
  divBtns.appendChild(newButton3); 

  return newElement;

  //   if (extra) {
//     newElement.classList.add('listCompleted');
//     return newElement;
// } 

}
 

function listClickManager(event) {
  
 
  currentItem = event.target.parentElement.parentElement.dataset.id;
  if (event.target.className === 'delete btn btn-danger btn-sm') {
    removeTodos ();
  } else if (event.target.className === 'edit btn btn-primary btn-sm'){
      editListElement();
  } else if (event.target.className === 'done btn btn-secondary btn-sm') {
      markAsDone();
  }
}



function removeTodos () {
  axios.delete(`http://195.181.210.249:3000/todo/${currentItem}`)
  .then(() =>{ 
    const removeItem = document.querySelector('li[data-id="' + currentItem + '"]');
    list.removeChild(removeItem); 
});
}


function editListElement(event) {
  openPopup();
  text = document.querySelector('li[data-id="' + currentItem + '"] div').textContent;
  popupInput.value = text; 
  
}


  function editAccept () {
    const editSelect = document.querySelector('li[data-id="' + currentItem + '"] div');
    const title = popupInput.value;
    axios.put(`http://195.181.210.249:3000/todo/${currentItem}`, { title })
  .then(() => { 
    editSelect.innerText = title
  })
  modal.style.display = "none";
  }


 //MARK AS DONE Without server
 function markAsDone() {
 const markCompleted = document.querySelector('li[data-id="' + currentItem + '"] div');
markCompleted.classList.add('listCompleted'); 
//  const markCompleted2 = markCompleted.classList.toggle('listCompleted')
//  markToDoAsDoneToServer(markCompleted.id, markCompleted2)
 }

//  function markToDoAsDoneToServer (id) {
//    axios.put('http://195.181.210.249:3000/todo/' + id, 
//   {extra: true})
//    .then(() => { 
//       list.innerHTML = '';
//       getTodosFromServer();
//   }
// )
// }



function showLoader () {
  loader.classList.add('loaderBoxShow');
}

function hideLoader () {
  loader.classList.remove('loaderBoxShow');
}


function openPopup() {
    modal.style.display = "block";
}

function modalClosed() {
  modal.style.display = "none";
}

function modalClosed2() {
  modal.style.display = "none";
}






document.addEventListener('DOMContentLoaded', main);
