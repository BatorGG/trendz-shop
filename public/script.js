var cartItems = [];
var storeItems = [
	{
		id: 1,
		name: "Self Cleaning Hairbrush (White)",
		priceInCents: 2999,
	},
	{
		id: 2,
		name: "Self Cleaning Hairbrush (Pink)",
		priceInCents: 2999,
	},
	{
		id: 3,
		name: "Self Cleaning Hairbrush (Red)",
		priceInCents: 2999,
	},
	{
		id: 4,
		name: "Syringe Pen (Red)",
		priceInCents: 1499,
	},
	{
		id: 5,
		name: "Syringe Pen (Yellow)",
		priceInCents: 1499,
	},
	{
		id: 6,
		name: "Syringe Pen (Green)",
		priceInCents: 1499,
	},
	{
		id: 7,
		name: "Syringe Pen (Blue)",
		priceInCents: 1499,
	},
	{
		id: 8,
		name: "2 in 1 Screen Cleaner (Black)",
		priceInCents: 1499,
	},
	{
		id: 9,
		name: "2 in 1 Screen Clenaer (Pink)",
		priceInCents: 1499,
	},
	{
		id: 10,
		name: "High-Security Door Alarm",
		priceInCents: 2999,
	}
];

// Add to cart
function addToCart(x, name){

	if (sessionStorage.getItem("cart") !== "" && sessionStorage.getItem("cart") != null){
		cartItems = JSON.parse(sessionStorage.getItem("cart"));
	}
	else {
		cartItems = [];
	}


	try {
		var size = x.parentNode.children[2].children[0].children[0].value;
	} catch {
		var size;
	}
	
	var amount = parseInt(x.parentNode.children[3].children[1].value);
	var itemId;
	if (name == "Self Cleaning Hairbrush"){
		var imgUrl = "products/hairbrush/3.jpg";
		if (size == "White") itemId = 1;
		if (size == "Pink") itemId = 2;
		if (size == "Red") itemId = 3;
	}

	if (name == "Syringe Pen"){
		var imgUrl = "products/syringepen/1.jpg";
		if (size == "Red") itemId = 4;
		if (size == "Yellow") itemId = 5;
		if (size == "Green") itemId = 6;
		if (size == "Blue") itemId = 7;
	}

	if (name == "Screen Cleaner"){
		var imgUrl = "products/screen_cleaner/2.jpg";
		if (size == "Black") itemId = 8;
		if (size == "Pink") itemId = 9;
	}

	if (name == "Alarm"){
		var imgUrl = "products/alarm/1.jpg";
		itemId = 10;
	}

	if (size == "select"){
		alert("Please select size or color!");
	}
	else {

		var itemName = storeItems.filter(obj => { return obj.id === itemId })[0].name;

		var itemIds = [];
		for (var i = 0; i < cartItems.length; i++){
			itemIds.push(cartItems[i]["id"]);
		}

		for (var i = 0; i < cartItems.length; i++){
			if (cartItems[i]["id"] == itemId){
				cartItems[i]["amount"] = parseInt(cartItems[i]["amount"]) + parseInt(amount);
			}
		}

		if (itemIds.indexOf(itemId) === -1) {
			var itemToCart = {
				id: itemId,
				name: itemName,
				img: imgUrl,
				priceInCents: storeItems.filter(obj => { return obj.id === itemId })[0].priceInCents,
				originalPriceInCents: storeItems.filter(obj => { return obj.id === itemId })[0].priceInCents,
				amount: amount
			};

			cartItems.push(itemToCart);
		}

		sessionStorage.setItem("cart", JSON.stringify(cartItems));



		updateCart();
		cartNotification();

		atcButtons = document.getElementsByClassName("atc button");
		console.log(atcButtons)
		for (var i = 0; i < atcButtons.length; i++){
			toChange = atcButtons[i]
			toChange.textContent = "Added To Cart";
			changeBack(toChange);


		}
	}


}

function changeBack(toChange){
	setTimeout(() => {
	    toChange.textContent = "Add To Cart";
	}, 1000)
}



