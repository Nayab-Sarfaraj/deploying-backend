const savetoken = async function (user, res, status) {
  try {
    const token = await user.generateToken();
  

    res.cookie("token", token);
    return res.status(status).json({ success: true, user, token });
  } catch (error) {

    return res.json({
      success: false,
    });
  }
};

module.exports = savetoken;
