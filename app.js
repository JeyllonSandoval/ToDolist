const form = document.getElementById('form');
const input = document.getElementById('input');
const task_list = document.getElementById('task_list');
const template = document.getElementById('template').content;
const fragment = document.createDocumentFragment();

let tasks = {};

document.addEventListener('DOMContentLoaded', () => {
    if(localStorage.getItem('tasks')){
        tasks = JSON.parse(localStorage.getItem('tasks'));
    }
    printTasks();
});

task_list.addEventListener('click', e => {
    btnAction(e);
});

form.addEventListener('submit', e => {
    e.preventDefault();
    setTask(e);
    }
);

const setTask = e => {
    if(!input.value.trim()){
    return;
    }
    const task = {
        id: Date.now(),
        description: input.value,
        state: false
    }
    tasks[task.id] = task;
    
    form.reset();
    input.focus();

    printTasks();
}

const printTasks = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks));

    if(Object.values(tasks).length === 0) {
        task_list.innerHTML = `
        <section class="alert-empty">
            <h2>There are no pending tasks. You can add new tasks</h2>
        </section>
        `;
        return;
    }
    task_list.innerHTML = '';
    Object.values(tasks).forEach(task => {
        const clone = template.cloneNode(true);
        clone.querySelector('p').textContent = task.description;
        if(task.state) {
            clone.querySelector('.alert').classList.replace('alert-context', 'alert-success');
            clone.querySelectorAll('.fas')[0].classList.replace('fa-circle-check', 'fa-rotate-right');
            clone.querySelector('p').style.textDecoration = 'line-through';
        }
        clone.querySelectorAll('.fas')[0].dataset.id = task.id;
        clone.querySelectorAll('.fas')[1].dataset.id = task.id;
        fragment.appendChild(clone);
    });
    task_list.appendChild(fragment);
}

const btnAction = e => {
    if(e.target.classList.contains('fa-circle-check')){
        tasks[e.target.dataset.id].state = true;
        printTasks();
    }
    if(e.target.classList.contains('fa-trash')){
        delete tasks[e.target.dataset.id];
        printTasks();
    }
    if(e.target.classList.contains('fa-rotate-right')){
        tasks[e.target.dataset.id].state = false;
        printTasks();
    }

    e.stopPropagation();
}
