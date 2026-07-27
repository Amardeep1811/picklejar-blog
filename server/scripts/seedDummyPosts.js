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

const MONGODB_URI = process.env.MONGO_URI || process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('Error: MONGO_URI or MONGODB_URI environment variable is required.');
  process.exit(1);
}

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
  "The Biggest Transfer Rumors Still Unresolved Heading Into August",
  "The Hidden Economics of Minor League Merchandising",
  "Why Home Crowds Matter More Than Ever in Modern Sports",
  "Ticket Prices Are Down for the First Time in Five Seasons",
  "When Stadium Naming Rights Actually Pay Off for Sponsors",
  "How the New Broadcast Deal Impacts Franchise Valuations",
  "The Unprecedented Rise of Women's Sports Sponsorships"
];

const sportsTitles = [
  "The Biggest Transfer Rumors Still Unresolved Heading Into August",
  "The Hidden Economics of Minor League Merchandising",
  "Why Home Crowds Matter More Than Ever in Modern Sports",
  "Ticket Prices Are Down for the First Time in Five Seasons",
  "When Stadium Naming Rights Actually Pay Off for Sponsors",
  "How the New Broadcast Deal Impacts Franchise Valuations",
  "The Unprecedented Rise of Women's Sports Sponsorships"
];

const sportsExcerpts = {
  "The Biggest Transfer Rumors Still Unresolved Heading Into August": "Europe's biggest clubs are still chasing marquee signings as the 2026 summer transfer window enters a crucial stage. From Bradley Barcola to Julián Álvarez, several blockbuster moves remain unresolved.",
  "The Hidden Economics of Minor League Merchandising": "An inside look at how minor league teams turn quirky branding into major profit.",
  "Why Home Crowds Matter More Than Ever in Modern Sports": "Despite advanced analytics, the psychological edge of a roaring home crowd remains undeniable.",
  "Ticket Prices Are Down for the First Time in Five Seasons": "Fans are finally seeing relief at the box office as leagues adjust their pricing strategies.",
  "When Stadium Naming Rights Actually Pay Off for Sponsors": "Not every mega-deal works out, but here is what happens when stadium branding strikes gold.",
  "How the New Broadcast Deal Impacts Franchise Valuations": "The latest multi-billion dollar TV contracts are reshaping how we evaluate team worth.",
  "The Unprecedented Rise of Women's Sports Sponsorships": "Major brands are finally realizing the massive ROI potential in women's leagues as viewership numbers hit all-time highs."
};

const financeTitles = [
  "How to Rebalance Your Portfolio Before the Next Rate Cut",
  "The Rise of Robo-Advisors: Should You Trust an Algorithm?",
  "Are Target-Date Funds Actually Costing You Money?",
  "The Truth About Credit Repair Services",
  "Navigating the New Tax Brackets for 2027",
  "Why Your Auto Insurance Rates Are Spiking Again",
  "The Hidden Costs of 0% Financing Offers",
  "Is It Finally Time to Buy a Hybrid Vehicle?",
  "The Beginner's Guide to Series I Savings Bonds",
  "How to Negotiate a Medical Bill Down to Zero",
  "The Ultimate Guide to Travel Rewards Credit Cards",
  "When to Start Taking Social Security Benefits",
  "The Psychological Toll of Carrying High-Interest Debt",
  "Why Millennials Are Flocking to High-Yield Savings",
  "The Mechanics of a Backdoor Roth IRA Explained",
  "Is Fractional Real Estate Investing Worth the Hype?",
  "How Inflation Is Affecting Your Grocery Bill",
  "The Best Way to Handle an Unexpected Windfall",
  "Understanding the Fine Print on Life Insurance Policies",
  "How to Prepare Your Finances for a Potential Recession"
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

const generateLongBody = (title) => {
  return {
    time: Date.now(),
    blocks: [
      {
        type: "paragraph",
        data: {
          text: `Welcome to our comprehensive deep-dive on <b>${title}</b>. Over the past 18 months, our financial analysts have tracked significant shifts in consumer behavior and market dynamics that demand a closer look.`
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
          text: "While traditional wisdom often points in one direction, recent macroeconomic indicators suggest a different reality. Many consumers are discovering that optimizing their approach can yield substantial long-term benefits without requiring dramatic lifestyle changes. The shift in global monetary policy, combined with domestic economic pressures, has created a unique environment for investors."
        }
      },
      {
        type: "quote",
        data: {
          text: "The direction of travel is clear, and the timing and pace of adjustments will depend on incoming data, the evolving outlook, and the balance of risks.",
          caption: "Federal Reserve Chairman",
          alignment: "left"
        }
      },
      {
        type: "paragraph",
        data: {
          text: "The remarks effectively lock in a strategic pivot for the coming quarter, marking the end of the most aggressive inflation-fighting campaign since the Volcker era of the early 1980s. Markets reacted instantly, with the S&P 500 surging and Treasury yields tumbling across the curve."
        }
      },
      {
        type: "header",
        data: {
          text: "The Labor Market Calculus",
          level: 2
        }
      },
      {
        type: "paragraph",
        data: {
          text: "The pivot comes after last month's jobs report showed the unemployment rate ticking up slightly, triggering historically reliable recession indicators. While analysts pushed back against imminent recession fears, they acknowledged the labor market is no longer a source of inflationary pressure."
        }
      },
      {
        type: "list",
        data: {
          style: "unordered",
          items: [
            "JPMorgan readies massive restructuring in asset management.",
            "Why the tech rally might actually be underpriced.",
            "Commercial real estate's quiet capitulation.",
            "The family office exodus to alternative assets."
          ]
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
        excerpt: sportsExcerpts[title] || generateExcerpt(title),
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

    // ADD FINANCE POSTS
    const financeVertical = verticals.find(v => v.slug === 'finance' || v.name.toLowerCase() === 'finance');
    if (financeVertical) {
      for (let i = 0; i < financeTitles.length; i++) {
        const title = financeTitles[i];
        const publishDate = new Date();
        publishDate.setDate(publishDate.getDate() - Math.floor(Math.random() * 30));
        
        postsToCreate.push({
          title,
          excerpt: generateExcerpt(title),
          bannerImage: `https://picsum.photos/seed/finance${i}/1200/675`,
          body: i < 7 ? generateLongBody(title) : generateBody(title),
          author: admin._id,
          status: 'published',
          publishDate,
          vertical: financeVertical._id,
          isDummySeed: true,
          editorsPick: i % 4 === 0,
          readTime: i < 7 ? 8 : Math.floor(Math.random() * 5) + 3
        });
      }
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
