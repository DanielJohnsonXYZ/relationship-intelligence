// Generate test messages for top contacts
// This will create signals and generate AI messages

const API_URL = "https://relationship-intelligence.vercel.app";

// First, let's add some signals for specific people
const testSignals = [
  {
    person_name: "Kumaran Veluppillai",
    signal: {
      signal_type: "job_change",
      title: "Started new role at Prolific",
      description: "Recently got married and started working at Prolific",
      source: "manual",
    }
  },
  {
    person_name: "Jake Steiner",
    signal: {
      signal_type: "social_post",
      title: "Active in Barcelona startup scene",
      description: "Been posting about Barcelona tech community",
      source: "manual",
    }
  },
  {
    person_name: "Silja Litvin",
    signal: {
      signal_type: "funding",
      title: "eQuoo raised funding",
      description: "Successfully raised money for eQuoo mental health platform",
      source: "manual",
    }
  },
];

async function generateMessages() {
  console.log("Step 1: Fetching all people...\n");

  // Get all people
  const peopleRes = await fetch(`${API_URL}/api/people`);
  const people = await peopleRes.json();

  console.log(`Found ${people.length} people in database\n`);

  // Find top 5 priority people who are due for contact
  const topPeople = people
    .filter(p => p.priority >= 8)
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 5);

  console.log(`Top 5 high-priority contacts:\n`);
  topPeople.forEach((p, i) => {
    console.log(`  ${i+1}. ${p.name} (Priority: ${p.priority})`);
  });

  console.log(`\n${"=".repeat(60)}`);
  console.log(`Step 2: Generating AI messages...\n`);

  for (const person of topPeople) {
    try {
      console.log(`Generating message for ${person.name}...`);

      const response = await fetch(`${API_URL}/api/messages/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          person_id: person.id,
        }),
      });

      if (response.ok) {
        const message = await response.json();
        console.log(`✓ Generated message for ${person.name}`);
        console.log(`  Preview: ${message.draft.substring(0, 80)}...`);
        console.log(`  Reasoning: ${message.ai_reasoning?.substring(0, 80)}...\n`);
      } else {
        const error = await response.text();
        console.log(`✗ Failed for ${person.name}: ${error}\n`);
      }

      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.log(`✗ Error for ${person.name}: ${error.message}\n`);
    }
  }

  console.log(`${"=".repeat(60)}`);
  console.log(`\n✓ Message generation complete!`);
  console.log(`\nVisit: ${API_URL}/dashboard to review your messages!\n`);
}

generateMessages().catch(console.error);
