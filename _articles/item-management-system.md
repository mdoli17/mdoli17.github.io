---
title: Item Management System in Stealth Prototype
description: Description of Item System
layout: distill
thumbnail: assets/img/1.jpg
priority: 2
toc:
- name: Overview
- name: Design Goals
- name: Architecture
- name: Implementation Highlights
- name: Example - Health Potion
- name: Future Improvements
- name: Conclusion
---

## Overview

In my <b>Stealth Prototype</b> project, to let the player explore the environment, interact with objects, and manage resources, I designed a <b>modular Item System</b> that could scale with new item types while staying simple to use. The focus was on <b>maintainability and flexibility</b> for a stealth-driven, resource-management prototype.

> ##### NOTE
> Add footage of using inventory, picking up items and using them
> {: .block-tip}

---

## Design Goals

- Use Unreal's <b>Data Assets</b> for item definitions
- Keep item logic lightweight and modular
- Make it easy to add new items withouth using C++
- Ensure inventory and pickup flow works consistently across item types

---

## Architecture

- `FItemData` - Struct that describes the item (id, name, description, weight, mesh, icon)
- `UItemAction` - Object that has item usage implementation
- `UItemDataAsset` - Wrapper object that stores `FItemData` and `UItemAction`s, which can be used in world
- `UInventoryComponent` - Item container, manages adding/removing/stacking
- `APickupItem` - World object that references `UItemDataAsset`, letting players pick/store/use the item

---

## Implementation Highlights

---

## Example - Health Potion

---

## Future Improvements

- Add save/load support to persist inventory
- Support more item behaviors & actions

---

## Conclusion

This system highlights how I apply data-driven design in Unreal: separating definitions from runtime logic, making new content creation fast, and ensuring the code remains scalable.