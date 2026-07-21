import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Post from '../models/Post.js';
import Vertical from '../models/Vertical.js';
import User from '../models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/picklejar';

const dummyTitles = [
  "Why Your Insurance Premium Keeps Rising Even With a Clean Record",
  "The Refinancing Window Most Homeowners Miss Every Year",
  "Small Emergency Funds Are Outperforming the Old Six-Month Rule",
  "5 Hidden Costs of Moving Out of State in 2026",
  "How the Latest Fed Rate Hike Impacts Your Student Loans",
  "The Rise of Micro-Investing: Is It Worth Your Time?",
  "Credit Card Rewards Are Changing: What You Need to Know",
  "Rethinking Retirement: Why the 4% Rule Might Be Dead",
  "The Pros and Cons of High-Yield Savings Accounts vs. CDs",
  "Should You Actually Pay Off Your Mortgage Early?",
  "Navigating the Nuances of Mega Backdoor Roth IRAs",
  "Index Funds vs. Active Mutual Funds: The 10-Year Data",
  "Are Electric Vehicles Still a Good Financial Investment?",
  "The Tax Implications of Remote Work Across State Lines",
  "Balancing Daycare Costs With Long-Term Savings Goals",
  "Why Young Professionals Are Delaying Homeownership",
  "The Surprising ROI of Simple Home Energy Audits",
  "Understanding the New 529 College Savings Plan Rules",
  "How to Audit Your Own Monthly Subscriptions and Save",
  "The Hidden Fees in Your 401(k) and How to Spot Them",
  "Ticket Prices Are Down for the First Time in Five Seasons",
  "The Quiet Rise of Athlete-Owned Sports Bars",
  "Why Insurers Are Watching the Injury Report Closer Than Bettors Are",
  "How the New Broadcast Deal Impacts Franchise Valuations",
  "The Hidden Economics of Minor League Merchandising",
  "When Stadium Naming Rights Actually Pay Off for Sponsors"
];

const sportsTitles = [
  "Ticket Prices Are Down for the First Time in Five Seasons",
  "The Quiet Rise of Athlete-Owned Sports Bars",
  "Why Insurers Are Watching the Injury Report Closer Than Bettors Are",
  "How the New Broadcast Deal Impacts Franchise Valuations",
  "The Hidden Economics of Minor League Merchandising",
  "When Stadium Naming Rights Actually Pay Off for Sponsors"
];

const generateExcerpt = (title) => {
  return `An in-depth look at ${title.toLowerCase().replace(/[^a-z0-9 ]/g, '')}. We break down the latest trends and data so you can make the best financial decisions for your future.`;
};

const generateBody = (title) => {
  return {
    time: Date.now(),
    blocks: [
      {
        type: "paragraph",
        data: {
          text: `Welcome to our comprehensive analysis on the topic: <b>${title}</b>. Over the past few months, our financial analysts have tracked significant shifts in consumer behavior and market dynamics.`
        }
      },
      {
        type: "header",
        data: {
          text: "What the Latest Data Reveals",
          level: 2
        }
      },
      {
        type: "paragraph",
        data: {
          text: "While traditional wisdom often points in one direction, recent macroeconomic indicators suggest a different reality. Many consumers are discovering that optimizing their approach can yield substantial long-term benefits without requiring dramatic lifestyle changes."
        }
      },
      {
        type: "paragraph",
        data: {
          text: "In conclusion, staying informed and proactively managing your financial portfolio is more crucial than ever. Always consult with a certified financial planner before making major adjustments."
        }
      }
    ],
    version: "2.30.7"
  };
};

async function seedDummyPosts() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      console.error('No admin user found. Please run seedAdmin.js first.');
      process.exit(1);
    }

    const verticals = await Vertical.find({ active: true });
    if (verticals.length === 0) {
      console.error('No active verticals found. Please create some first.');
      process.exit(1);
    }

    const featuredVerticals = verticals.filter(v => v.featured);
    console.log(`Found ${verticals.length} verticals, ${featuredVerticals.length} featured.`);

    // Delete existing dummy posts to avoid duplicates
    const deleteResult = await Post.deleteMany({ isDummySeed: true });
    console.log(`Cleared ${deleteResult.deletedCount} old dummy posts.`);

    let createdCount = 0;
    const postsToCreate = [];

    // Distribute titles across verticals
    for (let i = 0; i < dummyTitles.length; i++) {
      const title = dummyTitles[i];
      // Ensure featured verticals get enough posts (at least 4-6)
      let vertical;
      const sportsVertical = verticals.find(v => v.slug === 'sports' || v.name.toLowerCase() === 'sports');
      
      if (sportsTitles.includes(title) && sportsVertical) {
        vertical = sportsVertical;
      } else if (i < 6 && featuredVerticals.length > 0) {
        vertical = featuredVerticals[0];
      } else if (i < 12 && featuredVerticals.length > 1) {
        vertical = featuredVerticals[1];
      } else {
        vertical = verticals[i % verticals.length];
      }

      // Random date within last 14 days
      const publishDate = new Date();
      publishDate.setDate(publishDate.getDate() - Math.floor(Math.random() * 14));

      postsToCreate.push({
        title,
        excerpt: generateExcerpt(title),
        bannerImage: `https://picsum.photos/seed/dummyseed${i}/1200/675`,
        body: generateBody(title),
        author: admin._id,
        status: 'published',
        publishDate,
        vertical: vertical._id,
        isDummySeed: true,
        // Mark first 8 as editors pick
        editorsPick: i < 8,
        readTime: Math.floor(Math.random() * 5) + 3
      });
    }

    await Post.insertMany(postsToCreate);
    createdCount = postsToCreate.length;

    console.log(`Successfully created ${createdCount} dummy posts!`);
    console.log('Vertical distribution:');
    const verticalCounts = {};
    for (const post of postsToCreate) {
      const v = verticals.find(v => v._id.toString() === post.vertical.toString());
      verticalCounts[v.name] = (verticalCounts[v.name] || 0) + 1;
    }
    console.table(verticalCounts);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding dummy posts:', error);
    process.exit(1);
  }
}

seedDummyPosts();
