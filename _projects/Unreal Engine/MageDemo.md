---
layout: page
title: Mage Ability Demo
description: Project to showcase mage abilities
img: assets/img/projects/mage-ability-demo/mage-ability-demo-thumbnail.png
importance: 2
category: Unreal
toc:
  sidebar: right
---

## Overview

A prototype built to experiment with a custom ability framework and animation-driven combat.
The goal was to explore modular design before moving on to Unreal’s Gameplay Ability System (GAS).

---

## Highlights

- Designed a <b>modular ability system</b> (projectile, beam, teleport, heal).
- Implemented <b>Enhanced Input</b> for ability selection and activation.
- Used <b>Animation Notifies</b> to synchronize VFX and gameplay logic.
- Created custom <b>Niagara VFX</b> for clarity and feedback.
- Built a simple <b>resource system with cooldowns</b> for ability pacing.

<div>
    {% include video.liquid path="assets/video/mage-ability-demo/abilities.mp4" class="img-fluid rounded z-depth-1" autoplay=true loop=true controls=true %}
    <div class="caption">
        Abilities
    </div>
</div>

<div>
    {% include video.liquid path="assets/video/mage-ability-demo/demo.mp4" class="img-fluid rounded z-depth-1" autoplay=true loop=true controls=true %}
    <div class="caption">
        Demo
    </div>
</div>
