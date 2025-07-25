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
    toggleLogin();
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
      return;
    }

    Swal.fire("Success", "Login successful!", "success");
    window.location.href = "profile.html";
  });
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
        redirectTo: "http://localhost:5500/profile.html", // ✅ force redirect after login
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

// ======================================= Back Button Function ===============================================================

if (back) {
  back.addEventListener("click", () => {
    window.location.href = "index.html";
  });
}

let completeProfile = document.getElementById("completeProfile");
const cart = document.querySelector(".card").value;

if (completeProfile) {
  // 🚀 Function to handle profile update
  completeProfile.addEventListener("click", async () => {
    // 🧾 Step 1: Get input field values
    const fullname = document.getElementById("fullname").value;
    const email = document.getElementById("email").value;
    const dob = document.getElementById("dob").value;
    const gender = document.getElementById("gender").value;
    const phone = document.getElementById("phone").value;

    // 🔍 Step 2: Get current user from Supabase Auth
    const {
      data: { user },
      error,
    } = await client.auth.getUser();

    // ❌ If user not found or error occurred
    if (error || !user) {
      Swal.fire("Error", " ❌ User not found or not logged in", "error");
      return;
    }

    // 💾 Step 3: Update the user_information table
    const { error: updateError } = await client
      .from("user_profile_food") // ← Your table name
      .update({
        full_name: fullname,
        email: email,
        dob: dob,
        gender: gender,
        contact: phone,
      })
      .eq("id",user.id); // ← Match with the logged-in user ID

    // ✅ Step 4: Alert user with success or error message
    console.log(updateError);
    if (updateError) {
      Swal.fire("Error", updateError.message, "error");
    } else {
      Swal.fire("Success", "Profile updated successfully!", "success");
    }
    cart.style.display = "none";
  });

}
