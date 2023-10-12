import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import Navbar from './Navbar';
import ListComponent from "./components/ListComponent/ListComponent";
import { TaskStatus } from './constants/constants';
import { DragDropContext } from "react-beautiful-dnd";
import { onDragEnd } from "./utils/dndUtils";

function App() {
  const [lists, setLists] = useState([]);
  const [newListTitle, setNewListTitle] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [selectedList, setSelectedList] = useState(lists?.length > 0 ? lists[0].id : null);

  const onTaskStatusChange = (listIndex) => (taskIndex) => {
    const newListDefinitionArray = [...lists];
    const currentListDefinition = newListDefinitionArray[listIndex];
    const currentTask = currentListDefinition.Tasks[taskIndex];

    currentTask.taskStatus = currentTask.taskStatus === TaskStatus.Completed ? TaskStatus.In_Progress : TaskStatus.Completed;
    currentListDefinition.Tasks[taskIndex] = currentTask;
    newListDefinitionArray[listIndex] = currentListDefinition;
    setLists(newListDefinitionArray);

    // TODO: Add callback to update list
    updateTaskStatus(lists[listIndex]?.Tasks[taskIndex]?.id, currentTask.taskStatus);
  }

  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = async () => {
    try {
      const response = await axios.get('http://localhost:5001/lists');
      setLists(response.data);
    } catch (error) {
      console.error('Error fetching lists:', error);
    }
  };

  const createList = async () => {
    if (newListTitle) {
      try {
        const response = await axios.post('http://localhost:5001/lists', { title: newListTitle });
        setLists([...lists, response.data]);
        setNewListTitle('');
      } catch (error) {
        console.error('Error creating list:', error);
      }
    }
  };

  const createTask = async () => {
    if (newTaskTitle && selectedList) {
      try {
        await axios.post('http://localhost:5001/create/task', { title: newTaskTitle, listId: selectedList, taskStatus: TaskStatus.In_Progress });
        fetchLists();
        setNewTaskTitle('');
      } catch (error) {
        console.error('Error creating task:', error);
      }
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await axios.post('http://localhost:5001/update/task/taskStatus', { id: taskId, taskStatus: newStatus });
      fetchLists();
      setNewTaskTitle('');
    } catch (error) {
      console.error('Error creating task:', error);
    }
  }

  const updateTaskParentList = async (taskId, newParentListId) => {
    try {
      console.log("LOG INFO: updateTaskParentList", taskId, newParentListId);
      await axios.post('http://localhost:5001/update/task/listId', { id: taskId, listId: newParentListId });
      fetchLists();
      setNewTaskTitle('');
    } catch (error) {
      console.error('Error creating task:', error);
    }
  }

/*
  const styles = {
    li: {
      display: "inline-flex",
      align: "center",
      padding: "20px 0 100px",
      margin: "10px",
      gap: "15px",
      flexwrap: "wrap"
    },
    hd: {
      textAlign: "center"
    },
    bt: {
      display: "block",
      margin: "-15px auto"
    }
  }
  */

  console.log("LOG INFO: lists", lists);

  return (
    <>
      <Navbar username="sneha" />
      <div class="container">
        <h1>Task Board</h1>
        <div>
          <h2>Create a List</h2>
          <input
            type="text"
            placeholder="List title"
            value={newListTitle}
            onChange={(e) => setNewListTitle(e.target.value)}
           // style={styles.hd}
          />
          <button onClick={createList}>Create List</button>
        </div>
        <div>
          <h2>Create a Task</h2>
          <input
            type="text"
            placeholder="Task title"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
           // style={styles.hd}
          />
          <select value={selectedList} onChange={(e) => setSelectedList(e.target.value)}>
            <option value="" disabled>Select a list</option>
            {lists.map((list) => (
              <option key={list.id} value={list.id}>{list.title}</option>
            ))}
          </select>
          <button onClick={createTask}>Create Task</button>
        </div>
        <div>
          <h3>Lists</h3>
          <div class="list-component-parent-container">
            <DragDropContext onDragEnd={(result) => onDragEnd(result, lists, setLists, updateTaskParentList)}>
              {lists?.map((listDefinition, listIndex) => (
                <div class="list-component-parent-item">
                  <ListComponent listDefinition={listDefinition} onTaskStatusChange={onTaskStatusChange(listIndex)} listIndex={listIndex} />
                </div>
              ))}
            </DragDropContext>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
