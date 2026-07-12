import mongoose from "mongoose"
import { Product } from "../models/product.model.js"
import { ENV } from "../config/env.js"



const products = [
    {
        name: "Wireless Bluetooth Headphone",
        description: "Wireless and 24hr batery life with excellent sound",
        price: 150.55,
        stock: 50,
        category: "Electronics",
        images: [
            "https://plus.unsplash.com/premium_photo-1679513691474-73102089c117?w=500",
            "https://plus.unsplash.com/premium_photo-1678099940967-73fe30680949?w=500",
        ],
        averageReview: 4.0,
        totalReviews: 120
    },
    {
        name: "smart watch",
        description: "water resistant and 7 days batery life with excellent screen",
        price: 100.00,
        stock: 35,
        category: "Electronics",
        images: [
            "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500",
            "https://images.unsplash.com/photo-1660844817855-3ecc7ef21f12?w=500",
        ],
        averageReview: 4.0,
        totalReviews: 120
    },
    {
        name: "Wireless Bluetooth speakers",
        description: "Wireless and 24hr batery life with excellent sound",
        price: 200.55,
        stock: 30,
        category: "Electronics",
        images: ["https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500",
            "https://images.unsplash.com/photo-1529359744902-86b2ab9edaea?w=500"
        ],
        averageReview: 4.0,
        totalReviews: 120
    },
    {
        name: "Mowers",
        description: "great trimming capabilitiews for your environmemtal beautification with 4 years warranty",
        price: 600.00,
        stock: 100,
        category: "Machines",
        images: ["https://images.unsplash.com/photo-1590820292118-e256c3ac2676?w=500",
            "https://images.unsplash.com/photo-1630709437016-ee675b9b29b8?w=500"
        ],
        averageReview: 3.5,
        totalReviews: 190
    },
    {
        name: "Water Pumping Machine",
        description: "strong drilling machine with 4 years warranty",
        price: 480.20,
        stock: 14,
        category: "Machines",
        images: ["https://images.unsplash.com/photo-1700318092011-6e4666e94ab5?w=500",
            "https://plus.unsplash.com/premium_photo-1733317205924-b27238c65576?w=500"
        ],
        averageReview: 4.5,
        totalReviews: 125
    },
    {
        name: " Hand Drilling Machine",
        description: "strong drilling machine with 4 years warranty",
        price: 400.23,
        stock: 25,
        category: "Machines",
        images: [
            "https://images.unsplash.com/photo-1592054286113-649ba108e968?w=500",
            "https://plus.unsplash.com/premium_photo-1721460167354-b55c73c05331?w=500"
        ],
        averageReview: 4.5,
        totalReviews: 125
    },


    {
        name: "Ladies Wear",
        description: "trendy dress for your official and everyday wear",
        price: 165.23,
        stock: 69,
        category: "Fashion",
        images: ["https://plus.unsplash.com/premium_photo-1675186049366-64a655f8f537?w=500",
            "https://images.unsplash.com/photo-1739773375456-79be292cedb1?w=500"
        ],
        averageReview: 4.5,
        totalReviews: 125
    },


    {
        name: "Mens Wear",
        description: "for smart guys with class",
        price: 400.23,
        stock: 25,
        category: "Fashion",
        images: ["https://images.unsplash.com/photo-1479064555552-3ef4979f8908?w=500",
            "https://images.unsplash.com/photo-1667284152861-36e03571486a?w=500"
        ],
        averageReview: 4.5,
        totalReviews: 125
    },
    {
        name: "Childrens Wear",
        description: "for every lively and happy child",
        price: 78.11,
        stock: 22,
        category: "Fashion",
        images: ["https://images.unsplash.com/photo-1760287363879-6012adab292c?w=500",
            "https://images.unsplash.com/photo-1622218286192-95f6a20083c7?w=500"
        ],
        averageReview: 4.5,
        totalReviews: 125
    },
    {
        name: "Vegetarian Foods",
        description: "for your total health and welbeing",
        price: 50.00,
        stock: 20,
        category: "Foods",
        images: ["https://plus.unsplash.com/premium_photo-1664527305901-a3c8bec62850?w=500",
            "https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=500"
        ],
        averageReview: 3.0,
        totalReviews: 100
    },
    {
        name: "Baby Foods",
        description: "for every lively and happy child",
        price: 78.11,
        stock: 22,
        category: "Foods",
        images: ["https://images.unsplash.com/photo-1722639096482-4e1a805f9b0b?w=500",
            "https://images.unsplash.com/photo-1584263347416-85a696b4eda7?w=500"
        ],
        averageReview: 2.5,
        totalReviews: 78
    },
    {
        name: "Room Furniture",
        description: "for total comfort and relaxation",
        price: 1000.11,
        stock: 22,
        category: "Furniture",
        images: ["https://plus.unsplash.com/premium_photo-1683140479836-df0294469062?w=500",
            "https://plus.unsplash.com/premium_photo-1671269943771-63db2ab54bf2?w=500"
        ],
        averageReview: 2.5,
        totalReviews: 78
    },
    {
        name: "Kitchen Furniture",
        description: "for those who believe in class and how they eat",
        price: 1200.57,
        stock: 12,
        category: "Furniture",
        images: ["https://plus.unsplash.com/premium_photo-1661963167025-ca61fd6b36d8?w=500",
            "https://plus.unsplash.com/premium_photo-1661962752158-f7b15d5ec42b?w=500"
        ],
        averageReview: 4.5,
        totalReviews: 140
    },
]

const seedDataBase = async () => {

    try {
        await mongoose.connect(ENV.DB_URL)

        await Product.deleteMany({})


        await Product.insertMany(products)

        console.log(`Successfully seeded ${products.length} products`)

        const categories = [...new Set(products.map((p) => p.category))]

        console.log(`Categories: ${categories.join(",")}`)


        await mongoose.connection.close()

        console.log("DataBase Seeding Completed and Connection Closed ")

        process.exit(0)


    } catch (error) {
        console.error("Error Sending Database", error)
        process.exit(1)
    }
}

seedDataBase()