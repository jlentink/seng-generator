const path = require('path');
const fs = require('fs');
const toSpaceCase = require('to-space-case');

exports.getGeneratorQuestions = function (type, settings, name) {
	let questions;

	if (type) {
		questions = [askName(name), askDestination(type, settings.templates[type].destination) || settings.destination];
	}
	else {
		questions = [askType(settings.templates), askName(name)];

		Object.keys(settings.templates).forEach((key) => {
			questions.push(askDestination(key, settings.templates[key].destination || settings.destination, true));
		});
	}

	return questions;
};

exports.getSettingQuestions = function (settings) {
	return Object.keys(settings).map(key => askSetting(key, settings[key]));
};

exports.getCopyQuestions = function (destination) {
	return [askCopyDestination(destination)];
};

function askSetting(key, defaultValue) {
	return {
		type: 'input',
		name: key,
		message: toSpaceCase(key),
		default: defaultValue || ''
	}
}

function askType(templates) {
	return {
		type: 'list',
		name: 'type',
		message: 'Which template do you want to use?',
		choices: Object.keys(templates)
	}
}

function askName(defaultName) {
	return {
		type: 'input',
		name: 'name',
		message: 'What name do you want to use?',
		default: defaultName || '',
		filter(value){
			return value.trim();
		},
		validate(value){
			return value.trim().length == 0 ? 'No name given' : true;
		}
	}
}

function askCopyDestination(defaultDestination) {
	return {
		type: 'input',
		name: 'destination',
		message: 'destination',
		default: defaultDestination || '.'
	}
}

function askDestination(name, defaultDestination, optional = false) {
	return {
		type: 'input',
		name: 'destination',
		message: 'Where do you want to create the ' + name + '?',
		default: defaultDestination || '',
		when(answers){
			return !optional || (optional && answers.type == name);
		},
		validate(input){
			const destination = path.resolve(input);

			if (!fs.existsSync(destination)) {
				return `path: ${destination} doesn't exist`;
			}
			return true;
		}
	}
}
