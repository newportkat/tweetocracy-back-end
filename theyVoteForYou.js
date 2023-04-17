const axios = require("axios")
const theyVoteForYouApiKey = process.env.THEY_VOTE_FOR_YOU_API_KEY

const getPolicies = async () => {
    try {
        const response = await axios.get(
            `https://www.theyvoteforyou.org.au/api/v1/policies.json?key=${theyVoteForYouApiKey}`
        )
        if (response.status !== 200) {
            throw new Error(
                `${response.status} ${response.statusText}:\n${response.data}`
            )
        }
        return response.data
    } catch (error) {
        throw new Error(error.message)
    }
}

const getPolicyById = async (policyId) => {
    try {
        const response = await axios.get(
            `https://www.theyvoteforyou.org.au/api/v1/policies/${policyId}.json?key=${theyVoteForYouApiKey}`
        )
        if (response.status !== 200) {
            throw new Error(
                `${response.status} ${response.statusText}:\n${response.data}`
            )
        }
        return response.data
    } catch (error) {
        throw new Error(error.message)
    }
}

const getPoliticianById = async (id) => {
    try {
        const response = await axios.get(
            `https://theyvoteforyou.org.au/api/v1/people/${id}.json?key=${theyVoteForYouApiKey}`
        )
        if (response.status !== 200) {
            throw new Error(
                `${response.status} ${response.statusText}:\n${response.data}`
            )
        }
        return response.data
    } catch (error) {
        throw new Error(error.message)
    }
}

module.exports = {
    getPolicies,
    getPolicyById,
    getPoliticianById,
}
