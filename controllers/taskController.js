const { db } = require('../config/firebase');
const COLLECTION = 'tasks';

exports.createTask = async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;
    const newTask = {
      title,
      description: description || '',
      dueDate: dueDate || null,
      completed: false,
      userId: req.user.uid,
      createdAt: new Date()
    };
    const docRef = await db.collection(COLLECTION).add(newTask);
    res.status(201).json({ id: docRef.id, ...newTask });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const snapshot = await db
      .collection(COLLECTION)
      .where('userId', '==', req.user.uid)
      .orderBy('createdAt', 'desc')
      .get();

    const tasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getTask = async (req, res) => {
  try {
    const doc = await db.collection(COLLECTION).doc(req.params.id).get();
    if (!doc.exists || doc.data().userId !== req.user.uid)
      return res.status(404).json({ message: 'Task not found' });
    res.json({ id: doc.id, ...doc.data() });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const docRef = db.collection(COLLECTION).doc(req.params.id);
    const doc    = await docRef.get();
    if (!doc.exists || doc.data().userId !== req.user.uid)
      return res.status(404).json({ message: 'Task not found' });

    await docRef.update(req.body);
    res.json({ message: 'Task updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const docRef = db.collection(COLLECTION).doc(req.params.id);
    const doc    = await docRef.get();
    if (!doc.exists || doc.data().userId !== req.user.uid)
      return res.status(404).json({ message: 'Task not found' });

    await docRef.delete();
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
