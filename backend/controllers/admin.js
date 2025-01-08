const Admin = require('../models/Admin');

const login = async (req, res) => {
  try {
    const admin = await Admin.findOne({ admin_id: req.body.admin_id });
    if (!admin) {
      res.status(404).json({ message: 'Admin not found' });
    } else if (admin.password !== req.body.password) {
      res.status(401).json({ message: 'Invalid password' });
    } else {
      const token = await admin.generateToken();
      res.json({ token });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error logging in' });
  }
};

const register = async (req, res) => {
  try {
    const admin = new Admin(req.body);
    await admin.save();
    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: 'Error registering admin' });
  }
};

module.exports = { login, register };