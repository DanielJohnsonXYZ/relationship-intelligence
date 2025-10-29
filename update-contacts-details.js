// Update contacts with LinkedIn URLs and emails from CSV
const API_URL = "https://relationship-intelligence.vercel.app";

const updates = [
  // High Priority contacts with LinkedIn
  { name: "Hannah Parvaz", linkedin_url: null, email: null },
  { name: "Jay Paul", linkedin_url: "https://www.linkedin.com/in/jaypaul/", email: null },
  { name: "Frank Manuel Saviane", linkedin_url: "https://www.linkedin.com/in/frankmanuelsaviane/", email: null },
  { name: "Alex Embery", linkedin_url: "https://www.linkedin.com/in/alexemberey/", email: null },
  { name: "Jerome Minney", linkedin_url: "https://www.linkedin.com/in/jeromeminney/", email: null },
  { name: "Yannick Koechlin", linkedin_url: "https://www.linkedin.com/in/yannickkoechlin/", email: null },
  { name: "Curran Dye", linkedin_url: "https://www.linkedin.com/in/currandye/", email: null },
  { name: "Rodger Planes", linkedin_url: "https://www.linkedin.com/in/rogerplanes/", email: null },
  { name: "Taj Kamranpour", linkedin_url: "https://www.linkedin.com/in/tkamranpour/", email: null },
  { name: "Afshin Moayed", linkedin_url: "https://www.linkedin.com/in/afshinmoayedsanandajirafii/", email: null },
  { name: "Vincent Tresno", linkedin_url: "https://www.linkedin.com/in/growth-hacking-zurich/", email: null },
  { name: "Pablo Asensio", linkedin_url: "https://www.linkedin.com/in/pabloasensio/", email: null },
  { name: "Renny Chan", linkedin_url: "https://www.linkedin.com/in/rennychan/", email: null },
  { name: "Randy Chee", linkedin_url: "https://www.linkedin.com/in/randy-chee-6152ab4/", email: null },
  { name: "Kirien Sangha", linkedin_url: "https://www.linkedin.com/in/kiriensangha/", email: null },
  { name: "Leroy Yau", linkedin_url: "https://www.linkedin.com/in/yauleroy/", email: null },
  { name: "Ping Wang", linkedin_url: "https://www.linkedin.com/in/hpwang/", email: null },
  { name: "Emily Y Wu", linkedin_url: "https://www.linkedin.com/in/emilyywu/", email: null },
  { name: "Elias Ek", linkedin_url: "https://www.linkedin.com/in/eliasek/", email: null },
  { name: "Elisa Chiu", linkedin_url: "https://www.linkedin.com/in/elisachiu/", email: null },
  { name: "Will Ting", linkedin_url: "https://www.linkedin.com/in/deeptree/", email: null },
  { name: "Mark McDonagh", linkedin_url: "https://www.linkedin.com/in/markmcdonagh1/", email: null },
  { name: "Patrick Gilday", linkedin_url: "https://www.linkedin.com/in/patrick-gilday-40a014187/", email: null },
  { name: "Ishaan Arya", linkedin_url: "https://www.linkedin.com/in/ishaan-arya-ba1b0856/", email: null },
  { name: "Shivang Gupta", linkedin_url: "https://www.linkedin.com/in/shivang-gupta-01121988/", email: null },
  { name: "Ivan Shyr", linkedin_url: "https://www.linkedin.com/in/ivan-shyr-b349431/", email: null },
  { name: "Muhammad Scarim", linkedin_url: "https://www.linkedin.com/in/mscarim/", email: null },
  { name: "Sam Patel", linkedin_url: "https://www.linkedin.com/in/samitptl", email: null },
  { name: "Sunny Singh", linkedin_url: "https://www.linkedin.com/in/sunnysinghldn/", email: null },
  { name: "Tristan Gillen", linkedin_url: "Tristan Gillen", email: null }, // No full URL in CSV
  { name: "Przemek Victor Pardel", linkedin_url: "https://www.linkedin.com/in/pardel/", email: null },
  { name: "Edmund To", linkedin_url: "https://www.linkedin.com/in/edmundto/", email: null },
  { name: "Vishal Gohel", linkedin_url: "https://www.linkedin.com/in/vishal-gohel-6aa55111/", email: null },
  { name: "Justin Hong", linkedin_url: "https://www.linkedin.com/in/justin-hong-a4392a1b/", email: null },
  { name: "Robert Lai", linkedin_url: "https://www.linkedin.com/in/robertjlai/", email: null },
  { name: "Amol Ghemud", linkedin_url: "https://www.linkedin.com/in/amolghemud/", email: null },
  { name: "Harrison Kim", linkedin_url: "https://www.linkedin.com/in/theharrisonkim/", email: null },
  { name: "Graham Hussey", linkedin_url: "https://www.linkedin.com/in/grahamhussey/", email: null },
  { name: "Saher Shodhan", linkedin_url: "https://www.linkedin.com/in/sahers/", email: null },
  { name: "Andrew Crump - dead", linkedin_url: "https://www.linkedin.com/in/andrewneilcrump/", email: null },
  { name: "Jake Steiner", linkedin_url: "https://www.linkedin.com/in/jakestainer", email: null },
  { name: "Raffi Salama", linkedin_url: "https://www.linkedin.com/in/raffisalama/", email: null },
  { name: "Alex Wilson", linkedin_url: "https://www.linkedin.com/in/alex-wilson/", email: null },
  { name: "Andrew Birt", linkedin_url: "https://www.linkedin.com/in/andrewbirt/", email: null },
  { name: "Ashish Khatri", linkedin_url: "https://www.linkedin.com/in/ashish-khatri-794a2113/", email: null },
  { name: "Jakub Krcmar", linkedin_url: "https://www.linkedin.com/in/jakubkrcmar/", email: null },
  { name: "Daniel Hsu", linkedin_url: "https://www.linkedin.com/in/danieldhsu/", email: null },
  { name: "Mike Mahon", linkedin_url: "https://www.linkedin.com/in/mikemahonmarketing/", email: null },
  { name: "David Ling", linkedin_url: "https://www.linkedin.com/in/ling-david", email: null },
  { name: "Mathieu Delafosse", linkedin_url: "https://www.linkedin.com/in/m-delafosse", email: null },
  { name: "Mustafa Syed", linkedin_url: "https://www.linkedin.com/in/mustafa-ahmed-syed/", email: null },
  { name: "Ludo De Angelis", linkedin_url: "https://www.linkedin.com/in/ludodeangelis/", email: null },
  { name: "Michael Taylor", linkedin_url: "https://www.linkedin.com/in/mjt145/", email: null },
  { name: "Holly Wright", linkedin_url: "https://www.linkedin.com/in/holly-wright-02940599/", email: null },
  { name: "Chuong Van Dang", linkedin_url: "https://www.linkedin.com/in/chuong-van-dang-24930713/", email: null },
  { name: "Rebecca Collins", linkedin_url: null, email: null },
  { name: "Jessica Rameau", linkedin_url: "https://www.linkedin.com/in/jessica-rameau-858bb039/", email: null },
  { name: "David Willbe", linkedin_url: "https://www.linkedin.com/in/david-willbe-95159630/", email: null },
  { name: "Stephen Kakouris", linkedin_url: "https://www.linkedin.com/in/stephen-kakouris-3835bb8a/", email: null },
  { name: "Foti Panagiotakopoulos", linkedin_url: "https://www.linkedin.com/in/fotis-panagio/", email: null },
  { name: "Anthony Gale", linkedin_url: null, email: null },
  { name: "Elizabeth Huang", linkedin_url: null, email: null },
  { name: "Trevor Hatfield", linkedin_url: null, email: null },
  { name: "Silja Litvin", linkedin_url: "https://www.linkedin.com/in/silja-litvin/", email: null },
  { name: "Matt Whitmore", linkedin_url: "https://www.linkedin.com/in/matthew-whitmore-ca-sa-559551148/", email: null },
  { name: "Tomer Levy", linkedin_url: "https://www.linkedin.com/in/tomerlevyprofile/", email: null },
  { name: "Jan-Philip Grabs", linkedin_url: "https://www.linkedin.com/in/jpgrabs/", email: null },
  { name: "Sam Sturm", linkedin_url: "https://www.linkedin.com/in/sam-sturm-6a20b526/", email: null },
  { name: "Jon Neff", linkedin_url: "https://www.linkedin.com/in/yoni-neff/", email: null },
  { name: "Omar Nawaz", linkedin_url: "Omar Nawaz", email: null }, // No full URL
  { name: "Hussain Karbalai", linkedin_url: "https://www.linkedin.com/in/hussainkarbalai/", email: null },
  { name: "Theresa Mathawaphan", linkedin_url: null, email: null },
  { name: "Ana Kravitz", linkedin_url: "https://www.linkedin.com/in/anakravitz/", email: null },
  { name: "Sharleen Lopez", linkedin_url: "https://www.linkedin.com/in/sharlenellopez/", email: null },
  { name: "Andrew Muir Wood", linkedin_url: null, email: null },
  { name: "Irina Sergeeva", linkedin_url: "https://www.linkedin.com/in/isergeeva/", email: null },
  { name: "Amit Patel", linkedin_url: "https://www.linkedin.com/in/amitpatel911/", email: null },
  { name: "Alexander Moldow", linkedin_url: "https://www.linkedin.com/in/alexandermoldow/", email: null },
  { name: "Maeva Cifuentes", linkedin_url: "https://www.linkedin.com/in/maevaeverywhere/", email: null },
  { name: "Harri Thomas", linkedin_url: "https://www.linkedin.com/in/hthomas2/", email: null },
  { name: "Mark Atkinson", linkedin_url: null, email: null },
  { name: "Leanne Beesley", linkedin_url: "https://www.linkedin.com/in/leannebeesley/", email: null },
  { name: "Darius Safavi", linkedin_url: "https://www.linkedin.com/in/dariussafavi/", email: null },
  { name: "Jeremy Basset", linkedin_url: "https://uk.linkedin.com/in/jeremybasset", email: null },
  { name: "David Pitchford", linkedin_url: "https://www.linkedin.com/in/dpitchford/", email: null },
  { name: "Marc Abraham", linkedin_url: "https://www.linkedin.com/in/abrahammarc/", email: null },
  { name: "Edward Angstadt", linkedin_url: "https://www.linkedin.com/in/edwardangstadt/", email: null },
  { name: "Sophie Tapper", linkedin_url: null, email: null },
  { name: "Sally Hilditch", linkedin_url: "https://www.linkedin.com/in/sally-hilditch-417504aa", email: null },
  { name: "Daniel Haymes", linkedin_url: "https://www.linkedin.com/in/daniel-haymes-36984192/", email: null },
  { name: "Stuart Brameld", linkedin_url: null, email: null },
  { name: "Itay Forer", linkedin_url: "https://www.linkedin.com/in/itayforer/", email: null },
  { name: "Jaron Soh", linkedin_url: "https://www.linkedin.com/in/jaronsoh/", email: null },
  { name: "Oliver Stocks", linkedin_url: null, email: "oliver.stocks@slingsbypartners.com" },
  { name: "Dave Joshua", linkedin_url: "https://www.linkedin.com/in/davejoshua", email: null },
  { name: "Marion Messmer", linkedin_url: "https://www.linkedin.com/in/marion-messmer-06b85353/", email: null },
  { name: "William Excel", linkedin_url: null, email: null },
  { name: "Martyna Karaś", linkedin_url: "https://www.linkedin.com/in/martyna-kara%C5%9B-a7086a138/", email: null },
  { name: "Joseph Buchanan", linkedin_url: "https://www.linkedin.com/in/joe-buchanan-7b1759193/", email: null },
  { name: "Onajite Emerhor", linkedin_url: "https://www.linkedin.com/in/onajite-emerhor-0850b1a6/", email: null },
  { name: "Kumaran Veluppillai", linkedin_url: "https://www.linkedin.com/in/kumaran-veluppillai/", email: null },
  { name: "Holly White", linkedin_url: "https://www.linkedin.com/in/holly-wright-marketing/", email: null },
  { name: "Rayan Alghusoon", linkedin_url: null, email: null },
  { name: "Alanah Chambers", linkedin_url: "https://www.linkedin.com/in/alanah-chambers/", email: null },
  { name: "Dave Feinman", linkedin_url: null, email: null },
  { name: "Joseph Fitzgibbon", linkedin_url: "https://www.linkedin.com/in/josephfitzgibbon/", email: null },
  { name: "Dilay Coban Oruc", linkedin_url: "https://www.linkedin.com/in/dilaycoban/", email: null },
  { name: "Anvee Bhutani", linkedin_url: "https://www.linkedin.com/in/anvee/", email: null },
  { name: "Mariah Parker", linkedin_url: null, email: null },
  { name: "Jan Molenkamp", linkedin_url: "https://www.linkedin.com/in/jan-molenkamp-msc-mba-interim-management-deployment-and-turnarounds-greater-china-and-southeast-asia/", email: null },
  { name: "Peter O'Donoghue", linkedin_url: "https://www.linkedin.com/in/peterodonoghue/", email: null },
  { name: "Josh Lloyd", linkedin_url: null, email: null },
  { name: "Iulia Barau", linkedin_url: "https://www.linkedin.com/in/iulia-barau/", email: null },
  { name: "Steve Squires", linkedin_url: "uk.linkedin.com/in/stevesquires", email: null },
  { name: "Cordel Robbin-Coker", linkedin_url: "https://www.linkedin.com/in/cordelrc/", email: null },
  { name: "Philip Keenan", linkedin_url: "https://www.linkedin.com/in/philipkeenan-uk/", email: null },
  { name: "Megan Davis", linkedin_url: "https://www.linkedin.com/in/megan-davis-43018a129/", email: null },
  { name: "Harry Gadsby", linkedin_url: "https://www.linkedin.com/in/harrygadsby/", email: null },
  { name: "Michael Wu", linkedin_url: "https://www.linkedin.com/in/wumichaelm/", email: null },
];

