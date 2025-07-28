// ======================================= Import Supabase Config ============================================================
import { client } from "./subaConfig.js";

// ======================================= DOM Elements ======================================================================
const usersignup = document.getElementById("usersignup");
const userlogin = document.getElementById("userlogin");

const name = document.getElementById("name");
const useremail = document.getElementById("email");
const userpassword = document.getElementById("password");

const loginemail = document.getElementById("loginemail");
const loginpassword = document.getElementById("loginpassword");

const signupAcc = document.getElementById("signbtn");
const toggleSignup = document.querySelector(".toggleSignup");

const toggleLogin = document.querySelector(".toggleLogin");
const loginAcc = document.getElementById("loginbtn");
const logoutbtn = document.getElementById("logoutbtn");

const googleAuth = document.getElementById("googlebtn");
const back = document.querySelector(".back");
const profileCart = document.querySelector(".container");

const newPassword = document.querySelector(".newpassword");
const confirmPassword = document.querySelector(".confirmpassword");
const changePasswordBtn = document.querySelector(".changebtn");
const resetPassword = document.querySelector(".resetpassword");

// const logoutBtn = document.getElementById("loginbtn"); // Make sure this button has id="logoutbtn" in your HTML

// ======================================= Sign Up Handler ====================================================================
if (signupAcc) {
  signupAcc.addEventListener("click", async (e) => {
    e.preventDefault();

    // Field Validation
    if (!name.value || !useremail.value || !userpassword.value) {
      Swal.fire("Oops!", "Please fill in all fields", "warning");
      return;
    }

    // Supabase Auth SignUp
    const { data, error } = await client.auth.signUp({
      email: useremail.value,
      password: userpassword.value,
      options: {
        data: {
          displayName: name.value,
        },
      },
    });

    if (error) {
      Swal.fire("Error", error.message, "error");
      return;
    }

    // Optional: Insert Name into user_information Table
    const { error: insertError } = await client
      .from("user_profile_food")
      .insert({ id: data.user.id, full_name: name.value });

    if (insertError) {
      Swal.fire("Error", insertError.message, "error");
      return;
    }

    Swal.fire("Success!", "You have signed up successfully!", "success");

    // Clear Fields
    name.value = "";
    useremail.value = "";
    userpassword.value = "";

    // Switch to Login Form
    usersignup.style.display = "none";
    userlogin.style.display = "block";
  });
}

// ======================================= Login Handler ======================================================================
if (loginAcc) {
  loginAcc.addEventListener("click", async (e) => {
    e.preventDefault();

    const { data, error } = await client.auth.signInWithPassword({
      email: loginemail.value,
      password: loginpassword.value,
    });

    if (error) {
      Swal.fire("Error", error.message, "error");
    } else {
      Swal.fire("Success", "Login successful!", "success");
      window.location.href = "profile.html";
      profileCart.style.display = "block";
    }
  });
}
if (profileCart) {
}

// ======================================= Logout Handler =====================================================================

if (logoutbtn) {
  logoutbtn.addEventListener("click", async () => {
    const { error } = await client.auth.signOut();

    if (error) {
      Swal.fire("Error", error.message, "error");
    } else {
      Swal.fire("Logged Out", "You have been logged out!", "success");
      window.location.href = "signup.html";
    }
  });
}

// ======================================= Form Switchers =====================================================================
if (toggleSignup) {
  toggleSignup.addEventListener("click", () => {
    userlogin.style.display = "none";
    usersignup.style.display = "block";
  });
}
if (toggleLogin) {
  toggleLogin.addEventListener("click", () => {
    usersignup.style.display = "none";
    userlogin.style.display = "block";
  });
}

// ======================================= Redirect on Auth Check =============================================================
async function checkAuth() {
  const {
    data: { session },
  } = await client.auth.getSession();
  const currentPage = window.location.pathname.split("/").pop();

  if (session && currentPage === "signup.html") {
    window.location.href = "profile.html";
  } else if (!session && currentPage === "profile.html") {
    window.location.href = "signup.html";
  }
}

const currentPage = window.location.pathname.split("/").pop();
if (currentPage === "profile.html" || currentPage === "signup.html") {
  checkAuth();
}

// ======================================= GoogleAuth Function ===============================================================
if (googleAuth) {
  googleAuth.addEventListener("click", async (e) => {
    e.preventDefault();

    const { data, error } = await client.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo:
          "https://owaisraza72.github.io/Food-Recipes-API/profile.html", // ✅ force redirect after login
      },
    });

    if (error) {
      console.error("Error:", error.message);
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error.message,
        confirmButtonText: "OK",
      });
    } else {
      console.log("Google login...", data);
      // window.location.href = "profile.html";

      // ✅ Show SweetAlert with Google icon
      Swal.fire({
        title: "Google Account Login ",
        html: `
          <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg" alt="Google Icon" width="50" style="margin-bottom: 10px;" />
          <p style="margin-top: 5px;">You are being redirected to Google login</p>
        `,
        icon: "info",
        showConfirmButton: false,
        timer: 2500,
      });
    }
  });
}

