'use strict';

const fs = require('fs');

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
    } /*else {
      this.obj = {
        experiences: [],
        themes: []
      };
      this.path = 'portfolio.json';
      this.save(this.path, this.obj);
    } */
  }
  
  save(path = this.path, obj = this.obj) {
    return new Promise((resolve, reject) => {
      fs.writeFile(path, JSON.stringify(obj), (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(obj);
        }
      });
    });
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
  }
  
  deleteTheme(index) {
    this.obj.themes.splice(index, 1);
  }
}

module.exports = Portfolio;