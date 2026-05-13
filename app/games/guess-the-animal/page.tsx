'use client';

import { useCallback, useMemo, useState } from 'react';
import allEmojis from '../../../data/emojis.json';
import Breadcrumb from '@/components/Breadcrumb';

type AnimalEntry = {
  char: string;
  name: string;
  slug: string;
  subgroup: string;
};

const ANIMAL_SUBGROUPS = new Set([
  'animal-mammal',
  'animal-bird',
  'animal-amphibian',
  'animal-reptile',
  'animal-marine',
  'animal-bug',
]);

const ANIMALS: AnimalEntry[] = (
  allEmojis as {
    char: string;
    name: string;
    slug: string;
    subgroup: string;
  }[]
).filter((e) => ANIMAL_SUBGROUPS.has(e.subgroup) && e.char);

const FUN_FACTS: Record<string, string> = {
  ant: 'Ants can carry up to 50 times their own body weight — the equivalent of a human lifting a car.',
  'baby chick':
    'Baby chicks can communicate with their mother while still inside the egg.',
  badger:
    'Badgers are the fastest digging animals on Earth, able to bury themselves in seconds.',
  bat: 'Bats are the only mammals capable of sustained flight, and they navigate in total darkness using echolocation.',
  bear: 'Bears have an exceptional sense of smell — about 7 times better than a bloodhound.',
  beaver:
    'Beaver teeth never stop growing and are orange due to iron-reinforced enamel.',
  beetle: 'Beetles make up about 25% of all known animal species on Earth.',
  bird: 'Birds are the only living descendants of the dinosaurs — technically, they are dinosaurs.',
  bison:
    'American bison can run at 65 km/h (40 mph) and pivot quickly despite weighing nearly a tonne.',
  'black bird':
    'Blackbirds can remember the faces of specific humans and will alter their behaviour around those they consider threats.',
  'black cat':
    'Black cats were considered good luck in ancient Egypt and Japan.',
  blowfish:
    'The blowfish inflates by gulping water, expanding up to three times its normal size to deter predators.',
  boar: 'Wild boars have excellent memories and can remember the locations of hundreds of food sources.',
  bug: 'Insects make up around 80% of all animal species and are vital to nearly every ecosystem on Earth.',
  butterfly:
    'Butterflies taste with their feet — they have taste sensors on their tarsi to detect if a plant is edible.',
  camel:
    'Camel humps store fat, not water — they can convert that fat into energy and water during long journeys.',
  cat: 'Cats spend around 70% of their lives sleeping — roughly 13–16 hours a day.',
  'cat face':
    "A cat's purr vibrates at 25–150 Hz, a frequency that can promote bone healing and reduce stress.",
  chicken:
    'Chickens have better colour vision than humans and can see ultraviolet light.',
  chipmunk:
    'Chipmunks can carry up to 9 nuts at a time in their cheek pouches, which stretch to three times the size of their head.',
  cockroach:
    'Cockroaches can survive up to a week without their head — they die of thirst rather than the injury.',
  coral:
    'Coral reefs cover less than 1% of the ocean floor but support 25% of all marine species.',
  cow: 'Cows have best friends and show signs of stress when separated from them.',
  'cow face':
    'Cows can recognise over 100 other cows by their faces and calls.',
  crab: 'Crabs communicate by drumming or waving their claws, and some species can walk up to 1.6 km/h sideways.',
  cricket: 'Crickets "hear" through tympanic organs on their front legs.',
  crocodile:
    'Crocodiles have remained virtually unchanged for over 200 million years, surviving the asteroid that wiped out the dinosaurs.',
  deer: 'Male deer grow a new set of antlers every year — the fastest-growing tissue of any mammal.',
  dodo: 'Dodos went extinct around 1681, less than 100 years after humans first encountered them on Mauritius.',
  dog: "Dogs have a sense of smell estimated to be 10,000 to 100,000 times more powerful than a human's.",
  'dog face':
    'Dogs can detect certain diseases — including some cancers — by smell alone.',
  dolphin:
    'Dolphins have individual names for each other and call out to specific individuals using unique whistle signatures.',
  donkey:
    'Donkeys have an excellent memory and can recall places and animals they met up to 25 years earlier.',
  dove: 'Doves mate for life and both parents take turns incubating the eggs.',
  dragon:
    'The Komodo dragon is the largest living lizard and can run at up to 20 km/h.',
  'dragon face':
    'Dragon imagery appears independently in cultures across every inhabited continent.',
  duck: 'Ducks have waterproof feathers thanks to a special oil gland near their tail that they spread during preening.',
  eagle:
    "Eagles can spot a rabbit from 3.2 km (2 miles) away — their vision is 4–8 times sharper than a human's.",
  elephant:
    'Elephants are the only non-human animals that hold funeral-like rituals for their dead and mourn their losses.',
  ewe: 'Sheep can recognise up to 50 other sheep faces and remember them for years.',
  feather:
    'A single feather is incredibly complex — a large flight feather can have over a million interlocking barbules.',
  fish: 'Fish have been on Earth for more than 500 million years, longer than dinosaurs.',
  flamingo:
    'Flamingos are not naturally pink — they get their colour from the carotenoid pigments in their diet of algae and shrimp.',
  fly: 'A housefly beats its wings around 200 times per second and can taste food by landing on it.',
  fox: "Foxes use Earth's magnetic field to judge distance and direction when pouncing on prey under snow.",
  frog: 'Frogs absorb water through their skin rather than drinking it — they never actually need to drink.',
  giraffe:
    'Giraffes have the same number of neck vertebrae as humans (7) — each one just much larger.',
  goat: 'Goats were one of the first animals domesticated by humans, around 10,000 years ago.',
  goose:
    'Geese fly in a V formation to save energy — each bird benefits from the updraft of the one ahead.',
  gorilla:
    'Gorillas share 98.3% of their DNA with humans and use over 25 distinct vocalisations to communicate.',
  'guide dog':
    'Guide dogs can memorise up to 50 commands and make independent decisions to keep their owner safe.',
  hamster: 'Hamsters can run up to 8 km (5 miles) per night on their wheel.',
  'hatching chick':
    'Chicks start communicating with their mother through calls while still inside the egg, up to 24 hours before hatching.',
  hedgehog:
    'Hedgehogs are immune to many snake venoms and can survive bites from vipers.',
  hippopotamus:
    'Despite their bulk, hippos are faster than humans on land — reaching 30 km/h in short bursts.',
  honeybee:
    'A single honeybee produces only about 1/12 teaspoon of honey in its entire lifetime.',
  horse:
    'Horses can sleep both standing up and lying down — they lock their legs to doze upright.',
  'horse face':
    'Horses communicate emotions through their ears; they have 16 muscles in each ear for precise movement.',
  jellyfish:
    'The immortal jellyfish (Turritopsis dohrnii) can revert to its juvenile form after reaching adulthood, potentially living forever.',
  kangaroo:
    'A baby kangaroo (joey) is about the size of a grape when born and lives in the pouch for up to a year.',
  koala:
    'Koalas sleep up to 22 hours a day to conserve energy while digesting their toxic eucalyptus diet.',
  'lady beetle':
    "Ladybirds (ladybugs) can eat up to 5,000 aphids in their lifetime, making them a gardener's best friend.",
  leopard:
    'Leopards are the strongest climbers among big cats and will haul prey twice their weight up into a tree.',
  lion: "A lion's roar can be heard from 8 km (5 miles) away and is used to communicate with the pride.",
  lizard:
    'Some lizard species can detach their tails as a distraction for predators and then regrow them.',
  llama:
    'Llamas communicate displeasure by spitting — but usually at each other, not at humans.',
  lobster:
    'Lobsters taste and smell with their legs, and their teeth are in their stomach.',
  mammoth:
    'Woolly mammoths were alive as recently as 4,000 years ago, when the Egyptian pyramids were already ancient.',
  microbe:
    'There are more microbes in a teaspoon of healthy soil than there are people on Earth.',
  monkey:
    'Monkeys have been observed using tools, solving puzzles, and even bartering — behaviours once thought uniquely human.',
  'monkey face':
    'Capuchin monkeys wash their hands and feet with urine, believed to be a social signal and insect repellent.',
  moose:
    "A moose's antlers can span up to 1.8 m (6 ft) across and are shed and regrown every year.",
  mosquito:
    'Only female mosquitoes bite — they need blood proteins to produce eggs.',
  mouse:
    'Mice are highly social animals and have been shown to display empathy, feeling distress when other mice are in pain.',
  'mouse face':
    'Mice communicate using ultrasonic calls too high-pitched for humans to hear.',
  octopus:
    'Octopuses have three hearts, blue blood, and can edit their own RNA to adapt to temperature changes.',
  orangutan:
    'Orangutans are the most intelligent non-human primates and have been observed using leaves as umbrellas.',
  otter:
    'Sea otters hold hands while sleeping so they don\'t drift apart — the group is called a "raft".',
  owl: 'Owls can rotate their heads up to 270° because they cannot move their eyeballs — their eyes are fixed in their sockets.',
  ox: 'Oxen have been used as working animals for over 6,000 years and were critical to the development of agriculture.',
  oyster:
    'Oysters can change sex throughout their lives and filter up to 190 litres of water per day.',
  panda:
    'Giant pandas have a false thumb — an enlarged wrist bone that helps them grip bamboo — and eat up to 38 kg of it a day.',
  parrot:
    "Parrots don't just mimic speech — they can learn the meaning of words and use them in context.",
  'paw prints': "Every dog's nose print is unique, like a human fingerprint.",
  peacock:
    "A peacock's elaborate tail accounts for 60% of its total body length and is used purely to attract mates.",
  penguin:
    'Penguins propose to their mate by presenting them with a pebble — if accepted, they may stay together for life.',
  phoenix:
    'The phoenix myth appears independently in ancient Egyptian, Greek, Persian, and Chinese mythology.',
  pig: 'Pigs are considered the 4th most intelligent animal and can play video games with joysticks better than some primates.',
  'pig face':
    'Pigs have no sweat glands and wallow in mud to regulate their body temperature.',
  'pig nose':
    "A pig's snout contains 1,113 scent receptors — it's one of the most sensitive noses in the animal kingdom.",
  'polar bear':
    'Polar bear fur is actually transparent — it appears white because it scatters visible light.',
  poodle:
    'Poodles were originally bred as water retrievers, and their distinctive haircut was designed to protect their joints in cold water.',
  rabbit:
    'Rabbits perform a joyful jumping and twisting leap called a "binky" when they are happy.',
  'rabbit face':
    'Rabbits can see nearly 360° around them but have a blind spot directly in front of their nose.',
  raccoon:
    'Raccoons have highly dexterous front paws with nearly as many nerve endings as human hands.',
  ram: 'Rams compete by running at each other at up to 32 km/h — their skulls have a double-layered shock-absorbing structure.',
  rat: 'Rats laugh when tickled — at a frequency too high for humans to hear without special equipment.',
  rhinoceros:
    'A rhinoceros horn is made entirely of keratin — the same protein as human fingernails.',
  rooster:
    'Roosters perform a "cock-a-doodle-doo" before dawn even in total darkness, driven by their internal circadian clock.',
  sauropod:
    'Sauropod dinosaurs were the largest animals to ever walk the Earth, some reaching 37 m (120 ft) in length.',
  scorpion:
    'Scorpions glow under ultraviolet light due to fluorescent chemicals in their exoskeleton.',
  seal: 'Seals can slow their heartbeat to as few as 4 beats per minute to conserve oxygen when diving.',
  'service dog':
    "Service dogs can detect a diabetic's blood sugar drop before any medical device can.",
  shark:
    'Sharks are older than trees — sharks have existed for over 450 million years while trees appeared around 350 million years ago.',
  shrimp:
    'Mantis shrimp can punch with the force of a bullet and see 16 types of colour receptors (humans have 3).',
  skunk:
    'Skunks can spray their defensive musk up to 3 metres with remarkable accuracy.',
  sloth:
    'Sloths move so slowly that algae grows on their fur, providing camouflage and a nutritional supplement.',
  snail:
    'Snails can sleep for up to 3 years if the climate is too dry or cold.',
  snake:
    'Snakes smell with their tongues — they flick their forked tongue to collect scent particles from the air.',
  spider:
    'Spider silk is stronger than steel by weight and more elastic than nylon.',
  'spider web':
    'Spider webs are coated in a glue that does not dry out, keeping them sticky indefinitely.',
  'spiral shell':
    'The nautilus shell grows in a perfect logarithmic spiral, a pattern that appears throughout nature.',
  'spouting whale':
    'Blue whales are the largest animals ever known to have lived on Earth, reaching up to 30 m (100 ft) in length.',
  squid:
    'Squid have the largest eyes in the animal kingdom — up to 30 cm (12 inches) in diameter in giant squid.',
  swan: 'Swans mate for life and can live for over 20 years, raising multiple generations of cygnets together.',
  'T-Rex':
    'T. rex had arms too short to reach its own mouth, but they were strong enough to lift 200 kg.',
  tiger:
    'No two tigers have the same stripe pattern — stripes are as unique as human fingerprints.',
  'tiger face':
    'Tigers are the largest wild cats in the world and are strong swimmers, often cooling off in lakes and streams.',
  'tropical fish':
    'Clownfish can change sex — all clownfish are born male, and the dominant fish in a group becomes female.',
  turkey:
    'Wild turkeys can run at 40 km/h and fly at up to 88 km/h in short bursts.',
  turtle:
    'Sea turtles return to the same beach where they were born to lay their own eggs, decades later.',
  'two-hump camel':
    'Bactrian camels (two humps) can drink 57 litres of water in 10 minutes after being dehydrated.',
  unicorn:
    'The unicorn is the national animal of Scotland, chosen for its symbolic association with power and independence.',
  'water buffalo':
    'Water buffalo have been domesticated for over 5,000 years and are essential to rice farming across Asia.',
  whale:
    'Humpback whales compose complex songs that can last up to 20 minutes and evolve culturally across populations.',
  wing: 'The wandering albatross has the largest wingspan of any living bird — up to 3.5 m (11.5 ft).',
  wolf: 'Wolves howl to communicate location over long distances; each wolf has a unique howl voice.',
  worm: 'Earthworms have 5 pairs of hearts and can regenerate lost segments in some species.',
  zebra:
    "Each zebra's stripe pattern is unique, and stripes may confuse predators by making it hard to pick out one animal from the herd.",
};

