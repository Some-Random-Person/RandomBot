function formatMessage(template, member) {
  const replacements = {
    "{username}": member.user.username,
    "{mention}": member.user,
    "{server}": member.guild.name,
    "{linebreak}": "\n",
  };

  return template.replace(/{\w+}/g, (match) => replacements[match] || match);
}

module.exports = { formatMessage };
