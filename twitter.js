const axios = require("axios")
const twitterApiKey = { bearer_token: process.env.TWITTER_BEARER_TOKEN }
const options = {
    headers: {
        "User-Agent": "v2UserTweetsJS",
        authorization: `Bearer ${twitterApiKey.bearer_token}`,
    },
}

const getUserTweets = async (twitterId) => {
    const url = `https://api.twitter.com/2/users/${twitterId}/tweets`
    const params = {
        max_results: 30,
        "tweet.fields": "created_at,public_metrics,text,author_id",
    }

    const response = await axios.get(url, { params, headers: options.headers })
    if (response.status !== 200) {
        throw new Error(
            `${response.status} ${response.statusText}:\n${response.data}`
        )
    }

    return response.data.data
}

const getLatestTweets = async () => {
    const url = "https://api.twitter.com/2/tweets/search/recent"
    const params = {
        max_results: 12,
        "tweet.fields": "created_at,public_metrics,text,author_id",
        query: "#auspol -is:retweet",
    }

    const response = await axios.get(url, { params, headers: options.headers })

    if (response.status !== 200) {
        throw new Error(
            `${response.status} ${response.statusText}:\n${response.data}`
        )
    }

    const tweets = response.data.data || []

    const authorIds = Array.from(new Set(tweets.map((t) => t.author_id)))

    const usersResponse = await axios.get(
        `https://api.twitter.com/2/users?ids=${authorIds.join(
            ","
        )}&user.fields=profile_image_url,username`,
        { headers: options.headers }
    )

    if (usersResponse.status !== 200) {
        throw new Error(
            `${usersResponse.status} ${usersResponse.statusText}:\n${usersResponse.data}`
        )
    }

    const users = usersResponse.data.data

    const tweetsWithUserData = tweets.map((tweet) => {
        const user = users.find((u) => u.id === tweet.author_id)
        return {
            ...tweet,
            user: {
                username: user.username,
                profile_image_url: user.profile_image_url,
            },
        }
    })

    return tweetsWithUserData
}

const getAuthorData = async (twitterId) => {
    const url = `https://api.twitter.com/2/users?ids=${twitterId}&user.fields=username,profile_image_url`

    try {
        const response = await axios.get(url, { headers: options.headers })

        if (response.status !== 200) {
            throw new Error(
                `${response.status} ${response.statusText}:\n${response.data}`
            )
        }

        const user = response.data.data[0]
        return user
    } catch (error) {
        throw new Error(error.message)
    }
}

module.exports = {
    getUserTweets,
    getLatestTweets,
    getAuthorData,
}
