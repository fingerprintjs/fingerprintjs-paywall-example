const express = require("express");
const { Pool } = require("pg");

const connectionString = process.env["PAYWALL_DATABASE_URL"];
const pgPool = new Pool({ connectionString: connectionString });

const app = express();
app.set("views", "./views");
app.set("view engine", "pug");
app.use(express.static("public"))

app.locals.fpjsCdnUrl = process.env["PAYWALL_FPJS_CDN_URL"] || 'https://fpcdn.io/';
app.locals.fpjsPublicApiKey = process.env["PAYWALL_FPJS_PUBLIC_API_KEY"] || "";

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/articles/:id", (req, res) => {
  let id = req.params['id']
  res.render(`articles/article-${id}`)
});

app.get("/paywall", async (req, res) => {
  let visitorId = req.query['visitorId'];
  let articleId = parseInt(req.query['articleId']);
  let articleIds = await getAlreadyReadArticleIds(visitorId);
  let paywallEnabled = true;
  // paywall is enabled only in one scenario:
  // visitor already read 2 distinct articles in the last 7 days
  // and current article is not the one that was read in the last 7 days
  if (articleIds.length < 2 || articleIds.includes(articleId)) {
    paywallEnabled = false;
    // if no paywall, we need to register current event of reading in the DB
    insertArticleReadRow(visitorId, articleId);
  }
  res.json({ enabled: paywallEnabled });
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Started the server on ${port}`);
});

let getAlreadyReadArticleIds = async (visitorId) => {
  let sql = "select distinct(article_id) as article_id from article_reads where visitor_id = $1 and created_at > $2";
  let currentTimestamp = new Date().getTime();
  let weekAgoTimestamp = currentTimestamp - 7 * 24 * 3600 * 1000;
  let queryParams = [visitorId, new Date(weekAgoTimestamp)];
  let res = await pgPool.query(sql, queryParams);
  let articleIds = res.rows.map(r => r.article_id);
  return articleIds;
}

let insertArticleReadRow = async (visitorId, articleId) => {
  let sql = "insert into article_reads(visitor_id, article_id) values ($1, $2)";
  let insertParams = [visitorId, articleId];
  await pgPool.query(sql, insertParams);
}
