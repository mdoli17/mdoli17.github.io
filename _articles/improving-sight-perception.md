---
title: Improving Sight Perception in Stealth Prototype
description: Awareness Scoring, Vision Cone, State Integration
layout: distill
thumbnail: assets/img/projects/fia/vision-model-thumbnail.png
priority: 3

toc:
  - name: Introduction
  - name: Problem with Default Vision
  - name: Vision Model Overview
  - name: Core Math - Target Weight Calculation
  - name: Smooth Cone Tracking
  - name: Integration with AI Framework
  - name: Gameplay Impact
  - name: Closing
---

## Introduction

In stealth gameplay, vision is more than a simple on/off switch. Binary detection often feels predictable - either the player is seen or completely invisible. To build tension and create more believable AI, I extended Unreal Engine's perception system with a custom <b>Vision Model Component</b>.

This system introduces <b>smooth vision cone tracking</b>, a <b>target weight scoring model</b>, and <b>progressive awareness buildup</b>, all fully integrated into my AI framework.

## Problem with Default Vision

Unreal's built-in sight perception works, but it is limited:

- Detection is instantaneous and binary
- AI can snap from idle to chase with no buildup
- Little room for "suspicion"

I wanted to move from <b>robotic detection</b> to <b>gradual, math-driven awareness.</b>

## Vision Model Overview

The Vision Model Component calculates a <i>weight</i> for each visible target and updates an <b>Awareness Score</b> over time. This enables states like:

- <b>Suspicious</b>: Player is barely noticed.
- <b>Searching</b>: AI saw "something" and investigates.
- <b>Detected</b>: Player is fully itendified.

<div>
    {% include video.liquid path="assets/video/fia/vision-model-pov.mp4" class="img-fluid rounded z-depth-1" autoplay=true loop=true controls=true %}
</div>

## Core Math - Target Weight Calculation

Each target's visibility is scored using:

- <b>Distance</b>

<div>
    {% include video.liquid path="assets/video/fia/vision-distance-footage.mp4" class="img-fluid rounded z-depth-1" autoplay=true loop=true controls=true %}
    <div class="caption">
        Vision Model - Distance Scoring
    </div>
</div>

<aside>
{% include figure.liquid path="assets/img/projects/fia/distance-falloff.png" class="img-fluid rounded z-depth-1" zoomable=true %}
<p class="caption">Click to zoom</p>
</aside>

- <b>Angle</b>

<div>
    {% include video.liquid path="assets/video/fia/vision-angle-footage.mp4" class="img-fluid rounded z-depth-1" autoplay=true loop=true controls=true %}
    <div class="caption">
        Vision Model - Angle Scoring
    </div>
</div>

<aside>
{% include figure.liquid path="assets/img/projects/fia/angle-falloff.png" class="img-fluid rounded z-depth-1" zoomable=true %}
<p class="caption">Click to zoom</p>
</aside>

- <b>Occlusion</b>

<div>
    {% include video.liquid path="assets/video/fia/vision-occlusion-footage.mp4" class="img-fluid rounded z-depth-1" autoplay=true loop=true controls=true %}
    <div class="caption">
        Vision Model - Occlusion Scoring
    </div>
</div>

<aside>
{% include figure.liquid path="assets/img/projects/fia/occlusion-weight.png" class="img-fluid rounded z-depth-1" zoomable=true %}
<p class="caption">Click to zoom</p>
</aside>

```c++
float UVisionModelComponent:CalculateVisibilityWeight(const AActor* Target) const {
  // Angle
  const float x = FVector::DotProduct(fwdH, dirH); // = cos(theta)
  const float cIn  = FMath::Cos(FMath::DegreesToRadians(AngleInnerDeg));
  const float cOut = FMath::Cos(FMath::DegreesToRadians(AngleOuterDeg));

  // Smoothstep on dot domain
  float t = (x - cOut) / (cIn - cOut);
  t = FMath::Clamp(t, 0.f, 1.f);
  float angleWeight = t*t*(3.f - 2.f*t);  // cubic smoothstep

  angleWeight = FMath::Pow(angleWeight, AngleExp);

  // Distance
  float DistW = 1.f;

  if (DistanceMax > DistanceStart + KINDA_SMALL_NUMBER)
  {
      float t = (d - DistanceStart) / (DistanceMax - DistanceStart);
      t = FMath::Clamp(t, 0.f, 1.f);
      DistW = 1.f - t;  // full near, zero far
  }

  DistW = FMath::Pow(DistW, DistExp);

}
```

[Full Implementation available on GitHub →](https://github.com/mdoli17/code-samples/tree/main/Unreal/Vision%20Model)

The resulting weight is used to <b>increament and awareness score over time</b>. Only when awareness passes relative thresholds does the AI escalate from <i>Suspicious → Searching → Detected</i>.

<div>
    {% include video.liquid path="assets/video/fia/vision-model-scoring.mp4" class="img-fluid rounded z-depth-1" autoplay=true loop=true controls=true %}
    <div class="caption">
        Vision Model Scoring
    </div>
</div>

## Smooth Cone Tracking

The vision cone is aligned with the AI's head orientation rather than snapping directly the the player. This keeps perception grounded in animations and makes AI feel more lifelike.

<div>
    {% include video.liquid path="assets/video/fia/vision-cone-diff.mp4" class="img-fluid rounded z-depth-1" autoplay=true loop=true controls=true %}
    <div class="caption">
        Difference between <b>Default Sight</b> and <b>Custom Cone Smoothing</b>
    </div>
</div>

## Integration with AI Framework

The system ties into Unreal's AI stack:

- Vision Model Component: Broadcasts events for getting a clue, detecting or losing target
- AI Controller: Updates handles vision model events and notifies State Tree using State Tree Events
- State Tree: Handles high-level transitions like <i> Neutral → Search → Hostile<i>
- Behavior Tree: Uses blackboard values to trigger search or chase tasks.

<div>
  {% include figure.liquid path="assets/img/projects/fia/vision-model-diagram.png" class="img-fluid rounded z-depth-1" zoomable=true %}
  <p class="caption">Click to zoom</p>
</div>

## Gameplay Impact

The difference is noticeable:

- AI <b>hesitates</b> before spotting, allowing tense near-misses.
- <b>Suspicion</b> triggers search behaviors, not instant aggression.
- <b>Multiple clues</b> (sound + weak sight) can combine into full detection.

This creates more <b>dynamic, believable stealth encounters.</b>

## Closing

By extending Unreal's perception with math-driven awareness, I made stealth encounters <b>less binary and more immersive</b>. This project shows how <b>custom systems, math, and AI frameworks</b> can combine to improve player experience in systemic gameplay.
