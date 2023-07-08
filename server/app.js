const express = require("express");
const db = require("./db");
const app = express();

app.use(express.json()); // JSON 파싱 미들웨어 사용 설정

app.post("/api/user", async (req, res) => {
  const { id, nickname, email, profileurl } = req.body; // 클라이언트에서 보낸 데이터를 추출

  try {
    const [result] = await db
      .promise()
      .query(
        "INSERT INTO users (id, nickname, email, profileurl) VALUES (?, ?, ?, ?)",
        [id, nickname, email, profileurl]
      );
    res.status(201).json({ message: "New user added!" }); // 새 사용자가 추가되었음을 응답
  } catch (err) {
    res.status(500).json({ message: err.message }); // 에러가 발생한 경우 에러 메시지를 응답
  }
});

app.post("/api/check-user", async (req, res) => {
  const { id } = req.body;
  try {
    const [rows] = await db
      .promise()
      .query("SELECT * FROM users WHERE id = ?", [id]);
    if (rows.length > 0) {
      // 해당 ID를 가진 사용자가 DB에 존재하면, true를 반환
      res.json({ exists: true });
    } else {
      // 해당 ID를 가진 사용자가 DB에 존재하지 않으면, false를 반환
      res.json({ exists: false });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/api/user", async (req, res) => {
  try {
    const [rows] = await db.promise().query("SELECT * FROM users");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
