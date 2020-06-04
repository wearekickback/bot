const token = process.env.DISCORD_TOKEN;
const { Client } = require('discord.js');
const moment = require('moment')
const client = new Client();
var _ = require('lodash');

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

const handleMessages = (messages, msg) => {
  const mention = msg.mentions.users.first()
  let lastMessage
  a = messages.first(100).map(m => {
    let embed, embedTitle, embedType, embedUrl, imageUrl
    counter = m.id
    if(m.embeds.length){
      embed = m.embeds[0]
      embedTitle = embed.title
      embedType = embed.type
      embedUrl = embed.url
      imageUrl = embed.thumbnail.url
    }
    const attachement = m.attachments.length ? m.attachments[0] : null
    let obj = {
      content:m.content, createdTimestamp:m.createdTimestamp, createdAt:m.createdAt,
      messages: m.message,
      authorId: m.author.id,
      channelId: m.channel.id,
      attachement,
      embed,
      counter
    }
    lastMessage = obj
    // console.log(obj)
    if(embedUrl && m.author.id === mention.id){
      // const attachment = new MessageAttachment(imageUrl);
      // Send the attachment in the message channel
      msg.channel.send(`${m.author.username} : ${moment(m.createdAt).fromNow()} ${embedTitle}  <${embedUrl}>`)
      console.log(obj)
    }
  })
  return lastMessage
}


client.on('message', msg => { 
  if(msg.author.bot){
      return;
  }
  const chennelId = msg.channel.id
  const channelName = msg.channel.name
  const authorId = msg.author.id
  const authorName = msg.author.username
  const message = msg.content
  if(channelName !== 'makoto' ){
    return
  }
  let matched = message.match(/^\/activity (.*)/)
  if(!matched){
    return
  }
  console.log({chennelId, channelName, authorId, authorName, matched})

  msg.channel.guild.members.fetch()
  msg.channel.messages.fetch({limit:100})
    .then(messages => {
        console.log(`${msg.channel.name} Received ${messages.size} messages`)
        const lastMessage = handleMessages(messages, msg)
        console.log({lastMessage})
        msg.channel.messages.fetch({limit:100, before:lastMessage.counter})
          .then(messages => {
              console.log(`${msg.channel.name} Received ${messages.size} messages`)
              const lastMessage = handleMessages(messages, msg)
              console.log({lastMessage})
          })
    })
    .catch(console.error);
});

client.login(token);