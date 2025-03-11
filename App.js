import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000"; // Altere se necessário

function App() {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("Today");

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await axios.get(`${API_URL}/tasks`, {
                headers: { Authorization: localStorage.getItem("token") },
            });
            setTasks(response.data);
        } catch (error) {
            console.error("Erro ao buscar tarefas", error);
        }
    };

    const addTask = async () => {
        try {
            const response = await axios.post(
                `${API_URL}/tasks`,
                { title, category },
                { headers: { Authorization: localStorage.getItem("token") } }
            );
            setTasks([...tasks, response.data]);
            setTitle("");
        } catch (error) {
            console.error("Erro ao adicionar tarefa", error);
        }
    };

    const deleteTask = async (id) => {
        try {
            await axios.delete(`${API_URL}/tasks/${id}`, {
                headers: { Authorization: localStorage.getItem("token") },
            });
            setTasks(tasks.filter((task) => task._id !== id));
        } catch (error) {
            console.error("Erro ao deletar tarefa", error);
        }
    };

    return (
        <div>
            <h1>TaskNest</h1>
            <input
                type="text"
                placeholder="Nova Tarefa"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="Today">Today</option>
                <option value="Upcoming">Upcoming</option>
                <option value="Completed">Completed</option>
            </select>
            <button onClick={addTask}>Adicionar</button>

            <ul>
                {tasks.map((task) => (
                    <li key={task._id}>
                        {task.title} - {task.category}
                        <button onClick={() => deleteTask(task._id)}>Deletar</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
