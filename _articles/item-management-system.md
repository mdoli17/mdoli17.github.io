---
title: Data-Driven Item System in Stealth Prototype
description: DataAssets, DataTables, Inventory Component
layout: distill
thumbnail: assets/img/projects/fia/item-system-thumbnail.png
priority: 2
tags: [Unreal Engine, C++, Data Structures]
toc:
  - name: Overview
  - name: Design Goals
  - name: Architecture
  - name: In Action
    subsections:
      - name: Data-driven Definitions
      - name: Separation of data vs runtime
      - name: Extensibility
  - name: Future Improvements
  - name: Conclusion
---

## Overview

In my <b>Stealth Prototype</b> project, to let the player explore the environment, interact with objects, and manage resources, I designed a <b>modular Item System</b> that could scale with new item types while staying simple to use. The focus was on <b>maintainability and flexibility</b> for a stealth-driven, resource-management prototype.

{% include figure.liquid path="assets/img/projects/fia/item-system.gif" class="img-fluid rounded z-depth-1" zoomable=true%}

<p class="caption">Click to zoom</p>

---

## Design Goals

- Keep item logic <b>lightweight and modular</b>
- Make it easy to <b>add new items withouth using C++</b>
- Ensure inventory and pickup flow works consistently across item types

---

## Architecture

{% include figure.liquid path="assets/img/projects/fia/item-system-flow.png" class="img-fluid rounded z-depth-1" zoomable=true %}

<p class="caption">Click to zoom</p>

- `FItemData` → `UStruct` that describes the item (id, name, description, weight, mesh, icon)

- `UItemAction` → `UObject` that has item usage implementation

- `UItemDataAsset` → Wrapper `UDataAsset` that stores `FItemData` and `UItemAction`s, which can be used in world

- `DataTables` → Categorize and organize item definitions

- `UInventoryComponent` → Item container, manages adding/removing/stacking

- `APickupItem` → `AActor` that references `UItemDataAsset`, letting players pick/store/use the item

<p class="caption" style="text-align: center; margin-bottom: 0;">DA_Potion_Heal_Large contains data for the item and action which heals the player</p>
{% include figure.liquid path="assets/img/projects/fia/consumable-potion-large-data.png" class="img-fluid rounded z-depth-1" zoomable=true %}
<p class="caption">Click to zoom</p>

---

## In Action

### Data-driven Definitions

A key design choice was to make the system <b>data-driven</b>. Every item is defined in a `UItemDataAsset`, so that creating new items doesn't require touching C++. These assets are organized into DataTables like <i>DT_Potions, DT_Keys, and DT_Junk</i>.

The `APickupItem` actor references a `DataTable` and a row, which automatically assigns the correct data and cosmetics through its construction script. This makes iteration extremely fast: dropping an item into the world is as simple as selecting the right table and row in the Blueprint editor which applies the behavior of the item automatically.

<div>
    {% include video.liquid path="assets/video/fia/item-creation.mp4" class="img-fluid rounded z-depth-1" autoplay=true loop=true controls=true %}
    <div class="caption">
        Item Creation Process
    </div>
</div>

### Separation of data vs runtime

The system also enforces a clear <b>separation between data and runtime</b>. Assets only store static information like, name, type, weight, while the `UInventoryComponent` manages dynamic logic such as transfering items.

### Extensibility

This structure makes the framework naturally <b>extensible</b>. Consumables, quest items, and equipment all share the same flow, so expanding the item set only requires adding assets, not rewriting core systems.

---

## Future Improvements

While the current Item System is fully functional for the prototype, there are several areas I would expand if this were developed into a larger project:

- <b>Save/Load Support</b> - The inventory currently exists only in memory. Adding persistence (using serialization or save games) would allow the player to keep their items across sessions.

- <b>Richer Item Behaviors</b> - Right now items cover core actions like healing, unlocking areas. Extending the UItemAction framework could support equiping items, other stat modifiers etc.

---

## Conclusion

This system highlights how I apply data-driven design in Unreal: separating definitions from runtime logic, making new content creation fast, and ensuring the code remains scalable.
