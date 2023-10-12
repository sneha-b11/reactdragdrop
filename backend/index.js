const express = require('express');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');


const app = express();
app.use(cors());
app.use(express.json());

const sequelize = new Sequelize('task', 'postgres', 'sneha1107', {
  host: 'localhost',
  dialect: 'postgres'
});

const List = sequelize.define('List', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

const Task = sequelize.define('Task', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  taskStatus: {    
    type: DataTypes.STRING,
    allowNull: false
  }
});

List.hasMany(Task);
Task.belongsTo(List);


// Define User model
const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

// Sync models with the database
sequelize.sync()
  .then(() => {
    console.log('Database synced');
  })
  .catch(err => {
    console.error('Error syncing database:', err);
  });


app.get('/lists', async (req, res) => {
  const lists = await List.findAll({ include: Task });
  res.json(lists);
});

app.post('/lists', async (req, res) => {
  const { title } = req.body;
  const newList = await List.create({ title });
  res.json(newList);
});

app.post('/create/task', async (req, res) => {
  try {
    const { title, listId, taskStatus } = req.body;
    const newTask = await Task.create({ title, ListId: listId, taskStatus });
    res.json(newTask);
  } catch(err) {
    console.log("LOG ERROR: err", err);
  }
});

app.post('/update/task/taskStatus', async (req, res) => {
  try {

    const { id, taskStatus } = req.body;
    const newTask = await Task.update({ taskStatus }, { where: { id } });
    res.json(newTask);
  } catch(err) {
    console.log("LOG ERROR: err", err);
  }
});

app.post('/update/task/listId', async (req, res) => {
  try {
    console.log("LOG INFO: req", req);
    const { id, listId } = req.body;
    const newTask = await Task.update({ ListId: listId }, { where: { id } });
    res.json(newTask);
  } catch(err) {
    console.log("LOG ERROR: err", err);
  }
});


// Routes for registering and logging in users
app.post('/register', async (req, res) => {
  console.log("LOG INFO: req", req.body);
  const { rusername, rpassword } = req.body;
  try {
    const user = await User.create({ username: rusername, password: rpassword });
    res.json(user);
  } catch (error) {
    console.log("LOG ERROR: error", error);
    res.status(500).json({ error: 'An error occurred while registering.', message: error });
  }
});

app.post('/login', async (req, res) => {
  console.log("LOG INFO: req", req.body);

  const { lusername: username, lpassword: password } = req.body;
  try {
    const user = await User.findOne({ where: { username, password } });
    if (user) {
      res.json({ message: 'Login successful.' });
    } else {
      res.status(401).json({ error: 'Invalid credentials.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while logging in.' });
  }
});


app.listen(5001, () => {
  console.log('Server is running on port 5001');
});
