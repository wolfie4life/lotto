const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const snekfetch = require('snekfetch');
const moment = require('moment');

module.exports = class VocaloidCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'vocaloid',
			aliases: ['vocadb'],
			group: 'search',
			memberName: 'vocaloid',
			description: 'Searches VocaDB for your query.',
			args: [
				{
					key: 'query',
					prompt: 'What song would you like to search for?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, args) {
		const { query } = args;
		const { body } = await snekfetch
			.get('http://vocadb.net/api/songs')
			.query({
				query,
				maxResults: 1,
				getTotalCount: true,
				sort: 'FavoritedTimes',
				preferAccurateMatches: true,
				nameMatchMode: 'Words',
				fields: 'ThumbUrl,Lyrics'
			});
		if (!body.totalCount) return msg.say('No Results.');
		const embed = new MessageEmbed()
			.setColor(0x86D2D0)
			.setAuthor('VocaDB', 'https://i.imgur.com/9Tx9UIc.jpg')
			.setTitle(body.items[0].name)
			.setURL(`http://vocadb.net/S/${body.items[0].id}`)
			.setDescription(body.items[0].lyrics[0] ? body.items[0].lyrics[0].value.substr(0, 2048) : 'No lyrics available.')
			.setThumbnail(body.items[0].thumbUrl)
			.addField('❯ Artist',
				body.items[0].artistString)
			.addField('❯ Publish Date',
				moment(body.items[0].publishDate).format('MMMM Do YYYY'), true)
			.addField('❯ Length',
				moment.duration(body.items[0].lengthSeconds, 's').format(), true);
		return msg.embed(embed);
	}
};
