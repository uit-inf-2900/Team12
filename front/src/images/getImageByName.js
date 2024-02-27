const images = {
    img6: require('./6.png'),
    books: require('./books.png'),
    huggingYarn: require('./huggingYarn.png'),
    pileOfSweaters: require('./pileOfSweaters.png'),
    reading: require('./reading.png'),
    stash: require('./stash.png'),
    yarnBasket: require('./yarnBasket.png'),
    yarnSheep: require('./yarnSheep.png'),
};

export const getImageByName = (name) => images[name];
