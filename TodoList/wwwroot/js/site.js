const baseURL = 'https://localhost:44376/Home';
let todoList;
const todoListContainer = document.querySelector('ol');
const createTicketBtn = document.querySelector('.show-popup-create-ticket-btn');
const popupCreateTicket = document.querySelector('.popup-create-ticket');
const addTicketBtn = document.querySelector('.add-tecket-btn');
const closePopupBtn = document.querySelector('.close-popup-btn');
const textareaAddTicket = document.querySelector('.text-new-ticket');

closePopupBtn.addEventListener('click', event => { popupCreateTicket.classList.toggle('hide') });
createTicketBtn.addEventListener('click', event => { popupCreateTicket.classList.toggle('hide'); textareaAddTicket.value = "" });

addTicketBtn.addEventListener('click', on_clickAddTicketBtn);

getTodoList();

async function on_clickAddTicketBtn(event) {

    const res = await fetch(baseURL + '/Add', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
        body: JSON.stringify(textareaAddTicket.value)
    });

    if (res.ok) {
        popupCreateTicket.classList.toggle('hide');

        todoList = await res.json();
        todoList.sort(elem => elem.done);

        viewTodoList();
    }
}

async function on_checkedTodoItem(event) {
    const index = getIndexTodoItem(event.currentTarget.id);

    todoList[index].done = event.currentTarget.checked;

    const res = await fetch(baseURL + '/EditItem', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
        body: JSON.stringify({ Id: todoList[index].id, Text: todoList[index].text, Done: todoList[index].done })
    })

    viewTodoList();

}

async function on_clickRemoveBtn(event) {
    const index = getIndexTodoItem(event.currentTarget.value);

    const res = await fetch(baseURL + '/RemoveItem', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
        body: JSON.stringify(todoList[index].id)
    });

    if (res.ok) {
        todoList.splice(index, 1);
    }
    viewTodoList();
}

function on_clickEditBtn(event) {
    const index = getIndexTodoItem(event.currentTarget.value);
    const ticket = todoListContainer.children[index];

    ticket.innerHTML = editTicketTemplate.replace(/todoID/g, todoList[index].id).replace(/todoText/g, todoList[index].text);

    ticket.querySelector('textarea').value = todoList[index].text;

    ticket.querySelector('.save-btn').addEventListener('click', on_clickBtnSave);

    ticket.querySelector('.cancel-btn').addEventListener('click', on_clickBtnCancel);
}

async function on_clickBtnSave(event) {
    const index = getIndexTodoItem(event.currentTarget.value);
    const textarea = document.querySelector('.edit-textarea');

    const res = await fetch(baseURL + '/EditItem', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: 
            JSON.stringify({
                Id: todoList[index].id,
                Text: textarea.value,
                Done: todoList[index].done
            })
    });

    if (res.ok) {
        todoList = await res.json();
        viewTodoList();
    }
}

function on_clickBtnCancel(event) {
    viewTodoList();
}

async function getTodoList() {

    let res = await fetch(baseURL + '/GetTodoList', { method: 'POST' });

    if(!res.ok)
    {
        return null;
    }

    todoList = await res.json();
    viewTodoList();
}

function viewTodoList() {
    todoListContainer.innerHTML = "";

    todoList = sort(todoList);

    if (todoList != null) {
        todoList.forEach(elem => {
            todoListContainer.appendChild(createTodoListItem(elem.id, elem.text, elem.done))
        });
    }
}

function sort(arr) {
    doneArr = arr.filter(elem => elem.done);
    notDoneArr = arr.filter(elem => !elem.done);

    return notDoneArr.concat(doneArr);
}

function getIndexTodoItem(id) {
    for (let i = 0; i < todoList.length; i++) {
        if (todoList[i].id == id) {
            return i;
        }
    }
}

function createTodoListItem(id, text, done) {
    const li = document.createElement('li');
    li.classList.add('ticket');

    li.innerHTML = todoItemTemplate.replace(/todoID/g, id).replace(/todoText/g, text);

    li.querySelector('input').addEventListener('change', on_checkedTodoItem);

    li.querySelector('input').checked = done;

    li.querySelector('.edit-btn').addEventListener('click', on_clickEditBtn);

    li.querySelector('.remove-btn').addEventListener('click', on_clickRemoveBtn);

    return li;
}


const todoItemTemplate = `
    <div class="ticket-container">
        <div class="checkbox-container">
            <input type="checkbox" id="todoID" /> <label for="todoID">todoText</label>
        </div>
        <div class="ticket-btn-container">
            <button class="edit-btn btn" type="button" value="todoID">Edit</button>
            <button class="remove-btn btn" type="button" value="todoID">Remove</button>
        </div>
    </div>
`;

const editTicketTemplate =  `
    <div class="ticket-container">
        <div class="input-container">
            <textarea class="edit-textarea"> </textarea>
        </div>
        <div class="ticket-btn-container">
            <button class="save-btn btn" type="button" value="todoID">Save</button>
            <button class="cancel-btn btn" type="button" value="todoID">Cancel</button>
        </div>
    </div>
`;