import { initializeApp } from "firebase/app";
import { getDatabase, ref } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyDhTuOzrMd5xkdZDnijUzYuPXzMY0vIGho",
    authDomain: "blood-bridge-b30c8.firebaseapp.com",
    databaseURL: "https://blood-bridge-b30c8-default-rtdb.firebaseio.com",
    projectId: "blood-bridge-b30c8",
    storageBucket: "blood-bridge-b30c8.appspot.com",
    messagingSenderId: "586690052414",
    appId: "1:586690052414:web:6a9c10ce2096be92302c6f",
    measurementId: "G-C855XZGG94"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const contactFormDB = ref(database, "contactForm");

// Add this code here to ensure the DOM is fully loaded before attaching the event listener
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("contactForm").addEventListener("submit", submitMailForm);
});

function submitMailForm(e) {
    e.preventDefault();

    var name = getElementVal("name");
    var emailid = getElementVal("emailid");
    var msgContent = getElementVal("msgContent");

    // console.log("Form Submitted:", { name, emailid, msgContent });

    saveMessages(name, emailid, msgContent);

    document.querySelector(".alert").style.display = "block";
    setTimeout(() => {
        document.querySelector(".alert").style.display = "none";
    }, 3000);
  
    document.getElementById("contactForm").reset();
}

const saveMessages = (name, emailid, msgContent) => {
    var newContactForm = contactFormDB.push();
    newContactForm.set({
        name: name,
        emailid: emailid,
        msgContent: msgContent,
    }).then(() => {
        console.log("Message saved successfully");
    }).catch((error) => {
        console.error("Error saving message:", error);
    });
};

const getElementVal = (id) => {
    return document.getElementById(id).value;
};
