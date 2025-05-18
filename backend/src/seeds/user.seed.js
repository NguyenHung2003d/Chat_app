import 'dotenv/config'
import {connectDB} from '../lib/db.js'
import User from '../models/user.model.js'

const seedUsers = [
    //Female Users
    {
        email: 'emma.thomson@example.com',
        fullName: 'Emma Thomson',
        password: '123456',
        profilePic: ''
    },
    {
        email: 'olivia.miller@example.com',
        fullName: 'Olivia Miller',
        password: '123456',
        profilePic: ''
    }
]

const seedDatabase = async () => {
    try {
        await connectDB()
        await User.insertMany(seedUsers)
        console.log('Database seeded successfully')
    } catch (error) {
        console.log('Error seeding database:', error);
    }
}

seedDatabase()
  .then(() => {
    console.log('Seeding completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error during seeding:', error);
    process.exit(1);
  });