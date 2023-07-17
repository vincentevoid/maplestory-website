import { preload, debouncedUpdateUpperBound, debounce } from './util/index.js';
import Character from './util/Character.js';

const details = {
  "player": {
    "ign": "rins",
    "level": 300,
    "job": "artist",
    "fame": "-",
    "guild": "-",
    "alliance": "-",
    "married": true
  },
  "buttons": {
    "wishlist": "https://throne.com/rins/wishlist",
    "party": "https://risorins.com/pages/contact"
  },
  "pet": {
    "pet-ign": "",
    "type": "Fennec Fox",
    "pet-level": 30,
    "closeness": 30000,
    "fullness": 100
  },
  "links": [
    {
      "url": "https://twitter.com/risorins",
      "title": "Twitter",
      "image": "./public/images/ui/icons/twitter.png",
      "requiredLevel": 0
    },
    {
      "url": "https://instagram.com/risorins",
      "title": "Instagram",
      "image": "./public/images/ui/icons/instagram.png",
      "requiredLevel": 0
    },
    {
      "url": "https://risorins.com",
      "title": "Store",
      "image": "./public/images/ui/icons/risorins.png",
      "requiredLevel": 0
    },
    {
      "url": "https://throne.com/rins/wishlist",
      "title": "Throne",
      "image": "./public/images/ui/icons/throne.png",
      "requiredLevel": 0
    },
    {
      "url": "https://ko-fi.com/risorins",
      "title": "Ko-fi",
      "image": "./public/images/ui/icons/ko-fi.png",
      "requiredLevel": 0
    },
    {
      "url": "https://rins.artstation.com/",
      "title": "Artstation",
      "image": "./public/images/ui/icons/artstation.png",
      "requiredLevel": 0
    }
  ]
}
const images = [
  './public/images/animations/idle.gif',
  './public/images/animations/walking.gif',
  './public/images/ui/cursor/click.png',
  './public/images/ui/cursor/cursor.png',
  './public/images/ui/cursor/link.png',
  './public/images/ui/button/fame/down-disabled.png',
  './public/images/ui/button/fame/up-disabled.png',
  'public/images/ui/button/contact/mouseover.png',
  'public/images/ui/button/contact/pressed.png',
  'public/images/ui/button/wishlist/mouseover.png',
  'public/images/ui/button/wishlist/pressed.png',
  'public/images/ui/button/item/mouseover.png',
  'public/images/ui/button/item/pressed.png',
  'public/images/animations/emote/F1.gif',
  'public/images/animations/emote/F2.gif',
  'public/images/animations/emote/F3.gif',
  'public/images/animations/emote/F4.gif',
  'public/images/animations/emote/F5.gif',
  'public/images/animations/emote/F6.gif',
  'public/images/animations/emote/F7.gif',
]
const char = new Character();
const titleBar = document.getElementById('title-bar');
const characterInfo = document.getElementById('character-info');
const characterPreview = document.getElementById('character-preview');
const petLinks = document.getElementById('pet-links');
const itemLinks = document.getElementById('item-links');
const itemButton = document.getElementById('item-button');
const itemPanel = document.getElementById('item-links');
const upButton = document.getElementById('up-button');
const downButton = document.getElementById('down-button');
const fameElement = document.getElementById('fame');
const mediaQuery = window.matchMedia('(max-width: 520px)');
const track = document.getElementById("ios-scrollbar-track");
let timeoutId;
let trackMouse = false;
let initialX, initialY;
let left, top;
let moveAmountX = 0;
let moveAmountY = 0;
let itemIsOpen = false;

function changeEmote(key) {
  characterPreview.style.backgroundImage = `url("./public/images/animations/emote/${key}.gif")`
  clearTimeout(timeoutId);
  timeoutId = setTimeout(() => {
    characterPreview.style.backgroundImage = `url("./public/images/animations/idle.gif")`
  }, 5000)
}

function handleMouseDown(event) {
  if (event.button === 0) {
    document.body.classList.add('left-click');
  }
  if (event.target === titleBar) {
    event.preventDefault();
    const rect = characterInfo.getBoundingClientRect();
    left = rect.left;
    top = rect.top;
    trackMouse = true;
    initialX = event.clientX;
    initialY = event.clientY;
  }
}

function handleMouseUp(event) {
  if (event.button === 0) {
    document.body.classList.remove('left-click');
  }
  if (trackMouse) {
    characterInfo.style.left = `${left + moveAmountX}px`;
    characterInfo.style.top = `${top + moveAmountY}px`;
    characterInfo.style.transform = `none`;
    moveAmountX = 0;
    moveAmountY = 0;
    trackMouse = false;
  }

}

function handleMouseMove(event) {
  if (trackMouse) {
    moveAmountX = event.clientX - initialX;
    moveAmountY = event.clientY - initialY;
    characterInfo.style.transform = `translate(${moveAmountX}px, ${moveAmountY}px)`;
  }
}

function handleMediaQueryChange() {
  if (mediaQuery.matches) {
    itemButton.disabled = true;
    closeItemInfo()
  } else {
    itemButton.disabled = false;
    openItemInfo()
  }
}

function handleResize() {
  function updateCharInfoPosition() {
    const characterInfo = document.getElementById('character-info');
    characterInfo.style.left = `${window.innerWidth / 2 - (itemIsOpen ? 255 : 137.5)}px`;
    characterInfo.style.top = `${(window.innerHeight / 2 - 200) - 70}px`;
  }
  debouncedUpdateUpperBound();
  debounce(updateCharInfoPosition, 100)();
}

