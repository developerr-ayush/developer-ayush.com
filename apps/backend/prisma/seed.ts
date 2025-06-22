import { db } from "@/lib/db";

interface SlangTerm {
  term: string;
  meaning: string;
  example: string;
  category: string;
}

const slangData: SlangTerm[] = [
  // Original terms
  {
    term: "Slay",
    meaning: "To do something exceptionally well or look amazing",
    example: "You absolutely slayed that presentation!",
    category: "Compliment",
  },
  {
    term: "Bet",
    meaning: "Okay, sure, or expressing agreement",
    example: "Want to go to the movies? Bet!",
    category: "Agreement",
  },
  {
    term: "Cap",
    meaning: "A lie or something that's not true",
    example: "That story sounds like cap to me",
    category: "Truth",
  },
  {
    term: "No Cap",
    meaning: "No lie, telling the truth",
    example: "I got an A+ on the test, no cap!",
    category: "Truth",
  },
  {
    term: "Bussin",
    meaning: "Really good, especially referring to food",
    example: "This pizza is bussin!",
    category: "Quality",
  },
  {
    term: "Sus",
    meaning: "Suspicious or questionable",
    example: "That's pretty sus if you ask me",
    category: "Suspicion",
  },
  {
    term: "Boujee",
    meaning: "Fancy, high-maintenance",
    example: "She's so boujee with her designer bags",
    category: "Lifestyle",
  },
  {
    term: "Yeet",
    meaning: "To throw something or express excitement",
    example: "I'm about to yeet this ball across the field",
    category: "Action",
  },
  {
    term: "Flex",
    meaning: "To show off",
    example: "Stop trying to flex on everyone",
    category: "Behavior",
  },
  {
    term: "Rizz",
    meaning: "Flirting game or charisma",
    example: "He's got mad rizz with the ladies",
    category: "Romance",
  },
  {
    term: "Drip",
    meaning: "Stylish outfit or fashion sense",
    example: "Your outfit has serious drip",
    category: "Fashion",
  },
  {
    term: "Fam",
    meaning: "Close friends or family",
    example: "What's up, fam?",
    category: "Friendship",
  },
  {
    term: "Ghosting",
    meaning: "Suddenly cutting off all communication",
    example: "He's been ghosting me for weeks",
    category: "Communication",
  },

  // Reactions & Emotions
  {
    term: "Deadass",
    meaning: "Seriously, for real",
    example: "I'm deadass tired right now",
    category: "Emphasis",
  },
  {
    term: "Lowkey",
    meaning: "Somewhat, kind of, or secretly",
    example: "I'm lowkey tired right now",
    category: "Degree",
  },
  {
    term: "Highkey",
    meaning: "Very much, obviously",
    example: "I'm highkey obsessed with this song",
    category: "Degree",
  },
  {
    term: "I'm Dead",
    meaning: "That's hilarious",
    example: "That meme has me dead 💀",
    category: "Reaction",
  },
  {
    term: "Mood",
    meaning: "Relatable feeling or situation",
    example: "Not wanting to get out of bed is such a mood",
    category: "Emotion",
  },
  {
    term: "Vibe Check",
    meaning: "Assessing someone's mood or energy",
    example: "Let me give you a vibe check real quick",
    category: "Assessment",
  },
  {
    term: "It's Giving",
    meaning: "It has the vibe of, it reminds me of",
    example: "This outfit is giving main character energy",
    category: "Comparison",
  },
  {
    term: "Ate",
    meaning: "Did amazingly well",
    example: "She ate and left no crumbs with that performance",
    category: "Compliment",
  },
  {
    term: "Ick",
    meaning: "Something that's a turn-off",
    example: "Guys who don't tip are such an ick",
    category: "Disgust",
  },

  // Insults & Sarcasm
  {
    term: "NPC",
    meaning: "Someone who acts basic or robotic",
    example: "He's such an NPC, no original thoughts",
    category: "Insult",
  },
  {
    term: "Pick Me",
    meaning: "Someone craving attention in a cringey way",
    example: "She's being such a pick me girl",
    category: "Insult",
  },
  {
    term: "Mid",
    meaning: "Mediocre, not good or bad",
    example: "That movie was pretty mid, honestly",
    category: "Quality",
  },
  {
    term: "Clown",
    meaning: "Foolish person",
    example: "You're a whole clown for thinking that",
    category: "Insult",
  },
  {
    term: "Ratio",
    meaning: "Getting more replies than likes (usually negative)",
    example: "That tweet got ratioed hard",
    category: "Social Media",
  },
  {
    term: "Cheugy",
    meaning: "Outdated or trying too hard to be trendy",
    example: "Live laugh love signs are so cheugy",
    category: "Insult",
  },

  // Brainrot & Unhinged
  {
    term: "Delulu",
    meaning: "Delusional but in a funny way",
    example: "I'm delulu thinking I'll wake up early tomorrow",
    category: "Behavior",
  },
  {
    term: "Feral",
    meaning: "Unhinged chaotic behavior",
    example: "I went absolutely feral at the concert",
    category: "Behavior",
  },
  {
    term: "Canon Event",
    meaning: "A moment that must happen for personal growth",
    example: "Getting your heart broken is a canon event",
    category: "Life Experience",
  },
  {
    term: "Core Memory",
    meaning: "A deeply remembered important moment",
    example: "That concert was definitely a core memory",
    category: "Memory",
  },
  {
    term: "Goblin Mode",
    meaning: "Lazy chaotic energy, being unproductive",
    example: "I'm in full goblin mode today",
    category: "Lifestyle",
  },
  {
    term: "Brainrot",
    meaning: "So obsessed with something it's melting your brain",
    example: "TikTok is giving me serious brainrot",
    category: "Obsession",
  },
  {
    term: "Main Character Energy",
    meaning: "Acting like life is a movie and you're the star",
    example: "She's got that main character energy",
    category: "Confidence",
  },

  // Lifestyle & Identity
  {
    term: "Soft Launch",
    meaning: "Subtly posting about a new relationship",
    example: "She's soft launching her new boyfriend",
    category: "Romance",
  },
  {
    term: "Hard Launch",
    meaning: "Publicly revealing relationship or persona",
    example: "They finally hard launched their relationship",
    category: "Romance",
  },
  {
    term: "Clean Girl",
    meaning: "Aesthetic of minimalism and natural beauty",
    example: "She's going for that clean girl look",
    category: "Aesthetic",
  },
  {
    term: "Hot Girl Walk",
    meaning: "Confident solo walk for exercise and mental health",
    example: "Time for my daily hot girl walk",
    category: "Lifestyle",
  },
  {
    term: "Situationship",
    meaning: "Unofficial romantic entanglement",
    example: "We're not dating, it's just a situationship",
    category: "Romance",
  },

  // TikTok-Inspired Terms
  {
    term: "POV",
    meaning: "Point of view, used in videos and captions",
    example: "POV: You're the main character",
    category: "Social Media",
  },
  {
    term: "Gyatt",
    meaning: "Expression of attraction (slang for curves)",
    example: "Gyatt, she's stunning!",
    category: "Attraction",
  },
  {
    term: "Skibidi",
    meaning: "Nonsensical meme term from viral videos",
    example: "That's so skibidi toilet energy",
    category: "Meme",
  },
  {
    term: "Slaps",
    meaning: "Something that's really good, usually music",
    example: "This song absolutely slaps!",
    category: "Quality",
  },
  {
    term: "Purr",
    meaning: "Agreement or affirmation",
    example: "You look amazing today, purr!",
    category: "Agreement",
  },
  {
    term: "Simp",
    meaning: "Someone doing too much for someone they like",
    example: "Stop being such a simp",
    category: "Behavior",
  },

  // Internet Core Slang
  {
    term: "Based",
    meaning: "Unapologetically confident or speaking facts",
    example: "That take was actually based",
    category: "Approval",
  },
  {
    term: "Cringe",
    meaning: "Embarrassing or awkward",
    example: "That video was so cringe",
    category: "Disgust",
  },
  {
    term: "Karen",
    meaning: "Entitled person who demands to speak to managers",
    example: "She's being such a Karen about this",
    category: "Insult",
  },
  {
    term: "W",
    meaning: "Win, something good",
    example: "Getting that promotion was a huge W",
    category: "Success",
  },
  {
    term: "L",
    meaning: "Loss, something bad",
    example: "Missing the concert was such an L",
    category: "Failure",
  },
  {
    term: "Say Less",
    meaning: "I understand, no more explanation needed",
    example: "Pizza party tonight? Say less",
    category: "Understanding",
  },

  // Additional popular terms
  {
    term: "Fire",
    meaning: "Something that's really good or cool",
    example: "That outfit is straight fire!",
    category: "Quality",
  },
  {
    term: "Lit",
    meaning: "Exciting, fun, or awesome",
    example: "This party is so lit!",
    category: "Quality",
  },
  {
    term: "Vibe",
    meaning: "Feeling or atmosphere",
    example: "I love the vibe of this place",
    category: "Feeling",
  },
  {
    term: "Hits Different",
    meaning: "Something that feels especially good or unique",
    example: "Coffee in the morning just hits different",
    category: "Experience",
  },
  {
    term: "Rent Free",
    meaning: "Something that occupies your thoughts constantly",
    example: "That song is living rent free in my head",
    category: "Thoughts",
  },
  {
    term: "Understood the Assignment",
    meaning: "Did exactly what was expected perfectly",
    example: "She really understood the assignment with that speech",
    category: "Success",
  },
  {
    term: "Periodt",
    meaning: "Period but with emphasis, end of discussion",
    example: "I'm the best at this game, periodt!",
    category: "Emphasis",
  },
  {
    term: "Stan",
    meaning: "To be a big fan of someone or something",
    example: "I stan Taylor Swift so hard",
    category: "Support",
  },
  {
    term: "Salty",
    meaning: "Bitter or upset about something",
    example: "Why are you so salty about losing?",
    category: "Emotion",
  },
  {
    term: "Tea",
    meaning: "Gossip or interesting information",
    example: "Spill the tea! What happened?",
    category: "Information",
  },
  {
    term: "Shade",
    meaning: "Subtle insult or disrespect",
    example: "She threw some serious shade at him",
    category: "Disrespect",
  },
  {
    term: "Bop",
    meaning: "A really good song",
    example: "This is such a bop!",
    category: "Music",
  },
  {
    term: "Finna",
    meaning: "Going to, about to",
    example: "I'm finna go to the store",
    category: "Action",
  },
  {
    term: "OOMF",
    meaning: "One of my followers (used on social media)",
    example: "OOMF is really posting cringe content today",
    category: "Social Media",
  },
];

