const express = require("express");
const db = require("./db");
const app = express();

app.use(express.json()); // JSON 파싱 미들웨어 사용 설정

app.post("/api/user", async (req, res) => {
  const { id, nickname, email } = req.body; // 클라이언트에서 보낸 데이터를 추출

  try {
    const [result] = await db
      .promise()
      .query("INSERT INTO users (id, nickname, email) VALUES (?, ?, ?)", [
        id,
        nickname,
        email,
      ]);
    res.status(201).json({ message: "New user added!" }); // 새 사용자가 추가되었음을 응답
  } catch (err) {
    res.status(500).json({ message: err.message }); // 에러가 발생한 경우 에러 메시지를 응답
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
