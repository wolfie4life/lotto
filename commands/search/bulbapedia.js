const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const snekfetch = require('snekfetch');

module.exports = class BulbapediaCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'bulbapedia',
			aliases: ['bulbagarden'],
			group: 'search',
			memberName: 'bulbapedia',
			description: 'Searches Bulbapedia for your query.',
			clientPermissions: ['EMBED_LINKS'],
			args: [
				{
					key: 'query',
					prompt: 'What would you like to search for?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, args) {
		const { query } = args;
		const { body } = await snekfetch
			.get('http://bulbapedia.bulbagarden.net/w/api.php')
			.query({
				action: 'query',
				prop: 'extracts',
				format: 'json',
				titles: query,
				exintro: '',
				explaintext: '',
				redirects: '',
				formatversion: 2
			});
		if (body.query.pages[0].missing) return msg.say('No Results.');
		const embed = new MessageEmbed()
			.setColor(0x3E7614)
			.setTitle(body.query.pages[0].title)
			.setAuthor('Bulbapedia', 'https://i.imgur.com/09eYo5T.png')
			.setDescription(body.query.pages[0].extract.replace(/[\n]/g, '\n\n').substr(0, 2048));
		return msg.embed(embed);
	}
};
