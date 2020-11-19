+++
title = "Configuration"
template = "configuration.html"
+++

## Intro

sInterface is designed to be hackable. There are no profiles; components are independant; there is no dependency on `WTF/`. Transfer configurations between PCs by taking only your `sInterface_Configuration` directory.

Make changes in a code editor, then hit `/rl` in-game.

## Create a configuration addon

Create the directory `sInterface_Config` in your `_retail_/Interface/AddOns` directory

sInterface has an optional dependency, meaning that WoW will load your configuration addon before sInterface

## Create the toc file

Toc files are the entrypoint to an addon. They contain metadata and list all files that the addon needs. [Documentation](https://wow.gamepedia.com/TOC_format)

Create `sInterface_Config.toc`

```
## Interface: 90001
## Title: sInterface Config
## Notes: User customisation

core.lua
```

## Create the first configuration file

Your toc file references `core.lua`, so we need to create the file for the addon to work

Create `core.lua`

```
sInterface_Config = {}
local C = sInterface_Config

print("Hello World!")
```

Reload your interface with `/rl` or `/reload` and look at the chat for your message. You may need to restart your game client before sInterface_Config is loaded

The variable sInterface_Config is important because it's what sInterface looks for when applying your configuration.

## Add your first configurations

So far the addon loads and prints Hello World!, but doesn't change any elements. sInterface has a `config.default` directory containing all the supported configuration options. You can mix and match any of the options in your own addon.

For example, if you want to: reposition actionbar 1; permanently show it; and disable the chat module in favour of Glass/Prat/etc then you could add this to the bottom of your `core.lua`:


```
C["actionbars"] = {
  bar1 = {
    framePoint      = { "CENTER", UIParent, "BOTTOM", 0, 150 },
    frameVisibility = "show"
  }
}

C["chat"] = {
  enabled = false
}
```
