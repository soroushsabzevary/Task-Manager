const { serverApp, path } = require('./server');
const { uuidv4, createCookieSession, errorLog } = require('./util');
const { admin } = require('./CJdbConfig');

const db = admin.firestore();
const tasksCollection = db.collection('tasks');
var sessions = {};

serverApp.get('/signin', (req,res) =>{
  res.sendFile(path.join(__dirname, 'react-app', 'dist', 'index.html'));
});
serverApp.get('/dashboard', (req,res) =>{
  const sessionId = req.cookies['session'];
  try{
    if (!sessions[sessionId]) {
      throw new Error('Cookies expired or never logged in.');
    }
    res.sendFile(path.join(__dirname, 'react-app', 'dist', 'index.html'));
  }
  catch (err){
    errorLog(err);
    res.status(401);
  }
});

serverApp.post('/signin', async (req,res) =>{  
  const userInfo = req.body;
  const token = userInfo.token;
  const email = userInfo.email;
  try{
    await admin.auth().verifyIdToken(token);
    res.cookie('session', createCookieSession(email, sessions), {
      maxAge: 1800 * 1000,
      httpOnly: true,
      sameSite: 'strict',
    });
    res.status(201).json({auth:true})
  }catch (err){
    errorLog(err);
    res.status(401).json({auth:false})
  }
});

serverApp.get('/getTasks', async (req, res) => {
  const sessionId = req.cookies['session'];
  try {
    if (!sessions[sessionId]) {
      throw new Error('Cookies expired or never logged in.');
    }

    const selectDocRef = tasksCollection.where('email', '==', sessions[sessionId].email);
    const rows = await selectDocRef.get();
    const tasks = [];
    rows.forEach((doc) => {
      tasks.push({
        ...doc.data(),
        docId: doc.id,
      });
    });
    //console.log(tasks);
    res.status(200).json({ result: true, tasks });
  } catch (err) {
    errorLog(err);
    res.status(400).json({ result: false });
  }
});

const validTaskStates = ['To Do','In Progress','Completed'];
serverApp.put('/addTask', async (req, res) => {
  const sessionId = req.cookies['session'];
  const taskInfo = req.body;

  try {
    if (!sessions[sessionId]) {
      throw new Error('Cookies expired or never logged in.');
    }

    await tasksCollection.add({
      email: sessions[sessionId].email,
      title: taskInfo.title,
      description: taskInfo.description,
      status: validTaskStates.includes(taskInfo.status) ? taskInfo.status : (() => { throw new Error("Invalid Task State") }),
      dueDate: taskInfo.dueDate
    });
    res.status(201).json({ result: true });
  } catch (err) {
    errorLog(err);
    res.status(400).json({ result: false });
  }
});

serverApp.put('/editTask', async (req, res) => {
  const sessionId = req.cookies['session'];
  const taskInfo = req.body;
  //console.log(taskInfo);
  try {
    if (!sessions[sessionId]) {
      throw new Error('Cookies expired or never logged in.');
    }

    const taskRef = tasksCollection.doc(taskInfo.docId);
    await taskRef.update({
      title: taskInfo.title,
      description: taskInfo.description,
      status: validTaskStates.includes(taskInfo.status) ? taskInfo.status : (() => { throw new Error("Invalid Task State") }),
      dueDate: taskInfo.dueDate,
    });
    res.status(200).json({ result: true });
  } catch (err) {
    errorLog(err);
    res.status(400).json({ result: false });
  }
});

serverApp.delete('/deleteTask', async (req, res) => {
  const sessionId = req.cookies['session'];
  const docId = req.body.docId;

  try {
    if (!sessions[sessionId]) {
      throw new Error('Cookies expired or never logged in.');
    }

    const taskRef = tasksCollection.doc(docId);
    await taskRef.delete();
    res.status(200).json({ result: true });
  } catch (err) {
    errorLog(err);
    res.status(500).json({ result: false });
  }
});