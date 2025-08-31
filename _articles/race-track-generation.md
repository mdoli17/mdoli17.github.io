---
title: Race Track Generation in Alpaca Dash
description: >
    Pipeline, Bezier Splines, Mesh Generation
layout: post
thumbnail: assets/img/projects/alpaca-dash/red-rock-cliffs-background.png
priority: 1
toc:
    sidebar: right
images:
    compare: true
    slider: true
---

One of the core systems in <i>Alpaca Dash</i> was our <b>procedural race track generation pipeline</b>. We wanted each race to feel unique-some tracks tight and technical, others straight and fast-while still producing meshes clean enough for our artists to build environments around.

On this system:
- I helped <b>design the pipeline</b>
- Implemented <b>custom bezier</b> and <b>mesh generation</b> with my senior
- <b>Created editor tools</b> for artists to easily configure track visuals

<br>

---

<h3>Track Creation Pipeline</h3>

<br>

The process begins with our custom <b>Bezier Spline</b> defining the track contour. Designers adjust control points to emphasize different dynamics:
- Corner-heavy -> technical tracks
- Balanced -> mix of straights & corners
- Straight-dominant -> speedways

This spline is exported as JSON and brought into <b>Blender</b>, where our custom Python tool converts it into a mesh artists can build around. That way, the gameplay-driven spline becomes the foundation of the entire map.

<br>

---

<h3>Mesh Generation from Spline</h3>

<br>

<div>
    {% include video.liquid path="assets/video/alpaca-dash/track-generation-bezier.mp4" class="img-fluid rounded z-depth-1" autoplay=true loop=true controls=true %}
    <div class="caption">
        Generating track mesh in editor using 2d bezier
    </div>
</div>

At runtime, we turn the spline into a mesh. the core of this process is in our Generate() method:

```c#
public IEnumerable Generate(RaceTrack raceTrackData) {

    // Has information about track such as default and obstacle materials, uv configuration, and lane height curve
    var meshGenerationSettings = GetMeshGeneratorSettings(raceTrackData.EnvironmentType);
    if (meshRingInterval < 0.01f) meshRingInterval = 0.01f;

    var filter = GetComponent<MeshFilter>();
    if (filter == null) yield break;
    filter.mesh = null;

    if (raceTrackData.Length <= float.Epsilon) yield break;

    var localMatrix = raceTrackData.Transform.worldToLocalMatrix;

    var step = Mathf.Max(meshRingInterval / raceTrackData.Length,
        1.25f / UInt16.MaxValue * raceTrackData.NumLanes * numLaneDivisions);
    var trackDivisions = Mathf.Max(numLaneDivisions, 1) + 1;

    var segmentCosineThreshold = Mathf.Cos(
        Mathf.Clamp(minMeshSegmentAngle, 0.0f, 180.0f) * Mathf.Deg2Rad
    );

    // These are populated later
    var vertices = new List<Vector3>();
    var vertexColors = new List<Color>();
    var normals = new List<Vector3>();
    var uvs = new List<Vector2>();
    var triangles = new List<int>();
    
    ...
}
```

A few key details here:

- `meshRingInterval` controls how often we sample the spline
- `step` adapts subdivisions based on track length and lane count
- `segmentCosineThreshold` ensures we don’t oversample shallow curves

The mesh is built ring-by-ring, with each ring generated perpendicular to the spline tangent and then connected into quads.

<div>
    <img-comparison-slider>
        {% include figure.liquid path="assets/img/projects/alpaca-dash/track-shaded.png" class="img-fluid rounded z-depth-1" slot="first" %}
        {% include figure.liquid path="assets/img/projects/alpaca-dash/track-wireframe.png" class="img-fluid rounded z-depth-1" slot="second" %}
    </img-comparison-slider>
    <div class="caption">
        Segment Cosine Threshold effect - More samples on curves for smoothing
    </div>
</div>

<br>

---

<h3>Multi-Lane Tracks</h3>

<br>

Once a single lane works, supporting multiple lanes is a matter of offsetting the vertices for each lane:

```c#
var step = Mathf.Max(meshRingInterval / raceTrackData.Length,
    1.25f / UInt16.MaxValue * raceTrackData.NumLanes * numLaneDivisions);
```

Here, the `raceTrackData.NumLanes` <b>directly influences subdivision density</b>. This way, adding 3-4 lanes still produces smooth, playable geometry without exploding vertex count.

<br>

---

<h3>Procedural Obstacles</h3>

<br>

Obstacles are generated using the <b>same sampling logic</b> as the mesh. Because we already know position, tangent, and lane offsets at each step, we can deterministically place
obstacles along straights while skipping sharp corners:

```c#
if (Vector3.Dot(prevForward, currForward) > segmentCosineThreshold) {
    PlaceObstacle(localMatrix.MultiplyPoint(position));
}
```

This guarantess fair placement (avoiding blind turns) while still making tracks unpredictable.

<br>

---

<h3>Conclusion</h3>

<br>

By combining
- Bezier Splines, tangent vectors, cosine thresholds
- Adaptive mesh subdivision, lane offset, obstacle placement
- Blender Integration and handcrafted environments

we built a system where every race track could be <b>procedurally unique yet artistically polished</b>.