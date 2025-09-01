---
title: Race Track Generation in Alpaca Dash
description: >
  Pipeline, Bezier Splines, Mesh Generation
layout: distill
thumbnail: assets/img/projects/alpaca-dash/red-rock-cliffs-background.png
priority: 1
toc:
  - name: Map Creation Pipeline
  - name: Track Mesh Generation from Spline
    subsections:
        - name: Multi-Lane Tracks
  - name: Procedural Obstacles
  - name: Conclusion
images:
  compare: true
  slider: true
tabs: true
---

One of the core systems in <i>Alpaca Dash</i> for the <b>Map creation pipeline</b> was our <b>procedural race track generation</b>. We wanted each race to feel unique-some tracks tight and technical, others straight and fast-while still producing meshes clean enough for our artists to build environments around.

On this system:

- I helped <b>design the pipeline</b>
- Implemented <b>custom Bezier</b> and <b>mesh generation</b> with my senior
- <b>Created editor tools</b> for artists to easily configure track visuals

---

## Map Creation Pipeline

The process begins with our custom <b>Bezier Spline</b> defining the track contour. Designers adjust control points to emphasize different dynamics:

- Corner-heavy → technical tracks
- Balanced → mix of straights & corners
- Straight-dominant → speedways

Before artists begin working on environment visuals, we first test <b>racing behavior</b> directly on the generated track to ensure the layout feels fun, fair, and aligned with the intended <b>design goals</b>.

Once validated, a sample mesh is created from the spline, exported as an FBX file and brought into <b>Blender</b>, where artists can build the environment around it. This ensures that the <b>gameplay-driven spline becomes the foundation of the entire map.</b>

---

## Track Mesh Generation from Spline

<div>
    {% include video.liquid path="assets/video/alpaca-dash/track-generation-bezier.mp4" class="img-fluid rounded z-depth-1" autoplay=true loop=true controls=true %}
    <div class="caption">
        Generating track mesh in editor using 2d Bezier
    </div>
</div>

At runtime, we turn the spline into a mesh. The core of this process is in our `Generate()` method:

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
        segmentCosineThreshold increases ring density as curvature rises
    </div>
</div>

### Multi-Lane Tracks

Beyond simple vertex offset, we added control over how track <b>materials and UVs</b> behave across multiple lanes.

```c#
public enum UVMode {
    PER_LANE, // Each lane has its own UV space
    PER_LANE_EXTEND, // Like PER_LANE but stretches UVs across overlaps
    UNIFY_LANES, // All lanes share one continuous UV
}
```

When generating each ring, the laneWidth is adjusted based on the selection mode:
```c#
void addRing(float t, int laneId, bool isFirstRing, Color vertexColor) {
                var laneWidth = raceTrackData.LaneWidth * (1.0f + meshGenerationSettings.TrackOverlapSize *
                    Mathf.Max(meshGenerationSettings.UVMode == UVMode.UNIFY_LANES
                        ? ((laneId <= 0 || laneId >= raceTrackData.NumLanes - 1) ? 0.5f : 0.0f)
                        : 1.0f, 0.01f));
```

This gives artists and designers control over the look of the track for each map.

{% tabs uvmode %}

{% tab uvmode per-lane %}
    {% include figure.liquid path="assets/img/projects/alpaca-dash/track-generation-uv-lane.png" class="img-fluid rounded z-depth-1" zoomable=true %}
{% endtab %}

{% tab uvmode unify-lanes %}
    {% include figure.liquid path="assets/img/projects/alpaca-dash/track-generation-uv-unify.png" class="img-fluid rounded z-depth-1" zoomable=true %}
{% endtab %}

{% endtabs %}

<div class="caption">
    Click to zoom
</div>

---

## Procedural Obstacles

Obstacles are generated as <b>virtual sub-meshes</b> during track build. Each race session receives obstacle descriptors from backend such as start, end and lane number along the spline. At runtime, they are mapped to mesh segments.

Instead of spawning separate meshes, we treat obstacle spans as <b>submesh index ranges</b>. This lets us assign a different material per segment while keeping the track a single mesh.

{% details Show code: Building obstacle submeshes and blend margins %}
```c#
    var subMeshes = new List<UnityEngine.Rendering.SubMeshDescriptor>();
    var blendSize = obstacleBlendSize / raceTrackData.Length;
    
    // Loop for material & segment list key-pair
    foreach (var segments in segmentsPerType) {
        // Loop for lane & segment key-pair
        foreach (var segment in segments.segments) {
            var segmentStart = segment.segment.start;
            var segmentEnd = segmentStart + segment.segment.length;
            var sizeDelta = blendSize * (1.0f - obstacleBlendBias) *
                            ((segment.segment.length >= 0.99999f) ? 0.0f :
                                (subMeshes.Count <= 0) ? -1.0f : 1.0f);
            var loopStart = segmentStart - sizeDelta;
            var loopEnd = segmentEnd + sizeDelta;

            // Track circle overlap condition checks
            if (loopStart < 0) {
                var delta = Mathf.Floor(-loopStart) + 1.0f;
                if (loopEnd >= 0) {
                    addSegment(loopStart + delta, 1.0f, blendSize, 0.0f);
                    addSegment(0.0f, loopEnd, 0.0f, blendSize);
                }
                else {
                    addSegment(loopStart + delta, loopEnd + delta, blendSize, blendSize);
                }
            }
            else addSegment(loopStart, loopEnd, blendSize, blendSize);
        }

        // Enlist generated submesh from segments
        subMeshes.Add(new UnityEngine.Rendering.SubMeshDescriptor(startIndex, triangles.Count - startIndex));
    }

    var mesh = new UnityEngine.Mesh() { /* Pass vertices, colors, normals, uv, triangles */ };
    mesh.SetSubMeshes(subMeshes);
```
{% enddetails %}

The visuals are fully customizable: the <b>track material</b> and <b>obstacle material</b> are blended in the shader, with per-segment parameters driven via `MaterialPropertyBlock`.
Designers can tune these directly in the editor.

<div>
    {% include video.liquid path="assets/video/alpaca-dash/track-generation-obstacle-customization.mp4" class="img-fluid rounded z-depth-1" autoplay=true loop=true controls=true %}
    <div class="caption">
        Artists have control of customizing obstacle materials and blendings
    </div>
</div>

---

## Conclusion

By combining

- Bezier Splines, tangent vectors, cosine thresholds
- Adaptive mesh subdivision, lane offsets, obstacle placement
- Blender integration and handcrafted environments

we built a system where every race track could be <b>procedurally unique yet artistically polished</b>.