// ======================================= Reset Password ===============================================================

if (resetPassword) {
  resetPassword.addEventListener("click", async (e) => {
    e.preventDefault();
    const { data, error } = await client.auth.resetPasswordForEmail(
      loginemail.value,

      {
        redirectTo: "http://127.0.0.1:5500/resetpassword.html",
      }
    );
    if (error) {
      Swal.fire("Error", error.message);
      console.log("error", error.message);
    } else {
      Swal.fire("Confirm Reset Password", "Please check Your Email");
      console.log(data);
    }
  });
}

if (changePasswordBtn) {
  changePasswordBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    if (newPassword.value !== confirmPassword.value) {
      Swal.fire("This Password doesn't Match");
      return;
    }

    const { data, error } = await client.auth.updateUser({
      password: newPassword.value,
    });

    if (error) {
      console.error(error.message);

      Swal.fire("Error", error.message);
    } else {
      window.location.href = "signup.html";
      console.log(data);
    }
  });
}
// ======================================= Back Button Function ===============================================================

if (back) {
  back.addEventListener("click", () => {
    window.location.href = "index.html";
  });
}

// =================================================== Profile Page ===============================================================

const profilename = document.getElementById("fullname");
const profileemail = document.getElementById("email");

const dob = document.getElementById("dob");
const age = document.getElementById("age");
const gender = document.getElementById("gender");
const filelogo = document.getElementById("file");
const phone = document.getElementById("phone");

const completeProfile = document.getElementById("completeProfile");
let profileDiv = document.getElementById("profileshow");

if (completeProfile) {
    profileCart.style.display = "block";
  //
  completeProfile.addEventListener("click", async () => {
    //  Get input field values

    //  Get current user from Supabase Auth
    const {
      data: { user },
      error,
    } = await client.auth.getUser();

    //  If user not found or error occurred
    if (error || !user) {
      Swal.fire("Error", " ❌ User not found or not logged in", "error");
      return;
    }
    //  File URL ko pehle khali set kya
    let fileUrl = "";

    //  File input se image li (pehli file hi lenge)
    const file = filelogo.files[0];

    //  Agar user ne file upload ki hai
    if (file) {
      //  File ka ek unique path bnaya (user ID + time + file name)

      //yani iss tarah k diff path hoga : user/jslkfjk3/154651351513/imag.png
      const filePath = `users/${user.id}/${Date.now()}_${file.name}`; //Date now milisec m num return krega jis se path hr file k different hoga

      //  Supabase Storage me file upload ki h before the bucket creat supbase (bucket ka naam "images" hai)
      const { data: uploadData, error: uploadError } = await client.storage
        .from("images") //  bucket name
        .upload(filePath, file); // path aur file bhejna hai

      if (uploadError) {
        Swal.fire(
          "Error",
          "❌ File upload failed: " + uploadError.message,
          "error"
        );
        return;
      }

      //  File ka public URL nikaal taake wo database me save ho
      const { data: publicUrlData } = client.storage
        .from("images")
        .getPublicUrl(filePath);

      // Public URL ko variable me daal do
      fileUrl = publicUrlData.publicUrl;
    }

    //  Update the user_information table
    const { data, error: updateError } = await client
      .from("user_profile_food") //  table name
      .update({
        full_name: profilename.value,
        email: profileemail.value,
        dob: dob.value,
        age: age.value ? Number(age.value) : null, //  numeric conversion using terni oper
        gender: gender.value,
        file: fileUrl,
        contact: phone.value,
      })
      .eq("id", user.id); // Match with the logged-in user ID

    if (updateError) {
      Swal.fire("Error", updateError.message, "error");
    } else {
      Swal.fire("Success", "Profile updated successfully!", "success");
    }
    profileCart.style.display = "none";

    render();
  });
}
async function render() {
  //Get the current logged-in user
  const {
    data: { user },
    error: authError,
  } = await client.auth.getUser();

  //  Agar user ya error ho
  if (authError || !user) {
    console.log("❌ Auth error or user not logged in", authError?.message);
    return;
  }
  const { data, error } = await client
    .from("user_profile_food")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    console.log(error);
  } else {
    console.log(data);
    const { full_name, email, dob, age, gender, file, contact } = data;
    profileDiv.innerHTML += `<div id="card">
    <img src="${file}" class="logo">
    <h2> ${full_name}</h2>
    <p>Email : ${email}</p>
    <p>D.O.B : ${dob}</p>
    <p>Age : ${age}</p>
    <p>Gender : ${gender}</p>
    <p>Contact : ${contact}</p>
    </div>`;
  }
}

