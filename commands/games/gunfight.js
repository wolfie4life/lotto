const Command = require('../../structures/Command');

module.exports = class GunfightCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'gunfight',
            aliases: ['western-gunfight'],
            group: 'games',
            memberName: 'gunfight',
            description: 'Engage in a western gunfight against another user.',
            guildOnly: true,
            args: [
                {
                    key: 'opponent',
                    prompt: 'Who would you like to gunfight?',
                    type: 'user'
                }
            ]
        });

        this.fighting = new Set();
    }

    async run(msg, args) {
        const { opponent } = args;
        if (opponent.bot) return msg.say('Bots may not be fought.');
        if (opponent.id === msg.author.id) return msg.say('You may not fight yourself.');
        if (this.fighting.has(msg.guild.id)) return msg.say('Only one fight may be occurring per server.');
        this.fighting.add(msg.guild.id);
        try {
            await msg.say(`${opponent}, do you accept this challenge? **__Y__es** or **No**?`);
            const verify = await msg.channel.awaitMessages((res) => res.author.id === opponent.id, {
                max: 1,
                time: 30000
            });
            if (!verify.size || !['yes', 'y'].includes(verify.first().content.toLowerCase())) {
                this.fighting.delete(msg.guild.id);
                return msg.say('Looks like they declined...');
            }
            await msg.say('Get Ready...');
            const length = Math.floor(Math.random() * (30000 - 1000 + 1) + 1000);
            this.client.setTimeout(async () => {
                await msg.say('TYPE `FIRE` NOW!');
                const filter = (res) => [opponent.id, msg.author.id].includes(res.author.id) && res.content.toLowerCase() === 'fire'; // eslint-disable-line max-len
                const winner = await msg.channel.awaitMessages(filter, {
                    max: 1,
                    time: 30000
                });
                this.fighting.delete(msg.guild.id);
                if (!winner.size) return msg.say('Oh... No one won.');
                else return msg.say(`And the winner is ${winner.first().author.username}!`);
            }, length);
            return null;
        } catch (err) {
            this.fighting.delete(msg.guild.id);
            return msg.say(`Oh no, an Error occurred: \`${err.message}\`. Try again later!`);
        }
    }
};
