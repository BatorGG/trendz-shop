async function sendRegistration() {
    console.log({
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
        password2: document.getElementById("password2").value,
        invitedBy: document.getElementById("invitedBy").value,
        couponCode: document.getElementById("couponCode").value
    })
    var registration = await fetch("/users/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            password: document.getElementById("password").value,
            password2: document.getElementById("password2").value,
            invitedBy: document.getElementById("invitedBy").value,
            couponCode: document.getElementById("couponCode").value
        })
    }).then(res => {
        if (res.ok) return res.json();
        return res.json().then(json => Promise.reject(json))
    });

    console.log(registration);
    if (registration.errors.length > 0) {
        document.getElementById("errors").innerHTML = "";
        for (var i = 0; i < registration.errors.length; i++){
            document.getElementById("errors").innerHTML += "<p>" + registration.errors[i]["msg"] + "</p>";
        }
    }
    else {
        window.location.href = "./login.html";
    }
}


async function sendLogin() {

    var login = await fetch("/users/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: document.getElementById("email").value,
            password: document.getElementById("password").value
        })
    }).then(res => {
        if (res.ok) return res.json();
        return res.json().then(json => Promise.reject(json))
    });

    if (login.success) {
        window.location.href = "./dashboard.html";
    }
    else {
        document.getElementById("error").innerHTML = "<p>" + login.error + "</p>";
    }
    

}


async function getUserData() {
    console.log("Getting user data");

    var user = await fetch("/getuser", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
             
        })
    }).then(res => {
        if (res.ok) return res.json();
        return res.json().then(json => Promise.reject(json))
    });

    if (user.success) {
        console.log(user);
        document.getElementById("name").textContent = "Welcome " + user.name + "!";
        document.getElementById("invitedBy").textContent = user.invitedBy;
        document.getElementById("couponCode").textContent = user.couponCode;
        document.getElementById("balanceInCents").textContent = "$" + Math.round(user.balanceInCents)/100;

    }
    else {
        window.location.href = "./login.html";
    }
}


//Withdraw function
function withdrawFunction() {
    alert("Minimum withdrawal amount: $10");
}


// Stripe Checkout
function startCheckout(){
    console.log("Creating checkout!");
    fetch("/create-checkout-session2", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({

        })
    }).then(res => {
        if (res.ok) return res.json();
        return res.json().then(json => Promise.reject(json))
    }).then(({ session }) => {
        console.log(session);
        sessionStorage.setItem("paymentId", session.id);
        window.location = session.url;
    }).catch(e => {
        console.error(e.error);
    })
}


// Check payment
function checkPayment(){
    var id = sessionStorage.getItem("paymentId")
    console.log("Checking payment: " + id);

    fetch("/check-payment", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id: id
        })
    }).then(res => {
        if (res.ok) return res.json();
        return res.json().then(json => Promise.reject(json))
    }).then(({ session }) => {
        console.log(session);
        sessionStorage.setItem("paymentId", "");
        window.location = "./dashboard.html";
    }).catch(e => {
        console.error(e.error);
    })
}


// Check Subscription
function checkSubscription(){

    

    fetch("/check-subscription", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
        })
    }).then(res => {
        if (res.ok) return res.json();
        return res.json().then(json => Promise.reject(json))
    }).then(({ status }) => {
        console.log(status);
        if (!status) {
            document.getElementsByClassName("container")[0].innerHTML += "<br/><p>Your coupon code is currently disabled. Please pay the monthly membership fee to enable it!</p> <br/> <button onclick='startCheckout();'>Pay Membership Fee</button>";
        }
    }).catch(e => {
        console.error(e.error);
    })
    
}


// Logout
function logOut(){

    fetch("/users/logout", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
        })
    }).then(res => {
        if (res.ok) return res.json();
        return res.json().then(json => Promise.reject(json))
    }).then(({ success }) => {
        console.log(success);
        if (success) {
            window.location.href = "./login.html";
        }
    }).catch(e => {
        console.error(e.error);
    })

}



