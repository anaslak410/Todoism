
// class for todo elements
class TodoElem {
    todoRoot;
    todoCheckBox;
    todoNameInput;
    todoNameText;
    todoRemoveButt;
    container;

    constructor(container) {
        this.todoCheckBox = this.createTodoCheckbox();
        this.todoNameInput = this.createTodoNameInput();
        this.todoNameText =  this.createTodoNameText();      
        this.todoRemoveButt = this.createTodoRemoveButt();
        this.todoRoot =  this.createTodoRoot();      

        this.handleNameInputFinish();
        this.handleNameTextDbClick();
        this.appendElemsInTodoRoot();

        this.container = container

    }
    createTodoRoot(){
        let todoRoot = document.createElement("li");

        // make root element draggable when there is content and set their drag data
        todoRoot.setAttribute("draggable", true);
        todoRoot.addEventListener("dragstart", (e) => {
            // e.dataTransfer.setData("text/plain", this.todoNameText.innerHTML);
            e.dataTransfer.setData("text/number", [...todoRoot.parentNode.children].indexOf(todoRoot));
        })

        todoRoot.addEventListener("dragover", (e) => {
            e.preventDefault();
        })

        // when dragged item enters zone 
        todoRoot.addEventListener("dragenter", (e) => {
            // todoRoot.classList.toggle("todoRootDragOn");
            todoRoot.style.backgroundColor = "#1D3461";
        })
        todoRoot.addEventListener("dragleave", (e) => {
            // todoRoot.classList.toggle("todoRoot");
            todoRoot.style.backgroundColor = "#F7F7FF";
        })

        // when dropped
        todoRoot.addEventListener("drop", (e) => this.handleDraggedRootDropped(e));

        todoRoot.className = "todoRoot";
        return todoRoot;
    }
    createTodoNameInput() {
        const todoNameInput = document.createElement("input");
        todoNameInput.type = "text";
        todoNameInput.className = "todoInput";
        return todoNameInput;
    }
    createTodoNameText() {
        const todoNameText = document.createElement("p");
        todoNameText.className = "todoText";
        todoNameText.style.display = "none";
        return todoNameText;
    }
    createTodoRemoveButt() {
        const todoRemoveButt = document.createElement("button");
        todoRemoveButt.addEventListener("click", () => {
            todoRemoveButt.parentElement.classList.toggle("animation");
            todoRemoveButt.parentElement.remove();
        })
        todoRemoveButt.className = "todoRemoveButt";
        todoRemoveButt.innerHTML = "X";
        return todoRemoveButt;
    }
    createTodoCheckbox() {
        const todoCheckBox = document.createElement("input");
        todoCheckBox.type = "checkbox";

        todoCheckBox.addEventListener("click", () => {
            todoCheckBox.parentElement.classList.toggle("completedTodo")
        })
        todoCheckBox.style.display = "none";
        todoCheckBox.className = "todoCheckBox";
        return todoCheckBox;
    }
    // events
    handleNameInputFinish() {
        ['blur', 'keyup'].forEach(eventType => this.todoNameInput.addEventListener(eventType, (e) => {
            if (e.target.value !== "" && (e.type != 'keyup' || e.keyCode === 13)) { // 13 is the code for the "enter" key 
                this.todoNameText.innerHTML = e.target.value;
                this.todoNameText.style.display = "inline";
                this.todoNameInput.style.display = "none";
                this.todoCheckBox.style.display = "inline";
            }
        }));
    }
    handleNameTextDbClick() {
        this.todoNameText.style.display = "none";
        this.todoNameInput.style.display = "inline";
        this.todoNameInput.focus();
        this.todoCheckBox.style.display = "none";
    }
    handleDraggedRootDropped(e) {
            // dont drag when there is no text
            if (this.todoNameText.innerHTML === "") {
                return;
            }

            let indexOfDragedonElem = [...this.todoRoot.parentNode.children].indexOf(this.todoRoot);
            let indexOfDragedElem = parseInt(e.dataTransfer.getData("text/number"));
            let dragedElem = this.container.children.item(indexOfDragedElem, 10);
            
            if(indexOfDragedElem > indexOfDragedonElem) {
                this.todoRoot.insertAdjacentElement('beforebegin', dragedElem);
            }
            else {
                this.todoRoot.insertAdjacentElement('afterend', dragedElem);
            }

    }
    // utilities
    appendElemsInTodoRoot() {
        this.todoRoot.appendChild(this.todoRemoveButt);
        this.todoRoot.appendChild(this.todoNameInput);
        this.todoRoot.appendChild(this.todoNameText);
        this.todoRoot.appendChild(this.todoCheckBox);
    }
    postInContainer(){
        this.container.appendChild(this.todoRoot);
    }
    insertValues(todoObject) {
        this.todoNameInput.style.display = "none";
        this.todoCheckBox.style.display = "inline";
        this.todoNameText.innerHTML = todoObject.name;
        this.todoNameText.style.display = "inline";
        this.todoCheckBox.checked = todoObject.checked;
    }
    postAtIndexInContainer(index) {
        this.container.insertBefore(this.todoRoot, this.container.children.item(todoObject.Pos))
    }
    // Getters
    get todoRoot() {
        return this.todoRoot;
    }
    get todoCheckBox() {
        return this.todoCheckBox;
    }
    get todoNameInput() {
        return this.todoNameInput;
    }
    get todoNameText() {
        return this.todoNameText;
    }
    get todoRemoveButt() {
        return this.todoRemoveButt;
    }
 }

// GLOBAL VARIABLES
const lists = [];
var loadedList = 0;
const todosContainerElem = document.getElementById("todos");
const listsContainerElem = document.getElementById("lists");
const saveListButt = document.getElementById("saveListButt");
const addTodoButt = document.getElementById("addTodoButt");
const addListButt = document.getElementById("addList");
var listNameField = document.getElementById("listNameField");

