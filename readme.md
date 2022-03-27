# twitch-logs-scraper

Fetches Twitch logs for a provided user and channel using https://logs.ivr.fi/

## How to use

1. [Download the zip](https://github.com/MrAuro/twitch-logs-scraper/archive/refs/heads/main.zip)

2. Install Node.js and NPM from https://nodejs.org/en/

3. Extract the zip file to a folder and run `npm install`

    ```
    $ cd twitch-logs-scraper-master
    $ npm install
    ```

4. Run the script with `node ./index.js <channel> <user> <mode?>`

    The script will save a CSV file to the current directory. You can open this with Excel, Google Sheets, or any other
    spreadsheet software and create a chart.

    The mode can either be `messages` or `timeouts`. If not provided, the script will default to `messages`.

## NOTE:

This script uses a third party API to provide log data. The target channel must be logged on the API. You can view all
available channels [here](https://logs.ivr.fi/).
