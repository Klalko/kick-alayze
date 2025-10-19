require('dotenv').config(); // Load environment variables
const axios = require('axios');
const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);

// Optional: Only needed if you actually use TOP_5_LEAGUE_IDS elsewhere
// const { TOP_5_LEAGUE_IDS } = require('./config');

// ------------------- API CONFIG -------------------
const API_KEY = process.env.SPORTSDB_API_KEY || '3';
const BASE_URL = (process.env.SPORTSDB_BASE_URL || 'https://www.thesportsdb.com/api/v1/json')
    .replace(/\/+$/, ''); // remove trailing slashes

// ------------------- TEAM CACHE -------------------
const teamCache = {};
const CACHE_EXPIRATION_HOURS = 24;

/**
 * Looks up full team details (logo, stadium) using Caching.
 */
async function lookupTeamDetails(teamId) {
    if (
        teamCache[teamId] &&
        dayjs().diff(teamCache[teamId].timestamp, 'hour') < CACHE_EXPIRATION_HOURS
    ) {
        return teamCache[teamId].data;
    }

    const teamUrl = `${BASE_URL}/${API_KEY}/lookupteam.php?id=${teamId}`;

    try {
        const response = await axios.get(teamUrl);
        const teamData = response.data.teams ? response.data.teams[0] : null;

        if (teamData) {
            teamCache[teamId] = {
                data: teamData,
                timestamp: dayjs()
            };
            return teamData;
        }
    } catch (error) {
        console.error(`Error fetching team details for ID ${teamId}:`, error.message);
    }

    return {
        strStadium: 'Venue Unavailable',
        strStadiumThumb: 'https://placehold.co/400x200/cccccc/333333?text=No+Image',
        strStadiumLocation: 'Unknown Location',
        strTeamBadge: '/default_badge.png'
    };
}

/**
 * Fetches and returns today's relevant Top 5 league matches.
 */
async function getTodayRelevantMatches(testDate) {
    const date = testDate || new Date().toISOString().split('T')[0];

    const leagues = [
        "English Premier League",
        "Spanish La Liga",
        "Italian Serie A",
        "German Bundesliga",
        "French Ligue 1"
    ];

    const allMatches = [];

    for (const league of leagues) {
        // 🔧 FIXED: consistent variable naming — use SPORTSDB_API_KEY (not TSDB_API_KEY)
        const url = `${BASE_URL}/${API_KEY}/eventsday.php?d=${date}&l=${encodeURIComponent(league)}`;


        let response;
        try {
            response = await fetch(url);
        } catch (err) {
            console.error("❌ Network error for", league, ":", err.message);
            continue;
        }

        console.log("Response status:", response.status);

        let data;
        try {
            data = await response.json();
        } catch (err) {
            console.error("❌ JSON parse error for", league, ":", err.message);
            continue;
        }


        if (data && data.events) {
            allMatches.push(...data.events);
        } else {
            console.log(`⚠️ No events found for ${league} on ${date}`);
        }
    }

    return allMatches;
}

module.exports = {
    getTodayRelevantMatches,
    lookupTeamDetails
};