// Update Cart
function updateCart(){


	if (sessionStorage.getItem("cart") !== "" && sessionStorage.getItem("cart") != null){
		cartItems = JSON.parse(sessionStorage.getItem("cart"));
	}
	else {
		cartItems = [];
	}

	// Coupon
	var appliedCoupon = sessionStorage.getItem("coupon");

	if (appliedCoupon && appliedCoupon != "" && typeof appliedCoupon != "undefined"){
		document.getElementById("coupon").value = appliedCoupon.toUpperCase();
		document.getElementById("coupon").setAttribute("disabled", "");
		document.getElementById("coupon-button").setAttribute("disabled", "");
		document.getElementById("coupon-button").textContent = "Applied Coupon"
		
		for (var i = 0; i < cartItems.length; i++){
			cartItems[i]["priceInCents"] = Math.round(cartItems[i]["originalPriceInCents"] * 0.9);
			console.log("Changed price");
		}
	}

	



	var cart = document.getElementById("cart-item-container");

	cart.innerHTML = "";
	for (var i = 0; i < cartItems.length; i++) {
		cart.innerHTML += '<div class="cart-item"> <div class="cart-item-item"> <img src="./images/' + cartItems[i]["img"] + '" alt="Image 0"> <h4>' + cartItems[i]["name"] + '</h4> <button class="cart-item-remove" onclick="removeFromCart(this)">Remove</button> </div> <h4 class="cart-item-price">$' + cartItems[i]["priceInCents"]/100 + '</h4> <input type="number" name="quantity" value="' + cartItems[i]["amount"] + '" class="cart-item-quantity"> <h4 class="cart-item-subtotal">= $' + Math.round(cartItems[i]["amount"] * cartItems[i]["priceInCents"])/100 + '</h4> </div>';
	}

	var total = 0;
	for (var i = 0; i < cartItems.length; i++) {
		total += (cartItems[i]["amount"] * cartItems[i]["priceInCents"]);
	}

	document.getElementById("cart-total-amount").textContent = "$" + Math.round(total)/100;


	let amounts = document.querySelectorAll(".cart-item-quantity");

	for (i = 0; i < amounts.length; i++) {
		//Remove all event listeners
		var old_element = amounts[i];
		var new_element = old_element.cloneNode(true);
		old_element.parentNode.replaceChild(new_element, old_element);
	}

	amounts = document.querySelectorAll(".cart-item-quantity");
	for (i = 0; i < amounts.length; i++) {

    	amounts[i].addEventListener('change', function (e) {
    		var newAmount = e.target.value;
    		var itemName = e.target.parentNode.children[0].children[1].textContent;

			if (newAmount < 1 || isNaN(newAmount)){
				newAmount = 1;
			}
			if (newAmount > 1000){
				newAmount = 1000;
			}

			
    		for (var i = 0; i < cartItems.length; i++) {
    			if (itemName == cartItems[i]["name"]) {
    				cartItems[i]["amount"] = newAmount;
    			}
    		}
    		sessionStorage.setItem("cart", JSON.stringify(cartItems));
    		updateCart();
		});
	}




	sessionStorage.setItem("cart", JSON.stringify(cartItems));
	//console.log(sessionStorage.getItem("cart"));
	//sessionStorage.getItem("cart");
	cartNotification();
}



//Remove from cart
function removeFromCart(x){
	var itemName = x.parentNode.children[1].textContent;
  	for (var i = 0; i < cartItems.length; i++) {
		if (itemName == cartItems[i]["name"]) {
			cartItems.splice(i, 1);
    	}
    }

    sessionStorage.setItem("cart", JSON.stringify(cartItems));
	updateCart();
	cartNotification();
}


