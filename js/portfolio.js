'use strict';

const fs = require('fs');

const writeFile = (path, data) => {
  console.log(`called WriteFile(${path}, `, data)
  return new Promise((resolve, reject) => {
    fs.writeFile(path, JSON.stringify(data), (err) => {
      console.log('callback: ', err);
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

class Portfolio {
  constructor(filePath) {
    if (filePath) {      
      this.path = filePath;
      this.obj = JSON.parse(fs.readFileSync(this.path));
      if (!this.obj.themes) {
        this.obj.themes = [];
      }
      if (!this.obj.experiences) {
        this.obj.experiences = [];
      }
    } else {
	    throw new Error('Usage: node app.js [portfolioFile]');
    }
  }
  
  save(path = this.path, obj = this.obj) {
    return writeFile(path, obj);
  }
  
  get experiences() {
	  return Array.from(this.obj.experiences);
  }
  
  addExperience(exp) {
    this.obj.experiences.push(exp);
    return exp;
  }
  
  deleteExperience(index) {
    this.obj.experiences.splice(index, 1);
  }
  
  get themes() {
	  return Array.from(this.obj.themes);
  }
  
  addTheme(theme) {
    this.obj.themes.push(theme);
    return theme;
  }
  
  deleteTheme(index) {
    this.obj.themes.splice(index, 1);
  }
  
  writeCampaignFile(path, themeName) {
    const theme = this.obj.themes.find((theme) => theme.name === themeName),
          data = theme.tags.reduce((experiences, tag) => {
            return experiences.concat(this.obj.experiences.filter((exp) => exp.tags.indexOf(tag) > -1));
          }, []);
    return writeFile(path, data);
  }
}

module.exports = Portfolio;