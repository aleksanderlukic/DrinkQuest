import { shuffle, randomItem } from '../utils/randomizer';

// Pool words for contextual substitution
const words = {
  en: {
    action: ['disappear for hours', 'start a conversation with a stranger', 'lose their keys', 'be the last one standing', 'make everyone laugh', 'cause unexpected chaos', 'make a new friend', 'forget where they parked'],
    wildAction: ['challenge a stranger to a drinking game', 'end up on stage', 'start a conga line', 'convince the DJ to play their song', 'get everyone dancing', 'make a bold move on someone'],
    flirtyAction: ['flirt with someone they just met', 'get someone\'s number', 'wink at a stranger', 'slide into someone\'s DMs', 'make the first move'],
    adj: ['chaotic', 'wild', 'legendary', 'unforgettable', 'absolutely unhinged', 'surprisingly wholesome'],
    item: ['phone', 'wallet', 'sunglasses', 'dignity', 'shoes', 'their inhibitions'],
    chaos: ['drama', 'absolute chaos', 'an unforgettable scene', 'a legendary story', 'complete mayhem'],
  },
  sv: {
    action: ['försvinna i timmar', 'starta en konversation med en främling', 'tappa sina nycklar', 'vara den sista kvar', 'få alla att skratta', 'orsaka oväntad kaos', 'göra en ny vän', 'glömma var de parkerat'],
    wildAction: ['utmana en främling till ett drinkspel', 'hamna på scen', 'starta en coganslinga', 'övertala DJ:n att spela deras låt', 'få alla att dansa', 'göra ett djärvt drag på någon'],
    flirtyAction: ['flirta med någon de precis träffat', 'få någons nummer', 'blinka åt en främling', 'glida in i någons DMs', 'ta det första steget'],
    adj: ['kaotisk', 'vild', 'legendarisk', 'oförglömlig', 'helt otrolig', 'överraskande söt'],
    item: ['telefon', 'plånbok', 'solglasögon', 'värdigheten', 'skorna', 'sina hämningar'],
    chaos: ['drama', 'absolut kaos', 'en oförglömlig scen', 'en legendarisk historia', 'total förvirring'],
  },
};