//Check coupon
async function checkCoupon(coupon) {
    console.log("Checking for:" + coupon);

    var isValid = await fetch("/validate-coupon", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            coupon: coupon 
        })
    }).then(res => {
        if (res.ok) return res.json();
        return res.json().then(json => Promise.reject(json))
    });

    if (isValid) {
        console.log("Coupon is valid");
		//Recalculate item prices
		for (var i = 0; i < cartItems.length; i++){
			cartItems[i]["priceInCents"] = Math.round(cartItems[i]["originalPriceInCents"] * 0.9);
		}

		document.getElementById("coupon").setAttribute("disabled", "");
		document.getElementById("coupon-button").setAttribute("disabled", "");
		document.getElementById("coupon-button").textContent = "Applied Coupon"
		console.log("Set to:")
		sessionStorage.setItem("coupon", document.getElementById("coupon").value);

		sessionStorage.setItem("cart", JSON.stringify(cartItems));
		updateCart();

    }
    else {
        console.log("Not valid.")
		document.getElementById("coupon").value = "";
		document.getElementById("coupon").setAttribute("placeholder", "Not a valid coupon");
    }
}


//Stripe payment
const button = document.getElementById("cart-proceed");
button.addEventListener("click", () => {

	var appliedCoupon = sessionStorage.getItem("coupon");

	if (appliedCoupon && appliedCoupon != "" && typeof appliedCoupon != "undefined"){
		document.getElementById("coupon").value = appliedCoupon.toUpperCase();
		document.getElementById("coupon").setAttribute("disabled", "");
		document.getElementById("coupon-button").setAttribute("disabled", "");
		document.getElementById("coupon-button").textContent = "Applied Coupon"
		var couponApplied = true;
	}
    
	if (cartItems.length > 0){

		button.textContent = "Please Wait...";

		fetch("/create-checkout-session", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				items: cartItems,
				couponApplied: couponApplied

			})
		}).then(res => {
			if (res.ok) return res.json();
			return res.json().then(json => Promise.reject(json))
		}).then(({ session }) => {
			//console.log(url);
			sessionStorage.setItem("paymentId", session.id);
			window.location = session.url;
		}).catch(e => {
			console.error(e.error);
		})
	}
});


function successPage(){
	var page = document.getElementsByClassName("basicpage")[0];
	cartItems = JSON.parse(sessionStorage.getItem("cart"));
	var total = 0;
	for (var i=0; i < cartItems.length; i++){
		page.innerHTML += '<h4>' + cartItems[i]["amount"] + ' x ' + cartItems[i]["name"] + '</h4>';
		total += parseInt(cartItems[i]["amount"])*parseFloat(cartItems[i]["priceInCents"]);
		
		
	}
	page.innerHTML += '<h3> Total: $' + Math.round(total)/100 + '</h3>';

	
	// Give comission
	var id = sessionStorage.getItem("paymentId");
	var appliedCoupon = sessionStorage.getItem("coupon");

	if (cartItems.length > 0 && appliedCoupon && appliedCoupon != "" && typeof appliedCoupon != "undefined"){

		fetch("/give-commission", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				items: cartItems,
				coupon: appliedCoupon.toUpperCase(),
				id: id

			})
		}).then(res => {
			if (res.ok) return res.json();
			return res.json().then(json => Promise.reject(json))
		}).then(({ msg }) => {
			sessionStorage.setItem("paymentId", "");
		}).catch(e => {
			console.error(e.error);
		})
	}
	
	cartItems = [];
	sessionStorage.setItem("cart", JSON.stringify(cartItems));
}

//Mobile menu
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





//Cart Opener
function showCart() {
  var x = document.getElementById("cart");
  if (x.className === "cart") {
  	x.style.transition = "0.2s";
	x.style.position = "absolute";
	x.style.right = "-500px";

    setTimeout(() => {
	    x.className = "cart hidden";
	}, 200)

  } else {
    x.className = "cart";
	x.style.transition = "0.2s";
	x.style.position = "absolute";
	x.style.right = "-500px";
	setTimeout(() => {
		x.style.right = "0px";
	}, 1)
  }
}

function hideMenu() {
	var x = document.getElementById("menu-opened");
	x.className = "menu-opened hidden mobile";
}