// replace list dialog
const replaceListDial = document.getElementById("replaceListDial");
const replaceListYes = document.getElementById("replaceListYes");
const replaceListNo = document.getElementById("replaceListNo");

// FUNCTIONALITY
const loadList = (id) => {
    removeAllChildren(todosContainerElem);
    const list =  getListById(id);
    list.todos.forEach(todo => postTodoElem(todo))
    // change name 
    listNameField.value = list.name;
    loadedList = list.id;
}
const createListElem = (list) => {
    const listElem = document.createElement("li");
    listElem.className = "listItem";
    listElem.id = list.id;
    listElem.innerHTML = list.name;
    
    listElem.addEventListener("click" ,() => loadList(list.id))
    return listElem;
}
const saveList = async (list) => {
    const listWithSameNameExists = listExists(list.name);
    if (loadedList === 0) {
        if (listWithSameNameExists) {
			await promptToreplaceList()
				.then(() => {
					console.log("list will be replaced");
					const oldListPos = getListPosFromName(list.name);
					lists[oldListPos] = list;
				})
				.catch(dat => console.log(dat, "didnt"));
        }
        else {
            lists.push(list);
        }
        loadedList = list.id;
    }
    else {
        if (listWithSameNameExists) {
            await promptToreplaceList()
                .then(() => {
                    console.log("list will be replaced");
                    lists[getListPosFromId(list.id)] = list;

                    const oldListPos = getListPosFromName(list.name);
                    lists.splice(oldListPos, 1);
                })
                .catch(dat => console.log(dat, "didnt"));
        }
        else {
            lists[getListPosFromId(list.id)] = list
        }
    }

    renderListContainer();
}
const replaceList = (list) => {

}
const renderListContainer = () => {
    removeAllChildren(listsContainerElem);
    const listElems = lists.map(list => createListElem(list))
    listElems.forEach(listElem => listsContainerElem.appendChild(listElem));
}
const promptToreplaceList = () => {
    replaceListDial.showModal();
    
    return new Promise((resolve, reject) => {
        replaceListYes.onclick = () => {
            resolve("yes")
            replaceListDial.close()
        }
        replaceListNo.onclick = () => {
            reject("no")
            replaceListDial.close()
        }
        }
    );   
}


// utils
const getListPosFromId = (id) => {
    const position = lists.findIndex(list => list.id === id)
    return position;
}
const getListPosFromName = (name) => {
    const position = lists.findIndex(list => list.name === name)
    return position;
}
const CreateTodoFromTodoElem = (root) => {
    const todo = {
        name : root.children.item(2).innerHTML,
        checked : root.children.item(3).checked,
        pos : [...root.parentNode.children].indexOf(root)
    }
    return todo;
}
const postTodoElem = (todo) => {
    const todoElem = CreateTodoElemFromTodo(todo);
    todoElem.postInContainer();
}
const CreateTodoElemFromTodo = (todo) => {
    const todoElem = new TodoElem(todosContainerElem);
    todoElem.insertValues(todo);
    return todoElem;
}
const removeAllChildren = (container) => {
    while (container.firstChild) {
        container.firstChild.remove();
    }
}
// excludes loaded list
const getListByName = (name) => {
    const result = lists.find(list => list.name === name);
    return result;
}
const getListById = (id) => {
    const result = lists.find(list => list.id === id);
    return result;
}
//EXCLUDES THE LOADED LIST
const listExists = (name) => {
    const exists = lists.filter(ele => ele.id !== loadedList).map(list => list.name).includes(name);
    return exists;
}
const CreateNewListFromTodos = () => {
    // get third item in each todoroot CHANGE THS IF YOU CHANGE THE ORDER OF ELEMENT ADDITION
    const todosArr = Array.from(todosContainerElem.children)
                          .map(root => CreateTodoFromTodoElem(root));

    const list = {
        name : listNameField.value,
        id : lists.length + 1, // WRONG WHY SHOULD IT HAVE THIS
        todos : todosArr
    }

    return list;
}
const CreateUpdatedListFromTodos = () => {
    // get third item in each todoroot CHANGE THS IF YOU CHANGE THE ORDER OF ELEMENT ADDITION
    const todosArr = Array.from(todosContainerElem.children)
                          .map(root => CreateTodoFromTodoElem(root));

    const list = {
        name : listNameField.value,
        id : loadedList, 
        todos : todosArr
    }

    return list;
}
const startNewList = () => {
        // remove todos and empty input name field
        removeAllChildren(todosContainerElem);
        listNameField.value = "";
        
        loadedList = 0;
}
const isEmpty = (obj) => {
    for(let key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}


// EVENT LISTENERS

// todo add button, when pressed create new todos
addTodoButt.addEventListener('click' , () => {
    const newTodoElem = new TodoElem(todosContainerElem);
    newTodoElem.postInContainer(todosContainerElem);
})

// call function that creates new list
addListButt.addEventListener("click", (e) => {
    // if namefield value is empty do not create a new list
    if (listNameField.value == "") {
        listNameField.classList.toggle("invalidInputField");
        listNameField.style.backgroundColor = "red";
        return;
    }
    else{
        startNewList();
    }
});

// save list button on click
saveListButt.addEventListener("click" , () => {

    // if name field is empty do not save
    if (listNameField.value == "") {
        listNameField.classList.toggle("invalidInputField");
        listNameField.style.backgroundColor = "#611d1d";
        return;
    }
    else {
        const list = loadedList === 0 ? CreateNewListFromTodos() : CreateUpdatedListFromTodos();
        saveList(list);
    }
})