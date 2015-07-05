#Daemon Fetcher

The module grab information from different sites and return it as JSON file.

You can write addictional fetching modules such as bitcoinwarrior module. 
Module should have fetch method which return grabbed data by callback.

**Install:**

- type `npm install`
- change `config/config.json`

**Run:**
- type `npm start`

or

- type `npm link`
- create `/etc/init/daemon-fetcher.conf` with: `exec daemon-fetcher`
- type `start daemon-fetcher`
