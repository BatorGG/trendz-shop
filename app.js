require("dotenv").config();
const express = require("express");
const mongoose  = require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);
const path = require("path");

const app = express();

// User model
const User = require("./models/User");
const Applicant = require("./models/Applicant");

// Passport config
require("./config/passport")(passport);

// DB Config
const db = process.env.MONGO_URI;


const connectDatabase = async () => {
    try {
        console.log("Trying to connect to mongo");
        await mongoose.connect(db, { useNewUrlParser: true })
    
        console.log("MongoDB connected...");
      } catch (error) {
        console.log(error);
        //process.exit(1);
        setTimeout(connectDatabase, 1000);
      }
}

connectDatabase();



// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: false}));

//Set a static folder
app.use(express.static(path.join(__dirname, "public")));

// Express Session
app.use(session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    next();
});

// Routes
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));


//Items
const storeItems = new Map([
    [1, { priceInCents: 2999, name: "Self Cleaning Hairbrush (White)"}],
    [2, { priceInCents: 2999, name: "Self Cleaning Hairbrush (Pink)"}],
    [3, { priceInCents: 2999, name: "Self Cleaning Hairbrush (Red)"}],
    [4, { priceInCents: 999, name: "Syringe Pen (Red)"}],
    [5, { priceInCents: 999, name: "Syringe Pen (Yellow)"}],
    [6, { priceInCents: 999, name: "Syringe Pen (Green)"}],
    [7, { priceInCents: 999, name: "Syringe Pen (Blue)"}],
    [8, { priceInCents: 1499, name: "2 in 1 Screen Cleaner (Black)"}],
    [9, { priceInCents: 1499, name: "2 in 1 Screen Cleaner (Pink)"}],
    [10, { priceInCents: 2999, name: "High-Security Door Alarm"}]
]);



// Coupon codes
const coupons = ["10OFF", "20OFF", "TIKTOK"];

app.post("/validate-coupon", async (req, res) => {
  var coupon = req.body.coupon.toUpperCase();

  // Check if invitational coupon code is valid
  var isValid = await User.findOne({ couponCode: coupon})
  .then(user => {
     if (!user) {
        if (coupons.includes(coupon)) {
          return true;
        }
        return false;
      }
      return true;
  });

  if (isValid) {
    res.json(true);
  }
  else {
    res.json(false);
  }
  
});


// Stripe
app.post("/create-checkout-session", async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            shipping_address_collection: {
                allowed_countries: ["US", "BR", "RU", "MX", "JP", "VN", "TR", "DE", "TH", "FR", "IT", "KR", "ES", "PL", "UA", "CA", "SA", "MY", "AU", "BE", "SE", "GR", "PT", "HU", "IL", "AT", "CH", "HK", "SG", "DK", "FI", "NO", "NZ", "IE", "HR", "LT", "LV", "EE", "LU", "MT", ],
            },
            shipping_options: [
              {
                shipping_rate_data: {
                  type: 'fixed_amount',
                  fixed_amount: {
                    amount: 0,
                    currency: 'usd',
                  },
                  display_name: 'Free Shipping',
                  delivery_estimate: {
                    minimum: {
                      unit: 'business_day',
                      value: 7,
                    },
                    maximum: {
                      unit: 'business_day',
                      value: 40,
                    },
                  }
                }
              }
            ],
            line_items: req.body.items.map(item => {
                const storeItem = storeItems.get(item.id);
                if (req.body.couponApplied){
                  return {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: storeItem.name
                        },
                        unit_amount: Math.round(storeItem.priceInCents * 0.9)
                    },
                    quantity: item.amount
                  }
                }
                else {
                  return {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: storeItem.name
                        },
                        unit_amount: storeItem.priceInCents
                    },
                    quantity: item.amount
                  }
                }
                
            }),
            phone_number_collection: {
              enabled: true,
            },
            success_url: `${process.env.SERVER_URL}success.html`,
            cancel_url: `${process.env.SERVER_URL}`
        });
        res.json({ session: session });

    } catch (e) {
        console.log(e);
        res.status(500).json({ e: e.message });
    }
    
});