async function updateContacts() {
  console.log(`Starting update for ${updates.length} contacts...\n`);

  // Get all people first
  const peopleRes = await fetch(`${API_URL}/api/people`);
  const people = await peopleRes.json();

  let updateCount = 0;
  let skipCount = 0;

  for (const update of updates) {
    // Find the person in the database
    const person = people.find(p => p.name === update.name);

    if (!person) {
      skipCount++;
      continue;
    }

    // Only update if there's new information
    const needsUpdate =
      (update.linkedin_url && !person.linkedin_url) ||
      (update.email && !person.email);

    if (!needsUpdate) {
      skipCount++;
      continue;
    }

    try {
      const updateData = {};
      if (update.linkedin_url && !person.linkedin_url) {
        updateData.linkedin_url = update.linkedin_url;
      }
      if (update.email && !person.email) {
        updateData.email = update.email;
      }

      const response = await fetch(`${API_URL}/api/people/${person.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        updateCount++;
        console.log(`✓ Updated: ${person.name}`);
      } else {
        console.log(`✗ Failed: ${person.name}`);
      }
    } catch (error) {
      console.log(`✗ Error: ${person.name}`);
    }

    // Small delay
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  console.log(`\n${"=".repeat(60)}`);
  console.log(`✓ Update complete!`);
  console.log(`  Updated: ${updateCount}`);
  console.log(`  Skipped: ${skipCount}`);
  console.log(`${"=".repeat(60)}\n`);
}

updateContacts().catch(console.error);
