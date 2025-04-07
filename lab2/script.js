"use strict";

document.addEventListener('DOMContentLoaded', function() {
    // Elementy DOM
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    const trashList = document.getElementById('trashList');
    const undoButton = document.getElementById('undoButton');
    const deleteModal = document.getElementById('deleteModal');
    const modalOverlay = document.getElementById('modalOverlay');
    const deleteModalText = document.getElementById('deleteModalText');
    const confirmDeleteBtn = document.getElementById('confirmDelete');
    const closeModalBtn = document.querySelector('.close-btn');
    const cancelModalBtn = document.querySelector('.modal-cancel');
    
    let lastDeletedTask = null;
    let taskToDelete = null;
    
    function showModal() {
        deleteModal.classList.add('show');
        modalOverlay.classList.add('show');
    }
    
    function hideModal() {
        deleteModal.classList.remove('show');
        modalOverlay.classList.remove('show');
    }
    
    // zamykanie modalu
    closeModalBtn.addEventListener('click', hideModal);
    cancelModalBtn.addEventListener('click', hideModal);
    modalOverlay.addEventListener('click', hideModal);
    
    // przycisk dodania
    addTaskBtn.addEventListener('click', function() {
        addNewTask();
    });
    
    // wcisniecie enter w polu tekstowym
    taskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addNewTask();
        }
    });
    
    // funkcja dodająca nowe zadanie
    function addNewTask() {
        const taskText = taskInput.value.trim();
        if (taskText === '') {
            alert('Zadanie nie może być puste!');
            return;
        }
        
        // tworzymy nowy element
        const li = document.createElement('li');
        li.className = 'task-item';
        
        // div na tresc i date
        const contentDiv = document.createElement('div');
        contentDiv.className = 'task-content';
        
        // tresc zadania
        const taskSpan = document.createElement('span');
        taskSpan.className = 'task-text';
        taskSpan.textContent = taskText;
        contentDiv.appendChild(taskSpan);
        
        // data wykonania
        const dateSpan = document.createElement('span');
        dateSpan.className = 'task-date';
        dateSpan.style.display = 'none';    // ukryta na początku
        contentDiv.appendChild(dateSpan);
        
        li.appendChild(contentDiv);
        
        // Przycisk usuwania
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn-delete';
        deleteBtn.innerHTML = 'X';
        deleteBtn.addEventListener('click', function(e) {
            e.stopPropagation(); // zapobiega propagacji zdarzenia kliknięcia do li (wykonanie zadania)
            
            // Ustawienie zadania do usunięcia i wyświetlenie modalu
            taskToDelete = li;
            deleteModalText.textContent = 'Czy na pewno chcesz usunąć zadanie o treści: ' + taskText;
            showModal();
        });
        
        li.appendChild(deleteBtn);
        
        // Obsługa kliknięcia na zadanie (oznaczenie jako wykonane)
        li.addEventListener('click', function() {
            // Zmiana klasy CSS dla oznaczenia zadania jako wykonanego
            taskSpan.classList.toggle('completed');
            
            if (taskSpan.classList.contains('completed')) {
                // Zapisanie daty wykonania
                const now = new Date();
                const formattedDate = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
                dateSpan.textContent = `Wykonano: ${formattedDate}`;
                dateSpan.style.display = 'inline';
            } else {
                // Ukrycie daty wykonania
                dateSpan.style.display = 'none';
            }
        });
        taskList.appendChild(li);
        
        // Wyczyszczenie pola wprowadzania
        taskInput.value = '';
        taskInput.focus();
    }
    
    // potwierdzenie usunięcia zadania w modalu
    confirmDeleteBtn.addEventListener('click', function() {
        if (taskToDelete) {
            // Usuń zadanie z listy i dodaj do kosza
            taskList.removeChild(taskToDelete);
            trashList.appendChild(taskToDelete);
            
            // Usuń zdarzenia kliknięcia z zadania w koszu
            const newTask = taskToDelete.cloneNode(true);
            taskToDelete.parentNode.replaceChild(newTask, taskToDelete);
            
            // Aktualizacja ostatnio usuniętego zadania
            lastDeletedTask = newTask;
            
            // Aktywowanie przycisku cofnij
            undoButton.disabled = false;
            
            // Zamknięcie modalu
            hideModal();
            taskToDelete = null;
        }
    });
    
    // Obsługa przycisku cofnij usunięcie
    undoButton.addEventListener('click', function() {
        if (lastDeletedTask) {
            // Usuń z kosza i dodaj z powrotem do listy zadań
            trashList.removeChild(lastDeletedTask);
            
            // Przywróć zdarzenia kliknięcia
            const task = lastDeletedTask.cloneNode(true);
            
            // Odtworzenie zdarzenia kliknięcia na zadanie
            const taskSpan = task.querySelector('.task-text');
            const dateSpan = task.querySelector('.task-date');
            
            task.addEventListener('click', function() {
                taskSpan.classList.toggle('completed');
                
                if (taskSpan.classList.contains('completed')) {
                    // Zapisanie daty wykonania
                    const now = new Date();
                    const formattedDate = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
                    dateSpan.textContent = `Wykonano: ${formattedDate}`;
                    dateSpan.style.display = 'inline';
                } else {
                    // Ukrycie daty wykonania
                    dateSpan.style.display = 'none';
                }
            });
            
            // Odtworzenie zdarzenia kliknięcia na przycisk usuwania
            const deleteBtn = task.querySelector('.btn-delete');
            deleteBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                taskToDelete = task;
                const taskText = task.querySelector('.task-text').textContent;
                deleteModalText.textContent = 'Czy na pewno chcesz usunąć zadanie o treści: ' + taskText;
                showModal();
            });
            
            taskList.appendChild(task);
            
            // Deaktywacja przycisku cofnij
            undoButton.disabled = true;
            lastDeletedTask = null;
        }
    });
});