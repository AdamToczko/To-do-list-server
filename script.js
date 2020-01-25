
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
    // addNewElementToList(mainInput.value);
    // mainInput.value = '';
    axios.post('http://195.181.210.249:3000/todo/', {title: mainInput.value})
      .then(function (response) {
      if (response.status === 200) {
      getTodosFromServer();
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


// function removeListElement(event) {
//   // const line = document.querySelector('li[data-id="' + currentItem + '"]');
//   // list.removeChild(line); 
//   //tu sie trzeba odwolac do czesci serwerowej 
//   event.target.parentElement.querySelector('li').id
  

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
  
  // editTodos(currentItem);
}

// function editTodos() {
//   const line = document.querySelector('li[data-id="' + currentItem + '"]');
  
//   };

  function editAccept () {
    const line2 = document.querySelector('li[data-id="' + currentItem + '"] span');
    const title = popupInput.value;
    axios.put(`http://195.181.210.249:3000/todo/${currentItem}`, { title })
  .then(function () { 
    line2.innerText = title
  })
  modal.style.display = "none";
  }


// MARK AS DONE W WERSJI NIE SERWEROWEJ 
function markAsDone() {
  const line3 = document.querySelector('li[data-id="' + currentItem + '"] span');
  line3.classList.add('listCompleted'); //TO CZESC NIE SERWEROWA  
 //tu sie trzeba polaczyc jakos z funkcja serwerowa ponizej ??
  
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
  //obsługa dodawanie elementów do listy
  
  const newElement = createElement(title, id, extra);
  list.appendChild(newElement);
  

}


function createElement(title, id, extra) {
  // Tworzyc reprezentacje DOM elementu return newElement
  // currentId++; czesc nie serwerowa 

  const newElement = document.createElement('li');
  newElement.dataset.id = id;
  const titleElement = document.createElement('span');
  titleElement.innerText = title;
  titleElement.classList.add('styling')
  newElement.appendChild(titleElement);
  

  const newButton = document.createElement('button'); // tworzymy nowy button
  newButton.innerHTML = 'edytuj'; // dodajemy napis w buttonie 'edytuj'
  newButton.classList.add('edit')
  newElement.appendChild(newButton);  // dodajemy przycisk do naszej komórki   
  
  const newButton2 = document.createElement('button'); // tworzymy nowy button
  newButton2.innerHTML = 'usuń'; // dodajemy napis w buttonie 'delete'
  newButton2.classList.add('delete')
  newElement.appendChild(newButton2);  // dodajemy przycisk do naszej komórki
  
  const newButton3 = document.createElement('button'); // tworzymy nowy button
  newButton3.innerHTML = 'wykonane'; // dodajemy napis w buttonie 'wykonane'
  newButton3.classList.add('done')
  newElement.appendChild(newButton3);  // dodajemy przycisk do naszej komórki  

   return newElement;
//   if (extra == true) {
//     newList.classList.add('listCompleted');  //CZY TAK JAK BY SIE UDALO USTAWIC MARKED?
// }
}
 


function listClickManager(event) {
  // Rozstrzygnięcie co dokładnie zostało kliknięte i wywołanie odpowiedniej funkcji
 
  currentItem = event.target.parentElement.dataset.id;
  if (event.target.className === 'delete') {
    removeTodos ();
  } else if (event.target.className === 'edit'){
      editListElement();
  } else if (event.target.className === 'done') {
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
