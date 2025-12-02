# Contribution Guidelines

We encourage anyone who wants to support this site and/or our community to contribute to this project - either by working on the source code itself, or just sharing news for RoundUps!

This document is a set of guidelines meant to help you with your contribution.

## Sharing News for a RoundUp

### What is Allowed

Ultimately, we want to err on the side of inclusion. If you think you have a piece of news, a video, a project, or anything that you think would be of some interest to the *St Louis Game Development Community* [**SLGDC**], then we encourage you to share! If it turns out not to be appropriate for some reason, we can always remove it and speak to you about it. Don't be afraid to share!

*DO NOT SPAM!* Do *not* keep sharing news about the same *Project* every issue. Do not try to promote something completely outside the scope of this website.

#### Who is a *Community Member*?

It is important to know who we consider a *Community Member* for the purpose of drawing some kind of line on the map for the sake of brevity. Again, these are *loose guidelines* and if you think you are *close enough* to count, you're welcome to!

* Anyone who lives or works in or "around" St Louis - I might even go as far as to say Anyone in Missouri and/or Illinois, really, since KC and Chicago people are welcome!
* Anyone working on a project remotely (outside the first area) where any members of the team are based in the first area.
* Anyone who was formerly in the first 2 groups and has some projects that were made during that time who have since moved away
* Anyone with near-future plans to be in the first 2 groups

#### What *Project* are allowed?

Any of the following count as the types of *Project* that we want to hear about!

* Video Games
* Tabletop Games
* Mods, Tools, Websites, or other projects that are connected to the other types of *Project*
* Prototypes, Game Jam Games, Experiments, Books, Articles, Blog Posts, etc that are roughly in the "Game" space.
* Any side project that is not one of the above, but is made by a *Community Member* who predominantly makes/releases/works on projects of those other types

#### So what CAN be Shared?

Here is a list of the kinds of things we *encourage* anyone to share!

* A new *Project* announced/updated/released by a *Community Member*
* Some kind of announcement about one of those *Projects* - like an award nomination/earned, etc
* A *Community Member* Streaming as they work on a *Project*
* Events that are taking place in our area relevant to the Community
* Any articles, blog posts, videos, streams, let's plays featuring a *Project* from a *Community Member*
* Some kind of useful or interesting information that could be useful to any *Community Member*: a hiring notice, an interesting or useful video/article/etc about something game dev related, a game jam announcement, etc
* A video of someone playing a *Project* by a *Community Member*
* A *Community Member* Streaming random games not made in our area.

### How to Share your news

Every future RoundUp Issue will have an Open Issue pre-generated under the [Repository's Issues](https://github.com/STLGameDev/STLGameDevRoundUp/issues). Simply leave a comment under that Issue with your news item you want to share, and it will end up in the next RoundUp Issue automatically!

When adding your news item, it should match the following format:

```text
{🤖 category} Your news info [Optional Link](https:/link/to/something)
```

We have been putting a (loosely) appropriate emoji at the start of the category name for fun.

Your category can be anything you like, however, if there are already comments in the issue, we would suggest re-using an existing category *if it matches your news item*.

For example, if you want to share a trailer, you might put your category as: `{📼 videos}` or `{📽 trailers}` or something. But, if you already see a news item with a category for `{📽 trailers}` please don't make a new category called `{👑 better trailers}` or something - copy the exact wording and emoji used in the previous news item for this RoundUp.

This ensures that news with the same categories are all grouped together.

Feel free to add as many new news items as you want, but keep it to one entry per comment.

### Generating a New RoundUp Issue

This site uses a [GitHub Action](https://github.com/STLGameDev/STLGameDevRoundUp/actions/workflows/generate-new-issue.yaml) to generate a new RoundUp Issue. We can do this at any time, however, for now, we are going to try to only put out a new issue every other week on Wednesday - IF there is enough content to warrant putting one out. You can leave this to [SeiferTim](https://github.com/SeiferTim) to handle.

### Fixing an error

If you discover an error or need to correct some information in an *already generated RoundUp*, you must edit the Data file for that issue directly.

In the Repository, under the `data` folder, find the `.json` file for the issue you need to change. For example, Issue #1 is located here: [https://github.com/STLGameDev/STLGameDevRoundUp/blob/main/data/issue1.json]

Make your change as a new PR and it will be added later.

### Removing a news entry

To remove an entry from an *already generated RoundUp* you must edit the file as described above, and remove the entire Json object for that entry.

For example:

```json
{
      "body": "The incorrect news item!"
},
```

Make sure the final file is proper Json syntax and submit the change as a PR.

### Fixing an error / Requesting Removal

Currently, there is no simple way for someone to edit or remove themselves from either list. Simply reach out to [SeiferTim](https://github.com/SeiferTim) with your request and they will take care of it for you.

## Contributing to the Project's Code

We encourage anyone who wants to help improve the site to contribute to the site's code as long as those changes adhere to the core values of this project.

Those values are:

* To help facilitate spreading awareness of the people and projects that are part of our community first and foremost
* To be a *free* resource for anyone to see what's happing in and around our community
* To be as simple and hassle-free for anyone to include their news to future RoundUps
* To never 'sell out', or include advertisements anywhere on our site

The site is made with [Hugo](https://gohugo.io/) and [Bootstrap](https://gohugo.io/).

The site is deliberately designed to be fairly simple to encourage even less experienced developers to take the plunge and share their changes.

We use [GitHub Actions](https://github.com/STLGameDev/STLGameDevRoundUp/actions) to automatically build and deploy the site whenever changes to the code are committed.
