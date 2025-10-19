const Match = require('../models/Match');
const { cloudinary } = require('../cloudinary');
const { getTodayRelevantMatches } = require('../src/sportsdbService'); // 👈 ADD THIS IMPORT
const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;


module.exports.index = async (req, res) => {
    const matchesDocs = await Match.find({});
    const matchesGeoJson = matchesDocs.map(match => match.toJSON());

    // ✅ Read testDate from query (if provided)
    const { testDate, msg } = req.query;

    let liveMatches = [];
    let apiErrorMessage = null;
    try {
        // ✅ Pass testDate to the function
        liveMatches = await getTodayRelevantMatches(testDate);
    } catch (e) {
        console.error("Error fetching live matches for index page:", e.message);
        apiErrorMessage = "Could not load the real-time match feed due to an API error.";
    }

    res.render('matches/index', {
        matches: matchesGeoJson,
        liveMatches,
        msg,
        apiErrorMessage
    });
};




module.exports.renderNewForm = (req, res) => {
    res.render('matches/new');
};

module.exports.createMatch = async (req, res) => {
    const geoData = await maptilerClient.geocoding.forward(req.body.matches.location, { limit: 1 });
    if (!geoData.features?.length) {
        const errorMessage = 'Could not geocode that location. Please try again and enter a valid location.';
        return res.render('Matches/new', {
            error: errorMessage,
            
        });
    }
    const matches = new Match(req.body.matches);
    matches.geometry = geoData.features[0].geometry;
    matches.location = geoData.features[0].place_name;
    matches.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    matches.author = req.user._id;
    await matches.save();
    req.flash('success', 'Successfully made a new match');
    res.redirect(`/Matches/${matches._id}`);
};

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const matches = await Match.findById(req.params.id);
    res.render('matches/edit', { matches });
};

module.exports.updateMatch = async (req, res) => {
    const { id } = req.params;
    const matches = await Match.findByIdAndUpdate(id, { ...req.body.matches });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    matches.images.push(...imgs);
    await matches.save();
    if (req.body.deleteImage) {
        for (let filename of req.body.deleteImage) {
            await cloudinary.uploader.destroy(filename);
        }
        await matches.updateOne({
            $pull: { images: { filename: { $in: req.body.deleteImage } } }
        });

    }
    req.flash('success', 'Successfully updated match');
    res.redirect(`/Matches/${matches._id}`);
};

module.exports.deleteMatch = async (req, res) => {
    const { id } = req.params;
    await Match.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted match');
    res.redirect('/Matches');
};

module.exports.showMatch = async (req, res) => {
    const matches = await Match.findById(req.params.id)
        .populate({
            path: 'review',
            populate: {
                path: 'author'
            }
        })
        .populate('author');
    res.render('matches/show', { matches });
};