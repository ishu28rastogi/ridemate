const multer = require("multer");
const path = require("path");

const express = require("express");
const cors = require("cors");
const db = require("./db");
const nodemailer = require("nodemailer");

const app = express();
app.use(cors());
app.use(express.json());
// ===== MULTER SETUP (FOR LICENCE UPLOAD) =====
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });
app.use("/uploads", express.static("uploads"));

// ================= OTP STORE =================
const otpStore = {};

// ================= MAIL SETUP =================
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: "ridemate7@gmail.com",
        pass: "kzubwlweqtdazdxx"   // 👈 app password
    }
});

// verify mail config
transporter.verify((err, success) => {
    if (err) {
        console.log("MAIL CONFIG ERROR 👉", err);
    } else {
        console.log("Mail server ready");
    }
});

// ================= SEND OTP =================
app.post("/send-otp", (req, res) => {
    const { name, email, userid, password } = req.body;

    if (!email.endsWith("@banasthali.in")) {
        return res.status(400).json({ message: "Only banasthali.in emails allowed" });
    }

    // 🔍 STEP 1: CHECK USER EXISTS OR NOT
    const checkSql = "SELECT id FROM users WHERE email=?";
    db.query(checkSql, [email], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Server error" });
        }

        if (result.length > 0) {
            // ❌ already registered → OTP mat bhejo
            return res.status(409).json({ message: "User already registered. Please login." });
        }

        // ✅ STEP 2: USER NEW HAI → OTP BHEJO
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        otpStore[email] = { name, email, userid, password, otp };

        const mailOptions = {
            from: "RideMate <ridemate7@gmail.com>",
            to: email,
            subject: "RideMate OTP Verification",
            text: `Your OTP is ${otp}`
        };

        transporter.sendMail(mailOptions, (err) => {
            if (err) {
                return res.status(500).json({ message: "OTP send failed" });
            }

            res.json({ message: "OTP sent successfully" });
        });
    });
});


// ================= VERIFY OTP =================
app.post("/verify-otp", (req, res) => {
    const { email, otp } = req.body;

    const record = otpStore[email];

    if (!record || record.otp !== otp) {
        return res.status(400).json({ message: "Invalid OTP" });
    }

    const { name, userid, password } = record;

    const sql = "INSERT INTO users (name, email, userid, password) VALUES (?, ?, ?, ?)";
    db.query(sql, [name, email, userid, password], (err) => {
        if (err) {
            console.log("DB ERROR 👉", err);
            if (err.code === "ER_DUP_ENTRY") {
                return res.status(409).json({ message: "User already registered" });
            }
            return res.status(500).json({ message: "Database error" });
        }

        delete otpStore[email]; // clean memory
        res.json({ message: "Registration successful" });
    });
});

