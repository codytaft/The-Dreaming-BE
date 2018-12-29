const dreams = require('../dreams/dreaming.json');
const fs = require('fs');

const dateCleaner = () => {
  let newDreams = [];
  dreams.forEach(dream => {
    let dateSplit = dream.date.split('.');
    let month = monthCleaner(dateSplit[0]);
    let year = yearCleaner(dateSplit[2]);
    let day = dayCleaner(dateSplit[1]);
    let newDate = year + '-' + month + '-' + day;
    newDreams.push({
      date: (dream.date = newDate),
      dream: dream.dream
    });
  });
  makeNewDreamFile(newDreams);
};

const makeNewDreamFile = dreams => {
  fs.writeFile('../dreams/newDreams.json', JSON.stringify(dreams), err => {
    if (err) throw err;
    console.log('The file has been saved!');
  });
};

const monthCleaner = month => {
  if (month.length < 2) {
    return '0' + month;
  }
  return month;
};

const dayCleaner = day => {
  if (!day) {
    return '00';
  }
  if (day && day.length < 2) {
    return '0' + day;
  }
  return day;
};

const yearCleaner = year => {
  if (!year) {
    return '0000';
  }
  if (year && year.length < 4) {
    return '20' + year;
  }
  return year;
};

dateCleaner();
