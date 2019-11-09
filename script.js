// Tutaj dodacie zmienne globalne do przechowywania elementów takich jak np. lista czy input do wpisywania nowego todo
let list;
const initialList = ['Dzisiaj robię usuwanie', 'Nakarm psa'];
let modal;
let modalClose; 
let modalClose2;
let editList;
let modalInput;
let mainInput;
let addItem;
let lastID = 0;

function main() {
  prepareDOMElements();
  prepareDOMEvents();
  prepareInitialList();
}

function prepareDOMElements() {
  // To będzie idealne miejsce do pobrania naszych elementów z drzewa DOM i zapisanie ich w zmiennych
  list = document.getElementById('list');
  modal = document.querySelector(".modal");
  modalClose = document.querySelector(".close"); 
  modalClose2 = document.querySelector("#cancelTodo");
  editList = document.querySelector("#acceptTodo");
  modalInput = document.getElementById('popupInput');
  mainInput = document.getElementById('myInput');
  addItem = document.getElementById('addTodo');
}

function prepareDOMEvents() {
  // Przygotowanie listenerów
  list.addEventListener('click', listClickManager);
  addItem.addEventListener('click', addNewElementToList);

}

function prepareInitialList() {
  // Tutaj utworzymy sobie początkowe todosy. Mogą pochodzić np. z tablicy
  initialList.forEach(todo => {
    addNewElementToList(todo);
  });
}

function addNewElementToList(title   /* Title, author, id */) {
  //obsługa dodawanie elementów do listy
  // $list.appendChild(createElement('nowy', 2))
  const newElement = createElement(title);
  list.appendChild(newElement);
}

function createElement(title /* Title, author, id */) {
  // Tworzyc reprezentacje DOM elementu return newElement
  // return newElement
  const newElement = document.createElement('li');
  newElement.id = 'todo-' + (++lastID);

  const titleElement = document.createElement('span');
  titleElement.innerText = title;
  newElement.appendChild(titleElement);


  // const newButton = document.createElement('button'); // tworzymy nowy button
  // newButton.innerHTML = 'edytuj'; // dodajemy napis w buttonie 'edytuj'
  // newButton.classList.add('edit')
  // newElement.appendChild(newButton);  // dodajemy przycisk do naszej komórki   
  
  // const newButton2 = document.createElement('button'); // tworzymy nowy button
  // newButton2.innerHTML = 'usuń'; // dodajemy napis w buttonie 'delete'
  // newButton2.classList.add('delete')
  // newElement.appendChild(newButton2);  // dodajemy przycisk do naszej komórki
  
  // const newButton3 = document.createElement('button'); // tworzymy nowy button
  // newButton3.innerHTML = 'wykonane'; // dodajemy napis w buttonie 'wykonane'
  // newButton3.classList.add('done')
  // newElement.appendChild(newButton3);  // dodajemy przycisk do naszej komórki  

    return newElement;
}



function listClickManager(event) {
  // Rozstrzygnięcie co dokładnie zostało kliknięte i wywołanie odpowiedniej funkcji
 
    let id = event.target.parentElement.id;

  if (event.target.className === 'delete') {
      removeListElement(id);
  } else if (event.target.className === 'edit'){
      let title = document.querySelector('#' + id).querySelector('span')
      editListElement(id, title);
  } else if (event.target.className === 'done') {
    titleElement(id).classList.add('doneItem')
  }
  
}

function removeListElement(id) {
    let liElement = document.querySelector('#' + id);
    list.removeChild(liElement);
}

function editListElement(id, title) {

}




//TRZEBA DODAC OD EDYTUJ 
function openPopup() {
    modal.style.display = "block";
}

// modalClose.onclick = function() {
//     modal.style.display = "none";
//   }

// modalClose2.onclick = function() {
//     modal.style.display = "none";
//   }





document.addEventListener('DOMContentLoaded', main);