// ================= LOGIN =================
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    const sql = "SELECT * FROM users WHERE email=? AND password=?";
    db.query(sql, [email, password], (err, result) => {
        if (err) return res.status(500).json({ message: "Server error" });

        if (result.length > 0) {
            const user = result[0];
            // ✅ Return user info along with success message
            res.json({ message: "Login Success", user: {
    id: result[0].id,        // 🔥 AUTO INCREMENT INT (IMPORTANT)
    name: result[0].name,
    email: result[0].email,
    userid: result[0].userid,
    role: result[0].role 
  }
            });
        } else {
            res.status(401).json({ message: "Invalid credentials" });
        }
    });
});
app.post("/forgot-password", (req, res) => {
    const { email } = req.body;

    const sql = "SELECT id FROM users WHERE email=?";
    db.query(sql, [email], (err, result) => {
        if (err) return res.status(500).json({ message: "Server error" });

        if (result.length === 0) {
            return res.status(404).json({ message: "Email not registered" });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        otpStore[email] = { otp };

        transporter.sendMail({
            to: email,
            subject: "RideMate Password Reset OTP",
            text: `Your OTP is ${otp}`
        }, (err) => {
            if (err) return res.status(500).json({ message: "OTP send failed" });
            res.json({ message: "OTP sent" });
        });
    });
});



app.post("/reset-password", (req, res) => {
    const { email, otp, newPassword } = req.body;

    if (!otpStore[email] || otpStore[email].otp !== otp) {
        return res.status(400).json({ message: "Invalid OTP" });
    }

    const sql = "UPDATE users SET password=? WHERE email=?";
    db.query(sql, [newPassword, email], (err) => {
        if (err) return res.status(500).json({ message: "Server error" });

        delete otpStore[email];
        res.json({ message: "Password reset successful" });
    });
});

app.post("/create-ride", upload.single("licence"), (req, res) => {
  const {
    pickup, destination, date, time, seats,
    car_seater, total_price, price_per_person,
    phone, vehicle_no, user_id
  } = req.body;
if (!user_id) {
    return res.status(401).json({
      success: false,
      message: "Login required"
    });
  }

  if (!req.file) {
    return res.json({ success: false, message: "Licence required" });
  }
  const licence_image = req.file ? req.file.filename : null;

  if (!licence_image) return res.json({ success: false, message: "Licence is required" });

  const sql = `
    INSERT INTO rides
    (pickup, destination, ride_date, ride_time, seats, car_seater, total_price, price_per_person, phone, vehicle_no, user_id, driving_licence)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  
  const values = [
  pickup,
  destination,
  req.body.date,
  req.body.time,
  seats,
  car_seater,
  total_price,
  price_per_person,
  phone,
  vehicle_no,
  user_id,
  licence_image
];


console.log("REQ BODY 👉", req.body);
console.log("FILE 👉", req.file);

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error(err);
     return res.json({ 
      success: false, 
      message: err.sqlMessage || "DB Error" 
    });
  }
    res.json({ success: true, message: "Ride Created Successfully ✅" });
  });
});

// ================= SEARCH RIDES =================
app.get("/search-rides", (req, res) => {
  const { pickup, destination, date, passengers } = req.query;

  const sql = `
    SELECT * FROM rides
    WHERE pickup LIKE ?
    AND destination LIKE ?
    AND ride_date = ?
    AND seats >= ?
  `;

  db.query(sql, [pickup, destination, date, passengers], (err, result) => {
    if (err) {
      console.log("SEARCH ERROR 👉", err);
      return res.status(500).json({ success: false });
    }

    res.json({ success: true, rides: result });
  });
});

app.get("/suggest", (req, res) => {
  const search = req.query.search;

  const sql = `
    SELECT DISTINCT pickup FROM rides
    WHERE pickup LIKE ?
    LIMIT 5
  `;

  db.query(sql, [`%${search}%`], (err, result) => {
    if (err) return res.json([]);
    res.json(result);
  });
});
app.get("/suggest-destination", (req, res) => {
  const search = req.query.search;

  const sql = `
    SELECT DISTINCT destination FROM rides
    WHERE destination LIKE ?
    LIMIT 5
  `;

  db.query(sql, [`%${search}%`], (err, result) => {
    if (err) return res.json([]);
    res.json(result);
  });
});

// ================= MY RIDES =================
app.get("/my-rides", (req, res) => {
  console.log("MY RIDES HIT", req.query); // 🔥 ADD THIS

  const { user_id } = req.query;

  const sql = "SELECT * FROM rides WHERE user_id = ?";
  db.query(sql, [user_id], (err, result) => {
    if (err) {
      console.log("DB ERROR 👉", err); // 🔥 THIS WILL SHOW REAL ERROR
      return res.status(500).json({ success: false });
    }
    res.json({ success: true, rides: result });
  });
});



// ================= START SERVER =================
app.listen(3000, () => {
    console.log("Server running on port 3000");
});
//======================================

app.get("/api/rides/:id", (req,res)=>{

const id = req.params.id;

const sql = "SELECT * FROM rides WHERE id = ?";

db.query(sql,[id],(err,result)=>{

if(err){
console.log(err);
res.status(500).send("Error");
}
else{
res.json(result);
}

});

});
app.get("/get-ride/:id", (req, res) => {

  const rideId = req.params.id;

  const sql = "SELECT * FROM rides WHERE id = ?";

  db.query(sql, [rideId], (err, result) => {

    if (err) {
      return res.json({ success: false });
    }

    if (result.length === 0) {
      return res.json({ success: false });
    }

    res.json({
      success: true,
      ride: result[0]
    });

  });

});



app.post("/api/book", (req, res) => {

  const { ride_id, user_id, passengers, total_amount } = req.body;

  if (!ride_id || !user_id) {
    return res.status(400).json({ message: "Missing data" });
  }

  // ===== CHECK USER =====
  db.query("SELECT id FROM users WHERE id=?", [user_id], (err, userResult) => {

    if (err) return res.status(500).send("Server error");
    if (userResult.length === 0) {
      return res.status(400).json({ message: "Invalid user" });
    }

    // ===== GET RIDE =====
    const rideSql = `
    SELECT r.*, u.email AS creator_email
    FROM rides r
    JOIN users u ON r.user_id = u.id
    WHERE r.id = ?
    `;

    db.query(rideSql, [ride_id], (err, rideResult) => {

      if (err) return res.status(500).send("Server error");
      if (rideResult.length === 0) {
        return res.status(404).json({ message: "Ride not found" });
      }

      const ride = rideResult[0];

      if (ride.seats < passengers.length) {
        return res.json({ message: "Not enough seats" });
      }

      // ===== STEP 1: GET EXISTING PASSENGERS (BEFORE INSERT) =====
      const getExistingSql = `
      SELECT DISTINCT email FROM book WHERE ride_id = ?
      `;

      db.query(getExistingSql, [ride_id], (err, existingUsers) => {

        const existingEmails = existingUsers.map(u => u.email);

        // ===== STEP 2: INSERT NEW PASSENGERS =====
        const insertSql = `
        INSERT INTO book
        (ride_id,user_id,passenger_name,phone,email,seats_booked,total_amount)
        VALUES ?
        `;

        const values = passengers.map(p => [
  ride_id,
  user_id,
  p.name,
  p.phone,
  p.email,
  p.seats_booked || 1,
  total_amount
]);

        db.query(insertSql, [values], (err) => {

          if (err) {
            console.log(err);
            return res.status(500).send("Booking failed");
          }

          // ===== STEP 3: UPDATE SEATS =====
          const updateSeats = `
          UPDATE rides
          SET seats = seats - ?
          WHERE id = ?
          `;

          db.query(updateSeats, [passengers.length, ride_id], (err) => {

            if (err) return res.status(500).send("Seat update error");

            // ===== STEP 4: GET UPDATED SEATS =====
            db.query("SELECT seats FROM rides WHERE id = ?", [ride_id], (err, seatRes) => {

              const updatedSeats = seatRes[0].seats;

              // ===== STEP 5: COUNT JOINED =====
              db.query("SELECT COUNT(*) AS joined FROM book WHERE ride_id = ?", [ride_id], (err, countRes) => {

                const joinedPassengers = countRes[0].joined;

                const passengerDetails = passengers.map(p =>
                  `Name: ${p.name}, Phone: ${p.phone}`
                ).join("\n");

                // ===== STEP 6: FILTER EXISTING =====
                const newEmails = passengers.map(p => p.email);

                const filteredExisting = existingEmails.filter(
                  email => !newEmails.includes(email)
                );

                // ===== MAIL TO EXISTING PASSENGERS =====
                filteredExisting.forEach(email => {
                  transporter.sendMail({
                    from: "RideMate <ridemate7@gmail.com>",
                    to: email,
                    subject: "New Passenger Joined Your Ride",
                    text: `
🚗 Ride Update

A new passenger joined your ride!

📍 Route: ${ride.pickup} → ${ride.destination}

👥 Total Joined: ${joinedPassengers}

🙋 New Passenger:
${passengerDetails}

📅 Date: ${ride.ride_date}
⏰ Time: ${ride.ride_time}
`
                  });
                });

                // ===== MAIL TO NEW PASSENGERS =====
                passengers.forEach(p => {
                  transporter.sendMail({
                    from: "RideMate <ridemate7@gmail.com>",
                    to: p.email,
                    subject: "RideMate Booking Confirmed",
                    text: `
🚗 RideMate Booking Confirmed

📍 Route: ${ride.pickup} → ${ride.destination}

📅 Date: ${new Date(ride.ride_date).toLocaleDateString("en-IN", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric"
})}

⏰ Time: ${ride.ride_time}

💰 Total Ride Price: ₹${ride.total_price}


✅ Seats Booked: ${joinedPassengers}
🪑 Seats Available: ${updatedSeats}

--------------------------------------

🙋 Passenger Details:
${passengerDetails}

--------------------------------------

Thank you for using RideMate 🚗
`
                  });
                });

                // ===== MAIL TO CREATOR =====
                if (ride.creator_email) {
                  transporter.sendMail({
                    from: "RideMate <ridemate7@gmail.com>",
                    to: ride.creator_email,
                    subject: "Passenger Joined Your Ride",
                    text: `
New passenger(s) joined your ride.

📍 Route: ${ride.pickup} → ${ride.destination}

👥 Total Joined: ${joinedPassengers}

🙋 Passenger Details:
${passengerDetails}

📅 Date: ${ride.ride_date}
⏰ Time: ${ride.ride_time}
`
                  });
                }

                res.json({ message: "Booking successful ✅" });
                

              });

            });

          });

        });

      });

    });

  });

});


app.get("/ride-history", (req, res) => {

  const { email } = req.query;

  if (!email) {
    return res.json({ success: false });
  }

  // ===== UPCOMING RIDES =====
  const upcomingSql = `
  SELECT 
    r.*, 
    r.seats AS available_seats
  FROM rides r
  JOIN users u ON u.email = ?
  WHERE r.id IN (
    SELECT ride_id 
    FROM book 
    WHERE user_id = u.id
  )
  AND r.ride_date >= CURDATE()
  `;

  // ===== COMPLETED RIDES =====
  const completedSql = `
  SELECT 
    r.*, 
    r.seats AS available_seats
  FROM rides r
  JOIN users u ON u.email = ?
  WHERE r.id IN (
    SELECT ride_id 
    FROM book 
    WHERE user_id = u.id
  )
  AND r.ride_date < CURDATE()
  `;

  // ===== CREATED RIDES =====
  const createdSql = `
  SELECT 
    r.*, 
    r.seats AS available_seats
  FROM rides r
  JOIN users u ON r.user_id = u.id
  WHERE u.email = ?
  `;

  // ===== EXECUTE QUERIES =====
  db.query(upcomingSql, [email], (err, upcoming) => {

    if (err) {
      console.log(err);
      return res.json({ success: false });
    }

    db.query(completedSql, [email], (err2, completed) => {

      if (err2) {
        console.log(err2);
        return res.json({ success: false });
      }

      db.query(createdSql, [email], (err3, created) => {

        if (err3) {
          console.log(err3);
          return res.json({ success: false });
        }

        res.json({
          success: true,
          upcoming,
          completed,
          created
        });

      });

    });

  });

});

//-------------


app.get("/get-ride-details", (req, res) => {

  const { ride_id } = req.query;

  const sql = `
  SELECT 
  r.*,
  (r.car_seater - IFNULL(SUM(b.seats_booked),0)) AS available_seats
  FROM rides r
  LEFT JOIN book b ON r.id=b.ride_id
  WHERE r.id=?
  GROUP BY r.id
  `;

  db.query(sql,[ride_id],(err,result)=>{

    if(err) return res.json({success:false});

    res.json(result[0]);

  });

});


app.get("/ride-passengers", (req, res) => {

  const { ride_id, user_id } = req.query;

  if (!ride_id || !user_id) {
    return res.json({
      success: false,
      message: "Missing ride_id or user_id"
    });
  }

  const sql = `
  SELECT 
    b.id,
    b.passenger_name,
    b.phone,
    b.seats_booked,
    u.name AS booked_by,
    u.email
  FROM book b
  JOIN users u ON b.user_id = u.id
  WHERE b.ride_id = ?
  AND b.user_id = ?
  `;

  db.query(sql, [ride_id, user_id], (err, result) => {

    if (err) {
      console.log("Ride passengers error:", err);
      return res.json({
        success: false,
        message: "Database error"
      });
    }

    res.json({
      success: true,
      passengers: result
    });

  });

});

// 🔥 MAIL FUNCTION (PUT THIS ABOVE API - ONLY ONCE)
// ================= CANCEL RIDE API =================
app.post("/cancel-ride", (req, res) => {
  const { ride_id, user_id, booking_ids } = req.body;

  // ✅ Validate input
  if (!ride_id || !user_id || !booking_ids || !Array.isArray(booking_ids) || booking_ids.length === 0) {
    return res.status(400).json({ success: false, message: "Missing or invalid data" });
  }

  // 1️⃣ Get the bookings to cancel
  const checkBookingSql = `SELECT * FROM book WHERE ride_id = ? AND user_id = ? AND id IN (?)`;
  db.query(checkBookingSql, [ride_id, user_id, booking_ids], (err, bookings) => {
    if (err) return res.status(500).json({ success: false, message: "DB error", error: err });
    if (bookings.length === 0) return res.status(404).json({ success: false, message: "No matching bookings found" });

    // ✅ Map cancelled passengers
    const cancelledPassengers = bookings.map(b => ({
      email: b.email,
      name: b.passenger_name,
      phone: b.phone
    }));

    // ✅ Calculate total cancelled seats
    const cancelledSeats = bookings.reduce((acc, b) => acc + b.seats_booked, 0);

    // 2️⃣ Delete bookings
    const deleteBookingSql = `DELETE FROM book WHERE id IN (?)`;
    db.query(deleteBookingSql, [booking_ids], (err2) => {
      if (err2) return res.status(500).json({ success: false, message: "Failed to cancel bookings", error: err2 });

      // 3️⃣ Update ride seats
      const getRideSql = `SELECT seats, car_seater FROM rides WHERE id = ?`;
      db.query(getRideSql, [ride_id], (err3, rideResult) => {
        if (err3) return res.status(500).json({ success: false, message: "Ride fetch error", error: err3 });

        const ride = rideResult[0];
        const car_seater = ride.car_seater;
        const reservedSeats = car_seater - ride.seats; // already reserved
        const newSeats = Math.min(ride.seats + cancelledSeats, car_seater - reservedSeats);

        const updateSeatsSql = `UPDATE rides SET seats = ? WHERE id = ?`;
        db.query(updateSeatsSql, [newSeats, ride_id], (err4) => {
          if (err4) return res.status(500).json({ success: false, message: "Failed to update seats", error: err4 });

          // 4️⃣ Send cancellation mails
          sendCancellationMails(ride_id, cancelledSeats, user_id, cancelledPassengers);

          // ✅ Response
          return res.json({
            success: true,
            message: `Cancelled successfully. ${cancelledSeats} seats released.`
          });
        });
      });
    });
  });
});

// 🔥 SEND CANCELLATION MAILS FUNCTION
const sendCancellationMails = (ride_id, cancelledSeats, cancelledByUserId, cancelledPassengers) => {

  const rideSql = `
    SELECT r.*, u.name AS creator_name, u.email AS creator_email
    FROM rides r
    JOIN users u ON r.user_id = u.id
    WHERE r.id = ?
  `;

  db.query(rideSql, [ride_id], (err, rideRes) => {
    if (err || rideRes.length === 0) return;

    const ride = rideRes[0];

    // 🔹 canceller info
    db.query("SELECT name, email FROM users WHERE id = ?", [cancelledByUserId], (err2, cancelUser) => {

      const canceller = cancelUser[0] || {};

      // 🔹 STEP 1: get ALL passengers (important 🔥)
      const passengerSql = `
        SELECT DISTINCT email, passenger_name, phone
        FROM book
        WHERE ride_id = ?
      `;

      db.query(passengerSql, [ride_id], (err3, passengers) => {

        let allMails = [];

        // ✅ creator
        if (ride.creator_email) {
          allMails.push({
            email: ride.creator_email,
            name: ride.creator_name,
            type: "info"
          });
        }

        // ✅ existing passengers
        passengers.forEach(p => {
          allMails.push({
            email: p.email,
            name: p.passenger_name,
            phone: p.phone,
            type: "info"
          });
        });

        // ✅ cancelled passengers
        cancelledPassengers.forEach(p => {
          allMails.push({
            email: p.email,
            name: p.name,
            phone: p.phone,
            type: "cancellation"
          });
        });

        // 🔥 remove duplicates
        const uniqueMails = [...new Map(allMails.map(i => [i.email, i])).values()];

        // 🔥 send mails
        uniqueMails.forEach(u => {

          let subject = u.type === "cancellation"
            ? "Your Booking Cancelled ❌"
            : "Ride Update Info";

          let text = u.type === "cancellation"
            ? `Hello ${u.name},

Your booking has been cancelled.

📍 ${ride.pickup} → ${ride.destination}
📅 ${new Date(ride.ride_date).toLocaleDateString("en-IN")}
⏰ ${ride.ride_time}
🪑 Seats Cancelled: ${cancelledSeats}
🙅 Cancelled By: ${canceller.name || "User"}`

            : `Hello ${u.name},

A passenger cancelled their booking.

📍 ${ride.pickup} → ${ride.destination}
📅 ${new Date(ride.ride_date).toLocaleDateString("en-IN")}
⏰ ${ride.ride_time}
🪑 Seats Available Now: ${ride.seats}
🙅 Cancelled By: ${canceller.name || "User"}`;

          transporter.sendMail({
            from: "RideMate <ridemate7@gmail.com>",
            to: u.email,
            subject,
            text
          }, (err) => {
            if (err) console.log("Mail Error:", err);
          });

        });

      });

    });

  });

};
// ================= SUBMIT FEEDBACK =================
app.post("/submit-feedback", (req, res) => {

  const { ride_id, user_id, rating, comment} = req.body;

  if (!ride_id || !user_id || !rating) {
    return res.status(400).json({ success: false, message: "Missing data" });
  }

  // ❌ duplicate feedback check (same user same ride)
  const checkSql = `
    SELECT * FROM feedback WHERE ride_id = ? AND user_id = ?
  `;

  db.query(checkSql, [ride_id, user_id], (err, result) => {

    if (err) return res.status(500).json({ success: false });

    if (result.length > 0) {
      return res.json({
        success: false,
        message: "Already submitted feedback"
      });
    }

    // ✅ insert feedback
    const insertSql = `
      INSERT INTO feedback (ride_id, user_id, rating, comment)
      VALUES (?, ?, ?,?)
    `;

    db.query(insertSql, [ride_id, user_id, rating, comment], (err2) => {

      if (err2) {
    console.log(err2);   // 👈 ADD THIS FOR DEBUG
    return res.status(500).json({ success: false });
  }

      res.json({
        success: true,
        message: "Feedback submitted ✅"
      });

    });

  });

});


const adminRoutes = require("../routes/admin");
app.use("/admin", adminRoutes);