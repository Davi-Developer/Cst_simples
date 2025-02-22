import React, { useState, useEffect, useRef } from 'react';
import './style.css';
import Trash from '../../assets/trash.svg';
import api from '../../services/api';

function Home() {
  const [users, setUsers] = useState([]); // Corrected useState

  const inputName = useRef()
  const inputAge = useRef()
  const inputEmail = useRef()

  async function getUsers() {
    try {
      const usersFromApi = await api.get('/usuarios'); // Corrected variable name
      setUsers(usersFromApi.data); // Corrected variable name
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('Erro ao buscar usuários.');
    }
  }
  
  async function creatUsers(){ 
        await api.post('/usuarios', {
          name: inputName.current.value,
          age: inputAge.current.value,
          email: inputEmail.current.value
        })
  }   
 
      useEffect(() => {
    getUsers();
  }, []);

  const [form, setForm] = useState({ name: '', age: '', email: '' });

  // Function to handle input changes
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Function to add a new user
  const handleAddUser = () => {
    if (form.name && form.age && form.email) {
      const newUser = {
        id: Date.now().toString(), // Generate a unique ID
        ...form,
      };
      setUsers([...users, newUser]);
      setForm({ name: '', age: '', email: '' }); // Clear the form
    } else {
      alert('Por favor, preencha todos os campos');
    }
  };

  // Function to delete a user by ID
  const handleDeleteUser = (id) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  return (
    <div className='container'>
      <form onSubmit={(e) => e.preventDefault()}>
        <h1>Cadastro de Usuários</h1>
        <input
          placeholder="Nome"
          name="name"
          type="text"
          value={form.name}
          onChange={handleChange}
        />
        <input
          placeholder="Idade"
          name="age"
          type="number"
          value={form.age}
          onChange={handleChange}
        />
        <input
          placeholder="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
        />
        <button type="button" onClick={handleAddUser}>
          Cadastrar
        </button>
      </form>

      {users.map((user) => (
        <div key={user.id} className="card">
          <div>
            <p>
              Nome: <span>{user.name}</span>
            </p>
            <p>
              Idade: <span>{user.age}</span>
            </p>
            <p>
              Email: <span>{user.email}</span>
            </p>
          </div>
          <button onClick={() => handleDeleteUser(user.id)}>
            <img src={Trash} alt="Delete icon" />
          </button>
        </div>
      ))}
    </div>
  );
}

export default Home;