function hideCart() {
	var x = document.getElementById("cart");
	x.className = "cart hidden";
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




//Scroll to product
function scrollToProduct() {
	console.log("function")
	if (screen.width < 800) {
		document.getElementsByClassName('simple-section')[0].scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
		console.log("scrolled")
	}
	else {
		document.getElementsByClassName('simple-section')[0].scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
		console.log("scrolled")
	}
}




//Image zoom
function showBig(x) {
	var imgUrl = x.src;
	console.log(imgUrl);
	document.getElementById("main-image").src = imgUrl;
	document.getElementById("main-image-mobile").src = imgUrl;
}


//Image zoom revies
function bigReview(x) {
	var bigImg = x.parentNode.parentNode.parentNode.lastElementChild;
	bigImg.children[0].src = x.src;
	bigImg.className= "review-image-big";
	
}

function smallReview(x) {
	var bigImg = x.parentNode.parentNode.parentNode.lastElementChild;
	bigImg.className= "review-image-big hidden";
	
}





// Custom selector
var x, i, j, l, ll, selElmnt, a, b, c;
/* Look for any elements with the class "custom-select": */
x = document.getElementsByClassName("custom-select");
l = x.length;
for (i = 0; i < l; i++) {
    selElmnt = x[i].getElementsByTagName("select")[0];
    ll = selElmnt.length;
    /* For each element, create a new DIV that will act as the selected item: */
    a = document.createElement("DIV");
    a.setAttribute("class", "select-selected");
    a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
    x[i].appendChild(a);
    /* For each element, create a new DIV that will contain the option list: */
    b = document.createElement("DIV");
    b.setAttribute("class", "select-items select-hide");
    for (j = 1; j < ll; j++) {
        /* For each option in the original select element,
        create a new DIV that will act as an option item: */
        c = document.createElement("DIV");
        c.innerHTML = selElmnt.options[j].innerHTML;
        c.addEventListener("click", function(e) {
            /* When an item is clicked, update the original select box,
            and the selected item: */
            var y, i, k, s, h, sl, yl;
            s = this.parentNode.parentNode.getElementsByTagName("select")[0];
            sl = s.length;
            h = this.parentNode.previousSibling;
            for (i = 0; i < sl; i++) {
                if (s.options[i].innerHTML == this.innerHTML) {
                    s.selectedIndex = i;
                    h.innerHTML = this.innerHTML;
                    y = this.parentNode.getElementsByClassName("same-as-selected");
                    yl = y.length;
                    for (k = 0; k < yl; k++) {
                        y[k].removeAttribute("class");
                    }
                    this.setAttribute("class", "same-as-selected");
                    break;
                }
            }
            h.click();
        });
        b.appendChild(c);
    }
    x[i].appendChild(b);
    a.addEventListener("click", function(e) {
        /* When the select box is clicked, close any other select boxes,
        and open/close the current select box: */
        e.stopPropagation();
        closeAllSelect(this);
        this.nextSibling.classList.toggle("select-hide");
        this.classList.toggle("select-arrow-active");
    });
}

function closeAllSelect(elmnt) {
    /* A function that will close all select boxes in the document,
    except the current select box: */
    var x, y, i, xl, yl, arrNo = [];
    x = document.getElementsByClassName("select-items");
    y = document.getElementsByClassName("select-selected");
    xl = x.length;
    yl = y.length;
    for (i = 0; i < yl; i++) {
        if (elmnt == y[i]) {
            arrNo.push(i)
        } else {
            y[i].classList.remove("select-arrow-active");
        }
    }
    for (i = 0; i < xl; i++) {
        if (arrNo.indexOf(i)) {
            x[i].classList.add("select-hide");
        }
    }
}

/* If the user clicks anywhere outside the select box,
then close all select boxes: */
document.addEventListener("click", closeAllSelect);


try {
	//Amount Selector
	var number = 1; /// number value
	var minusBtn = document.getElementById("minus"),
		plusBtn = document.getElementById("plus"),
		minusBtnM = document.getElementById("minus-mobile"),
		plusBtnM = document.getElementById("plus-mobile"),
		numberPlace = document.getElementById("numberPlace"),
		numberPlaceM = document.getElementById("numberPlace-mobile"),
		submitBtn = document.getElementById("submit"),
		min = 1, /// min number
		max = 1000; /// max number
		
	minusBtn.onclick = function(){
		if (number>min){
		number = number-1; /// Minus 1 of the number
		//numberPlace.innerText = number ; /// Display the value in place of the number
		numberPlace.value = number;
		
		}
		if(number == min) {        
			numberPlace.style.color= "red";
			setTimeout(function(){numberPlace.style.color= "rgb(255, 255, 255)"},500)
		}
		else {
		numberPlace.style.color="rgb(255, 255, 255)";            
		}
				
	}
	plusBtn.onclick = function(){
		if(number<max){
		number = number+1;
		//numberPlace.innerText = number ; /// Display the value in place of the number
		numberPlace.value = number;
		}     
		if(number == max){
			numberPlace.style.color= "red";
			setTimeout(function(){numberPlace.style.color= "rgb(255, 255, 255)"},500)
		}
		
		else {
			numberPlace.style.color = "rgb(255, 255, 255)";
			
		}    
	}


	minusBtnM.onclick = function(){
		if (number>min){
		number = number-1; /// Minus 1 of the number
		//numberPlace.innerText = number ; /// Display the value in place of the number
		numberPlaceM.value = number;
		
		}
		if(number == min) {        
			numberPlaceM.style.color= "red";
			setTimeout(function(){numberPlaceM.style.color= "rgb(255, 255, 255)"},500)
		}
		else {
		numberPlaceM.style.color="rgb(255, 255, 255)";            
		}
				
	}
	plusBtnM.onclick = function(){
		if(number<max){
		number = number+1;
		//numberPlace.innerText = number ; /// Display the value in place of the number
		numberPlaceM.value = number;
		}     
		if(number == max){
			numberPlaceM.style.color= "red";
			setTimeout(function(){numberPlaceM.style.color= "rgb(255, 255, 255)"},500)
		}
		
		else {
			numberPlaceM.style.color = "rgb(255, 255, 255)";
			
		}    
	}

	var forms = document.getElementsByClassName("amount-form");

	for (var i = 0; i < forms.length; i++){
		
		forms[i].addEventListener('change', function () {
			if (this.value < 1 || isNaN(this.value)) {
				this.value = 1;
			}
			if (this.value > 1000) {
				this.value = 1000;
			}
			
			this.value = Math.round(this.value);

			number = parseFloat(this.value);
		});
	}
} catch (error) {
	//console.error(error);
	console.log(" ");
}




document.body.addEventListener('click', doSomething, true); 
function changeNumber(){
	var numberInputs = document.querySelectorAll('input[type=number]');

	for (var i = 0; i < numberInputs.length; i++) {
		var x = numberInputs[i];
		if (x.value < 1) {
			x.value = 1;
		}
		if (x.value % 1 != 0) {
			x.value = Math.round(x.value);
		}
	}
}

function cartNotification(){
	var cartLength = cartItems.length;

	if (cartLength == 0){
		var x = document.getElementsByClassName("fa fa-circle cart-notification");
		for (var i = 0; i < x.length; i++){

			x[i].className = "fa fa-circle cart-notification hidden";
		}
	}
	else {
		var x = document.getElementsByClassName("fa fa-circle cart-notification hidden");
		for (var i = 0; i < x.length; i++){
			x[i].className = "fa fa-circle cart-notification";
		}
	}

}

function doSomething(){
	changeNumber();

}



// Bouncy ATC button
var buttons = document.getElementsByClassName("atc");

function bounce(){

	for (var i = 0; i < buttons.length; i++) {
		var atc = buttons[i];
		doSetTimeout(atc)

	}

	setTimeout(() => {
		bounce();
	}, 3000);

}

function doSetTimeout(atc) {
		atc.style.transition = "0.2s"
		atc.style.marginLeft = "-20px"
		setTimeout(() => {
			atc.style.marginLeft = "20px"
		}, 200);
		setTimeout(() => {
			atc.style.marginLeft = "0"
		}, 400);
}

bounce();


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


// Products
var one = document.getElementsByClassName("product-category")[0];
var two = document.getElementsByClassName("product-category")[1];

var productsOne = document.getElementsByClassName("category1");
var productsTwo = document.getElementsByClassName("category2");

if (one && two){
	one.addEventListener("click", function () {

		one.classList.add("active-category");
		two.classList.remove("active-category");
	
		for (i = 0; i < productsOne.length; i++){
			productsOne[i].classList.remove("hidden");
		}
	
		for (i = 0; i < productsTwo.length; i++){
			productsTwo[i].classList.add("hidden");
		}
	
	});
	
	two.addEventListener("click", function () {

		one.classList.remove("active-category");
		two.classList.add("active-category");
	
		for (i = 0; i < productsTwo.length; i++){
			productsTwo[i].classList.remove("hidden");
		}
	
		for (i = 0; i < productsOne.length; i++){
			productsOne[i].classList.add("hidden");
		}
	});
}



//Reviews
try {
	document.getElementById("reviews-button").addEventListener("click", function (e) {
		var parent = e.target.parentNode;
		parent.innerHTML = '<img src="./images/loading.gif" class="loading-gif"></img>';
		setTimeout(() => {
			parent.innerHTML = "";
		}, 1000)

		
	});
} catch (error) {
	//console.error(error);
	console.log(" ");
}



//Swipe on images
document.addEventListener('touchstart', handleTouchStart, false);        
document.addEventListener('touchmove', handleTouchMove, false);

var xDown = null;                                                        
var yDown = null;
var onImage = false;
var currentImg = 0;
var imgUrls = [];

function getTouches(evt) {
  return evt.touches ||             // browser API
         evt.originalEvent.touches; // jQuery
}                                                     
                                                                         
function handleTouchStart(evt) {
    const firstTouch = getTouches(evt)[0];                                      
    xDown = firstTouch.clientX;                                      
    yDown = firstTouch.clientY;        
	if (evt.target.id == "main-image-mobile"){
		onImage = true;

		imgUrls = [];
	
		for (var i = 0; i < evt.target.parentNode.parentNode.children[1].children.length; i++) {
			var element = evt.target.parentNode.parentNode.children[1].children[i];
			imgUrls.push(element.children[0].src);
		}
	}          
	else {
		onImage = false;
	}

	

};                                                
                                                                         
function handleTouchMove(evt) {
    if ( ! xDown || ! yDown ) {
        return;
    }

    var xUp = evt.touches[0].clientX;                                    
    var yUp = evt.touches[0].clientY;

    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;
                                                                         
    if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
        if ( xDiff > 0 ) {
            /* right swipe */ 
			if (onImage) {

				currentImg++;
				if (currentImg > imgUrls.length - 1){
					currentImg = 0;
				}

				evt.target.src = imgUrls[currentImg];
			}
			
        }
		else {
			/* left swipe */
			if (onImage) {

				currentImg--;
				if (currentImg < 0){
					currentImg = imgUrls.length - 1;
				}

				evt.target.src = imgUrls[currentImg];
			}
        }                       
    }
	else {
        if ( yDiff > 0 ) {
            /* down swipe */ 
        } else { 
            /* up swipe */
        }                                                                 
    }
    /* reset values */
    xDown = null;
    yDown = null;                                             
};


//Log requests
function requestLogger(msg){
	var currentUser = localStorage.getItem("currentUser");

	if (!currentUser || currentUser == null || currentUser == "" || typeof currentUser == "undefined"){
		var newUser = makeId(5);
		localStorage.setItem("currentUser", newUser);
        currentUser = newUser;
	}

	var requestedUrl = window.location.href;

	if (msg) {
		requestedUrl = msg;
	}

	fetch("/log-request", {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			currentUser: currentUser,
			requestedUrl: requestedUrl

		})
	}).then(res => {
		if (res.ok) return res.json();
		return res.json().then(json => Promise.reject(json))
	}).catch(e => {
		console.error(e.error);
	})

	
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

window.addEventListener("beforeunload", function (e) {

	requestLogger("exit");

	return null;	//Webkit, Safari, Chrome
	
});
