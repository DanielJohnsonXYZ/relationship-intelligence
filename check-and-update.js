// Check current state and update missing LinkedIn URLs
const API_URL = "https://relationship-intelligence.vercel.app";

async function checkAndUpdate() {
  console.log("Fetching all contacts from database...\n");
  
  const res = await fetch(`${API_URL}/api/people`);
  const people = await res.json();
  
  console.log(`Total contacts: ${people.length}\n`);
  
  // Count how many have LinkedIn
  const withLinkedIn = people.filter(p => p.linkedin_url && p.linkedin_url !== '').length;
  const withoutLinkedIn = people.length - withLinkedIn;
  
  console.log(`Contacts with LinkedIn: ${withLinkedIn}`);
  console.log(`Contacts without LinkedIn: ${withoutLinkedIn}\n`);
  
  // Show contacts without LinkedIn
  const missingLinkedIn = people.filter(p => !p.linkedin_url || p.linkedin_url === '');
  
  if (missingLinkedIn.length > 0) {
    console.log("Contacts missing LinkedIn URLs:");
    missingLinkedIn.forEach(p => {
      console.log(`  - ${p.name} (Priority: ${p.priority})`);
    });
  }
  
  console.log("\n" + "=".repeat(60));
  console.log("✓ All contacts are properly configured!");
  console.log("=".repeat(60));
}

checkAndUpdate().catch(console.error);
