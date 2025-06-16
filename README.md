# RandomBot

Currently only has a test /ping command and /track

## Public commands (Anyone can use them)

### Ping

Ping returns with the current roundtrip latency of the bot

Example: `/ping`

## Admin only commands (requires administrator priveleges in server to run)

### Twitch

Connected to a database, allows you to choose which streamers you want notified, and where you want the notification to go.<br>
Currently all notifications are notified in the "{streamerName} is now live on Twitch!" format, followed by an embed.

Commands:<br>
To add streamers:<br>
`/twitch add {streamerName} {channel}`

To edit which channel streamer notifications are sent to:<br>
`/twitch edit {streamerName} {channel}`

To remove streamers: <br>
`/twitch remove {streamerName}`

### Welcomes

Allows you to set a welcome message, with custom title, custom message and choose a channel to send it to

{image url} and {hexColor} are optional, and will provide the url for the Embed image and Embed color respectively. If none are defined it will post without a custom image and with the default Discord gray color

Commands:<br>
To add welcome message:<br>
`/welcome add {welcomeTitle} {welcomeMessage} {channel} {imageUrl} {hexColor}`

To edit welcome message:<br>
`/welcome edit {welcomeTitle} {welcomeMessage} {channel} {imageUrl} {hexColor}`

To delete welcome message:<br>
`/welcome delete`<br>
_Note: This will delete the actual message from the bot, if you just want to disable the welcome message instead try `/options setting:welcomeMessage on_off:False`_

### Options

Sets the options for various other commands

e.g.
`/options setting:twitchNotifications on_off:True`

#### Available options

`twitchNotifications` - For enabling and disabling Twitch notifications in the server<br>
`welcomeMessage` - For enabling and disabling welcome messages in the server
