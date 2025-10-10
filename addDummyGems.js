const mongoose = require('mongoose');
require('dotenv').config();

const Gem = require('./models/Gem');
const User = require('./models/User');

const addDummyGems = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected successfully');

        // Find or create a seller user
        let seller = await User.findOne({ role: 'seller' });

        if (!seller) {
            console.log('Creating a dummy seller...');
            seller = new User({
                name: 'Raj Kumar Gems',
                email: 'seller@gems.com',
                password: '123456',
                role: 'seller',
                emailVerified: true
            });
            await seller.save();
            console.log('Seller created!');
        }

        console.log('Using seller ID:', seller._id);

        // Dummy Gem 1 - Emerald
        const emerald = new Gem({
            name: 'Emerald',
            hindiName: 'Panna (पन्ना)',
            planet: 'Mercury (Budh)',
            planetHindi: 'बुध ग्रह',
            color: 'Green',
            description: 'Beautiful natural emerald with excellent clarity and vibrant green color. Perfect for Mercury strengthening and enhancing intelligence. This certified gemstone is sourced from the finest mines of Sri Lanka.',
            benefits: [
                'Enhances intelligence and communication skills',
                'Improves business acumen and analytical ability',
                'Brings mental clarity and focus',
                'Strengthens Mercury planet in horoscope',
                'Promotes success in education and career'
            ],
            suitableFor: [
                'Teachers',
                'Lawyers',
                'Writers',
                'Media professionals',
                'Business people',
                'Students',
                'Gemini',
                'Virgo'
            ],
            price: 50000,
            sizeWeight: 5.5,
            sizeUnit: 'carat',
            stock: 10,
            availability: true,
            certification: 'Govt. Lab Certified',
            origin: 'Sri Lanka',
            deliveryDays: 7,
            heroImage: 'https://res.cloudinary.com/demo/image/upload/v1234567890/gems/emerald_hero.jpg',
            additionalImages: [
                'https://res.cloudinary.com/demo/image/upload/v1234567890/gems/emerald_1.jpg',
                'https://res.cloudinary.com/demo/image/upload/v1234567890/gems/emerald_2.jpg'
            ],
            seller: seller._id
        });

        // Dummy Gem 2 - Ruby
        const ruby = new Gem({
            name: 'Ruby',
            hindiName: 'Manik (माणिक)',
            planet: 'Sun (Surya)',
            planetHindi: 'सूर्य',
            color: 'Red',
            description: 'Premium quality natural ruby with deep red color and excellent clarity. Known as the king of gemstones, ruby represents the Sun and brings power, confidence, and success. This certified Burmese ruby is perfect for leadership and authority.',
            benefits: [
                'Boosts confidence and self-esteem',
                'Enhances leadership qualities',
                'Brings success and recognition',
                'Strengthens Sun planet in horoscope',
                'Improves career prospects and authority',
                'Provides protection and courage'
            ],
            suitableFor: [
                'Leaders',
                'Politicians',
                'Managers',
                'Government officials',
                'Executives',
                'Entrepreneurs',
                'Leo',
                'Aries',
                'Sagittarius'
            ],
            price: 75000,
            sizeWeight: 4.2,
            sizeUnit: 'carat',
            stock: 5,
            availability: true,
            certification: 'GIA Certified',
            origin: 'Myanmar',
            deliveryDays: 5,
            heroImage: 'https://res.cloudinary.com/demo/image/upload/v1234567890/gems/ruby_hero.jpg',
            additionalImages: [
                'https://res.cloudinary.com/demo/image/upload/v1234567890/gems/ruby_1.jpg',
                'https://res.cloudinary.com/demo/image/upload/v1234567890/gems/ruby_2.jpg',
                'https://res.cloudinary.com/demo/image/upload/v1234567890/gems/ruby_3.jpg'
            ],
            seller: seller._id
        });

        // Check if gems already exist
        const existingEmerald = await Gem.findOne({ name: 'Emerald', seller: seller._id });
        const existingRuby = await Gem.findOne({ name: 'Ruby', seller: seller._id });

        if (existingEmerald && existingRuby) {
            console.log('✅ Dummy gems already exist!');
            console.log('Emerald ID:', existingEmerald._id);
            console.log('Ruby ID:', existingRuby._id);
            process.exit(0);
        }

        // Save gems
        if (!existingEmerald) {
            await emerald.save();
            console.log('✅ Emerald added! ID:', emerald._id);
        }

        if (!existingRuby) {
            await ruby.save();
            console.log('✅ Ruby added! ID:', ruby._id);
        }

        console.log('\n═══════════════════════════════════════');
        console.log('🎉 Dummy gems created successfully!');
        console.log('═══════════════════════════════════════\n');
        console.log('Seller Email:', seller.email);
        console.log('Seller Password: 123456\n');
        console.log('Gems added:');
        console.log('1. Emerald (Panna) - ₹50,000 - Mercury');
        console.log('2. Ruby (Manik) - ₹75,000 - Sun');
        console.log('═══════════════════════════════════════\n');

        process.exit(0);
    } catch (error) {
        console.error('Error adding dummy gems:', error);
        process.exit(1);
    }
};

addDummyGems();
