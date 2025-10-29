// Populate Twitter handles and company domains from CSV
const API_URL = "https://relationship-intelligence.vercel.app";

const linkUpdates = [
  // People with company domains that can be inferred
  { name: "Kumaran Veluppillai", company_domain: "prolific.co" },
  { name: "Michael Taylor", company_domain: "vexpower.com" },
  { name: "Curran Dye", company_domain: "atomlearning.com" },
  { name: "Jake Steiner", company_domain: "onlinegeniuses.com" },
  { name: "Sam Sturm", company_domain: "foundersfactory.com" },
  { name: "Silja Litvin", company_domain: "equoo.org" },
  { name: "Robert Lai", company_domain: "growthhackers.com" },
  { name: "Michael Wu", company_domain: "stripe.com" },
  { name: "Muhammad Scarim", company_domain: "mobility.com" },
  { name: "Amit Patel", company_domain: "getpeachy.co" },
  { name: "Ludo De Angelis", company_domain: "startupvan.co.uk" },
  { name: "Mark McDonagh", company_domain: "startupvan.co.uk" },
  
  // People with Twitter handles we can add
  { name: "Jay Paul", twitter_handle: "@jaypaul" },
  { name: "Sam Patel", twitter_handle: "@samitptl" },
  { name: "Dave Joshua", twitter_handle: "@davejoshua" },
];

async function populateLinks() {
  console.log("Fetching all contacts...\n");
  
  const res = await fetch(`${API_URL}/api/people`);
  const people = await res.json();
  
  let updateCount = 0;
  
  for (const update of linkUpdates) {
    const person = people.find(p => p.name === update.name);
    if (!person) continue;
    
    const updates = {};
    if (update.company_domain && !person.company_domain) {
      updates.company_domain = update.company_domain;
    }
    if (update.twitter_handle && !person.twitter_handle) {
      updates.twitter_handle = update.twitter_handle;
    }
    
    if (Object.keys(updates).length === 0) continue;
    
    try {
      const response = await fetch(`${API_URL}/api/people/${person.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      
      if (response.ok) {
        updateCount++;
        console.log(`✓ Updated: ${person.name}`);
      }
    } catch (error) {
      console.log(`✗ Failed: ${person.name}`);
    }
    
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  console.log(`\n✓ Updated ${updateCount} contacts with additional links`);
}

populateLinks().catch(console.error);