// Give commission
app.post("/give-commission", async (req, res) => {
	var commission = 0.1;
    var downlineCommission = 0.25;
	var msg = "";
    var updatedUsers = [];

	if (typeof req.body.id != "undefined" && req.body.id != "" && req.body.id != null){
		var session = await stripe.checkout.sessions.retrieve(
			req.body.id
		);

		if (session.status == "complete"){

			
			var total = 0;
			for (var i = 0; i < req.body.items.length; i++){
				console.log(storeItems.get(req.body.items[i].id)["priceInCents"]);
				total += storeItems.get(req.body.items[i].id)["priceInCents"];
			}

      var commissionAmount = total * commission
		
		

			var user = await User.findOne({ couponCode: req.body.coupon})

			if (user) {
				var filter = { couponCode: req.body.coupon };
				var update = { balanceInCents: Math.round(user.balanceInCents + commissionAmount) };
				var updated = await User.findOneAndUpdate(filter, update, {
           			new: true
          		});
                
                updatedUsers.push(updated);

                while (user) {
                    var searchFor = user.invitedBy;
                    user = await User.findOne({ couponCode: searchFor});

                    if (user) {

                        commissionAmount = commissionAmount*downlineCommission;

                        var filter = { couponCode: searchFor };
                        var update = { balanceInCents: Math.round(user.balanceInCents + commissionAmount) };
                        var updated = await User.findOneAndUpdate(filter, update, {
                            new: true
                        });

                        updatedUsers.push(updated);
                    }
                }

                console.log(updatedUsers);
                msg = updatedUsers;
			}

			
		}
		else {
			msg = "Payment not completed."; 
		}
		
	}
	else {
		msg = "Invalid payment id."; 
	}

	res.json({ msg: msg });
});


// Stripe membership fee
app.post("/create-checkout-session2", async (req, res) => {

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "subscription",
            line_items: [{
                price_data: {
                    currency: "usd",
                    unit_amount: 1000,
                    product_data: {
                        name: "Monthly membership fee"
                    },
                    recurring: {
                        interval: "month",
                        interval_count: 1
                    }
                },
                quantity: 1
            }],
            customer_email: req.user.email,
            /*
            success_url: `${process.env.SERVER_URL}success.html`,
            cancel_url: `${process.env.SERVER_URL}dashboard.html`
            */
           success_url: "http://localhost:5000/success.html",
           cancel_url: "http://localhost:5000/dashboard.html"

        });
        res.json({ session: session});

    } catch (e) {
        console.log(e);
        res.status(500).json({ e: e.message });
    }
    
});

app.post("/check-payment", async (req, res) => {
    
    if (typeof req.body.id != "undefined" && req.body.id != "" && req.body.id != null){
        var session = await stripe.checkout.sessions.retrieve(
            req.body.id
        );

        var filter = { email: session.customer_email };
        var update = { subscriptionId: session.subscription };
        var updated = await User.findOneAndUpdate(filter, update, {
            new: true
          });
        console.log(updated);
    }
    else {
        var session = false; 
    }

    res.json({session: session});
});

// Check subscription
app.post("/check-subscription", async (req, res) => {
    
    var status = false;

    if (typeof req.user != "undefined"){
        if (typeof req.user.subscriptionId != "undefined" && req.user.subscriptionId != "" && req.user.subscriptionId != " "){
            var id = req.user.subscriptionId;
            try {
              var subscription = await stripe.subscriptions.retrieve(
                id
              );
    
              if (subscription.status == "active"){
                status = true;
              } 
            }
            catch {
              status = false;
            }
            
        }
        else {
            status = false;
        }
    }
    else {
        status = false;
    }

    if (status){
        var filter = { email: req.user.email };
        var update = { couponCodeEnabled: true };
        var updated = await User.findOneAndUpdate(filter, update, {
            new: true
          });
        console.log(updated);

        res.json({status: true});
    }
    else {
        var filter = { email: req.user.email };
        var update = { couponCodeEnabled: false };
        var updated = await User.findOneAndUpdate(filter, update, {
            new: true
          });
        console.log(updated);

        res.json({status: false});
    }
    
    
});

// Send applicants to database
app.post("/send-application", async (req, res) => {
  var { name, birthDate, email} = req.body;


  if (name && birthDate && email){
      // Validation passed
      Applicant.findOne({ email: email })
      .then(user => {
          if (user) {
              // User already exists
              res.json({success: false, msg: "You have already applied."});
              
          }
          else {
              // Register user
              const newApplicant = new Applicant({
                  name,
                  birthDate,
                  email
              });

              // Save user
              newApplicant.save()
              .then(applicant => {
                  res.json({success: true, msg: "Success!"});
              })
              .catch(err => console.log(err));
          }
      });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));

module.exports = app;
