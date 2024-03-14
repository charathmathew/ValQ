const { SlashCommandBuilder } = require('discord.js')

const MAPS = [
    "ASCENT",
    "BIND",
    "BREEZE",
    "FRACTURE",
    "HAVEN",
    "ICEBOX",
    "LOTUS",
    "PEARL",
    "SPLIT",
    "SUNSET"
]

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roll_map')
        .setDescription('Picks a random map')
        .addStringOption(option =>
            option
                .setName('ban_1')
                .setDescription('Map to ban')
                .setRequired(false)
                .addChoices(
                    {name:'Ascent',value:'ASCENT'},
                    {name:'Bind',value:'BIND'},
                    {name:'Breeze',value:'BREEZE'},
                    {name:'Fracture',value:'FRACTURE'},
                    {name:'Haven',value:'HAVEN'},
                    {name:'Icebox',value:'ICEBOX'},
                    {name:'Lotus',value:'LOTUS'},
                    {name:'Pearl',value:'PEARL'},
                    {name:'Split',value:'SPLIT'},
                    {name:'Sunset',value:'SUNSET'}
                )
            )
        .addStringOption(option =>
            option
                .setName('ban_2')
                .setDescription('Map to ban')
                .setRequired(false)
                .addChoices(
                    {name:'Ascent',value:'ASCENT'},
                    {name:'Bind',value:'BIND'},
                    {name:'Breeze',value:'BREEZE'},
                    {name:'Fracture',value:'FRACTURE'},
                    {name:'Haven',value:'HAVEN'},
                    {name:'Icebox',value:'ICEBOX'},
                    {name:'Lotus',value:'LOTUS'},
                    {name:'Pearl',value:'PEARL'},
                    {name:'Split',value:'SPLIT'},
                    {name:'Sunset',value:'SUNSET'}
                )
            )
        .addStringOption(option =>
            option
                .setName('ban_3')
                .setDescription('Map to ban')
                .setRequired(false)
                .addChoices(
                    {name:'Ascent',value:'ASCENT'},
                    {name:'Bind',value:'BIND'},
                    {name:'Breeze',value:'BREEZE'},
                    {name:'Fracture',value:'FRACTURE'},
                    {name:'Haven',value:'HAVEN'},
                    {name:'Icebox',value:'ICEBOX'},
                    {name:'Lotus',value:'LOTUS'},
                    {name:'Pearl',value:'PEARL'},
                    {name:'Split',value:'SPLIT'},
                    {name:'Sunset',value:'SUNSET'}
                )
            ),
        async execute(interaction) {
            const ban1 = interaction.options.getString('ban_1')
            const ban2 = interaction.options.getString('ban_2')
            const ban3 = interaction.options.getString('ban_3')
            
            const unbannedMaps = MAPS.filter(map => (map !== ban1 && map !== ban2 && map !== ban3))
            const randomMap = unbannedMaps[Math.floor(Math.random() * unbannedMaps.length)]
           
            await interaction.reply(`${randomMap}`)
            return
        }
}
 
