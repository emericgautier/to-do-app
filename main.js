// select all the selectors
let form = document.getElementById("form");
let textInput = document.getElementById("textInput");
let dateInput = document.getElementById("dateInput");
let textarea = document.getElementById("textarea");
let msg = document.getElementById("msg");
let tasks = document.getElementById("tasks");
let add = document.getElementById("add");


// We cannot let a user submit blank input fields. 
form.addEventListener("submit", (e) => {
    e.preventDefault();
    formValidation();
  });
  
  let formValidation = () => {
    if (textInput.value === "") {
      console.log("failure");
      msg.innerHTML = "Task cannot be blank";
    } else {
      console.log("success");
      msg.innerHTML = "";

      // note that this will never work unless you invoke the function acceptData
      acceptData();

      // to closethe modal automatically, write this small function
      add.setAttribute("data-bs-dismiss", "modal");
      add.click();

      (() => {
      add.setAttribute("data-bs-dismiss", "");
    })();

    }
  };

  // to collect data and use local storage
  // Whatever inputs the user writes, we need to collect them and store them in local storage
  // we collect the data from the input fields, using the function named acceptData and an array named data. Then we push them inside the local storage
  let data = [];

  let acceptData = () => {
    data.push({
      text: textInput.value,
      date: dateInput.value,
      description: textarea.value,
    });
  
    localStorage.setItem("data", JSON.stringify(data));
    console.log(data);
    
    // note that the function will never run unless you invoke it inside the acceptData function
    createTasks();
  };

  // to create new tasks
  // to create a new task, we need to create a function, use template literals to create the HTML elements, and use a map to push the data collected from the user inside the template
  let createTasks = () => {
    tasks.innerHTML = "";
    data.map((x, y) => {
      return (tasks.innerHTML += `
      <div id=${y}>
            <span class="fw-bold">${x.text}</span>
            <span class="small text-secondary">${x.date}</span>
            <p>${x.description}</p>
    
            <span class="options">
              <i onClick= "editTask(this)" data-bs-toggle="modal" data-bs-target="#form" class="fas fa-edit"></i>
              <i onClick ="deleteTask(this);createTasks()" class="fas fa-trash-alt"></i>
            </span>
          </div>
      `);
    });
  
    resetForm();
  };

  // Once we're done collecting and accepting data from the user, we need to clear the input fields.
  let resetForm = () => {
    textInput.value = "";
    dateInput.value = "";
    textarea.value = "";
  };

  // delete a task
  // 1. delete the HTML element from the screen
  // 2. remove the targetted Task from the data array
  // 3. update the local storage with the new data
  let deleteTask = (e) => {
    e.parentElement.parentElement.remove();
  
    data.splice(e.parentElement.parentElement.id, 1);
  
    localStorage.setItem("data", JSON.stringify(data));
  
    console.log(data);
  };

  // edit tasks
  // Line 1 is targetting the task that we selected to edit
  // Lines 2, 3, and 4, are targetting the values [task, date, description] of the task that we selected to edit
  // line 5 is running the delete function to remove the selected data both from the local storage, HTML element, and data array.

  let editTask = (e) => {
    let selectedTask = e.parentElement.parentElement;
  
    textInput.value = selectedTask.children[0].innerHTML;
    dateInput.value = selectedTask.children[1].innerHTML;
    textarea.value = selectedTask.children[2].innerHTML;
  
    deleteTask(e);
  };

  // get data from local storage
  // we run a IIFE to retrieve the data from local storage. 
  (() => {
    data = JSON.parse(localStorage.getItem("data")) || [];
    console.log(data);
    createTasks();
  })();