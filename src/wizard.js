const Settings = require('./settings');
const Questions = require('./questions');
const inquirer = require('inquirer');
const generate = require('./generate');
const chalk = require('chalk');
const _ = require('lodash');

module.exports = function wizard(type, name, force) {
	let settingOverrides = {};

	let settings = Settings.getSettings(settingOverrides, false);

	let questions = Questions.getGeneratorQuestions(type, settings, name);

	inquirer.prompt(questions).then((answers) => {
		let templateSettings = Settings.getTemplateSettings(settings.templatePath)[answers.type || type];

		if (templateSettings.variables) {
			return inquirer.prompt(templateSettings.variables).then((variables) => {
				answers.variables = variables;
				return answers;
			});
		}

		return answers;
	}).then((options) => {
		options = _.merge(options, { force: force });

		return generate(options.type || type, options, settings).then(() => {
			console.log();
			console.log(chalk.green('Done!'));
		});
	});
};
