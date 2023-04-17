require("dotenv").config()
const express = require("express")
const cors = require("cors")
const app = express()
const { getUserTweets, getLatestTweets, getAuthorData } = require("./twitter")
const {
    getPolicies,
    getPolicyById,
    getPoliticianById,
} = require("./theyVoteForYou")

app.use(cors())

app.get("/api/tweets/:twitterId", async (req, res) => {
    const twitterId = req.params.twitterId
    try {
        const tweets = await getUserTweets(twitterId)
        res.json(tweets)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

app.get("/api/latest", async (req, res) => {
    try {
        const tweets = await getLatestTweets()
        res.json(tweets)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

app.get("/api/authordata/:twitterId", async (req, res) => {
    const twitterId = req.params.twitterId
    try {
        const user = await getAuthorData(twitterId)
        res.json(user)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

app.get("/api/policies", async (req, res) => {
    try {
        const policies = await getPolicies()
        res.json(policies)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Error fetching data from TheyVoteForYou",
        })
    }
})

app.get("/api/policies/:id", async (req, res) => {
    try {
        const policy = await getPolicyById(req.params.id)
        res.json(policy)
    } catch (error) {
        res.status(500).json({ message: "Error fetching policy data" })
    }
})

app.get("/api/politician/:id", async (req, res) => {
    const id = req.params.id
    try {
        const politician = await getPoliticianById(id)
        res.json(politician)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: error.message })
    }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
