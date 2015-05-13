/**
 * @file
 * Takes a project object, and creates a build from it.
 */

/* globals require, module */

module.exports = function (Aquifer) {
  'use strict';

  /**
   * Creates a build object from which operations can be initiated.
   *
   * @param object project object of project that should be built.
   * @param string destination path to destination folder.
   */
  var Build = function(project, destination) {
    var self = this,
        fs = require('fs-extra'),
        path = require('path'),
        drush = require('drush-node'),
        promise = require('promised-io/promise'),
        q = require('q');

    self.destination = destination;
    self.project = project;

    /**
     * Creates a Drupal root in specified directory.
     *
     * @param string make string representing absolute path to makefile.
     * @param funciton callback called when process finishes executing or errors out.
     */
    self.create = function (make, callback) {
      // If project isn't initialized (doesn't exist) then exit.
      if (!Aquifer.initialized) {
        callback('Cannot build a project that hasn\'t been initialized.');
        return;
      }

      // Run drush make.
      drush.init().then(function() {
        drush.exec('make ' + make + ' ' + self.destination)
        .then(function(res) {
          fs.symlinkSync(self.project.absolutePaths.settings, path.join(self.destination, 'sites/default/site.settings.php'), 'file');
          //fs.symlinkSync(path.join(self.destination, 'sites/all/themes/contrib'), self.project.absolutePaths.themes.contrib, 'directory');
          //fs.symlinkSync(path.join(self.destination, 'sites/all/modules/contrib'), self.project.absolutePaths.modules.contrib, 'directory');
          //fs.symlinkSync(path.join(self.destination, 'sites/all/modules/custom'), self.project.absolutePaths.modules.contrib, 'directory');
          //fs.symlinkSync(path.join(self.destination, 'sites/all/modules/features'), self.project.absolutePaths.modules.features, 'directory');
        });
      });
    }
  };

  return Build;
}