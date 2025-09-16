---
layout: page
title: Stealth Game Prototype
description: Faith In Abyss
img: assets/img/projects/fia/background.png
importance: 1
category: Unreal
slug: faith-in-abyss
toc:
  sidebar: right
---

## Overview

A first-person stealth prototype exploring advanced AI systems built with Unreal Engine 5.
The project showcases my ability to extend existing frameworks, design systemic AI, and deliver responsive stealth gameplay.

---

## Highlights

- Built an <b>extended AI Perception system</b> with custom Safezone sense.
- Combined <b>finite state machines, Behavior Trees,</b> and <b>State Trees</b> for layered decision-making.
- Integrated <b>pathfinding</b> with dynamic investigation points projected on the navmesh.
- Designed <b>patrol, search, and chase behaviors</b> reactive to sound and sight.
- Developed <b>AI debugging overlays</b> for faster iteration.

---

## Writeups
{% include project_writeups.liquid project_slug=page.slug %}

## Articles
<section id="articles">
    {% assign articles = site.articles | sort: 'priority' %}
    <div class="container">
        <div class="row row-cols-1 row-cols-md-5">
            {% for article in articles %}
                {% include article-item.liquid item=article %}
            {% endfor %}
        </div>
    </div>
</section>
