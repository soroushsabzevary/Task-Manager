import React, { useState, useEffect } from 'react';
import './Dashboard.css';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [currentTask, setCurrentTask] = useState({ title: '', dueDate: '', status: 'To do', description: '' });
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDetails, setShowDetails] = useState(null);

  useEffect(() =>{
    const fetchTasks = async ()=> {
      const tasksFromServer = await getTasks();
      if (tasksFromServer){
        setTasks(tasksFromServer);
      }
    };
    fetchTasks();
  },[]);

  const handleShowForm = (task = null) => {
    if (task) {
      setCurrentTask(task);
      setIsEditing(true);
    }else {
      setCurrentTask({ title: '', dueDate: '', status: 'To Do', description: '' });
      setIsEditing(false);
    }
    setShowForm(true);
  };

  const handleHideForm = () => {
    setShowForm(false);
    setCurrentTask({ title: '', dueDate: '', status: 'To Do', description: '' });
    setIsEditing(false);
  };

  const handleSaveTask = async () => {
    if (isEditing){
      const success= await editTask(currentTask.docId, currentTask);
      if (success) {
        const updatedTasks = tasks.map((task) =>
          task.docId === currentTask.docId ? currentTask : task
        );
        setTasks(updatedTasks);
      }
    } else {
      const newDocId = await addTask(currentTask);
      if (newDocId) {
        const newTask = { ...currentTask, docId: newDocId };
        setTasks((prevTasks) => [...prevTasks, newTask]);
      }
    }
    window.location.reload();
  };

  const handleDeleteTask = async (docId) => {
    const success = await deleteTask(docId);
    if (success) {
       const updatedTasks =tasks.filter((task) => task.docId !== docId);
      setTasks(updatedTasks);
    }
  };

  const handleShowDetails = (task) => {
    setShowDetails(task);
  };

  const handleCloseDetails = () => {
     setShowDetails(null);
  };

  const renderForm = () => (
    <div className="task-form-overlay">
      <div className="new-task-form">
        <h3>{isEditing ? 'Edit Task' : 'Add New Task'}</h3>
        <input
          type="text"
          name="title"
          placeholder="Title"
           value={currentTask.title}
          onChange={(e) => setCurrentTask({ ...currentTask, title: e.target.value })}
        />
        <input
          type="text" 
          name="dueDate"
          placeholder="Due Date (e.g., 2024-12-31)"
          value={currentTask.dueDate}
          onChange={(e) => setCurrentTask({ ...currentTask, dueDate: e.target.value })}
        />
        <select
          name="status"
          value={currentTask.status}
          onChange={(e) => setCurrentTask({ ...currentTask, status: e.target.value })}>
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
        <textarea
          name="description"
          placeholder="Description"
          value={currentTask.description}
          onChange={(e) => setCurrentTask({ ...currentTask, description: e.target.value })}
        ></textarea>
        <div className="form-buttons">
          <button onClick={handleSaveTask}>{isEditing ? 'Save Task' : 'Add Task'}</button>
        <button onClick={handleHideForm}>Cancel</button>
        </div>
      </div>
    </div>
  );

  const renderTaskDetails = () => {
    if (!showDetails) return null;
    else{
    return (
      <div className="task-overlay" onClick={handleCloseDetails}>
        <div className="task-details">
          <h3>{showDetails.title}</h3>
          <p><strong>Due Date:</strong> {showDetails.dueDate}</p>
          <p><strong>Status:</strong> {showDetails.status}</p>
           <p><strong>Description:</strong> {showDetails.description}</p>
          <button onClick={handleCloseDetails}>Close</button>
        </div>
      </div>   
        );
    }
  };

  return (
    <div className="task-manager-container">
      <div className="header">
        <h1>Task Manager</h1>
        <button className="add-task-btn" onClick={() => handleShowForm()}>Add Task</button>
      </div>

      <div className="task-list">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <div key={task.docId} className="task" onClick={() => handleShowDetails(task)}>
              <h3 style={{ maxWidth: '10%', overflowX: 'auto', padding:'3px', borderWidth: '1px', borderStyle: 'solid', borderColor: 'white', borderRadius: '5px'}}>{task.title}</h3>
              <p style={{ maxWidth: '15%',  overflowX: 'auto', padding:'3px',borderWidth: '1px', borderStyle: 'solid', borderColor: 'white',borderRadius: '5px' }}>Due: {task.dueDate}</p>
               <p style={{ maxWidth: '15%', overflowX: 'auto', padding:'3px',borderWidth: '1px', borderStyle: 'solid', borderColor: 'white',borderRadius: '5px' }}>Status: {task.status}</p>
              <button onClick={(e) => { e.stopPropagation(); handleShowForm(task); }}>Edit</button>
              <button onClick={(e) => { e.stopPropagation(); handleDeleteTask(task.docId); }}>Delete</button>
            </div>
          ))
        ) : (
          <p>No tasks available. Please add a task.</p>
        )}
      </div>
      {showForm && renderForm()}
      {renderTaskDetails()}
    </div>
  );
};

const getTasks = async () => {
  const response = await fetch('/getTasks', {
    method: 'GET',
  });
  const data = await response.json();
  if (data.result) {
    return data.tasks;
  }
  return null;
};

const addTask = async (task) => {
  const response = await fetch('/addTask', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(task),
  });
  const data = await response.json();
  if (data.result) {
    return data.docId; 
  }
  return false;
};

const editTask = async (docId, task) => {
  const response = await fetch(`/editTask`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ...task, docId: docId }),
  });
  const data = await response.json();
  return data.result;
};

const deleteTask = async (docId) => {
  const response = await fetch(`/deleteTask`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ docId })
  });
  const data = await response.json();
  return data.result;
};

export default Dashboard;
