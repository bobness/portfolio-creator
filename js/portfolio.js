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
    return this.obj.experiences;
  }
  
  get lastExperience() {
    return this.obj.experiences[this.obj.experieces.length-1];
  }
  
  addExperience(exp) {
    exp.index = this.obj.experiences.length;
    this.obj.experiences.push(exp);
  }
  
  deleteExperience(exp) {
    this.obj.experiences.splice(exp.index, 1);
  }
  
  get themes() {
    return this.obj.themes;
  }
  
  get lastTheme() {
    return this.obj.themes[this.obj.themes.length-1];
  }
  
  addTheme(theme) {
    theme.index = this.obj.themes.length;
    this.obj.themes.push(theme);
  }
  
  deleteTheme(theme) {
    this.obj.themes.splice(theme.index, 1);
  }
}

module.exports = Portfolio;