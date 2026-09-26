/** In-app community rules — productized from handoff/SERVER_RULES.md (21 locks). */
export interface ServerRule {
  id: number;
  title: string;
  body: string;
}

export const SERVER_RULES: ServerRule[] = [
  {
    id: 1,
    title: '🌈 You Do Not Have to Be Male or Gay to Play',
    body: 'Anyone may join and participate as long as they respect the world, the players, and the rules.\n\nHowever, characters in Virilion must be adult male characters who are gay or male-attracted.\n\nThis is part of the world concept. Virilion is a male-only fantasy realm centered around male characters, male relationships, brotherhood, romance, rivalry, lineage, and queer mythic fantasy.\n\nYou can be any gender or sexuality in real life. Your character just needs to fit the setting.',
  },
  {
    id: 2,
    title: '🏳️\u200d⚧️ Trans Men Are Welcome',
    body: 'Trans men are men. Period.\n\nIf you are playing a trans male character and want that character to keep some anatomy or reproductive traits traditionally associated with female anatomy, that fits naturally within Virilion through the Sorns.\n\nSorns are a lore-friendly people connected to balance, lineage, sacred water, healing, dreams, continuation, and hidden memory.\n\nYou do not have to explain your real body, identity, or personal life to anyone. Character anatomy and lore should only be discussed when relevant to the character and handled respectfully.',
  },
  {
    id: 3,
    title: '🔞 Characters Must Be Adults',
    body: "All roleplay characters must be adults.\n\nNo child characters. (except NPCs)\nNo teen romance. Period.\nNo sexualized minors. Period.\nNo “technically ancient but looks underage” loopholes. A Smol is the closest thing you're going to get.\n\nKeep it clear. Keep it adult.",
  },
  {
    id: 4,
    title: '❤️ Respect Other Players',
    body: 'Treat other players with basic respect.\n\nNo harassment, bullying, stalking, threats, doxxing, slurs, hate speech, or targeted cruelty.\n\nIn-character conflict is allowed. Out-of-character disrespect is not.\n\nYour character can be messy. You cannot.',
  },
  {
    id: 5,
    title: '🤝 Consent Matters in Roleplay',
    body: 'Ask before escalating a scene.\n\nYou need consent before major things like:\n\nRomance  \nHeavy flirting  \nSexual tension becoming explicit  \nMajor injury  \nCaptivity  \nBetrayal plots  \nCurses  \nMind control  \nDeath  \nPublic humiliation  \nMajor trauma scenes  \nAnything that permanently changes another character  \n\nDo not force another player’s character to react, feel, lose, love, submit, forgive, or die.\n\nYou control your character. They control theirs.',
  },
  {
    id: 6,
    title: '⚔️ No Godmodding',
    body: 'Do not make your character unbeatable, untouchable, all-knowing, or impossible to challenge.\n\nDo not decide your attack automatically hits.  \nDo not decide another character is scared of you.  \nDo not decide another character is in love with you.  \nDo not decide another character loses unless the other player agrees.\n\nPowerful is fine. Perfect is boring.',
  },
  {
    id: 7,
    title: '👁️ No Metagaming',
    body: 'Do not use information you know as a player unless your character would reasonably know it too.\n\nIf a secret is posted in a private scene, your character does not magically know it.\n\nIf someone reveals something in their character bio, your character does not automatically know it.\n\nLet secrets breathe. It makes the story better.',
  },
  {
    id: 8,
    title: '🧾 Keep Character Creation Organized',
    body: 'Use the character creation template.\n\nCharacters should include:\n\nName  \nAge  \nPeople  \nStyle  \nClass  \nRole  \nStarting city or region  \nAppearance  \nPersonality  \nBackground  \nMotivation  \nFlaw  \nSecret  \nStrengths  \nWeaknesses  \nRoleplay preferences  \nOpen connections  \n\nCustom styles and custom classes are allowed, but they must be approved by a Game Master.',
  },
  {
    id: 9,
    title: '✨ Custom Styles and Classes Need Approval',
    body: 'Custom options are welcome, but they need to fit the world.\n\nA custom style or custom class should be:\n\nClear  \nBalanced  \nPlayable  \nEasy for others to understand  \nConnected to Virilion’s tone  \nNot stronger than existing options  \n\nA Game Master may ask you to adjust a custom idea so the server stays fair and readable.\n\nThis is not to kill creativity. It is to keep the world from becoming chaos soup.',
  },
  {
    id: 10,
    title: '🎲 Game Master Decisions Matter',
    body: 'Game Masters help maintain the story, approve custom options, resolve confusion, guide events, and protect the realm’s balance.\n\nYou can ask questions.  \nYou can suggest changes.  \nYou can respectfully appeal a decision.\n\nDo not argue endlessly, rules-lawyer scenes to death, or derail the community because you did not get your way.',
  },
  {
    id: 11,
    title: '🗺️ Use the Right Places',
    body: 'Use the correct in-app places for the correct content.\n\nCharacter creation stays in the Rite of Making.  \nLore questions go to Codex / GM.  \nCity roleplay goes in the matching Map place / scene room.  \nArt stays in art spaces when those open.  \nOut-of-character notes stay clearly marked OOC.\n\nDo not flood scene rooms with unrelated conversations.',
  },
  {
    id: 12,
    title: '🌶️ NSFW and Adult Content Must Stay Controlled',
    body: 'Virilion can have mature themes, romance, flirtation, desire, violence, horror, tragedy, and sexy energy.\n\nThat does not mean anything goes everywhere.\n\nExplicit sexual content, if allowed by the server structure, must stay in properly marked adult scene rooms and follow these community rules.\n\nDo not bring explicit content into general Realm / Map surfaces.\n\nNo sexual content involving minors, underage-looking characters, coercion presented as sexy, or anything that violates consent rules.\n\nWhen in doubt, fade to black.',
  },
  {
    id: 13,
    title: '⚠️ Use Content Warnings When Needed',
    body: 'Use a warning before intense content.\n\nExamples:\n\nViolence  \nGore  \nSexual themes  \nAbuse themes  \nPanic attacks  \nBody horror  \nDeath  \nGrief  \nMind control  \nPregnancy or birth-related lore  \nHeavy trauma  \nReligious horror  \n\nYou do not have to over-explain, but give people enough warning to choose whether they want to engage.\n\nExample:\n\nContent warning: body horror, blood, panic.',
  },
  {
    id: 14,
    title: '🚫 No Real-World Bigotry',
    body: 'No racism, sexism, homophobia, transphobia, ableism, antisemitism, Islamophobia, or other real-world hate.\n\nVirilion may include fictional prejudice, political tension, class conflict, rival cultures, or spiritual conflict, but it should not be used as an excuse to target real people or real marginalized groups.\n\nIf a topic is sensitive, handle it with care or ask a Game Master first.',
  },
  {
    id: 15,
    title: '🎭 Keep Drama In Character',
    body: 'Character drama is encouraged.\n\nPlayer drama is exhausting.\n\nRivalries, betrayals, jealousy, flirting, heartbreak, alliances, and messy fantasy politics are all welcome when everyone involved is having fun.\n\nDo not turn roleplay conflict into personal attacks.',
  },
  {
    id: 16,
    title: '🔕 Do Not Spam or Derail',
    body: 'Do not spam messages, images, pings, memes, or repeated jokes in serious scene rooms.\n\nDo not derail active roleplay scenes unless invited.\n\nDo not constantly interrupt other people’s stories to make everything about your character.\n\nEveryone deserves space to play.',
  },
  {
    id: 17,
    title: '🎨 Respect Art and Character Ownership',
    body: 'Do not steal, repost, trace, edit, or claim someone else’s art or character without permission.\n\nIf you use AI-generated images, Picrews, references, commissions, or found images, be honest about what they are and follow the place guidelines.\n\nDo not use someone else’s character in your writing without asking.',
  },
  {
    id: 18,
    title: '🕯️ Keep the World Collaborative',
    body: 'Virilion is a shared world.\n\nThat means you should:\n\nMake room for other characters  \nAsk people to plot  \nOffer scene hooks  \nBuild relationships  \nRespect boundaries  \nLet other people be cool too  \nHelp new players understand where to start  \n\nThe goal is not to “win” roleplay. The goal is to make the world feel alive.',
  },
  {
    id: 19,
    title: '📜 Ask Before Creating Major Lore',
    body: 'Please ask a Game Master before introducing major world-changing lore.\n\nThis includes:\n\nSecret gods  \nRoyal bloodlines  \nAncient plague answers  \nWorld-ending relics  \nNew races or peoples  \nReality-breaking powers  \nMajor factions  \nAncient prophecies  \nMagic systems outside the current lore  \nAnything that changes the whole setting  \n\nSmall personal lore is fine. Big canon needs approval.',
  },
  {
    id: 20,
    title: '💅 Be Hot and Useful',
    body: 'Bring energy.  \nBring creativity.  \nBring drama.  \nBring pretty men with problems.\n\nBut also be useful.\n\nRead the guides. Respect places and scene rooms. Ask questions. Help people. Make scenes easier to join. Do not make the community harder to run.\n\nVirilion is magical, sexy, dangerous, emotional, and weird on purpose.\n\nDo your part to keep it fun. ✨',
  },
  {
    id: 21,
    title: '🎭 Present Yourself as Your Character',
    body: 'In Virilion, you are not just posting about your character. You are presenting yourself as your character.\n\nOnce your character is approved, you should go by your character’s name in scene rooms. Speak, act, react, and move through the world as him.\n\nThis role is you inside Virilion.\n\nThat means:\n\nUse your character name when roleplaying.  \nTreat city places and scene rooms like places your character can enter.  \nStay in character during roleplay scenes.  \nLet your character have opinions, desires, fears, flaws, and relationships.  \nDo not constantly step outside the scene to explain yourself unless needed.  \nUse out-of-character notes when something needs clarification.\n\nYou are still a real person behind the screen, and real-world boundaries always matter. But inside Virilion, your character is your presence in the world.\n\nEmbody him. Let him breathe. Let him cause problems beautifully.',
  },
];

