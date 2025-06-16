# RandomBot

Currently only has a test /ping command and /track

## Ping

Ping returns with a simple "pong" to show the bot is online and available

Example: `/ping`

## Twitch

Connected to a database, allows you to choose which streamers you want notified, and where you want the notification to go.<br>
Currently all notifications are notified in the "{streamerName} is now live on Twitch!" format, followed by an embed.

Commands:
To add streamers:<br>
`/twitch add {streamerName} {channel}`

To edit which channel streamer notifications are sent to:<br>
`/twitch edit {streamerName} {channel}`

To remove streamers: <br>
`/twitch remove {streamerName}`

## Options

Sets the options for various other commands

e.g.
`/options setting: twitchNotifications on_off: true`