// Template banks by tone and language
const templates = {
  en: {
    funny: [
      'Who will be the first to {action} at {event}?',
      'If {event} was a reality TV show, who would get eliminated first?',
      'Who will forget to charge their phone and ask everyone for a charger at {event}?',
      'Who is most likely to {action} and not tell anyone for three days?',
      'If this group was a sitcom, who would be the comic relief at {event}?',
      'Who will accidentally start a trend at {event} in {place}?',
      'Who will be asleep before midnight at {event}?',
      'Who will lose their {item} at {event} in {place}?',
      'Who will make the most embarrassing "it seemed like a good idea" decision at {event}?',
      'Who will be the one to accidentally ruin {event} and make it 10x better instead?',
      'Who will document every single moment of {event} and run out of storage?',
      'Who will say "I\'m not even drunk" and then immediately prove themselves wrong?',
      'Who will give the most unsolicited advice to strangers in {place}?',
      'Who will order the most food and not finish any of it?',
      'Who will get everyone lost in {place} but insist they know exactly where they\'re going?',
    ],
    wild: [
      'Who will cause the most {chaos} during {event}?',
      'Who is most likely to do something tonight that becomes a story people tell for years?',
      'Who will push everyone\'s boundaries the furthest at {event}?',
      'Who will {wildAction} and not feel even slightly embarrassed?',
      'Who will make the boldest move on someone in {place}?',
      'Who will convince the group to do something completely insane at {event}?',
      'Who will be the one that security has their eye on all night at {event}?',
      'Who will find the most unexpected adventure in {place}?',
      'Who will wake up tomorrow not remembering half of {event}?',
      'Who will set the record for most shots taken at {event}?',
      'Who will get the {group} into VIP or somewhere they\'re definitely not supposed to be?',
      'Who will start a legendary tradition at {event} in {place}?',
      'Who will be the last one standing when {event} is officially over?',
      'Who will dare to {wildAction} first and drag everyone else along?',
    ],
    awkward: [
      'Who will accidentally call someone by the wrong name the entire time at {event}?',
      'Who will try to be smooth and completely fail at {event} in {place}?',
      'Who will send a message to the wrong person during {event}?',
      'Who will have the most cringe-worthy moment at {event}?',
      'Who will accidentally reveal a secret they weren\'t supposed to share at {event}?',
      'Who will try to take an artsy photo in {place} and fall over?',
      'Who will say something completely inappropriate without realizing it at {event}?',
      'Who will try to be the life of the party at {event} and read the room completely wrong?',
      'Who will laugh at the worst possible moment at {event}?',
      'Who will get stuck in the most awkward conversation with a stranger in {place}?',
      'Who will accidentally like a really old photo while scrolling through someone\'s profile at {event}?',
      'Who will show up overdressed or underdressed for {event}?',
      'Who will have the most embarrassing autocorrect moment during {event}?',
    ],
    flirty: [
      'Who will {flirtyAction} during {event}?',
      'Who will get the most phone numbers at {event} in {place}?',
      'Who will have the most flirtatious night of their life at {event}?',
      'Who will make the smoothest entrance at {event} and immediately lock eyes with someone?',
      'Who will send a risky text to their crush during {event}?',
      'Who will have the most romantic moment of the {event} in {place}?',
      'Who will connect the deepest with a stranger at {event}?',
      'Who is most likely to leave {event} with a date for next weekend?',
      'Who will {flirtyAction} and actually pull it off perfectly?',
      'Who will have the most memorable conversation with someone new at {event}?',
      'Who will be the most magnetic person in the room at {event}?',
      'Who will make someone\'s night by just being themselves at {event}?',
      'Who will end up dancing with a stranger in {place}?',
    ],
    brutal: [
      'Who will say something tonight they DEEPLY regret by morning?',
      'Who will create the most {adj} moment of {event}?',
      'Who will be the one everyone\'s talking about after {event} in {place}?',
      'Who will push things way too far at {event} and not even notice?',
      'Who will make the worst decision of their year during {event}?',
      'Who will cross a line they\'ve been tip-toeing around for months at {event}?',
      'Who will absolutely spiral out during {event} and need to be talked down?',
      'Who will say the thing nobody else dares to say out loud at {event}?',
      'Who will cause drama they can\'t undo at {event} in {place}?',
      'Who will overshare in a way that changes the group dynamic forever?',
      'Who will wake up tomorrow absolutely horrified by what they did at {event}?',
      'Who will make an enemy out of a stranger in {place} tonight?',
      'Who will be the reason {event} becomes {adj} and legendary in the worst way?',
    ],
  },
  sv: {
    funny: [
      'Vem kommer vara den första att {action} under {event}?',
      'Om {event} var ett reality-TV-program, vem skulle åka ut först?',
      'Vem kommer glömma ladda sin telefon och be alla om en laddare under {event}?',
      'Vem är mest trolig att {action} och inte berätta för någon på tre dagar?',
      'Om den här gruppen var en sitcom, vem skulle vara comic relief under {event}?',
      'Vem kommer av misstag starta en trend under {event} i {place}?',
      'Vem kommer sova innan midnatt under {event}?',
      'Vem kommer tappa sin {item} under {event} i {place}?',
      'Vem kommer fatta det mest pinsamma "det verkade som en bra idé"-beslutet under {event}?',
      'Vem kommer av misstag förstöra {event} och istället göra det 10 gånger bättre?',
      'Vem kommer dokumentera varje enskilt ögonblick av {event} och få fullt minne?',
      'Vem kommer säga "jag är inte ens berusad" och direkt motbevisa sig själv?',
      'Vem kommer ge de mest oönskade råden till främlingar i {place}?',
    ],
    wild: [
      'Vem kommer orsaka mest {chaos} under {event}?',
      'Vem är mest trolig att göra något ikväll som folk berättar om i år?',
      'Vem kommer {wildAction} och inte känna sig det minsta generad?',
      'Vem kommer övertala gruppen att göra något helt vansinnigt under {event}?',
      'Vem kommer vakna imorgon utan minne av halva {event}?',
      'Vem kommer sätta rekord för flest shots under {event}?',
      'Vem kommer ta {group} till VIP eller någonstans de definitivt inte borde vara?',
      'Vem kommer vara den sista kvar när {event} officiellt är slut?',
      'Vem hittar det mest oväntade äventyret i {place}?',
      'Vem törs {wildAction} först och dra med alla andra?',
    ],
    awkward: [
      'Vem kommer av misstag kalla någon vid fel namn hela {event}?',
      'Vem kommer försöka vara smidig och misslyckas totalt under {event} i {place}?',
      'Vem kommer skicka ett meddelande till fel person under {event}?',
      'Vem kommer ha det mest pinsamma ögonblicket under {event}?',
      'Vem kommer av misstag avslöja en hemlighet de inte borde dela under {event}?',
      'Vem kommer försöka ta ett konstnärligt foto i {place} och ramla?',
      'Vem kommer säga något helt olämpligt utan att inse det under {event}?',
      'Vem kommer ha den mest pinsamma autokorrektur-stunden under {event}?',
    ],
    flirty: [
      'Vem kommer {flirtyAction} under {event}?',
      'Vem kommer få flest telefonnummer under {event} i {place}?',
      'Vem kommer ha den mest flirtiga kvällen i sitt liv under {event}?',
      'Vem kommer skicka ett vågat SMS till sin crush under {event}?',
      'Vem kommer ha det mest romantiska ögonblicket under {event} i {place}?',
      'Vem är mest trolig att lämna {event} med en dejt för nästa helg?',
      'Vem kommer hamna och dansa med en främling i {place}?',
      'Vem kommer {flirtyAction} och faktiskt lyckas perfekt?',
    ],
    brutal: [
      'Vem kommer säga något ikväll de DJUPT ångrar på morgonen?',
      'Vem kommer skapa det mest {adj} ögonblicket under {event}?',
      'Vem kommer alla prata om efter {event} i {place}?',
      'Vem kommer fatta det värsta beslutet av sitt år under {event}?',
      'Vem kommer korsa en gräns de tuppat runt i månader under {event}?',
      'Vem kommer säga det ingen annan törs säga högt under {event}?',
      'Vem kommer orsaka drama de inte kan ångra under {event} i {place}?',
      'Vem kommer vakna imorgon totalt chockad av vad de gjorde under {event}?',
    ],
  },
};

