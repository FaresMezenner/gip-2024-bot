const {
    SlashCommandBuilder,
    Colors,
    ChannelType,
    PermissionFlagsBits
  } = require("discord.js");
  require("dotenv").config()
  
  const MENTOR_ROLE_ID = process.env.MENTOR_ROLE_ID
  const ORGANIZER_ROLE_ID = process.env.ORGANIZER_ROLE_ID
  const DIP_MENTOR_ID = process.env.DIP_MENTOR_ID
  
  module.exports = {
    data: new SlashCommandBuilder()
      .setName("create_dev_team")
      .setDescription("Creates a dev team with a category and a role and without a mentor")
      .addStringOption((option) =>
        option
          .setName("name")
          .setDescription("The name of the team")
          .setRequired(true)
      )
      .addUserOption((option) =>
        option
          .setName("member1")
          .setDescription("First member of the team")
          .setRequired(false)
      )
      .addUserOption((option) =>
        option
          .setName("member2")
          .setDescription("Second member of the team")
          .setRequired(false)
      )
      .addUserOption((option) =>
        option
          .setName("member3")
          .setDescription("Third member of the team")
          .setRequired(false)
      )
      .addUserOption((option) =>
        option
          .setName("member4")
          .setDescription("Fourth member of the team")
          .setRequired(false)
      )
      .addUserOption((option) =>
        option
        .setName("member5")
        .setDescription("Fifth member of the team")
        .setRequired(false)
      )
      .addUserOption((option) =>
        option
        .setName("member6")
        .setDescription("Sixth member of the team")
        .setRequired(false)
      )
      ,
    async execute(client, interaction, args) {
  
  
      const adminRole = interaction.member.roles.cache.find((r) =>
        r.name.startsWith("Admin")
      );
      const organizersRole = interaction.member.roles.cache.find((r) =>
        r.id === ORGANIZER_ROLE_ID
      );
      
      // Check if either role is found
      if (!organizersRole ) {
      
        await interaction.reply({ embeds: [{ title: "Only Orgenizers can create teams" }] });
        return;
      }
      await interaction.reply({
        embeds: [{ title: "Processing team creation" }],
      });
      try {
        // Getting all the members of the team
        const member1 = interaction.options.getMember("member1");
        const member2 = interaction.options.getMember("member2");
        const member3 = interaction.options.getMember("member3");
        const member4 = interaction.options.getMember("member4");
        const member5 = interaction.options.getMember("member5");
        const member6 = interaction.options.getMember("member6");
  
  
        // Filtering the members in case of a team with a size less than 5
        const members = [
          member1, member2, member3, member4, member5, member6,
        ].filter(
          (member) => member !== null
        );
  
        // Check if all the members are not in a team
        for (const member of members) {
          const role = member.roles.cache.find((r) => r.name.startsWith("Team"));
  
          if (role) {
            await interaction.editReply({
              embeds: [{ title: "One of the team members is already in a team" }],
            });
            return;
          }
        }
  
  
        // Check if the team name already exists
        const name = interaction.options.getString("name");
        
  
        const role = interaction.guild.roles.cache.find(
          (r) => r.name === `Team ${name}`
        );
  
        if (role) {
          await interaction.editReply({
            embeds: [
              { title: `A team with the name of \`${name}\` already exists!` },
            ],
          });
          return;
        }
  
  
  
        
  
        // Create the team role and add to the team members
        const createdRole = await interaction.guild.roles.create({
          name: `Team ${name}`,
          color: Colors.Blue,
        });
  
        members.forEach((member) => member.roles.add(createdRole));
  
  
  
  
        
  
        // Create the team category, voice channel and text channel
        const category = await interaction.guild.channels.create({
          name: `Team ${name}`,
          type: ChannelType.GuildCategory,
          permissionOverwrites: [
            {
              id: interaction.guild.id,
              deny: [PermissionFlagsBits.ViewChannel],
            },
            {
              id: createdRole.id,
              allow: [PermissionFlagsBits.ViewChannel],
            },
          ],
        });
  
        await interaction.guild.channels.create({
          name: `voice-channel`,
          type: ChannelType.GuildVoice,
          parent: category.id,
          permissionOverwrites: [
            {
              id: interaction.guild.id,
              deny: [PermissionFlagsBits.ViewChannel],
            },
            {
              id: createdRole.id,
              allow: [
                PermissionFlagsBits.ViewChannel,
                PermissionFlagsBits.Connect,
              ],
            },

          ],
        });
  
        const textChannel = await interaction.guild.channels.create({
          name: `text-channel`,
          type: ChannelType.GuildText,
          parent: category.id,
          permissionOverwrites: [
            {
              id: interaction.guild.id,
              deny: [PermissionFlagsBits.ViewChannel],
            },
            {
              id: createdRole.id,
              allow: [
                PermissionFlagsBits.ViewChannel,
                PermissionFlagsBits.SendMessages,
              ],
            },
            {
              id: DIP_MENTOR_ID,
              allow: [
                PermissionFlagsBits.ViewChannel,
                PermissionFlagsBits.SendMessages,
              ],
            }
          ],
        });
  
        await interaction.guild.channels.create({
          name: `ask-questions`,
          type: ChannelType.GuildText,
          parent: category.id,
          permissionOverwrites: [
            {
              id: interaction.guild.id,
              deny: [PermissionFlagsBits.ViewChannel],
            },
            {
              id: createdRole.id,
              allow: [
                PermissionFlagsBits.ViewChannel,
                PermissionFlagsBits.SendMessages,
              ],
            },
            {
                id: DIP_MENTOR_ID,
              allow: [
                PermissionFlagsBits.ViewChannel,
                PermissionFlagsBits.SendMessages,
              ],
            }
          ],
        });
  
  
        await interaction.guild.channels.create({
          name: `team-announcements`,
          type: ChannelType.GuildText,
          parent: category.id,
          permissionOverwrites: [
            {
              id: interaction.guild.id,
              deny: [PermissionFlagsBits.ViewChannel,
                PermissionFlagsBits.SendMessages,
              ],
            },
            {
              id: createdRole.id,
              allow: [
                PermissionFlagsBits.ViewChannel,
              ],
            },
            {
                id: DIP_MENTOR_ID,
              allow: [
                PermissionFlagsBits.ViewChannel,
                PermissionFlagsBits.SendMessages,
              ],
            }

          ],
        })
  
  
  
        await textChannel.send(
          `Welcome ${createdRole.toString()}, this is your team space`
        );
  
        await interaction.editReply({
          embeds: [
            {
              title: `Team \`${name}\` created successfully`,
            },
          ],
        });
      } catch (err) {
        console.log(err);
        await interaction.editReply("There's an error, try to contact an admin");
      }
    },
  };
  