# discord-neofetch

<!-- markdownlint-disable no-inline-html header-increment no-trailing-punctuation -->

> ### ⚠️ This project is still a work in progress. The bot might be unstable and changes might not have been deployed yet. Use it at your own risk.
>
> ##### The bot is currently offline and will be up and running once it has been migrated to v14 of discord.js and all the errors have been fixed. See [#4](https://github.com/savioxavier/discord-neofetch/issues/4) for more details.
>
> **View your Discord information, neofetch style!**

## Add to your server

[![Add Neofetch Bot](https://img.shields.io/badge/-Add%20Neofetch%20Bot-141B2E?style=for-the-badge&logo=discord)](https://discord.com/api/oauth2/authorize?client_id=938858179993952297&permissions=535260818496&scope=bot%20applications.commands)

## Demo

### Here's a demo of the bot

![Demo](neofetch_showcase.gif)

## FAQs

- **Hmm. What's this?**

This is the Neofetch bot, a _really_ cool bot that allows you to view your Discord information, right in Discord, _neofetch style_. Complete with fully customizable prompts and ascii distros, this is every developer's dream come true.

- **Why would I even need this?**

Because everybody absolutely loves [Neofetch](https://github.com/dylanaraps/neofetch), a command-line tool that displays your system information. This bot is a hobby project of mine, and I, inspired by the orginal CLI tool, wanted to make a visual Discord version of it.

Also you get to show off your favorite distro (looking at you arch btw users).

- **How does it even work?**

Alright, so Discord recently added ANSI escape codes to codeblock messages, which means that you can 'colorize' your output an style it whichever way you want. This bot takes advantage of this feature, and works around with the color codes using `chalk` to produce a neofetch-like colored output.

Unfortunately, mobile support for ANSI codes haven't been added yet, but fear not! There's a button called `--mobile` that outputs a mobile friendly view of the information. Alternatively, you can use the `/neomobile` command too!

- **What sort of information is displayed?**

Here's a list of the information that is displayed:

> | Name        | Description                                                         |
> | ----------- | ------------------------------------------------------------------- |
> | Username    | The author/user's tag (eg: Wumpus#0001)                             |
> | ID          | The author/user's unique Discord ID                                 |
> | Created     | The date on which the user/author's account was created             |
> | Is Bot      | Checks if the user/author is a bot                                  |
> | CPU Usage\* | CPU Usage count, similar to neofetch                                |
> | Shell\*     | Distro specific shell                                               |
> | Packages\*  | Package count, with the appropriate distro specific package manager |
>
> Fields marked with a `*` are randomized values and do not directly depend on the Discord API

- **What distros are supported?**

Here's a list of distros that this bot supports. Choose any one you'd like:

> | Name              | Value        |
> | ----------------- | ------------ |
> | Discord (Default) | `discord`    |
> | Arch Linux        | `arch`       |
> | Fedora            | `fedora`     |
> | Manjaro           | `manjaro`    |
> | Mint              | `mint`       |
> | Pop!\_OS          | `popos`      |
> | Ubuntu            | `ubuntu`     |
> | Android           | `android`    |
> | CentOS            | `centos`     |
> | Debian            | `debian`     |
> | Elementary        | `elementary` |
> | Gentoo            | `gentoo`     |
> | MacOS             | `macos`      |
> | Windows           | `windows`    |

All the above distros and their ascii arts have been ported from [dylanaraps/neofetch](https://github.com/dylanaraps/neofetch).

- **What prompts are supported?**

Here's a list of prompts that this bot supports. Choose any one you'd like:

> | Name              | Value      |
> | ----------------- | ---------- |
> | Default (Default) | `default`  |
> | Pristine          | `pristine` |
> | AFMagic           | `afmagic`  |
> | Candy             | `candy`    |
> | Zap               | `zap`      |
> | Percent           | `percent`  |
> | Wuffers           | `wuffers`  |

All the above prompts have been ported from [ohmyzsh/ohmyzsh](https://github.com/ohmyzsh/ohmyzsh).

- **What commands are available?**

Here's a list of commands that are available:

> | Command            | Description|
> | ------------------ | ---------- |
> | `/neofetch`        | The main neofetch command.<br>Used to display the neofetch-ed information of the author<br>or the user mentioned, in accordance with their set distro and prompt.<br>Also displays a set of neofetch-like, non-Discord related info,<br>such as the number of packages, shell, etc. |
> | `/neomobile`       | A mobile version of the neofetch command. |
> | `/neoconf distro`  | Customize your distro from a list of options. |
> | `/neoconf prompt`  | Customize your prompt from a list of options. |
> | `/info`            | Display relevant information about the bot. |
> | `/help`            | View a list of bot commands. |
> | `/invite`          | Display an invite link to add your bot to your server. |

- **Are there slash commands?**

Absolutely! Check them out by typing in `/help`. Legacy commands aren't supported though, as they have been deprecated.

- **Cool bot, can I add it to my server?**

Of course you can! Just click [this link](https://discord.com/api/oauth2/authorize?client_id=938858179993952297&permissions=535260818496&scope=bot%20applications.commands) and select the server of your choice.

- **Why is the code so bad?**

Because we need you! A number of contributors are helping to expand and improve the code base. Why don't you join us?

- **How can I contribute?**

Just check out the Issues pane for potential issues and submit a PR to solve them. Of course, you can always contribute to the inprovement of the code, and I'd be happy to accept your PRs!

## Support

You can support further development of this bot by **giving it a 🌟** and help me make even better stuff in the future by **buying me a ☕**

<a href="https://www.buymeacoffee.com/savioxavier">
<img src="https://cdn.buymeacoffee.com/buttons/v2/default-blue.png" height="50px">
</a>

<br>

**Also, if you liked this repo, consider checking out my other projects, that would be real cool!**

## Attributions and special thanks

- [dylanaraps/neofetch](https://github.com/dylanaraps/neofetch) for introducing neofetch to the world, without which this bot wouldn't have existed.
- [ohmyzsh/ohmyzsh](https://github.com/ohmyzsh/ohmyzsh) for the cool prompts.
- This [Reddit post](https://www.reddit.com/r/discordapp/comments/sa6vvx/i_was_able_to_make_a_fake_neofetch_with_the/) for the original inspiration.
- [chalk/chalk](https://github.com/chalk/chalk) for creating the most versatile terminal styling library ever. Saved me a ton of time and work so that I wouldn't have to place ANSI codes everywhere and ruin the whole thing.
- Bot avatar: [Terminal icons created by SumberRejeki - Flaticon](https://www.flaticon.com/free-icons/terminal)
