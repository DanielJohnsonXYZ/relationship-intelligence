// Bulk import script for top contacts
// Run this with: node import-contacts.js

const contacts = [
  {
    name: "Kumaran Veluppillai",
    email: "",
    company: "",
    role: "Mentor",
    tags: ["Google Mentor", "Connections", "Marketing"],
    priority: 9,
    linkedin_url: "https://www.linkedin.com/in/kumaran-veluppillai/",
    relationship_temperature: "hot",
    notes: "Got married, started at Prolific. Met through Google Launchpad. Direct and efficient communicator.",
    interests: ["Marketing", "Startups", "Mentoring"],
  },
  {
    name: "Mike Mahon",
    email: "",
    company: "",
    role: "",
    tags: ["TechLondon", "Marketing", "PPC"],
    priority: 9,
    linkedin_url: "https://www.linkedin.com/in/mikemahonmarketing/",
    relationship_temperature: "warm",
    notes: "Through TechLondon Slack. Formal, direct and comprehensive. Asked if still in London for catchup.",
    interests: ["Data Analytics", "Marketing", "PPC"],
  },
  {
    name: "Michael Taylor",
    email: "",
    company: "Vexpower",
    role: "",
    tags: ["London", "Marketing Agency", "Startups"],
    priority: 9,
    linkedin_url: "https://www.linkedin.com/in/mjt145/",
    relationship_temperature: "hot",
    notes: "Working on Vexpower. Through London startup ecosystem. Online and regular communicator. Friend.",
    interests: ["Coding", "Data Analytics", "Agency Growth", "Self improvement"],
  },
  {
    name: "Jake Steiner",
    email: "",
    company: "",
    role: "",
    tags: ["Google", "Online Geniuses", "Startups"],
    priority: 9,
    linkedin_url: "https://www.linkedin.com/in/jakestainer",
    relationship_temperature: "hot",
    notes: "Barcelona based. Really friendly, good to chat! Had coffee in London. Keep in touch.",
    interests: ["Marketing", "Community", "Growth"],
  },
  {
    name: "Ping Wang",
    email: "",
    company: "",
    role: "",
    tags: ["Techstars", "Taiwan Ecosystem", "Startups"],
    priority: 9,
    linkedin_url: "https://www.linkedin.com/in/hpwang/",
    relationship_temperature: "hot",
    notes: "Taipei based. Met at MeetTaipei. Friendly, direct, clever. Speaks highly of me. Chatting on Line.",
    interests: ["Startups", "Taiwan Ecosystem", "Connections"],
  },
  {
    name: "Sam Sturm",
    email: "",
    company: "Founders Factory",
    role: "",
    tags: ["Founders Factory", "Marketing Agency", "London"],
    priority: 9,
    linkedin_url: "https://www.linkedin.com/in/sam-sturm-6a20b526/",
    relationship_temperature: "warm",
    notes: "Interviewed me for Head of Growth at Founders Factory. Friendly, direct and intense. Potential leads incoming.",
    interests: ["Connections", "Leads", "Venture Growth"],
  },
  {
    name: "Silja Litvin",
    email: "",
    company: "eQuoo",
    role: "",
    tags: ["Friend", "Techstars", "Fundraising"],
    priority: 9,
    linkedin_url: "https://www.linkedin.com/in/silja-litvin/",
    relationship_temperature: "hot",
    notes: "London based. Just raised money for eQuoo. Friend. Keep in touch.",
    interests: ["Fundraising", "EdTech", "Mental Health"],
  },
  {
    name: "Leanne Beesley",
    email: "",
    company: "",
    role: "",
    tags: ["Investment", "Venture Growth"],
    priority: 9,
    linkedin_url: "https://www.linkedin.com/in/leannebeesley/",
    relationship_temperature: "hot",
    notes: "Met in Chiang Mai. Friendly. Traveling. Friend. High value for leads and venture growth.",
    interests: ["Venture Growth", "Investment", "Leads"],
  },
  {
    name: "Matthew Eisner",
    email: "",
    company: "",
    role: "",
    tags: ["Friend", "Startups", "Leads"],
    priority: 9,
    linkedin_url: "",
    relationship_temperature: "hot",
    notes: "Through James Lethem. Started new job. Friendly but bit slow to respond. Friend.",
    interests: ["Agency Growth", "Leads", "Startups", "Venture Growth"],
  },
  {
    name: "Dave Joshua",
    email: "",
    company: "",
    role: "",
    tags: ["London", "Growth", "Marketing", "AI"],
    priority: 9,
    linkedin_url: "https://www.linkedin.com/in/davejoshua",
    relationship_temperature: "warm",
    notes: "Through networking event. Friendly! Working on AI projects. London based.",
    interests: ["Marketing", "AI", "Growth"],
  },
  {
    name: "Patrick Gilday",
    email: "",
    company: "",
    role: "",
    tags: ["London", "Fundraising", "Venture Growth"],
    priority: 8,
    linkedin_url: "https://www.linkedin.com/in/patrick-gilday-40a014187/",
    relationship_temperature: "warm",
    notes: "Really casual and friendly. Lovely chat. Gave feedback to Greenscreen. Asked for coffee.",
    interests: ["Fundraising", "Venture Growth", "Startups"],
  },
  {
    name: "Afshin Moayed",
    email: "",
    company: "",
    role: "",
    tags: ["Google", "Google Mentor", "Fundraising"],
    priority: 8,
    linkedin_url: "https://www.linkedin.com/in/afshinmoayedsanandajirafii/",
    relationship_temperature: "hot",
    notes: "Belgium and London. Through James via Google Launchpad. Friendly, chatty. Friend. Get advice on next steps.",
    interests: ["Connections", "Fundraising", "Venture Growth"],
  },
  {
    name: "Jay Paul",
    email: "",
    company: "",
    role: "",
    tags: ["London", "Marketing", "Marketing Agency"],
    priority: 8,
    linkedin_url: "https://www.linkedin.com/in/jaypaul/",
    relationship_temperature: "warm",
    notes: "Through Ludo. Very friendly. Asked for coffee or walk. Keep saying hi.",
    interests: ["Agency Growth", "Marketing", "London Network"],
  },
  {
    name: "Darius Safavi",
    email: "",
    company: "",
    role: "",
    tags: ["Startups", "London", "Leads"],
    priority: 8,
    linkedin_url: "https://www.linkedin.com/in/dariussafavi/",
    relationship_temperature: "warm",
    notes: "Through Leanne. Friendly and direct. Had catchup. London based. Keep in touch.",
    interests: ["Startups", "Leads", "Business Development"],
  },
  {
    name: "Tristan Gillen",
    email: "",
    company: "",
    role: "",
    tags: ["London", "Marketing", "Startups", "Portugal"],
    priority: 8,
    linkedin_url: "",
    relationship_temperature: "warm",
    notes: "Portugal based. Working on a few ideas. Friendly and polite. Similar circles. Identify collaboration opportunities.",
    interests: ["Marketing", "Agency Growth", "Collaboration"],
  },
];

async function importContacts() {
  const API_URL = "https://relationship-intelligence.vercel.app/api/people";

  console.log(`Starting import of ${contacts.length} contacts...`);

  for (const contact of contacts) {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contact),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`✓ Added: ${contact.name}`);
      } else {
        const error = await response.text();
        console.log(`✗ Failed: ${contact.name} - ${error}`);
      }
    } catch (error) {
      console.log(`✗ Error adding ${contact.name}:`, error.message);
    }

    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log("\n✓ Import complete!");
  console.log(`Visit https://relationship-intelligence.vercel.app/people to see your contacts`);
}

importContacts();
