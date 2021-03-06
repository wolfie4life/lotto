const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const { sentences, difficulties, times } = require('../../assets/json/typing-game');

module.exports = class TypingGameCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'typing-game',
			group: 'games',
			memberName: 'typing-game',
			description: 'See how fast you can type a sentence in a given time limit.',
			clientPermissions: ['EMBED_LINKS'],
			args: [
				{
					key: 'difficulty',
					prompt: `What should the difficulty of the game be? One of: ${difficulties.join(', ')}`,
					type: 'string',
					validate: difficulty => {
						if (difficulties.includes(difficulty.toLowerCase())) return true;
						return `The difficulty must be one of: ${difficulties.join(', ')}`;
					},
					parse: difficulty => difficulty.toLowerCase()
				}
			]
		});
	}

	async run(msg, args) {
		const { difficulty } = args;
		const sentence = sentences[Math.floor(Math.random() * sentences.length)];
		const time = times[difficulty];
		const embed = new MessageEmbed()
			.setTitle(`You have ${time / 1000} seconds to type:`)
			.setDescription(sentence);
		await msg.embed(embed);
		const msgs = await msg.channel.awaitMessages(res => res.author.id === msg.author.id, {
			max: 1,
			time
		});
		if (!msgs.size || msgs.first().content !== sentence) return msg.say('Sorry! You lose!');
		return msg.say('Nice job! 10/10! You deserve some cake!');
	}
};
