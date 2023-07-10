const express = require("express");
const db = require("./db");
const app = express();

app.use(express.json()); // JSON 파싱 미들웨어 사용 설정

app.post("/api/user", async (req, res) => {
  const { id, nickname, email, profileurl, userid, pw } = req.body; // 클라이언트에서 보낸 데이터를 추출

  try {
    const [result] = await db
      .promise()
      .query(
        "INSERT INTO users (id, nickname, email, profileurl, userid, pw) VALUES (?, ?, ?, ?, ?, ?)",
        [id, nickname, email, profileurl, userid, pw]
      );
    res.status(201).json({ message: "New user added!" }); // 새 사용자가 추가되었음을 응답
  } catch (err) {
    res.status(500).json({ message: err.message }); // 에러가 발생한 경우 에러 메시지를 응답
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
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

app.post("/api/login", async (req, res) => {
  const { userid, pw } = req.body; // 클라이언트에서 보낸 사용자 이름과 비밀번호를 추출합니다.
  try {
    const [rows] = await db
      .promise()
      .query("SELECT * FROM users WHERE userid = ? AND pw = ?", [userid, pw]); // DB에서 사용자를 찾습니다.

    if (rows.length > 0) {
      // 사용자가 발견되면 사용자 정보를 반환합니다.
      res.json(rows[0]);
    } else {
      // 사용자를 찾지 못했을 경우, 오류 메시지를 반환합니다.
      res.status(404).json({ message: "User not found." });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/api/get-nickname", async (req, res) => {
  const { id } = req.body;
  try {
    const [rows] = await db
      .promise()
      .query("SELECT nickname FROM users WHERE id = ?", [id]);
    if (rows.length > 0) {
      // 해당 ID를 가진 사용자가 DB에 존재하면, 닉네임을 반환
      res.json({ nickname: rows[0].nickname });
    } else {
      // 해당 ID를 가진 사용자가 DB에 존재하지 않으면, 적절한 메시지와 함께 응답
      res.json({ message: "No user with this ID found." });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/api/push_money", async (req, res) => {
  const { id, user_id, date, type, amount, asset, category, description } =
    req.body;

  try {
    const [result] = await db
      .promise()
      .query(
        "INSERT INTO ledger (id, date, type, amount, asset, category, description) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [id, date, type, amount, asset, category, description]
      );

    res.status(201).json({ message: "New record added!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/api/get_money", async (req, res) => {
  const userId = req.query.id;

  try {
    const [rows] = await db
      .promise()
      .query("SELECT * FROM ledger WHERE id = ?", [userId]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/api/get_expense", async (req, res) => {
  const userId = req.query.id;

  try {
    // 이번 달의 시작과 끝 날짜를 얻습니다.
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const [rows] = await db
      .promise()
      .query(
        "SELECT SUM(amount) as totalExpense FROM ledger WHERE id = ? AND type = 'expense' AND date BETWEEN ? AND ?",
        [userId, firstDayOfMonth, lastDayOfMonth]
      );
    const totalExpense = rows[0].totalExpense || 0; // totalExpense가 NULL일 경우 0으로 처리
    res.json({ totalExpense });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