async function main() {
  console.log("🌱 Starting seed...");

  // Clear existing slang terms (optional)
  await db.slangTerm.deleteMany({});
  console.log("🗑️  Cleared existing slang terms");

  // Get unique categories
  const categories = [...new Set(slangData.map((item) => item.category))];

  // Create slang categories first
  console.log("📁 Creating slang categories...");
  for (const categoryName of categories) {
    await db.slangCategory.upsert({
      where: { name: categoryName },
      update: {},
      create: {
        name: categoryName,
        description: `Slang terms related to ${categoryName.toLowerCase()}`,
        color: getRandomColor(),
      },
    });
  }
  console.log(`✅ Created ${categories.length} categories`);

  // Create slang terms
  console.log("💬 Creating slang terms...");
  let createdCount = 0;
  let featuredCount = 0;

  for (const slang of slangData) {
    // Make some terms featured (about 10%)
    const isFeatured = Math.random() < 0.1;
    if (isFeatured) featuredCount++;

    try {
      await db.slangTerm.create({
        data: {
          term: slang.term.toLowerCase(),
          meaning: slang.meaning,
          example: slang.example,
          category: slang.category,
          status: "approved", // All seed data is pre-approved
          isFeatured: isFeatured,
          submittedBy: "admin",
          approvedBy: "admin",
          approvedAt: new Date(),
        },
      });
      createdCount++;
    } catch (error) {
      console.error(`❌ Failed to create term "${slang.term}":`, error);
    }
  }

  console.log(`✅ Created ${createdCount} slang terms`);
  console.log(`⭐ Featured ${featuredCount} terms`);
  console.log("🎉 Seed completed successfully!");
}

function getRandomColor(): string {
  const colors = [
    "#7c3aed", // purple
    "#3b82f6", // blue
    "#10b981", // green
    "#f59e0b", // yellow
    "#ef4444", // red
    "#8b5cf6", // violet
    "#06b6d4", // cyan
    "#84cc16", // lime
    "#f97316", // orange
    "#ec4899", // pink
  ];
  return colors[Math.floor(Math.random() * colors.length)] || "#7c3aed";
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
