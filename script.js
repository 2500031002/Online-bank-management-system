function getUsers() {
    return JSON.parse(localStorage.getItem("bankUsers")) || [];
}

function saveUsers(users) {
    localStorage.setItem("bankUsers", JSON.stringify(users));
}

function getAdmins() {
    return JSON.parse(localStorage.getItem("bankAdmins")) || [];
}

function saveAdmins(admins) {
    localStorage.setItem("bankAdmins", JSON.stringify(admins));
}

function generateAccountNumber() {
    return "MYB" + Math.floor(10000000 + Math.random() * 90000000);
}


/* LOGIN PAGE */

function showUserLogin() {

    document.getElementById("userLogin").style.display = "block";
    document.getElementById("adminLogin").style.display = "none";

    document.getElementById("userTab").classList.add("active");
    document.getElementById("adminTab").classList.remove("active");
}

function showAdminLogin() {

    document.getElementById("userLogin").style.display = "none";
    document.getElementById("adminLogin").style.display = "block";

    document.getElementById("userTab").classList.remove("active");
    document.getElementById("adminTab").classList.add("active");
}


/* USER REGISTRATION */

function registerUser(event) {

    event.preventDefault();

    let name = document.getElementById("fullName").value;
    let email = document.getElementById("email").value;
    let phone = document.getElementById("phone").value;
    let username = document.getElementById("registerUsername").value;
    let password = document.getElementById("registerPassword").value;
    let confirmPassword =
        document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {

        document.getElementById("registerMessage").innerText =
            "Passwords do not match!";

        return;
    }

    let users = getUsers();

    let existingUser = users.find(
        user => user.username === username
    );

    if (existingUser) {

        document.getElementById("registerMessage").innerText =
            "Username already exists!";

        return;
    }

    let newUser = {

        name: name,
        email: email,
        phone: phone,
        username: username,
        password: password,
        accountNumber: generateAccountNumber(),
        balance: 0,
        transactions: []

    };

    users.push(newUser);

    saveUsers(users);

    alert("User account created successfully!");

    window.location.href = "index.html";
}


/* ADMIN REGISTRATION */

function registerAdmin(event) {

    event.preventDefault();

    let name =
        document.getElementById("adminFullName").value;

    let email =
        document.getElementById("adminEmail").value;

    let username =
        document.getElementById("registerAdminUsername").value;

    let password =
        document.getElementById("registerAdminPassword").value;

    let confirmPassword =
        document.getElementById("confirmAdminPassword").value;


    if (password !== confirmPassword) {

        document.getElementById("registerMessage").innerText =
            "Passwords do not match!";

        return;
    }


    let admins = getAdmins();

    let existingAdmin = admins.find(
        admin => admin.username === username
    );


    if (existingAdmin) {

        document.getElementById("registerMessage").innerText =
            "Admin username already exists!";

        return;
    }


    let newAdmin = {

        name: name,
        email: email,
        username: username,
        password: password

    };


    admins.push(newAdmin);

    saveAdmins(admins);

    alert("Admin account created successfully!");

    window.location.href = "index.html";
}


/* USER LOGIN */

function userLogin(event) {

    event.preventDefault();

    let username =
        document.getElementById("userUsername").value;

    let password =
        document.getElementById("userPassword").value;


    let users = getUsers();


    let user = users.find(
        user =>
            user.username === username &&
            user.password === password
    );


    if (user) {

        localStorage.setItem("currentUser", username);

        window.location.href = "user.html";

    } else {

        document.getElementById("loginMessage").innerText =
            "Invalid username or password!";
    }
}


/* ADMIN LOGIN */

function adminLogin(event) {

    event.preventDefault();

    let username =
        document.getElementById("adminUsername").value;

    let password =
        document.getElementById("adminPassword").value;


    let admins = getAdmins();


    let admin = admins.find(
        admin =>
            admin.username === username &&
            admin.password === password
    );


    if (admin) {

        localStorage.setItem("currentAdmin", username);

        window.location.href = "admin.html";

    } else {

        document.getElementById("loginMessage").innerText =
            "Invalid admin username or password!";
    }
}


