const Sib = require('sib-api-v3-sdk');
require('dotenv').config();
const uuid = require('uuid');
const bcrypt = require("bcrypt");

const User = require('../models/user');
const ForgotPassword = require('../models/forgotPassword');

exports.forgotPassword = async (req, res, next) => {
    try {
      const email = req.body.email;
      const client = Sib.ApiClient.instance;
      const apiKey = client.authentications["api-key"];
      apiKey.apiKey = process.env.SEND_IN_BLUE_API_KEY;
      
      const user = await User.findOne({ where: { email } });
      if (user) {
        const id = uuid.v4();
        const userId = user.id;
        console.log('My User Id=',userId);
        await ForgotPassword.create({ id, active: true, userId });
        const tranEmailApi = new Sib.TransactionalEmailsApi();
      const sender = {
        email: "malviyasarvesh83@gmail.com",
      };

      const receivers = [
        {
          email: email,
        },
      ];

      tranEmailApi
        .sendTransacEmail({
          sender,
          to: receivers,
          subject: "Password Reset Link For Expense Tracker",
          htmlContent: `
            <div>
              <h5>Password Reset Link For Expense Tracker App</h5>
              <p>Please Click On The Link Given Below And Set Your New Password</p>
              <a href="http://localhost:8000/password/resetpassword/${id}">Reset password</a>
            </div>
          `,
        })
        .then((emailRes) => {
          console.log("Email Send=", emailRes);
        })
        .catch((err) => {
          console.log("My Error=", err);
        });
      res.status(200).json({ message: 'Mail Send Succefully to Your Email id'});
      }
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: error.message });
    }
}

exports.resetPassword = async (req, res, next) => {
  try {
     const id = req.params.id;
     const forgotPassword = await ForgotPassword.findOne({ where: { id } });
     if (forgotPassword) {
       await forgotPassword.update({ active: false });
       res.status(200).send(`
    <html>
      <script>
        const closeEye=()=>{
          document.querySelector(".close").style.display = "none";
          document.querySelector(".open").style.display = "inline-block";
          document.getElementById("password").type = "text";
        }

        const openEye=()=>{
          document.querySelector(".open").style.display = "none";
          document.querySelector(".close").style.display = "inline-block";
          document.getElementById("password").type = "password";
        }
        const resetPassword= async ()=>{
          let password=document.getElementById('password').value;
          const response = await axios.post('http://localhost:8000/password/updatepassword/${id}',{password:password});
          document.getElementById('message').textContent=response.data.message;
        }
        const login=()=>{
          location.href="http://127.0.0.1:5500/client/login.html";
        }
      </script>
      <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css"
      integrity="sha512-SzlrxWUlpfuzQ+pcUCosxcglQRNAq/DZjVsC0lE40xsADsfeQoEypE+enwcOiGjk/bSuGGKHEyjSoQ1zVisanQ=="
      crossorigin="anonymous"
      referrerpolicy="no-referrer"
    />
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Clicker+Script&family=Nunito:wght@200;300;400;600;700&family=Poppins:wght@200;300;400;500;600&family=Quicksand:wght@300;400;500&display=swap');

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Poppins', sans-serif;
}

.container {
    height: 100vh;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #4070f4;
}

.form {
    max-width: 430px;
    width: 100%;
    padding: 30px;
    border-radius: 6px;
    background: #FFF;
}

header {
    font-size: 28px;
    font-weight: 600;
    color: #232836;
    text-align: center;
}

form {
    margin-top: 30px;
}

.field {
    position: relative;
    height: 50px;
    width: 100%;
    margin-top: 20px;
}

.field input,
.field button {
    height: 100%;
    width: 100%;
    border: none;
    font-size: 16px;
    font-weight: 400;
    border-radius: 6px;
}

.field input {
    padding: 0 15px;
    border: 1px solid #CACACA;
}

.form-link {
    text-align: center;
    margin-top: 10px;
}

.form-link span {
    font-size: 14px;
    font-weight: 400;
    color: #232836;
}

.form-link a {
    color: #2874f0;
} 

a {
    color: #0171d3;
    text-decoration: none;
}

.form a:hover {
    text-decoration: underline;
}

.fa-eye-slash,
.fa-eye {
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    font-size: 18px;
    color: #2874f0;
    cursor: pointer;
}

.fa-eye {
    display: none;
}

.input-field button {
    cursor: pointer;
}
      </style>
      <section class="container forms">
      <div class="form login">
        <div class="form-content">
          <header>Reset Password</header>
          <div class="field input-field">
            <input
              type="password"
              name="password"
              id="password"
              class="password"
              placeholder="Enter New Password"
            />
            <i class="fas fa-eye-slash close" onclick="closeEye()"></i>
            <i class="fas fa-eye open" onclick="openEye()"></i>
          </div>
          <div class="field input-field">
            <button type="submit" onclick="resetPassword()">Reset Password</button>
          </div>
          <div class="field input-field">
            <button type="submit" onclick="login()">Back To Login</button>
          </div>
          <h5 id="message"></h5>
        </div>
      </div>
    </section>
    <script
      src="https://cdnjs.cloudflare.com/ajax/libs/axios/1.3.4/axios.min.js"
      integrity="sha512-LUKzDoJKOLqnxGWWIBM4lzRBlxcva2ZTztO8bTcWPmDSpkErWx0bSP4pdsjNH8kiHAUPaT06UXcb+vOEZH+HpQ=="
      crossorigin="anonymous"
      referrerpolicy="no-referrer"
    ></script>
    </html>
  `);
  res.end();
  }
  } catch (error) {
    res.status(400).json({ error: 'Error while Calling reset Password Api' });
  }
}

exports.updatePassword = async (req, res, next) => {
  try {
    const password = req.body.password;
    const id = req.params.id;
    console.log("My New Password=", password);
    console.log("My Id=", id);
    const resetPasswordRequest = await ForgotPassword.findOne({
      where: { id: id },
    });
    const user = await User.findOne({
      where: { id: resetPasswordRequest.userId },
    });
    console.log("User Details=", user);
    if (user) {
      const saltRounds = 10;
      bcrypt.genSalt(saltRounds, (err, salt) => {
        if (err) {
          console.log(err);
          throw new Error(err);
        }
        bcrypt.hash(password, salt, async (err, hash) => {
          if (err) {
            console.log(err);
            throw new Error(err);
          }
          await user.update({ password: hash });
          res
            .status(201)
            .json({ message: "Password Updated Successfully" });
        });
      });
    } else {
      return res.status(404).json({ error: "No user Exists", success: false });
    }
  } catch (error) {
    res.status(400).json({ error: 'Error while calling update Password Api' });
  }
}