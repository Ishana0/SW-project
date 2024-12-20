const cardArray = [
    {
        name: 'fries',
        img: 'Image-files/images/fries.png',
    },
    {
        name: 'cheeseburger',
        img: 'Image-files/images/cheeseburger.png',
    },
    {
        name: 'hotdog',
        img: 'Image-files/images/hotdog.png',
    },
    {
        name: 'ice-cream',
        img: 'Image-files/images/ice-cream.png',
    },
    {
        name: 'milkshake',
        img: 'Image-files/images/milkshake.png',
    },
    {
        name: 'pizza',
        img: 'Image-files/images/pizza.png',
    },
    {
        name: 'fries',
        img: 'Image-files/images/fries.png',
    },
    {
        name: 'cheeseburger',
        img: 'Image-files/images/cheeseburger.png',
    },
    {
        name: 'hotdog',
        img: 'Image-files/images/hotdog.png',
    },
    {
        name: 'ice-cream',
        img: 'Image-files/images/ice-cream.png',
    },
    {
        name: 'milkshake',
        img: 'Image-files/images/milkshake.png',
    },
    {
        name: 'pizza',
        img: 'Image-files/images/pizza.png',
    }
]

cardArray.sort(()=>0.5 - Math.random());

const gridDisplay = document.querySelector('#grid')
const resultDisplay = document.querySelector('#result')
let cardsChosen = []
let cardsChosenIds = []
const cardsWon = []

function createBoard(){
    for(let i=0;i<cardArray.length;i++){
        const card = document.createElement('img')
        card.setAttribute('src','Image-files/images/blank.png')
        card.setAttribute('data-id',i)
        card.addEventListener('click',flipCard)
        gridDisplay.appendChild(card)


    }
}
createBoard()

function flipCard(){
   let cardId =  this.getAttribute('data-id')
   cardsChosen.push(cardArray[cardId].name)
   cardsChosenIds.push(cardId)
   this.setAttribute('src',cardArray[cardId].img)
   if(cardsChosen.length == 2){
    setTimeout(checkMatch,500)
   }
}

function checkMatch(){
    const cards = document.querySelectorAll('img')
    const optionOneID = cardsChosenIds[0]
    const optionTwoID = cardsChosenIds[1]
    if(optionOneID == optionTwoID){
        alert('You have clicked the same image!')
    }

    if(cardsChosen[0] == cardsChosen[1]){
        alert('you found the match')
        cards[optionOneID].setAttribute('src','Image-files/images/blank.png')
        cards[optionTwoID].setAttribute('src','Image-files/images/blank.png')
        cards[optionOneID].removeEventListener('click',flipCard)
        cards[optionTwoID].removeEventListener('click',flipCard)
        cardsWon.push(cardsChosen)
    }else{
        cards[optionOneID].setAttribute('src','Image-files/images/blank.png')
        cards[optionTwoID].setAttribute('src','Image-files/images/blank.png')
        alert('Sorry try again')
    }
    resultDisplay.textContent = cardsWon.length;
    cardsChosen = []
    cardsChosenIds = []
    if(cardsWon.length == (cardArray.length/2)){
        resultDisplay.innerHTML = 'Congratulations you found all!'
    }
}