/* USER DASHBOARD */

function getCurrentUser() {

    let username =
        localStorage.getItem("currentUser");

    let users = getUsers();

    return users.find(
        user => user.username === username
    );
}


function updateCurrentUser(updatedUser) {

    let users = getUsers();

    let index = users.findIndex(
        user => user.username === updatedUser.username
    );

    if (index !== -1) {

        users[index] = updatedUser;

    }

    saveUsers(users);
}


function loadUserDashboard() {

    let user = getCurrentUser();

    if (!user) {

        window.location.href = "index.html";

        return;
    }

    document.getElementById("welcomeName").innerText =
        user.name;

    document.getElementById("balance").innerText =
        user.balance;

    document.getElementById("accountNumber").innerText =
        user.accountNumber;
}


/* USER SECTIONS */

function showUserSection(section) {

    let sections =
        document.querySelectorAll(".user-section");

    sections.forEach(item => {

        item.style.display = "none";

    });

    document.getElementById(section).style.display =
        "block";


    if (section === "transactions") {

        loadTransactions();

    }


    if (section === "profile") {

        loadProfile();

    }
}


/* DEPOSIT */

function depositMoney(event) {

    event.preventDefault();

    let amount =
        Number(document.getElementById("depositAmount").value);


    if (amount <= 0) {

        alert("Enter a valid amount");

        return;
    }


    let user = getCurrentUser();

    user.balance += amount;


    user.transactions.push({

        type: "Deposit",
        amount: amount,
        date: new Date().toLocaleString()

    });


    updateCurrentUser(user);

    document.getElementById("depositAmount").value = "";

    alert("Money deposited successfully!");

    loadUserDashboard();
}


/* WITHDRAW */

function withdrawMoney(event) {

    event.preventDefault();

    let amount =
        Number(document.getElementById("withdrawAmount").value);

    let user = getCurrentUser();


    if (amount <= 0) {

        alert("Enter a valid amount");

        return;
    }


    if (amount > user.balance) {

        alert("Insufficient balance!");

        return;
    }


    user.balance -= amount;


    user.transactions.push({

        type: "Withdraw",
        amount: amount,
        date: new Date().toLocaleString()

    });


    updateCurrentUser(user);

    document.getElementById("withdrawAmount").value = "";

    alert("Money withdrawn successfully!");

    loadUserDashboard();
}


/* TRANSFER */

function transferMoney(event) {

    event.preventDefault();

    let receiverAccount =
        document.getElementById("receiverAccount").value;

    let amount =
        Number(document.getElementById("transferAmount").value);


    let sender = getCurrentUser();

    let users = getUsers();


    let receiver = users.find(
        user =>
            user.accountNumber === receiverAccount
    );


    if (!receiver) {

        alert("Receiver account not found!");

        return;
    }


    if (receiver.username === sender.username) {

        alert("You cannot transfer money to yourself!");

        return;
    }


    if (amount <= 0) {

        alert("Enter a valid amount");

        return;
    }


    if (amount > sender.balance) {

        alert("Insufficient balance!");

        return;
    }


    sender.balance -= amount;

    receiver.balance += amount;


    sender.transactions.push({

        type: "Transfer Sent",
        amount: amount,
        date: new Date().toLocaleString()

    });


    receiver.transactions.push({

        type: "Transfer Received",
        amount: amount,
        date: new Date().toLocaleString()

    });


    saveUsers(users);


    document.getElementById("receiverAccount").value = "";

    document.getElementById("transferAmount").value = "";


    alert("Money transferred successfully!");

    loadUserDashboard();
}


/* USER TRANSACTIONS */

