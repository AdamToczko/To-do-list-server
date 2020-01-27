
let list;
const initialList = ['Dzisiaj robię usuwanie', 'Nakarm psa'];
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

function addNewTodo() {
  if (mainInput.value.trim() !== ''){

    axios.post('http://195.181.210.249:3000/todo/', {title: mainInput.value})
      .then(function (response) {
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
  .then(function (response) {
    response.data.forEach(function(todo) {
      addNewElementToList(todo.title, todo.id, todo.extra);
    });
  }).catch(function (e) {
    console.log(`mamy error: ${e}`);
  }).finally(function () {
    hideLoader(); 
  });
}

function removeTodos () {
  axios.delete(`http://195.181.210.249:3000/todo/${currentItem}`)
  .then(function () { 
    const line = document.querySelector('li[data-id="' + currentItem + '"]');
    list.removeChild(line); 
});
}


function editListElement(event) {
  openPopup();
  text = document.querySelector('li[data-id="' + currentItem + '"] span').textContent;
  popupInput.value = text; 
  
}


  function editAccept () {
    const line2 = document.querySelector('li[data-id="' + currentItem + '"] span');
    const title = popupInput.value;
    axios.put(`http://195.181.210.249:3000/todo/${currentItem}`, { title })
  .then(function () { 
    line2.innerText = title
  })
  modal.style.display = "none";
  }


// MARK AS DONE Without server
function markAsDone() {
  const line3 = document.querySelector('li[data-id="' + currentItem + '"] span');
  line3.classList.add('listCompleted'); 
 
  
}


// function markToDoAsDoneToServer (id) {
//   axios.put('http://195.181.210.249:3000/todo/' + id, 
// {extra: true})
//    .then(function () { 
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



function addNewElementToList(title, id, extra) {
  
  const newElement = createElement(title, id, extra);
  list.appendChild(newElement);
  

}


function createElement(title, id, extra) {
 

  const newElement = document.createElement('li');
  newElement.dataset.id = id;
  const titleElement = document.createElement('span');
  titleElement.innerText = title;
  titleElement.classList.add('styling')
  newElement.appendChild(titleElement);
  

  const newButton = document.createElement('button'); 
  newButton.innerHTML = 'EDIT'; 
  newButton.classList.add('edit')
  newButton.classList.add('btn-primary')
  newElement.appendChild(newButton);   
  
  const newButton2 = document.createElement('button'); 
  newButton2.innerHTML = 'DELETE'; 
  newButton2.classList.add('delete')
  newButton2.classList.add('btn-danger')
  newElement.appendChild(newButton2);  
  
  const newButton3 = document.createElement('button'); 
  newButton3.innerHTML = 'DONE'; 
  newButton3.classList.add('done')
  newButton3.classList.add('btn-light')
  newElement.appendChild(newButton3);  

   return newElement;


}
 


function listClickManager(event) {
  
 
  currentItem = event.target.parentElement.dataset.id;
  if (event.target.className === 'delete btn-danger') {
    removeTodos ();
  } else if (event.target.className === 'edit btn-primary'){
      editListElement();
  } else if (event.target.className === 'done btn-light') {
      markAsDone();
  }
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
