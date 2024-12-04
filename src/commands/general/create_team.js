const {
  SlashCommandBuilder,
  Colors,
  ChannelType,
  PermissionFlagsBits
} = require("discord.js");
require("dotenv").config()

const MENTOR_ROLE_ID = process.env.MENTOR_ROLE_ID
const ORGANIZER_ROLE_ID = process.env.ORGANIZER_ROLE_ID

module.exports = {
  data: new SlashCommandBuilder()
    .setName("create_team")
    .setDescription("Creates a team with a category and a role")
    .addStringOption((option) =>
      option
        .setName("name")
        .setDescription("The name of the team")
        .setRequired(true)
    )
    .addUserOption((option) =>
      option
        .setName("mentor")
        .setDescription("The mentor of the team")
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
    .addUserOption((option) =>
      option
      .setName("member7")
      .setDescription("Seventh member of the team")
      .setRequired(false)
    )
    .addUserOption((option) =>
      option
      .setName("member8")
      .setDescription("Eighth member of the team")
      .setRequired(false)
    )
    .addUserOption((option) =>
      option
      .setName("member9")
      .setDescription("Ninth member of the team")
      .setRequired(false)
    )
    .addUserOption((option) =>
      option
      .setName("member10")
      .setDescription("Tenth member of the team")
      .setRequired(false)
    )
    .addUserOption((option) =>
      option
      .setName("member11")
      .setDescription("Eleventh member of the team")
      .setRequired(false)
    )
    .addUserOption((option) =>
      option
      .setName("member12")
      .setDescription("Twelfth member of the team")
      .setRequired(false)
    )
    .addUserOption((option) =>
      option
      .setName("member13")
      .setDescription("Thirteenth member of the team")
      .setRequired(false)
    )
    .addUserOption((option) =>
      option
      .setName("member14")
      .setDescription("Fourteenth member of the team")
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
      const member7 = interaction.options.getMember("member7");
      const member8 = interaction.options.getMember("member8");
      const member9 = interaction.options.getMember("member9");
      const member10 = interaction.options.getMember("member10");
      const member11 = interaction.options.getMember("member11");
      const member12 = interaction.options.getMember("member12");
      const member13 = interaction.options.getMember("member13");
      const member14 = interaction.options.getMember("member14");


      // Filtering the members in case of a team with a size less than 5
      const members = [
        member1, member2, member3, member4, member5, member6, member7, member8, member9, member10, member11, member12, member13, member14
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



      // Getting the mentor
      const mentor = interaction.options.getMember("mentor");
      // setting the mentor roles
      mentor.roles.add(createdRole);
      mentor.roles.add(MENTOR_ROLE_ID);

      

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
        ],
      });

      await interaction.guild.channels.create({
        name: `resources-channel`,
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
        ],
      });



      await interaction.guild.channels.create({
        name: `ask-questions`,
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
          {
            id: ORGANIZER_ROLE_ID,
            allow: [
              PermissionFlagsBits.ViewChannel,
              PermissionFlagsBits.Connect,
            ],
          },
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
            id: mentor.id,
            allow: [
              PermissionFlagsBits.SendMessages,
            ],
          }
        ],
      })

      await interaction.guild.channels.create({
        name: "mentor-text",
        type: ChannelType.GuildText,
        parent: category.id,
        permissionOverwrites: [
          {
            id: interaction.guild.id,
            deny: [PermissionFlagsBits.ViewChannel],
          },
          {
            id: mentor.id,
            allow: [
              PermissionFlagsBits.ViewChannel,
              PermissionFlagsBits.SendMessages,
            ],
          },
          {
            id: ORGANIZER_ROLE_ID,
            allow: [
              PermissionFlagsBits.ViewChannel,
              PermissionFlagsBits.SendMessages,
            ],
          }
        ],
      })


      await interaction.guild.channels.create({
        name: "mentor-voice",
        type: ChannelType.GuildText,
        parent: category.id,
        permissionOverwrites: [
          {
            id: interaction.guild.id,
            deny: [PermissionFlagsBits.ViewChannel],
          },
          {
            id: mentor.id,
            allow: [
              PermissionFlagsBits.ViewChannel,
              PermissionFlagsBits.SendMessages,
            ],
          },
          {
            id: ORGANIZER_ROLE_ID,
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
