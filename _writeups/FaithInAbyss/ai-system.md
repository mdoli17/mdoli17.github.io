---
title: Implementing AI Logic
description: Implementation of AI System in Faith in Abyss
project: faith-in-abyss
thumbnail: assets/img/3.jpg
priority: 1
layout: page
permalink: /projects/faith-in-abyss/:name/
---

<h2>
AI System Overview
</h2>

`Behavior Trees` are a powerful tool for implementing AI decision-making logic. However, I found that tracking the AI’s current state at specific moments-and dynamically changing its behavior was inconvenient when using Behavior Trees alone.

To address this, I chose to separate certain aspects of state handling and decision-making from the `Behavior Tree` and `AI Controller`. Using `State Tree` alongside the `Behavior Tree` I was able to achieve a cleaner structure and more maintainable logic, allowing each system to play its strengths.

<br>
<br>

<h2>
Component Roles
</h2>

- `AI Controller`<br>
    Acts as the central coordinator. It owns both the Behavior Tree and the State Tree. It handles environmental perception (such as sight, sound, custom safe-zone stimuli) and passes relevant information to the State Tree.<br>

- `State Tree`<br>
    Responds to input from the AI Controller. It transitions between high-level states (Patrol, Search, Combat, Lurk) and runs associated tasks. These tasks update the Blackboard values used by the Behavior Tree.<br>

- `Behavior Tree`<br>
    Uses the current Blackboard values to drive low-level behavior logic, such as movement, animations and executing actions.<br>

This separation allows each system to focus on a specific layer of decision-making: State Tree for high-level state management, and Behavior Tree for executing detailed behavior logic.