function handlePetLinksScroll() {
  const petLinksScrollHeight = petLinks.scrollHeight;
  const petLinksClientHeight = petLinks.clientHeight;
  const scrollPercentage = (petLinks.scrollTop / (petLinksScrollHeight - petLinksClientHeight)) * 100;
  const maxScroll = petLinksClientHeight - track.clientHeight - 26;
  const trackPosition = (scrollPercentage / 100) * maxScroll;

  track.style.transform = `translateY(${trackPosition}px)`;
}

async function handleFameUp() {
  const upButton = document.getElementById('up-button');
  const downButton = document.getElementById('down-button');
  const fameElement = document.getElementById('fame');
  const fameStatus = await patchFame();
  if (fameStatus) {
    fameElement.textContent = Number(fameElement.textContent) + 1
  } else {
    upButton.disabled = true;
    downButton.disabled = true;
  }
  return fameStatus;
}

function handleFameDown() {
  changeEmote('F4');
}

function handleKeyDown(event) {

  const validFKeys = ['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7'];
  const validKeys = ['1', '2', '3', '4', '5', '6', '7'];

  const key = event.key;
  const isValidFKey = validFKeys.includes(key);
  const isValidKey = validKeys.includes(key);

  if (isValidFKey || isValidKey) {
    event.preventDefault();
    const emoteKey = isValidFKey ? key : `F${key}`;
    changeEmote(emoteKey);
  }
}

async function getFame() {
  // make request
  const response = await fetch(`https://api.risorins.com/${details.player.ign}/fame`);
  const fame = await response.json();
  return fame.fame;
  // set fame to be response
}

async function updateFame() {
  const fameElement = document.getElementById('fame');
  return fameElement.textContent = await getFame();
}

async function patchFame() {
  const response = await fetch(`https://api.risorins.com/${details.player.ign}/fame`, { method: 'PATCH' });
  return response.ok;
}

function closeItemInfo() {
  itemIsOpen = false;
  itemPanel.classList.add('closed');
  itemPanel.classList.remove('open');
  // clear previous html
  petLinks.innerHTML = '';
  // loops through array
  details.links.forEach(link => {
    const linkHTML =
      `<a href="${link.url}" target="_blank">
      <div class="link-image" style="background-image: url('${link.image}');" ></div>
      <div class="link-text">${link.title}</div>
      <div class="link-subtext">
        <img src="./public/images/ui/ReqLv.png" />
        <span>${link.requiredLevel}</span>
      </div>
    </a>`;
    petLinks.innerHTML += linkHTML;
  });
}

function openItemInfo() {
  itemIsOpen = true;
  itemPanel.classList.remove('closed');
  itemPanel.classList.add('open');
  // rerender pet list to have 4-6
  // clear previous html
  petLinks.innerHTML = '';
  // loops through array
  details.links.forEach((link, index) => {
    if (index > 2) {
      const linkHTML =
        `<a href="${link.url}" target="_blank">
        <div class="link-image" style="background-image: url('${link.image}');" ></div>
        <div class="link-text">${link.title}</div>
        <div class="link-subtext">
          <img src="./public/images/ui/ReqLv.png" />
          <span>${link.requiredLevel}</span>
        </div>
      </a>`;
      petLinks.innerHTML += linkHTML;
    }
  });
}

function renderItemLinks() {
  itemLinks.innerHTML = '';
  details.links.forEach((link, index) => {
    if (index <= 2) {
      const linkHTML =
        `
          <a id="item-link-${index + 1}" href="${link.url}" target="_blank">
          <div class="link-image" style="background-image: url('${link.image}');" ></div>
          <div class="link-text">${link.title}</div>
          <div class="link-subtext">
            <img src="./public/images/ui/ReqLv.png" />
            <span>${link.requiredLevel}</span>
          </div>
        </a>
      `
      itemLinks.innerHTML += linkHTML;
    }
  })
}

preload(images);

renderItemLinks();
// handleResize();
characterInfo.classList.toggle("hidden");

for (const id in details.player) {
  const element = document.getElementById(id);
  if (element) {
    element.textContent = details.player[id];
  }
}

for (const id in details.buttons) {
  const element = document.getElementById(`${id}-button`);
  if (element) {
    element.href = details.buttons[id];
  }
}

for (const id in details.pet) {
  const element = document.getElementById(id);
  if (element) {
    element.textContent = details.pet[id];
  }
}

const characterIgn = document.getElementById('character-ign');
characterIgn.textContent = details.player.ign;


fameElement.textContent = details.player.fame;


itemButton.addEventListener('click', function () {
  itemIsOpen ? closeItemInfo() : openItemInfo()
});

char.init();
setTimeout(() => {
  char.moveRandomly();
}, 1000)

handlePetLinksScroll();
updateFame();
handleFameUp();
addEventListener("resize", handleResize);
upButton.addEventListener("click", handleFameUp);
downButton.addEventListener("click", handleFameDown);
petLinks.addEventListener("scroll", handlePetLinksScroll);
mediaQuery.addEventListener('change', handleMediaQueryChange);
handleMediaQueryChange()
document.addEventListener('mousedown', handleMouseDown);
document.addEventListener('mouseup', handleMouseUp);
document.addEventListener('mousemove', handleMouseMove);
document.addEventListener('keydown', handleKeyDown);

console.log(`hello, my name is nathaniel. if you're a curious dev, this is just a small vanilla js project using assets ripped from maplestory files. thanks for coming by!`)