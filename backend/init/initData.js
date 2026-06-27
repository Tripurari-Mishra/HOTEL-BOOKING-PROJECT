export let sampleListings = [
  {
    title: "Cozy Beachfront Resort",

    description:
      "Escape to this beautiful beachfront resort with stunning ocean views.",

    image: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688"], // 🎯 FIXED: Array format mein string di

    category: "Resort", // 🎯 FIXED: Enum ka part hai

    price: 1500,

    location: "Goa",

    country: "India",
  },

  {
    title: "Modern Luxury Apartment",

    description: "Stay in the heart of the city with world-class amenities.",

    image: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267"], // 🎯 FIXED

    category: "Apartment", // 🎯 FIXED: Enum ka part hai

    price: 3500,

    location: "Mumbai",

    country: "India",
  },

  {
    title: "Mountain View Villa",

    description: "A peaceful villa surrounded by pine trees and snowy peaks.",

    image: ["https://images.unsplash.com/photo-1510798831971-661eb04b3739"], // 🎯 FIXED

    category: "Villa", // 🎯 FIXED: Enum ka part hai

    price: 2000,

    location: "Manali",

    country: "India",
  },
  {
    title: "Heritage Palace Hotel",
    description:
      "Experience royal hospitality and ancient architecture in the pink city.",
    image: ["https://images.unsplash.com/photo-1542314831-068cd1dbfeeb"],
    category: "Hotel",
    price: 4500,
    location: "Jaipur",
    country: "India",
  },
  {
    title: "Sunset Cliff Resort",
    description:
      "Enjoy stunning cliffside views of the Arabian Sea with world-class dining.",
    image: ["https://images.unsplash.com/photo-1571896349842-33c89424de2d"],
    category: "Resort",
    price: 2800,
    location: "Varkala",
    country: "India",
  },
  {
    title: "Infinity Pool Luxury Villa",
    description:
      "A private hillside villa featuring a massive infinity pool overlooking lush valleys.",
    image: ["https://images.unsplash.com/photo-1613977257363-707ba9348227"],
    category: "Villa",
    price: 5500,
    location: "Lonavala",
    country: "India",
  },
  {
    title: "Urban Chic Studio Apartment",
    description:
      "A modern, minimalist studio perfect for digital nomads and business travelers.",
    image: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688"],
    category: "Apartment",
    price: 1800,
    location: "Bengaluru",
    country: "India",
  },
  {
    title: "Snowy Peaks Resort",
    description:
      "Ski-in, ski-out luxury resort offering breathtaking views of the Himalayas.",
    image: ["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab"],
    category: "Resort",
    price: 4000,
    location: "Gulmarg",
    country: "India",
  },
  {
    title: "The Grand Regal Hotel",
    description:
      "Luxury stay in the financial hub with a 5-star spa and rooftop lounge.",
    image: ["https://images.unsplash.com/photo-1566073771259-6a8506099945"],
    category: "Hotel",
    price: 6000,
    location: "Delhi",
    country: "India",
  },
  {
    title: "Backwater Serenity Villa",
    description:
      "A traditional wooden villa sitting right on the calm backwaters of Kerala.",
    image: ["https://images.unsplash.com/photo-1580587771525-78b9dba3b914"],
    category: "Villa",
    price: 3200,
    location: "Alleppey",
    country: "India",
  },
  {
    title: "High-Rise Penthouse Apartment",
    description:
      "Luxury penthouse with a 360-degree panoramic view of the city skyline.",
    image: ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00"],
    category: "Apartment",
    price: 7500,
    location: "Gurugram",
    country: "India",
  },
  {
    title: "Tropical Paradise Resort",
    description:
      "Unwind under the palm trees in your private beachfront cottage.",
    image: ["https://images.unsplash.com/photo-1540555700478-4be289fbecef"],
    category: "Resort",
    price: 3800,
    location: "Havelock Island",
    country: "India",
  },
  {
    title: "Colonial Charm Hotel",
    description:
      "A beautifully restored British-era hotel with vintage aesthetics and gardens.",
    image: ["https://images.unsplash.com/photo-1551882547-ff40c63fe5fa"],
    category: "Hotel",
    price: 2500,
    location: "Ooty",
    country: "India",
  },
  {
    title: "Pine Forest Ridge Villa",
    description:
      "A wooden cabin-style villa perfect for stargazing and peaceful mountain walks.",
    image: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c"],
    category: "Villa",
    price: 2900,
    location: "Kasauli",
    country: "India",
  },
  {
    title: "Metro Hub Service Apartment",
    description:
      "Fully furnished apartment located right next to the major tech parks.",
    image: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2"],
    category: "Apartment",
    price: 2200,
    location: "Hyderabad",
    country: "India",
  },
  {
    title: "Desert Edge Safari Resort",
    description:
      "Stay in luxury Swiss tents with traditional folk dance and desert safaris.",
    image: ["https://images.unsplash.com/photo-1549693578-d683be217e58"],
    category: "Resort",
    price: 3100,
    location: "Jaisalmer",
    country: "India",
  },
  {
    title: "Lakeview Heritage Hotel",
    description:
      "Watch the sunset over Lake Pichola from the window of this grand hotel.",
    image: ["https://images.unsplash.com/photo-1520250497591-112f2f40a3f4"],
    category: "Hotel",
    price: 5000,
    location: "Udaipur",
    country: "India",
  },
  {
    title: "French Quarter Villa",
    description:
      "Bright yellow colonial villa featuring a gorgeous private courtyard.",
    image: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750"],
    category: "Villa",
    price: 3400,
    location: "Puducherry",
    country: "India",
  },
  {
    title: "Downtown Minimalist Apartment",
    description:
      "Sleek and classy apartment located walking distance from the best cafes.",
    image: ["https://images.unsplash.com/photo-1493809842364-78817add7ffb"],
    category: "Apartment",
    price: 2600,
    location: "Kolkata",
    country: "India",
  },
  {
    title: "Jungle Vista Eco-Resort",
    description:
      "Listen to the birds in an eco-friendly resort right on the edge of the national park.",
    image: ["https://images.unsplash.com/photo-1596394516093-501ba68a0ba6"],
    category: "Resort",
    price: 4200,
    location: "Jim Corbett",
    country: "India",
  },
  {
    title: "Boutique Business Hotel",
    description:
      "Smart hotel equipped with high-speed internet and excellent conference rooms.",
    image: ["https://images.unsplash.com/photo-1445019980597-93fa8acb246c"],
    category: "Hotel",
    price: 2300,
    location: "Pune",
    country: "India",
  },
  {
    title: "Cliffside Sunset Villa",
    description:
      "Watch spectacular ocean views right from the balcony of this modern villa.",
    image: ["https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83"],
    category: "Villa",
    price: 4800,
    location: "Wayanad",
    country: "India",
  },
  {
    title: "Riverside Peace Apartment",
    description:
      "Calm and serene apartment located close to the spiritual ghats of the holy river.",
    image: ["https://images.unsplash.com/photo-1512915922686-57c11dde9b6b"],
    category: "Apartment",
    price: 1500,
    location: "Rishikesh",
    country: "India",
  },
];
