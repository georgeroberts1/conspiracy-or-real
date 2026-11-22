# Conspiracy or Real?

A quiz game. Each case is a claim, and you decide whether it really happened or was made up. Real claims link to Wikipedia once you answer.

## Play

Open `index.html` in a browser. There is nothing to install or build.

1. Type your name.
2. Pick how many cases you want: 5, 10, 20, 50 or 100.
3. Answer each case with REAL or MADE UP.
4. Get a rank at the end and copy your score to share.

Each game is drawn at random from the whole pool, split evenly between real and made up. A claim never repeats within a game. Your name and round choice are remembered in the browser.

## Share it

`index.html` is the whole game. The claims, styles and code are all inside it, so you can send that one file on its own.

The tab icon and title also work from the file. Link previews (for example in WhatsApp) do not, because they need the game hosted at a public address.

## Add or edit claims

Edit `conspiracy.json`, then run:

```
node sync.js
```

This copies the claims into `index.html`. It needs Node.js and nothing else. Do not edit the claims inside `index.html` by hand, because the next sync overwrites them.

Each claim looks like this:

```json
{
  "real": true,
  "text": "The claim shown to the player.",
  "explain": "True. Shown after they answer.",
  "wiki": "https://en.wikipedia.org/wiki/Example"
}
```

| Field | Notes |
| --- | --- |
| `real` | `true` if it happened, `false` if it was made up. |
| `text` | The claim. Escape inner quotes as `\"`. |
| `explain` | Shown on reveal. `{name}` is replaced with the player's name. |
| `wiki` | Optional. Real claims only. Must be an `en.wikipedia.org/wiki/` link. |

`sync.js` checks the file first. It stops without changing `index.html` if the JSON is invalid, a field is missing, a claim is duplicated, or a `wiki` link is malformed. It also lists real claims that have no link.

## Settings

The block marked `EDIT ME` at the top of the script in `index.html` holds the settings.

| Setting | Meaning |
| --- | --- |
| `ROUND_CHOICES` | The round counts players can pick. Counts above the pool size are capped. |
| `DEFAULT_ROUNDS` | The preselected round count on a first visit. |
| `DEFAULT_NAME` | The name used when the field is left empty. |
| `RANKS` | End-screen titles. Each `max` is the share of answers right, from 0 to 1. |

## Files

| File | Purpose |
| --- | --- |
| `index.html` | The game. This is the only file players need. |
| `conspiracy.json` | The claims. Edit this one. |
| `sync.js` | Validates the JSON and copies it into `index.html`. |

## Notes

- The font loads from Google Fonts. Offline, the game falls back to a monospace font.
- Three real claims have no Wikipedia link because no matching article exists. `sync.js` lists them each time it runs.
