const router = require("express").Router();
const authorize = require("../middleware/authorize");
import db from "../db.js";

router.get("/", authorize, async (req, res) => {
	try {
		const user = await db.query(
			"SELECT User_id, User_firstname, User_secondname, User_email, User_language_speak, User_language_interest, User_city, user_country FROM user_profiles WHERE user_id = $1 ",
			[req.user]
		);

		res.json(user.rows[0]);
		// res.json(req.user);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server error");
	}
});

router.get("/all", authorize, async (req, res) => {
	try {
		const user = await db.query(
			"SELECT user_id, user_firstname, user_secondname, user_email, user_language_speak, user_language_interest, user_city, user_country FROM user_profiles"
		);

		res.json(user.rows);
		// res.json(req.user);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server error");
	}
});
//💫

router.post("/create_events", async (req, res) => {
	const { Languages, Location, Link, Title, Description, Datetime } = req.body;

	try {
		const result = await db.query(
			"INSERT INTO create_events (Languages, Location, Link, Title, Description, Datetime) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
			[Languages, Location, Link, Title, Description, atetime]
		);

		res.status(201).json(result.rows[0]);
	} catch (error) {
		console.error(error.message);
		res.status(500).json({ error: "Server error" });
	}
});

router.get("/events", async (req, res) => {
 try {
  const result = await db.query("SELECT * FROM create_events");
  res.status(200).json(result.rows);
 } catch (error) {
  console.error(error.message);
  res.status(500).json({ error: "Server error" });
 }
});

// router.put("/update/:userId", async (req, res) => {
// 	const { userId } = req.params;
// 	const {
// 		user_firstname,
// 		user_secondname,
// 		user_email,
// 		user_language_speak,
// 		user_language_interest,
// 		user_city,
// 		user_country,
// 	} = req.body;

// 	try {
// 		const updateUserQuery = `
// 		UPDATE user_profiles
// 		SET user_firstname=$1, user_secondname=$2, user_email=$3,
// 			user_language_speak=$4, user_language_interest=$5,
// 			user_city=$6, user_country=$7
// 		WHERE user_id=$8
// 		RETURNING *;
// 	  `;
// 		const values = [
// 			user_firstname,
// 			user_secondname,
// 			user_email,
// 			user_language_speak,
// 			user_language_interest,
// 			user_city,
// 			user_country,
// 			userId,
// 		];

// 		const { rows } = await db.query(updateUserQuery, values);

// 		res.status(200).json({
// 			success: true,
// 			message: `User with ID ${userId} updated successfully.`,
// 			data: rows[0],
// 		});
// 	} catch (error) {
// 		console.error(error);
// 		res.status(500).json({
// 			success: false,
// 			message: `Could not update user with ID ${userId}.`,
// 		});
// 	}
// });

//💫💫💫💫💫💫
// router.put("/update/:userId", async (req, res) => {
// 	const { userId } = req.params;
// 	const {
// 		user_firstname,
// 		user_secondname,
// 		user_email,
// 		user_language_speak,
// 		user_language_interest,
// 		user_city,
// 		user_country,
// 	} = req.body;

router.post("/send-message", authorize, async (req, res) => {
	try {
		const { recipientEmail, message, senderEmail } = req.body;
		const senderId = req.user;

		// Check if recipient exists
		const recipient = await db.query(
			"SELECT * FROM user_profiles WHERE user_email = $1",
			[recipientEmail]
		);

		if (recipient.rows.length === 0) {
			return res.status(404).json("Recipient not found");
		}
		const newMessage = await db.query(
			"INSERT INTO messages (sender_id, sender_email, recipient_id, recipient_email, message) VALUES ($1, $2, $3, $4, $5) RETURNING *",
			[senderId, senderEmail, recipient.rows[0].user_id, recipientEmail, message]
		);
		if (!newMessage.rows[0]) {
			return res
				.status(500)
				.json({ message: "Failed to insert message into database" });
		}

		res.json(newMessage.rows[0]);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server error");
	}
});

router.get("/messages", authorize, async (req, res) => {
	try {
		const userId = req.user;
		const messages = await db.query(
			"SELECT * FROM messages WHERE sender_id = $1 OR recipient_id = $1 ORDER BY created_at DESC",
			[userId]
		);
		//sender_id = $1 OR
		res.json(messages.rows);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server error");
	}
});

module.exports = router;

//how to delete table in postgresql=> DROP TABLE messages;
