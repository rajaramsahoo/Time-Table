const bcrypt = require('bcrypt');

 const hashPassword = async (password) => {
    try {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      return hashedPassword;
    } catch (error) {
      console.log(error);
    }
  };
  const confirmHashPassword = async (conpasswors) => {
    try {
      const saltRounds = 15;
      const hashedPassword = await bcrypt.hash(conpasswors, saltRounds);
      return hashedPassword;
    } catch (error) {
      console.log(error);
    }
  };
  
   const comparePassword = async (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword);
  };

  module.exports = { hashPassword,comparePassword,confirmHashPassword };