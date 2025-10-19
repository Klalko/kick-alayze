const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cities = require('./cities')
const Match = require('../models/Match');

mongoose.connect('mongodb://localhost:27017/kick-alyze');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected');
});

const seedDB = async () => {
    await Match.deleteMany({});
    for (let i = 0; i < 20; i++) {
        const random1 = Math.floor(Math.random() * cities.length);
        let random2 = Math.floor(Math.random() * cities.length);
        while (random1 === random2) {
            random2 = Math.floor(Math.random() * cities.length);
        }
        const match = new Match({
            author: '68d81a1574331155c8f64337',
            location: `${cities[random1].city},${cities[random1].state}`,
            title: `${cities[random1].team} vs ${cities[random2].team}`,
            description: "Match stadium photos",
            price: Math.floor(Math.random() * 20) + 10,
            images: [{
                url: 'https://res.cloudinary.com/dl93vkrbh/image/upload/v1759861424/FOOTY/sdtrjgilfvoqwxnlbjux.jpg',
                filename: 'FOOTY/vhxemcsc3jlxtppiv4zp'
            },
            {
                url: 'https://res.cloudinary.com/dl93vkrbh/image/upload/v1759860891/FOOTY/vhxemcsc3jlxtppiv4zp.png',
                filename: 'FOOTY/anotherimage'
            }
            ],
            geometry: cities[random1].geometry
        })

        await match.save();
    }
}




seedDB();