function getFact(name: string): string {
  return (
    FUN_FACTS[name] ??
    `The ${name} is one of ${ANIMALS.length} animal emojis in the Unicode standard.`
  );
}

function pickRandom(exclude?: AnimalEntry): AnimalEntry {
  const pool = exclude
    ? ANIMALS.filter((a) => a.slug !== exclude.slug)
    : ANIMALS;
  return pool[Math.floor(Math.random() * pool.length)];
}

function buildChoices(correct: AnimalEntry): string[] {
  const wrong = new Set<string>();
  while (wrong.size < 3) {
    const candidate = pickRandom(correct);
    wrong.add(candidate.name);
  }
  const choices = [correct.name, ...wrong];
  for (let i = choices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [choices[i], choices[j]] = [choices[j], choices[i]];
  }
  return choices;
}

function newRound(exclude?: AnimalEntry) {
  const current = pickRandom(exclude);
  return { current, choices: buildChoices(current) };
}

type HistoryRow = {
  emoji: string;
  name: string;
  guessed: string;
  correct: boolean;
};

const SUBGROUP_LABEL: Record<string, string> = {
  'animal-mammal': '🦁 Mammal',
  'animal-bird': '🐦 Bird',
  'animal-amphibian': '🐸 Amphibian',
  'animal-reptile': '🦎 Reptile',
  'animal-marine': '🐠 Marine',
  'animal-bug': '🐛 Bug',
};

