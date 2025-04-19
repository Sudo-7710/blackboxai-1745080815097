document.addEventListener('DOMContentLoaded', () => {
  const sideMenu = document.getElementById('sideMenu');
  const overlay = document.getElementById('overlay');
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const closeMenuBtn = document.getElementById('closeMenuBtn');
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const body = document.body;

  const sections = document.querySelectorAll('main section');
  const tabButtons = document.querySelectorAll('.tab-btn');
  const menuItems = document.querySelectorAll('.menu-item');

  // Show section by id and hide others
  function showSection(id) {
    sections.forEach((section) => {
      section.classList.toggle('hidden', section.id !== id);
    });
    // Update active tab button
    tabButtons.forEach((btn) => {
      btn.classList.toggle(
        'text-blue-600',
        btn.getAttribute('data-target') === id
      );
      btn.classList.toggle(
        'dark:text-blue-400',
        btn.getAttribute('data-target') === id
      );
      btn.classList.toggle(
        'text-gray-600',
        btn.getAttribute('data-target') !== id
      );
      btn.classList.toggle(
        'dark:text-gray-400',
        btn.getAttribute('data-target') !== id
      );
    });
  }

  // Initial show dashboard
  showSection('dashboard');

  // Hamburger menu open
  hamburgerBtn.addEventListener('click', () => {
    sideMenu.classList.remove('-translate-x-full');
    overlay.classList.remove('hidden');
  });

  // Close menu
  function closeMenu() {
    sideMenu.classList.add('-translate-x-full');
    overlay.classList.add('hidden');
  }
  closeMenuBtn.addEventListener('click', closeMenu);
  overlay.addEventListener('click', closeMenu);

  // Menu item click
  menuItems.forEach((item) => {
    item.addEventListener('click', (e) => {
      const target = e.currentTarget.getAttribute('data-target');
      showSection(target);
      closeMenu();
    });
  });

  // Bottom tab click
  tabButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const target = e.currentTarget.getAttribute('data-target');
      showSection(target);
    });
  });

  // Theme toggle
  function setTheme(theme) {
    if (theme === 'dark') {
      body.classList.add('dark');
      body.setAttribute('data-theme', 'dark');
      themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
      localStorage.setItem('theme', 'dark');
    } else {
      body.classList.remove('dark');
      body.setAttribute('data-theme', 'light');
      themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
      localStorage.setItem('theme', 'light');
    }
  }

  // Load theme from localStorage
  const savedTheme = localStorage.getItem('theme') || 'light';
  setTheme(savedTheme);

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = body.classList.contains('dark') ? 'dark' : 'light';
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
  });

  // --- Dashboard Functionality ---

  // Daily Goals
  const dailyGoalsList = document.getElementById('dailyGoalsList');
  const newGoalInput = document.getElementById('newGoalInput');
  const addGoalBtn = document.getElementById('addGoalBtn');

  function loadDailyGoals() {
    const goals = JSON.parse(localStorage.getItem('dailyGoals') || '[]');
    dailyGoalsList.innerHTML = '';
    goals.forEach((goal, index) => {
      const li = document.createElement('li');
      li.className = 'flex items-center justify-between bg-gray-100 dark:bg-gray-700 rounded px-3 py-1';
      li.innerHTML = `
        <span>${goal}</span>
        <button aria-label="Remove goal" class="text-red-500 hover:text-red-700 font-bold">&times;</button>
      `;
      li.querySelector('button').addEventListener('click', () => {
        removeGoal(index);
      });
      dailyGoalsList.appendChild(li);
    });
  }

  function saveDailyGoals(goals) {
    localStorage.setItem('dailyGoals', JSON.stringify(goals));
  }

  function addGoal() {
    const goal = newGoalInput.value.trim();
    if (goal) {
      const goals = JSON.parse(localStorage.getItem('dailyGoals') || '[]');
      goals.push(goal);
      saveDailyGoals(goals);
      newGoalInput.value = '';
      loadDailyGoals();
    }
  }

  function removeGoal(index) {
    const goals = JSON.parse(localStorage.getItem('dailyGoals') || '[]');
    goals.splice(index, 1);
    saveDailyGoals(goals);
    loadDailyGoals();
  }

  addGoalBtn.addEventListener('click', addGoal);
  newGoalInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addGoal();
  });

  loadDailyGoals();

  // To-Do List
  const todoList = document.getElementById('todoList');
  const newTodoInput = document.getElementById('newTodoInput');
  const addTodoBtn = document.getElementById('addTodoBtn');

  function loadTodos() {
    const todos = JSON.parse(localStorage.getItem('todos') || '[]');
    todoList.innerHTML = '';
    todos.forEach((todo, index) => {
      const li = document.createElement('li');
      li.className = 'flex items-center justify-between bg-gray-100 dark:bg-gray-700 rounded px-3 py-1';
      li.innerHTML = `
        <span>${todo}</span>
        <button aria-label="Remove to-do" class="text-red-500 hover:text-red-700 font-bold">&times;</button>
      `;
      li.querySelector('button').addEventListener('click', () => {
        removeTodo(index);
      });
      todoList.appendChild(li);
    });
  }

  function saveTodos(todos) {
    localStorage.setItem('todos', JSON.stringify(todos));
  }

  function addTodo() {
    const todo = newTodoInput.value.trim();
    if (todo) {
      const todos = JSON.parse(localStorage.getItem('todos') || '[]');
      todos.push(todo);
      saveTodos(todos);
      newTodoInput.value = '';
      loadTodos();
    }
  }

  function removeTodo(index) {
    const todos = JSON.parse(localStorage.getItem('todos') || '[]');
    todos.splice(index, 1);
    saveTodos(todos);
    loadTodos();
  }

  addTodoBtn.addEventListener('click', addTodo);
  newTodoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTodo();
  });

  loadTodos();

  // Pomodoro Timer
  const startPomodoroBtn = document.getElementById('startPomodoroBtn');
  const stopPomodoroBtn = document.getElementById('stopPomodoroBtn');
  const pomodoroTimer = document.getElementById('pomodoroTimer');

  let pomodoroInterval = null;
  let pomodoroTime = 25 * 60; // 25 minutes in seconds

  function updatePomodoroDisplay() {
    const minutes = Math.floor(pomodoroTime / 60)
      .toString()
      .padStart(2, '0');
    const seconds = (pomodoroTime % 60).toString().padStart(2, '0');
    pomodoroTimer.textContent = `${minutes}:${seconds}`;
  }

  function startPomodoro() {
    if (pomodoroInterval) return;
    startPomodoroBtn.disabled = true;
    stopPomodoroBtn.disabled = false;
    pomodoroInterval = setInterval(() => {
      pomodoroTime--;
      updatePomodoroDisplay();
      if (pomodoroTime <= 0) {
        clearInterval(pomodoroInterval);
        pomodoroInterval = null;
        startPomodoroBtn.disabled = false;
        stopPomodoroBtn.disabled = true;
        pomodoroTime = 25 * 60;
        updatePomodoroDisplay();
        alert('Pomodoro session completed!');
      }
    }, 1000);
  }

  function stopPomodoro() {
    if (!pomodoroInterval) return;
    clearInterval(pomodoroInterval);
    pomodoroInterval = null;
    startPomodoroBtn.disabled = false;
    stopPomodoroBtn.disabled = true;
    pomodoroTime = 25 * 60;
    updatePomodoroDisplay();
  }

  startPomodoroBtn.addEventListener('click', startPomodoro);
  stopPomodoroBtn.addEventListener('click', stopPomodoro);
  updatePomodoroDisplay();

  // Habit Tracking
  const habitIds = ['habitWater', 'habitReading', 'habitWorkout', 'habitSleep'];

  function loadHabits() {
    const habits = JSON.parse(localStorage.getItem('habits') || '{}');
    habitIds.forEach((id) => {
      const checkbox = document.getElementById(id);
      checkbox.checked = habits[id] || false;
      checkbox.addEventListener('change', () => {
        habits[id] = checkbox.checked;
        localStorage.setItem('habits', JSON.stringify(habits));
      });
    });
  }

  loadHabits();

  // Mood Tracker
  const moodButtons = document.querySelectorAll('.mood-btn');
  const selectedMoodDisplay = document.getElementById('selectedMood');

  function loadMood() {
    const mood = localStorage.getItem('mood') || '';
    if (mood) {
      selectedMoodDisplay.textContent = `Selected mood: ${mood}`;
      moodButtons.forEach((btn) => {
        btn.classList.toggle('ring-2 ring-blue-500 rounded-full', btn.getAttribute('data-mood') === mood);
      });
    }
  }

  moodButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const mood = btn.getAttribute('data-mood');
      localStorage.setItem('mood', mood);
      loadMood();
    });
  });

  loadMood();

  // --- Multi-type Tracker System Functionality ---

  // Time Tracker
  const startTimeTrackerBtn = document.getElementById('startTimeTrackerBtn');
  const stopTimeTrackerBtn = document.getElementById('stopTimeTrackerBtn');
  const timeTrackerDisplay = document.getElementById('timeTrackerDisplay');

  let timeTrackerInterval = null;
  let timeTrackerSeconds = parseInt(localStorage.getItem('timeTrackerSeconds')) || 0;

  function updateTimeTrackerDisplay() {
    const hrs = Math.floor(timeTrackerSeconds / 3600)
      .toString()
      .padStart(2, '0');
    const mins = Math.floor((timeTrackerSeconds % 3600) / 60)
      .toString()
      .padStart(2, '0');
    const secs = (timeTrackerSeconds % 60).toString().padStart(2, '0');
    timeTrackerDisplay.textContent = `${hrs}:${mins}:${secs}`;
  }

  function startTimeTracker() {
    if (timeTrackerInterval) return;
    startTimeTrackerBtn.disabled = true;
    stopTimeTrackerBtn.disabled = false;
    timeTrackerInterval = setInterval(() => {
      timeTrackerSeconds++;
      updateTimeTrackerDisplay();
      localStorage.setItem('timeTrackerSeconds', timeTrackerSeconds);
    }, 1000);
  }

  function stopTimeTracker() {
    if (!timeTrackerInterval) return;
    clearInterval(timeTrackerInterval);
    timeTrackerInterval = null;
    startTimeTrackerBtn.disabled = false;
    stopTimeTrackerBtn.disabled = true;
  }

  startTimeTrackerBtn.addEventListener('click', startTimeTracker);
  stopTimeTrackerBtn.addEventListener('click', stopTimeTracker);
  updateTimeTrackerDisplay();

  // Task Completion Tracker
  const taskCompletionList = document.getElementById('taskCompletionList');
  const newTaskInput = document.getElementById('newTaskInput');
  const addTaskBtn = document.getElementById('addTaskBtn');

  function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    taskCompletionList.innerHTML = '';
    tasks.forEach((task, index) => {
      const li = document.createElement('li');
      li.className = 'flex items-center justify-between bg-gray-100 dark:bg-gray-700 rounded px-3 py-1';
      li.innerHTML = `
        <span>${task}</span>
        <button aria-label="Remove task" class="text-red-500 hover:text-red-700 font-bold">&times;</button>
      `;
      li.querySelector('button').addEventListener('click', () => {
        removeTask(index);
      });
      taskCompletionList.appendChild(li);
    });
  }

  function saveTasks(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  function addTask() {
    const task = newTaskInput.value.trim();
    if (task) {
      const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
      tasks.push(task);
      saveTasks(tasks);
      newTaskInput.value = '';
      loadTasks();
    }
  }

  function removeTask(index) {
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    tasks.splice(index, 1);
    saveTasks(tasks);
    loadTasks();
  }

  addTaskBtn.addEventListener('click', addTask);
  newTaskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
  });

  loadTasks();

  // Habit & Routine Tracker
  const habitRoutineList = document.getElementById('habitRoutineList');
  const newHabitRoutineInput = document.getElementById('newHabitRoutineInput');
  const addHabitRoutineBtn = document.getElementById('addHabitRoutineBtn');

  function loadHabitRoutines() {
    const habitRoutines = JSON.parse(localStorage.getItem('habitRoutines') || '[]');
    habitRoutineList.innerHTML = '';
    habitRoutines.forEach((habit, index) => {
      const li = document.createElement('li');
      li.className = 'flex items-center justify-between bg-gray-100 dark:bg-gray-700 rounded px-3 py-1';
      li.innerHTML = `
        <span>${habit}</span>
        <button aria-label="Remove habit or routine" class="text-red-500 hover:text-red-700 font-bold">&times;</button>
      `;
      li.querySelector('button').addEventListener('click', () => {
        removeHabitRoutine(index);
      });
      habitRoutineList.appendChild(li);
    });
  }

  function saveHabitRoutines(habitRoutines) {
    localStorage.setItem('habitRoutines', JSON.stringify(habitRoutines));
  }

  function addHabitRoutine() {
    const habit = newHabitRoutineInput.value.trim();
    if (habit) {
      const habitRoutines = JSON.parse(localStorage.getItem('habitRoutines') || '[]');
      habitRoutines.push(habit);
      saveHabitRoutines(habitRoutines);
      newHabitRoutineInput.value = '';
      loadHabitRoutines();
    }
  }

  function removeHabitRoutine(index) {
    const habitRoutines = JSON.parse(localStorage.getItem('habitRoutines') || '[]');
    habitRoutines.splice(index, 1);
    saveHabitRoutines(habitRoutines);
    loadHabitRoutines();
  }

  addHabitRoutineBtn.addEventListener('click', addHabitRoutine);
  newHabitRoutineInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addHabitRoutine();
  });

  loadHabitRoutines();

  // Custom Field Tracker
  const customFieldList = document.getElementById('customFieldList');
  const newCustomFieldInput = document.getElementById('newCustomFieldInput');
  const addCustomFieldBtn = document.getElementById('addCustomFieldBtn');

  function loadCustomFields() {
    const customFields = JSON.parse(localStorage.getItem('customFields') || '[]');
    customFieldList.innerHTML = '';
    customFields.forEach((field, index) => {
      const li = document.createElement('li');
      li.className = 'flex items-center justify-between bg-gray-100 dark:bg-gray-700 rounded px-3 py-1';
      li.innerHTML = `
        <span>${field}</span>
        <button aria-label="Remove custom field" class="text-red-500 hover:text-red-700 font-bold">&times;</button>
      `;
      li.querySelector('button').addEventListener('click', () => {
        removeCustomField(index);
      });
      customFieldList.appendChild(li);
    });
  }

  function saveCustomFields(customFields) {
    localStorage.setItem('customFields', JSON.stringify(customFields));
  }

  function addCustomField() {
    const field = newCustomFieldInput.value.trim();
    if (field) {
      const customFields = JSON.parse(localStorage.getItem('customFields') || '[]');
      customFields.push(field);
      saveCustomFields(customFields);
      newCustomFieldInput.value = '';
      loadCustomFields();
    }
  }

  function removeCustomField(index) {
    const customFields = JSON.parse(localStorage.getItem('customFields') || '[]');
    customFields.splice(index, 1);
    saveCustomFields(customFields);
    loadCustomFields();
  }

  addCustomFieldBtn.addEventListener('click', addCustomField);
  newCustomFieldInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addCustomField();
  });

  loadCustomFields();

  // --- Notes & Journal Section Functionality ---

  const notesEditor = document.getElementById('notesEditor');
  const boldBtn = document.getElementById('boldBtn');
  const italicBtn = document.getElementById('italicBtn');
  const underlineBtn = document.getElementById('underlineBtn');
  const voiceToTextBtn = document.getElementById('voiceToTextBtn');
  const imageUploadInput = document.getElementById('imageUploadInput');
  const imageUploadBtn = document.getElementById('imageUploadBtn');
  const saveNoteBtn = document.getElementById('saveNoteBtn');
  const notesList = document.getElementById('notesList');
  const noteSearchInput = document.getElementById('noteSearchInput');
  const tagsContainer = document.getElementById('tagsContainer');

  let recognition = null;
  let isRecognizing = false;

  // Rich text formatting
  boldBtn.addEventListener('click', () => {
    document.execCommand('bold');
    notesEditor.focus();
  });
  italicBtn.addEventListener('click', () => {
    document.execCommand('italic');
    notesEditor.focus();
  });
  underlineBtn.addEventListener('click', () => {
    document.execCommand('underline');
    notesEditor.focus();
  });

  // Voice to text using Web Speech API
  if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        transcript += event.results[i][0].transcript;
      }
      notesEditor.innerHTML += transcript;
      notesEditor.focus();
    };

    recognition.onstart = () => {
      isRecognizing = true;
      voiceToTextBtn.classList.add('text-red-600');
    };

    recognition.onend = () => {
      isRecognizing = false;
      voiceToTextBtn.classList.remove('text-red-600');
    };
  } else {
    voiceToTextBtn.disabled = true;
    voiceToTextBtn.title = 'Voice recognition not supported in this browser';
  }

  voiceToTextBtn.addEventListener('click', () => {
    if (!recognition) return;
    if (isRecognizing) {
      recognition.stop();
    } else {
      recognition.start();
    }
  });

  // Image upload
  imageUploadBtn.addEventListener('click', () => {
    imageUploadInput.click();
  });

  imageUploadInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = document.createElement('img');
        img.src = event.target.result;
        img.alt = 'Uploaded Image';
        img.className = 'max-w-full rounded mt-2';
        notesEditor.appendChild(img);
      };
      reader.readAsDataURL(file);
    }
    imageUploadInput.value = '';
  });

  // Notes data structure: array of {id, content, tags, createdAt}
  function loadNotes() {
    const notes = JSON.parse(localStorage.getItem('notes') || '[]');
    return notes;
  }

  function saveNotes(notes) {
    localStorage.setItem('notes', JSON.stringify(notes));
  }

  function renderNotesList(filter = '') {
    const notes = loadNotes();
    notesList.innerHTML = '';
    const filteredNotes = notes.filter((note) => {
      const contentText = note.content.replace(/<[^>]+>/g, '').toLowerCase();
      const tagsText = (note.tags || []).join(' ').toLowerCase();
      return contentText.includes(filter.toLowerCase()) || tagsText.includes(filter.toLowerCase());
    });
    filteredNotes.forEach((note) => {
      const li = document.createElement('li');
      li.className = 'bg-gray-100 dark:bg-gray-700 rounded p-2 cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-600';
      li.textContent = `Note - ${new Date(note.createdAt).toLocaleString()}`;
      li.title = note.content.replace(/<[^>]+>/g, '').slice(0, 100) + (note.content.length > 100 ? '...' : '');
      li.addEventListener('click', () => {
        loadNoteIntoEditor(note.id);
      });
      notesList.appendChild(li);
    });
  }

  function loadNoteIntoEditor(id) {
    const notes = loadNotes();
    const note = notes.find((n) => n.id === id);
    if (note) {
      notesEditor.innerHTML = note.content;
      currentEditingNoteId = id;
      renderTags(note.tags || []);
    }
  }

  function renderTags(tags) {
    tagsContainer.innerHTML = '';
    tags.forEach((tag) => {
      const span = document.createElement('span');
      span.className = 'bg-blue-500 text-white rounded-full px-3 py-1 text-sm cursor-pointer select-none';
      span.textContent = tag;
      span.title = 'Click to remove tag';
      span.addEventListener('click', () => {
        removeTag(tag);
      });
      tagsContainer.appendChild(span);
    });
  }

  function addTag(tag) {
    if (!currentTags.includes(tag)) {
      currentTags.push(tag);
      renderTags(currentTags);
    }
  }

  function removeTag(tag) {
    currentTags = currentTags.filter((t) => t !== tag);
    renderTags(currentTags);
  }

  let currentTags = [];
  let currentEditingNoteId = null;

  // Save note
  saveNoteBtn.addEventListener('click', () => {
    const content = notesEditor.innerHTML.trim();
    if (!content) {
      alert('Note content cannot be empty.');
      return;
    }
    const notes = loadNotes();
    if (currentEditingNoteId) {
      // Update existing note
      const noteIndex = notes.findIndex((n) => n.id === currentEditingNoteId);
      if (noteIndex !== -1) {
        notes[noteIndex].content = content;
        notes[noteIndex].tags = currentTags;
        notes[noteIndex].createdAt = new Date().toISOString();
      }
    } else {
      // Add new note
      notes.push({
        id: Date.now(),
        content,
        tags: currentTags,
        createdAt: new Date().toISOString(),
      });
    }
    saveNotes(notes);
    currentEditingNoteId = null;
    currentTags = [];
    notesEditor.innerHTML = '';
    renderTags(currentTags);
    renderNotesList();
  });

  // Search notes
  noteSearchInput.addEventListener('input', (e) => {
    renderNotesList(e.target.value);
  });

  // Initialize notes list
  renderNotesList();

  // --- Trading Journal Functionality ---

  const tradeForm = document.getElementById('tradeForm');
  const tradesList = document.getElementById('tradesList');
  const filterAsset = document.getElementById('filterAsset');
  const filterDate = document.getElementById('filterDate');
  const filterOutcome = document.getElementById('filterOutcome');

  function loadTrades() {
    return JSON.parse(localStorage.getItem('trades') || '[]');
  }

  function saveTrades(trades) {
    localStorage.setItem('trades', JSON.stringify(trades));
  }

  function renderTradesList() {
    const trades = loadTrades();
    const assetFilter = filterAsset.value.toLowerCase();
    const dateFilter = filterDate.value;
    const outcomeFilter = filterOutcome.value;

    tradesList.innerHTML = '';

    const filteredTrades = trades.filter((trade) => {
      const matchesAsset = trade.instrument.toLowerCase().includes(assetFilter);
      const matchesDate = !dateFilter || trade.date === dateFilter;
      const matchesOutcome = !outcomeFilter || trade.outcome === outcomeFilter;
      return matchesAsset && matchesDate && matchesOutcome;
    });

    if (filteredTrades.length === 0) {
      tradesList.innerHTML = '<p class="text-gray-600 dark:text-gray-400">No trades found.</p>';
      return;
    }

    filteredTrades.forEach((trade) => {
      const div = document.createElement('div');
      div.className = 'bg-gray-100 dark:bg-gray-700 rounded p-3 flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0';

      const leftDiv = document.createElement('div');
      leftDiv.className = 'flex flex-col space-y-1';

      leftDiv.innerHTML = `
        <div><strong>Date:</strong> ${trade.date} <strong>Time:</strong> ${trade.time}</div>
        <div><strong>Instrument:</strong> ${trade.instrument}</div>
        <div><strong>Entry/Exit:</strong> ${trade.entryExit}</div>
        <div><strong>P&L:</strong> ${trade.pl}</div>
        <div><strong>Notes:</strong> ${trade.notes || ''}</div>
        <div><strong>Rating:</strong> Confidence: ${trade.confidence}, Outcome: ${trade.outcome}, Mistake/Success: ${trade.mistakeSuccess}</div>
        <div><strong>Tags:</strong> ${trade.tags.join(', ')}</div>
      `;

      const rightDiv = document.createElement('div');
      rightDiv.className = 'flex flex-col items-center space-y-2';

      if (trade.screenshot) {
        const img = document.createElement('img');
        img.src = trade.screenshot;
        img.alt = 'Trade Screenshot';
        img.className = 'max-w-[150px] max-h-[100px] rounded shadow';
        rightDiv.appendChild(img);
      }

      div.appendChild(leftDiv);
      div.appendChild(rightDiv);

      tradesList.appendChild(div);
    });
  }

  tradeForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const date = document.getElementById('tradeDate').value;
    const time = document.getElementById('tradeTime').value;
    const instrument = document.getElementById('tradeInstrument').value.trim();
    const entryExit = document.getElementById('tradeEntryExit').value;
    const pl = parseFloat(document.getElementById('tradePL').value);
    const notes = document.getElementById('tradeNotes').value.trim();
    const confidence = document.getElementById('tradeConfidence').value;
    const outcome = document.getElementById('tradeOutcome').value;
    const mistakeSuccess = document.getElementById('tradeMistakeSuccess').value;
    const tagsInput = document.getElementById('tradeTags').value.trim();

    if (!date || !time || !instrument || !entryExit || isNaN(pl) || !confidence || !outcome || !mistakeSuccess) {
      alert('Please fill in all required fields.');
      return;
    }

    const tags = tagsInput ? tagsInput.split(',').map((t) => t.trim()).filter((t) => t) : [];

    const screenshotInput = document.getElementById('tradeScreenshot');
    const file = screenshotInput.files[0];

    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        saveTrade(event.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      saveTrade(null);
    }

    function saveTrade(screenshotDataUrl) {
      const trades = loadTrades();
      trades.push({
        id: Date.now(),
        date,
        time,
        instrument,
        entryExit,
        pl,
        screenshot: screenshotDataUrl,
        notes,
        confidence,
        outcome,
        mistakeSuccess,
        tags,
      });
      saveTrades(trades);
      tradeForm.reset();
      renderTradesList();
    }
  });

  filterAsset.addEventListener('input', renderTradesList);
  filterDate.addEventListener('change', renderTradesList);
  filterOutcome.addEventListener('change', renderTradesList);

  renderTradesList();

  // --- Chart.js Graphs ---

  // Tracker Stats Chart (Multi-type Tracker System)
  const trackerStatsCtx = document.getElementById('trackerStatsChart').getContext('2d');
  const trackerStatsChart = new Chart(trackerStatsCtx, {
    type: 'bar',
    data: {
      labels: ['Daily Goals', 'To-Dos', 'Focus Sessions', 'Habits Completed'],
      datasets: [{
        label: 'Progress',
        data: [5, 8, 3, 4], // Example static data, can be dynamic
        backgroundColor: [
          'rgba(59, 130, 246, 0.7)',
          'rgba(16, 185, 129, 0.7)',
          'rgba(239, 68, 68, 0.7)',
          'rgba(234, 179, 8, 0.7)'
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(234, 179, 8, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          max: 10
        }
      },
      plugins: {
        legend: {
          display: false
        }
      }
    }
  });

  // Performance Overview Chart (Trading Journal)
  const performanceOverviewCtx = document.getElementById('performanceOverviewChart').getContext('2d');
  const performanceOverviewChart = new Chart(performanceOverviewCtx, {
    type: 'line',
    data: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      datasets: [{
        label: 'Profit/Loss',
        data: [500, 700, 300, 900], // Example static data, can be dynamic
        fill: false,
        borderColor: 'rgba(59, 130, 246, 1)',
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: false
        }
      }
    }
  });
});
