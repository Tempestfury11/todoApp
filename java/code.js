const form = document.querySelector('#todo-form')
const input = document.querySelector('#input')
const buttons = document.querySelectorAll('.view')
const allBtn = document.querySelector('#all')
const completedBtn = document.querySelector('#completed-items')
const nonCompletedBtn = document.querySelector('#uncompleted-items')
const list = document.querySelector('#list')
const completeAllBtn = document.querySelector('#mark-as-complete')
const clearBtn = document.querySelector('#clear-list')
const STORAGE_PREFIX = "TODO_LIST"
const TODOS_STORAGE_KEY = `${STORAGE_PREFIX}-todos`
let todos = []
todos.forEach(addTodoToList)

// submit form
form.addEventListener("submit", e => {
    e.preventDefault()

    const userInput = input.value
    if (userInput === "") return

    const newTodo = {
        name: userInput,
        complete: false,
        id: new Date().valueOf().toString()
    }

    todos.push(newTodo)
    addTodoToList(newTodo)
    input.value = ""

    buttons.forEach(button => {
        if(todos.length > 0)
        button.classList.remove('hide')
    }) 
})

// show all todos
allBtn.addEventListener("click", () => {
    const allItems = Array.from(list.children)
    allItems.forEach(todo => todo.classList.remove('hide'))
})

// only show completed items
completedBtn.addEventListener("click", () => {
    const allItems = Array.from(list.children)
    allItems.forEach(todo => todo.classList.remove('hide'))
    const completed = allItems.filter(todo => !todo.classList.contains('complete'))
    completed.forEach(todo => todo.classList.add('hide'))
})

// only show uncompleted items
nonCompletedBtn.addEventListener("click", () => {
    const allItems = Array.from(list.children)
    allItems.forEach(todo => todo.classList.remove('hide'))
    const completed = allItems.filter(todo => todo.classList.contains('complete'))
    completed.forEach(todo => todo.classList.add('hide'))
})

// clear list
clearBtn.addEventListener("click", () => {
    const allItems = Array.from(list.children)
    allItems.forEach(item => item.remove())
    todos = []
    buttons.forEach(button => {
        button.classList.add('hide')
    })
})

// mark all items as completed
completeAllBtn.addEventListener("click", () => {
    const allItems = Array.from(list.children)
    allItems.forEach(item => {
        item.classList.add('complete')
        const button = item.children[1]
        button.classList.add('item-complete')
    })

    for (let i = 0; i < allItems.length; i++) {
        const currentItem = allItems[i]

        const todoId = currentItem.dataset.todoId
        const todo = todos.find(todo => todo.id === todoId)
        todo.complete = currentItem.classList.contains('complete')
        currentItem.querySelector('.checkbox').checked = true
    }
})

// mark item as complete ( if user clicks outside of label )
list.addEventListener("click", e => {
    if (!e.target.matches('.list-item')) return

    const currentItem = e.target
    currentItem.classList.toggle('complete')

    const todoId = e.target.dataset.todoId
    const todo = todos.find(todo => todo.id === todoId)
    todo.complete = currentItem.classList.contains('complete')
    currentItem.querySelector('.checkbox').checked = todo.complete
})

// checkboxes
list.addEventListener("change", e => {
    if (!e.target.matches('.checkbox')) return

    const parent = e.target.closest('.list-item')
    const button = parent.children[1]

    if (e.target.checked) {
        parent.classList.add('complete')
        button.classList.add('item-complete')
    } else {
        parent.classList.remove('complete')
        button.classList.remove('item-complete')
    }

    const todoId = parent.dataset.todoId
    const todo = todos.find(todo => todo.id === todoId)
    todo.complete = parent.classList.contains('complete')
})

// delete item
list.addEventListener("click", e => {
    if (!e.target.matches('.delete-button')) return

    parent = e.target.closest('.list-item')
    parent.remove()
    const todoId = parent.dataset.todoId
    todos = todos.filter(todo => todo.id !== todoId)

    buttons.forEach(button => {
        if(todos.length === 0)
        button.classList.add('hide')
    }) 
})

// render todo
function addTodoToList(todo) {
    const item = document.createElement('li')
    item.classList.add('list-item')
    item.dataset.todoId = todo.id

    const label = document.createElement('label')

    const checkbox = document.createElement('input')
    checkbox.setAttribute("type", "checkbox")
    checkbox.classList.add('checkbox')
    checkbox.checked = todo.complete

    if(checkbox.checked) {
        item.classList.add('complete')
    } else (item.classList.remove('complete'))

    label.appendChild(checkbox)

    const span = document.createElement('span')
    span.innerText = todo.name
    label.appendChild(span)
    item.appendChild(label)

    const button = document.createElement('button')
    button.innerText = "Delete"
    button.classList.add('delete-button')
    item.appendChild(button)

    list.appendChild(item)
}