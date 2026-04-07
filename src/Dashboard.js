import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get('https://task-manager-backend-075l.onrender.com', {
        headers: { Authorization: token }
      });
      setTasks(res.data);
    } catch (err) {
      alert('Please login first!');
      navigate('/');
    }
  };

  const addTask = async () => {
    try {
      await axios.post('https://task-manager-backend-075l.onrender.com', 
        { title, description },
        { headers: { Authorization: token } }
      );
      setTitle('');
      setDescription('');
      fetchTasks();
    } catch (err) {
      alert('Failed to add task!');
    }
  };

  const completeTask = async (id) => {
    try {
      await axios.put(`https://task-manager-backend-075l.onrender.com/${id}`,
        {},
        { headers: { Authorization: token } }
      );
      fetchTasks();
    } catch (err) {
      alert('Failed to update task!');
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`https://task-manager-backend-075l.onrender.com/${id}`,
        { headers: { Authorization: token } }
      );
      fetchTasks();
    } catch (err) {
      alert('Failed to delete task!');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h2>My Tasks</h2>
        <button onClick={logout}>Logout</button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px' }}
        />
        <input
          type="text"
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px' }}
        />
        <button onClick={addTask} style={{ padding: '10px 20px' }}>Add Task</button>
      </div>

      {tasks.map((task) => (
        <div key={task._id} style={{ 
          border: '1px solid #ccc', 
          padding: '10px', 
          marginBottom: '10px',
          textDecoration: task.completed ? 'line-through' : 'none'
        }}>
          <h3>{task.title}</h3>
          <p>{task.description}</p>
          <button onClick={() => completeTask(task._id)}>✅ Complete</button>
          <button onClick={() => deleteTask(task._id)} style={{ marginLeft: '10px' }}>🗑️ Delete</button>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;