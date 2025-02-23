const Discord = require("discord.js");
const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} = require("discord.js");
const { GatewayIntentBits } = require("discord.js");
const axios = require("axios");
const bot = new Discord.Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});
require("dotenv").config();

const token = process.env.BOT_TOKEN;

const prefix = "!";

bot.on("ready", () => {
  console.log("bot is working!");
});

bot.on("messageCreate", async (msg) => {
  if (msg.author.bot) return;
  if (msg.content.toLowerCase() === "hello") {
    msg.reply("Hello Good People!");
  }

  if (!msg.content.startsWith(prefix)) {
    return;
  }
  const args = msg.content.slice(prefix.length).trim().split(/ +/g);

  const command = args.shift().toLowerCase();
  console.log(args);

  if (command === "ego") {
    msg.react("😊");
  }

  if (command === "clear") {
    let num = 2;
    if (args[0]) {
      num = parseInt(args[0]) + 1;
    }
    msg.channel.bulkDelete(num);
    msg.channel.send(`Deleted ${num - 1} messages!`);
  }

  if (command === "capslock") {
    const combinedArgs = args.join(" ");
    msg.channel.send(
      `${
        msg.author.username
      } is angry and says:\n\n ${combinedArgs.toUpperCase()}`
    );
  }

  if (command === "search") {
    let query = args.join(" ");
    try {
      let response = await axios.get(
        `https://imagestack.onrender.com/api/search/photos?query=${query}`
      );

      console.log("API Response:", response.data);

      if (!response.data.photos || response.data.photos.length === 0) {
        msg.channel.send(response.data.message || "No images found.");
      } else {
        let imageUrls = response.data.photos.slice(0, 5);
        for (let photo of imageUrls) {
          const embed = new EmbedBuilder()
            .setImage(photo.imageUrl)
            .setDescription(photo.altDescription || "No description available.")
            .setFooter({
              text: "Click the button below to download the image.",
            });

          const downloadButton = new ButtonBuilder()
            .setLabel("Download Image")
            .setStyle(ButtonStyle.Link)
            .setURL(photo.imageUrl);

          const row = new ActionRowBuilder().addComponents(downloadButton);

          await msg.channel.send({ embeds: [embed], components: [row] });
        }
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404 && error.response.data.message) {
          msg.channel.send(error.response.data.message);
        } else {
          msg.channel.send(
            `Error: ${error.response.status} - ${
              error.response.data.message || "Something went wrong!"
            }`
          );
        }
      } else {
        console.error("Axios Error:", error);
        msg.channel.send(
          "An error occurred while fetching images. Please try again."
        );
      }
    }
  }
});

bot.login(token);

const express = require("express");
const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
  res.send("Bot is running!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