export default function GuessTheAnimalPage() {
  const [{ current, choices }, setRound] = useState(() => newRound());
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [total, setTotal] = useState(0);
  const [history, setHistory] = useState<HistoryRow[]>([]);

  const revealed = selected !== null;
  const isCorrect = selected === current.name;
  const fact = getFact(current.name);

  const handleGuess = useCallback(
    (choice: string) => {
      if (revealed) return;
      setSelected(choice);
      const correct = choice === current.name;
      setTotal((t) => t + 1);
      if (correct) {
        setScore((s) => s + 1);
        setStreak((s) => {
          const next = s + 1;
          setBestStreak((b) => Math.max(b, next));
          return next;
        });
      } else {
        setStreak(0);
      }
      setHistory((prev) =>
        [
          { emoji: current.char, name: current.name, guessed: choice, correct },
          ...prev,
        ].slice(0, 15),
      );
    },
    [current, revealed],
  );

  function nextRound() {
    setRound(newRound(current));
    setSelected(null);
  }

  function resetStats() {
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setTotal(0);
    setHistory([]);
    setRound(newRound());
    setSelected(null);
  }

  const accuracy = useMemo(
    () => (total > 0 ? Math.round((score / total) * 100) : null),
    [score, total],
  );

  return (
    <div className="mx-auto max-w-2xl p-4 space-y-6">
      <Breadcrumb
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Games', href: '/games' },
          { label: 'Guess the Animal' },
        ]}
      />

      <div>
        <h1 className="text-2xl font-semibold">Guess the Animal 🐾</h1>
        <p className="text-sm text-gray-500 mt-1">
          Which animal does this emoji represent? Choose from 4 options.
        </p>
      </div>

      {/* Stats bar */}
      <div className="flex gap-3 text-sm flex-wrap">
        <span className="bg-green-50 text-green-700 rounded-lg px-3 py-1.5 font-medium">
          ✅ {score} correct
        </span>
        <span className="bg-orange-50 text-orange-600 rounded-lg px-3 py-1.5 font-medium">
          🔥 Streak: {streak}
        </span>
        <span className="bg-blue-50 text-blue-700 rounded-lg px-3 py-1.5 font-medium">
          ⭐ Best: {bestStreak}
        </span>
        {accuracy !== null && (
          <span className="bg-gray-50 text-gray-600 rounded-lg px-3 py-1.5 font-medium">
            🎯 {accuracy}% accuracy
          </span>
        )}
      </div>

      {/* Emoji display */}
      <div className="border rounded-2xl p-10 flex flex-col items-center gap-3 bg-white shadow-sm">
        <div className="text-9xl leading-none select-none">{current.char}</div>
        <span className="text-xs bg-gray-100 text-gray-500 rounded-full px-3 py-1">
          {SUBGROUP_LABEL[current.subgroup] ?? current.subgroup}
        </span>
        <p className="text-sm text-gray-400">What animal is this?</p>
      </div>

      {/* Choices */}
      <div className="grid grid-cols-2 gap-3">
        {choices.map((choice) => {
          let cls =
            'rounded-xl border-2 px-4 py-3 text-sm font-medium transition text-left w-full capitalize ';
          if (!revealed) {
            cls += 'hover:bg-gray-50 border-gray-200 cursor-pointer';
          } else if (choice === current.name) {
            cls += 'border-green-500 bg-green-50 text-green-700';
          } else if (choice === selected) {
            cls += 'border-red-400 bg-red-50 text-red-600';
          } else {
            cls += 'border-gray-100 text-gray-400 bg-gray-50';
          }
          return (
            <button
              key={choice}
              className={cls}
              onClick={() => handleGuess(choice)}
              disabled={revealed}
            >
              {revealed && choice === current.name && '✅ '}
              {revealed &&
                choice === selected &&
                choice !== current.name &&
                '❌ '}
              {choice}
            </button>
          );
        })}
      </div>

      {/* Result + fun fact */}
      {revealed && (
        <div
          className={`rounded-2xl p-5 space-y-2 ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}
        >
          <p
            className={`text-lg font-semibold ${isCorrect ? 'text-green-700' : 'text-red-600'}`}
          >
            {isCorrect ? '🎉 Correct!' : `❌ It's a ${current.name}!`}
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            💡 <strong>Fun fact:</strong> {fact}
          </p>
          <button
            onClick={nextRound}
            className="mt-1 rounded-xl bg-blue-600 text-white px-6 py-2.5 font-medium hover:bg-blue-700 transition text-sm"
          >
            Next Animal →
          </button>
        </div>
      )}

      {/* History table */}
      {history.length > 0 && (
        <div className="border rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-base">Recent rounds</h2>
            <button
              onClick={resetStats}
              className="text-sm text-gray-400 hover:text-gray-600"
            >
              Reset
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 text-xs uppercase tracking-wide">
                  <th className="pb-2 pr-4">Emoji</th>
                  <th className="pb-2 pr-4">Animal</th>
                  <th className="pb-2 pr-4">Your answer</th>
                  <th className="pb-2">Result</th>
                </tr>
              </thead>
              <tbody>
                {history.map((row, i) => (
                  <tr key={i} className="border-t">
                    <td className="py-2 pr-4 text-2xl">{row.emoji}</td>
                    <td className="py-2 pr-4 capitalize">{row.name}</td>
                    <td
                      className={`py-2 pr-4 capitalize ${row.correct ? 'text-green-600' : 'text-red-500'}`}
                    >
                      {row.guessed}
                    </td>
                    <td className="py-2">{row.correct ? '✅' : '❌'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <p className="text-xs text-gray-400 pb-4">
        {ANIMALS.length} animal emojis across mammals, birds, reptiles,
        amphibians, marine life, and bugs.
      </p>
    </div>
  );
}