function fillTemplate(template, data) {
  const lang = data.language || 'en';
  const w = words[lang] || words.en;
  let result = template;

  result = result.replace(/{event}/g, data.event || (lang === 'sv' ? 'evenemanget' : 'the event'));
  result = result.replace(/{place}/g, data.place || (lang === 'sv' ? 'platsen' : 'the place'));
  result = result.replace(/{group}/g, data.group || (lang === 'sv' ? 'gruppen' : 'the group'));
  result = result.replace(/{vibe}/g, data.vibe || (lang === 'sv' ? 'stämningen' : 'the vibe'));
  result = result.replace(/{action}/g, randomItem(w.action));
  result = result.replace(/{wildAction}/g, randomItem(w.wildAction));
  result = result.replace(/{flirtyAction}/g, randomItem(w.flirtyAction));
  result = result.replace(/{adj}/g, randomItem(w.adj));
  result = result.replace(/{item}/g, randomItem(w.item));
  result = result.replace(/{chaos}/g, randomItem(w.chaos));

  return result;
}

export function generateQuestions({ event, place, vibe, tone = 'funny', group, language = 'en', count = 10 }) {
  const lang = language === 'sv' ? 'sv' : 'en';
  const toneTemplates = templates[lang][tone] || templates[lang].funny;
  const data = { event, place, vibe, group, language: lang };

  const shuffled = shuffle(toneTemplates);
  const selected = shuffled.slice(0, Math.min(count, shuffled.length));

  return selected.map((t, i) => ({
    id: `gen-${Date.now()}-${i}`,
    text: fillTemplate(t, data),
    type: 'question',
    difficulty: 'normal',
    source: 'generated',
    requiresNames: false,
  }));
}
