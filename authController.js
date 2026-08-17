const User = require('./UserModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { username, email, password, fullName } = req.body;
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    
    if (existingUser) {
      return res.status(400).json({ message: 'Bu e-posta veya kullanıcı adı zaten kullanımda.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ username, email, password: hashedPassword, fullName });
    await newUser.save();

    res.status(201).json({ success: true, message: 'Kayıt başarılı! Giriş yapabilirsiniz.' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Hatalı şifre.' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secretkey', { expiresIn: '7d' });

    res.status(200).json({
      success: true,
      token,
      user: { id: user._id, username: user.username, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};