//Mobile menu -----------------
function showMenu() {
  var x = document.getElementById("menu-opened");
  if (x.className === "menu-opened mobile") {
    x.style.transition = "0.2s";
    x.style.position = "absolute";
    x.style.left = "-400px";

    setTimeout(() => {
        x.className = "menu-opened hidden mobile";
    }, 200)

  } else {
    x.className = "menu-opened mobile";
    x.style.transition = "0.2s";
    x.style.position = "absolute";
    x.style.left = "-400px";
    setTimeout(() => {
        x.style.left = "0px";
    }, 1)
  }
}

// Navbar
// When the user scrolls down 80px from the top of the document, resize the navbar's padding and the logo's font size
window.onscroll = function() {scrollFunction()};

var mode = "relative";
function scrollFunction() {


	//(mode == "relative" && (document.body.scrollTop > 240 || document.documentElement.scrollTop > 240)) || (mode == "fixed" && (document.body.scrollTop > 160 || document.documentElement.scrollTop > 160))
	if ((mode == "relative" && (document.body.scrollTop > 240 || document.documentElement.scrollTop > 240)) || (mode == "fixed" && (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100))) {
	if (mode == "relative") {
  		document.getElementById("topnav-id").style.transition = "0s";
    	document.getElementById("topnav-id").style.height = "60px"
    	document.getElementById("topnav-id").style.position = "fixed";
		document.getElementById("topnav-id").style.top = "-40px";
    	//document.getElementById("logo").style.fontSize = "25px";
	}
    setTimeout(() => {
  		document.getElementById("topnav-id").style.transition = "0.4s";
		document.getElementById("topnav-id").style.top = "0";
	}, 10)

    mode = "fixed";

  } else {
  	if (mode == "fixed" && (document.body.scrollTop < 100 || document.documentElement.scrollTop < 100)){
    document.getElementById("topnav-id").style.height = "90px";
    document.getElementById("topnav-id").style.position = "relative";
	document.getElementById("topnav-id").style.top = "";

    //document.getElementById("logo").style.fontSize = "35px";
    mode = "relative";
	}
  }
}



//Questions
function nextQuestion(x){
    var current = "question" + x;
    var next = "question" + (x+1)

    document.getElementById(current).className = "question-section hidden";
    document.getElementById(next).className = "question-section";
}


//Send signup
function sendSignUp(){
    var name = document.getElementById("name").value;
    var birthDate = document.getElementById("birthdate").value;
    var email = document.getElementById("email").value;

    var error = "";

    if (!email.includes("@")){
        error = "Plese use a real email address!"
    }

    if (!name || !birthDate || !email) {
        error = "Please fill in all fields!"
    }

    if (error != ""){
        document.getElementById("errors").innerHTML = "<p>" + error + "</p>";
    }
    else {
        fetch("/send-application", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name,
                birthDate: birthDate,
                email: email
            })
        }).then(res => {
            if (res.ok) return res.json();
            return res.json().then(json => Promise.reject(json))
        }).then((res) => {
            console.log(res.msg);
            if (res.success) {
                nextQuestion(6);
            }
            else {
                document.getElementById("errors").innerHTML = "<p>" + res.msg + "</p>";
            }

        }).catch(e => {
            console.error(e.error);
        })
        
        
    }

}


// FAQ
var faq = document.getElementsByClassName("faq-page");
var i;

for (i = 0; i < faq.length; i++) {
	
    faq[i].addEventListener("click", function () {
        /* Toggle between adding and removing the "active" class,
        to highlight the button that controls the panel */
        this.classList.toggle("faq-active");

        /* Toggle between hiding and showing the active panel */
        var body = this.nextElementSibling;
        if (body.style.display === "block") {
            body.style.display = "none";
        } else {
            body.style.display = "block";
        }
    });
}


//Log requests
function requestLogger(){
	var currentUser = localStorage.getItem("currentUser");

	if (!currentUser || currentUser == null || currentUser == "" || typeof currentUser == "undefined"){
        var newUser = makeId(5);
		localStorage.setItem("currentUser", newUser);
        currentUser = newUser;
	}

	var requestedUrl = window.location.href;

	fetch("/log-request", {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			currentUser: currentUser,
			requestedUrl: requestedUrl

		})
	});

	
}

function makeId(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
