# RandomBot

Currently only has a test /ping command and /track

## Ping

Ping returns with a simple "pong" to show the bot is online and available

Example: `/ping`

## Track

Track is a command to check package status for packages sent through Posten or Bring.<br>
Track has a tracking number requirement, this tracking number is then sent to Posten and returns with information about the package

Example: `/track TESTPACKAGEDELIVERED` or `/track 16546874651849`

Note: if the tracking number isn't found, it will return a TypeError. This will be fixed to provide a proper answer later.