function loadTransactions() {

    let user = getCurrentUser();

    let body =
        document.getElementById("transactionBody");

    body.innerHTML = "";


    user.transactions.forEach(transaction => {

        let row = document.createElement("tr");


        row.innerHTML =
            "<td>" + transaction.type + "</td>" +
            "<td>₹" + transaction.amount + "</td>" +
            "<td>" + transaction.date + "</td>";


        body.appendChild(row);

    });
}


/* USER PROFILE */

function loadProfile() {

    let user = getCurrentUser();


    document.getElementById("profileName").innerText =
        user.name;

    document.getElementById("profileEmail").innerText =
        user.email;

    document.getElementById("profilePhone").innerText =
        user.phone;

    document.getElementById("profileUsername").innerText =
        user.username;

    document.getElementById("profileAccount").innerText =
        user.accountNumber;
}


/* ADMIN DASHBOARD */

function showAdminSection(section) {

    let sections =
        document.querySelectorAll(".admin-section");


    sections.forEach(item => {

        item.style.display = "none";

    });


    document.getElementById(section).style.display =
        "block";


    if (section === "users") {

        loadAdminUsers();

    }


    if (section === "accounts") {

        loadAdminAccounts();

    }


    if (section === "adminTransactions") {

        loadAdminTransactions();

    }
}


function loadAdminDashboard() {

    let admin =
        localStorage.getItem("currentAdmin");


    if (!admin) {

        window.location.href = "index.html";

        return;
    }


    let users = getUsers();

    let transactionCount = 0;


    users.forEach(user => {

        transactionCount +=
            user.transactions.length;

    });


    document.getElementById("totalUsers").innerText =
        users.length;

    document.getElementById("totalAccounts").innerText =
        users.length;

    document.getElementById("totalTransactions").innerText =
        transactionCount;
}


/* ADMIN USERS */

function loadAdminUsers() {

    let users = getUsers();

    let body =
        document.getElementById("usersBody");


    body.innerHTML = "";


    users.forEach(user => {

        let row = document.createElement("tr");


        row.innerHTML =
            "<td>" + user.name + "</td>" +
            "<td>" + user.email + "</td>" +
            "<td>" + user.phone + "</td>" +
            "<td>" + user.username + "</td>" +
            "<td>" + user.accountNumber + "</td>";


        body.appendChild(row);

    });
}


/* ADMIN ACCOUNTS */

function loadAdminAccounts() {

    let users = getUsers();

    let body =
        document.getElementById("accountsBody");


    body.innerHTML = "";


    users.forEach(user => {

        let row = document.createElement("tr");


        row.innerHTML =
            "<td>" + user.accountNumber + "</td>" +
            "<td>" + user.username + "</td>" +
            "<td>₹" + user.balance + "</td>" +
            "<td>Savings</td>";


        body.appendChild(row);

    });
}


/* ADMIN TRANSACTIONS */

function loadAdminTransactions() {

    let users = getUsers();

    let body =
        document.getElementById("adminTransactionBody");


    body.innerHTML = "";


    users.forEach(user => {

        user.transactions.forEach(transaction => {

            let row = document.createElement("tr");


            row.innerHTML =
                "<td>" + user.username + "</td>" +
                "<td>" + transaction.type + "</td>" +
                "<td>₹" + transaction.amount + "</td>" +
                "<td>" + transaction.date + "</td>";


            body.appendChild(row);

        });

    });
}


/* LOGOUT */

function logout() {

    localStorage.removeItem("currentUser");

    localStorage.removeItem("currentAdmin");

    window.location.href = "index.html";
}


/* PAGE LOAD */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        let page =
            window.location.pathname;


        if (page.includes("register.html")) {

            let role =
                new URLSearchParams(
                    window.location.search
                ).get("role");


            if (role === "admin") {

                document.getElementById(
                    "userRegister"
                ).style.display = "none";


                document.getElementById(
                    "adminRegister"
                ).style.display = "block";

            }

        }


        if (page.includes("user.html")) {

            loadUserDashboard();

        }


        if (page.includes("admin.html")) {

            loadAdminDashboard();

        }

    }
);