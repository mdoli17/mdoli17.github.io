---
title: AI System Overview
description: Detailed analysis of stealth mechanics and AI system
project: faith-in-abyss
slug: ai-system-overview
thumbnail: assets/img/3.jpg
priority: 1
layout: page
permalink: /projects/faith-in-abyss/:title/
tabs: true
toc:
  sidebar: right
mermaid:
  enabled: true
  zoomable: true
images:
  compare: true
  slider: true
pretty_table: true
---

<h2>
Overview
</h2>

In this project, the AI system is designed to create reactive and believable enemy behavior while keeping the underlying logic <b>modular</b>, <b>maintanable, and easy to extend.</b> Its purpose is to manage how enemies perceive the world, decide their current state, and execute appropriate actions in real time.

Gameplay-wise, I took inspiration from the <b>unpredictable and relentless enemy encounters</b> in <i>Outlast</i>, and the <b>tense, location-driven threat dynamics</b> of the series <i>From</i>. Both emphasize the importance of enemies that react believably to the player's actions and surroundings, which informed my focus on clear state transitions and context-driven behaviors.

Behavior Trees are a powerful tool for implementing AI decision-making logic. However, I found that tracking the AI’s <b>current high-level state</b> at specific moments-and dynamically changing its behavior was inconvenient when using Behavior Trees alone.

To address this, I chose to combine a <b>State Tree</b> with the Behavior Tree.The State Tree manages <b>high-level transitions</b> (such as Neutral, Search, Hostile) and updates shared data, while the Behavior Tree executes <b>low-level actions</b> based on that state. This hybrid approach resulted in <b>cleaner structure, clearer separation of responsibilities, and easier scalability</b> for future gameplay features.

---

<br>

<h2>
Architecture
</h2>

<h3>
Component Roles
</h3>

- `AI Controller`<br>
  Acts as the central coordinator. It owns both the Behavior Tree and the State Tree. It handles environmental perception (such as sight, sound, custom safe-zone stimuli) and passes relevant information to the State Tree.<br>

- `State Tree`<br>
  Responds to input from the AI Controller. It transitions between high-level states (Patrol, Search, Combat, Lurk) and runs associated tasks. These tasks update the <b>Blackboard</b> values used by the Behavior Tree.<br>

- `Behavior Tree`<br>
  Uses the current Blackboard values to drive low-level behavior logic, such as movement, animations and executing actions.<br>

This separation allows each system to focus on a specific layer of decision-making: State Tree for high-level state management, and Behavior Tree for executing detailed behavior logic.

<h3>
Data Flow
</h3>

<div>
{% include figure.liquid loading="eager" path="assets/img/projects/fia/ai-system-flowgraph.svg" caption="Click to zoom" class="img-fluid rounded z-depth-1" zoomable=true %}
</div>

The <b>EnemyAIController</b> manages how the AI perceives its surroundings using Unreal’s <b>AIPerceptionComponent</b>. Perception updates are handled in the controller’s `OnTargetPerceptionUpdated` callback. Instead of directly modifying the behavior or state, these events are converted into <b>State Tree events</b>, identified by `Gameplay Tags`. Each event also carries relative `Payload` data, providing additional context (such as stimulus strength, actor location, relative player information). These are dispatched to the State Tree, which interprets the data and determines whether to `Transition` to a new state – such as from <b>Patrol</b> to <b>Search</b>, or from <b>Search</b> to <b>Hostile</b>. Once in a new state, the Behavior Tree executes the specific logic for that state using updated Blackboard values.

> ##### TODO
>
> Show footage of actual gameplay and code exeuction which corresponds to the graph drawn above.
> {: .block-tip }

---

<br>

<h2>
AI Controller & Perception
</h2>

The EnemyAIController servers as the central bridge between the AI's sensory systems and its decision-making logic. It owns the <b>AIPerceptionComponent>, which is configured to handle multiple senses.

<h3>
Perception Setup
</h3>

- <b>Sight</b> - Detects visible actors within a defined field of view and range.
- <b>Hearing</b> - Detects noise events, such as thrown objects, player movement, environment interaction, and determines their location and alert level.
- <b>Safezone</b> - A Custom perception sense that detects when the player enters or leaves speecial areas where hostile actions are restricted.

When the perception system detects or updates a stimulus, the OnTargetPerceptionUpdated callback is triggered. Rather than directly atlering AI behavior, the AI Controller converts the stimulus into a <b>State Tree event</b> identified by a <b>Gameplay Tag</b> and optionally carrying payload data relevant to the event.

This data can is then used by the <b>State Tree</b> to select the most appropriate state based on the current situation.

By decoupling perception from direct behavior controler, the AI controller remains <b>modular and maintainable</b> - new senses or event types can be integrated without altering the core behavior logic, simply by defining new events and ensuring the State Tree can receive them.

<h3>
Safezone - Custom Sense
</h3>

To support gameplay mechanics like protected areas where the player can’t be chased - and to add moments of tension and dramatization - I implemented a custom perception sense called `SafezoneSense`. Unreal’s build-in senses were insufficient for this purpose because of built in senses lacked:

1. The ability to define a custom reporting type
2. The ability to include <b>additional environmental or context data</b> with a stimulus

Following Unreal's standard pattern for creating custom senses, SafezoneSense is composed of:

- `UAISenseConfig_Safezone` - Configurable settings such as range and filtering
- `FAISafezoneEvent` - Encapsulates data about the trigger event
- `FDigestedSafezoneProperties` - Stores listener-specific precessed data, such as detection range

```c++
USTRUCT(BlueprintType)
struct FAISafezoneEvent
{
	GENERATED_BODY()

    FAISafezoneEvent() : ID(FGuid::NewGuid()), Location(FVector::Zero()), Instigator(nullptr), SafezoneInterfaceObject(nullptr)
    {
    }

    FAISafezoneEvent(AActor* InInstigator, const FVector& InLocation, UObject* InSafezoneInterfaceObject);

    typedef class UAISense_Safezone FSenseClass;

    UPROPERTY(BlueprintReadOnly, Category="Sense")
    FGuid ID;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category="Sense")
    FVector Location;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category="Sense")
    TObjectPtr<AActor> Instigator;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category="Sense")
    TObjectPtr<UObject> SafezoneInterfaceObject;
};
```

<br>

<h4>
Event Data Management
</h4>

A unique aspect of this implementation is how it handles <b>additional data</b> beyond what <b>FAIStimulus</b> can carry.

FAIStimulus has strict limitations on what data it can store - it only supports a fixed set of fields and cannot directly carry custom complex data.
Because of this, I implemented a separate system for transferring additional event information.

Each event is:

- Assigned a GUID
- Stored in a <b>static map</b> keyed by that GUID
- Given a stimulus where the <b>GUID</b> is stored in the Stimulus.Tag field

When OnTargetPerceptionUpdated is called:

1. The AI Controller Retrieves the complete event data from the static map using the GUID
2. Sends it to the State Tree as a tagged event
3. The event is removed from the map to prevent memory buildup

```c++
// Inside FAISense_Safezone.h
public:
    static bool GetSafezoneEvent(FName IdAsName, FAISafezoneEvent& SafezoneEvent)
    {
        FGuid ID;
        FGuid::Parse(IdAsName.ToString(), ID);

        if (!StoredEvents.Contains(ID)) return false;
        StoredEvents.RemoveAndCopyValue(ID, SafezoneEvent);
        return true;
    }

private:
    static TMap<FGuid, FAISafezoneEvent> StoredEvents;

// ------------------------------------- //

// Inside Update() of UAISense_Safezone.cpp
for (const FAISafezoneEvent& Event : Events)
{
    // Filtering out events using digested property is here

    // Store Event and report stimulus
    StoredEvents.Add(Event.ID, Event);
    FAIStimulus Stimulus(*this, 1.f, Event.Location, Listener.CachedLocation, FAIStimulus::SensingSucceeded,
                            FName(*Event.ID.ToString(EGuidFormats::DigitsWithHyphens)));
    Listener.RegisterStimulus(Event.Instigator, Stimulus);
}
```

<div class="caption">
    Safezone Event Management
</div>

<br>

```c++
// Inside EnemyAIController.cpp
void AEnemyAIController::HandleSensingSafezone(AActor* SourceActor, const FAIStimulus& Stimulus)
{
	FAISafezoneEvent SafezoneEvent;
	bool EventFound = UAISense_Safezone::GetSafezoneEvent(Stimulus.Tag, SafezoneEvent);
	if (!EventFound) return;

	FStateTreePayload_Safezone Payload(Stimulus.StimulusLocation, SafezoneEvent.SafezoneInterfaceObject);
	StateTreeComponent->SendStateTreeEvent(SafezoneEventTag, FConstStructView::Make(Payload));
}
```

<div class="caption">
    Use case inside EnemyAIController
</div>

<br>

<h4>
Outcome
</h4>

This design preserves Unreal's perception API structure while extending it with <b>rich, context-aware sensing</b> and <b>memory-safe event storage</b>. It also integrates seamleslly with the existing perception -> State Tree -> Behavior Tree flow, requiring no special handling outside the AI Controller and State Tree.

---

<br>

<h2>
State Tree - Structure, States and Transitions
</h2>

The State Tree is the core of my AI’s <b>high-level</b> decision-making. It determines <i>which</i> state the AI should be in at any given moment and drives the flow toward the correct <b>Behavioral State</b>.

<h3>
Behavioral States vs Transitional States
</h3>

The State Tree is structured as a hierarchy of `Behavioral` and `Transitional` states (Colored and Gray), each with a clear purpose:

- `Behavioral` (colored) states represent the actual high-level states the AI can be in. These are always leaf states-the final nodes in a state branch-and are the only states that execute tasks which write into blackboard. Each Behavioral State defines what the AI is doing at that moment, such as <i>Patrolling</i>, <i>Searching Cautiously</i>, engaging in <i>Combat</i>, or <i>Lurking</i> in a safe-zone area.

{% include figure.liquid path="assets/img/projects/fia/state-tree-behavioral-state.png" caption="Click to zoom" class="img-fluid rounded z-depth-1" zoomable=true %}

| Legend | Description                                            |
| :----- | ------------------------------------------------------ |
| 1      | Behavioral State                                       |
| 2      | Call of a State Tree Task which sets Blackboard Values |
| 3      | Implementation of the State Tree Task                  |

<br>

- `Transitional` (gray) states serve as a routing logic between events and <b>Behavioral</b> States. They are similar to the states which have a type set to “Linked”, however they can execute tasks. Their role is to:  
  A. Receive State Tree events triggered by the AI Controller (e.g. OnNoise, OnSightGained)  
  B. Fill shared <b>parameter data structures</b> with context (event payload)  
  C. Instantly transition into the appropriate <b>Behavioral</b> State

{% include figure.liquid path="assets/img/projects/fia/state-tree-transitional-state.png" caption="Click to zoom" class="img-fluid rounded z-depth-1" zoomable=true %}

| Legend | Description                                           |
| :----- | ----------------------------------------------------- |
| 1      | Transitional State                                    |
| 2      | Call of a State Tree Task which sets Parameter Values |
| 3      | Implementation of the State Tree Task                 |

<br>

This separation of responsibilities allows the AI to respond to complex inputs in a <b>modular</b> and <b>maintainable</b> way. Transitions are decoupled from behavior logic, and payload data is passed cleanly through parameters-enabling each Behavioral State to react appropriately without needing to know the source of the trigger.

<br>

<h3>
Event Handling & State Selection
</h3>

<b>State Tree events</b> received by the AI Controller are identified using <b>Gameplay Tags</b>. They can be accompanied by a <b>relative payload data structure</b> containing relavant context. This event-driven approach ensures that perception data is decoupled from direct behavior changes, allowing the State Tree to interpret the event and determine the most appropriate next state.

Importantly, the <b>currently active Behavioral State</b> defines which Transitional State it can move into. Event if a valid event is received, the system will only transition if that Behavioral State explicitly allows it. This prevents inappropriate state changes and ensures that transitions follow the intended AI logic.

{% include figure.liquid path="assets/img/projects/fia/state-tree-event-handling.png" caption="Click to zoom" class="img-fluid rounded z-depth-1" zoomable=true %}

| Legend | Description                                                            |
| :----- | ---------------------------------------------------------------------- |
| 1      | Currently selected Behavioural State which receives a State Tree event |
| 2      | Possible destination Transitional States marked explicitly             |
| 3      | Gameplay Tag which Identifies the State Tree event                     |
| 4      | Data structure which is passed with the State Tree event as Payload    |
| 5      | Transition to a Transitional State                                     |
| 6      | Target Transitional State                                              |

<br>

In most cases, once a valid event is accepted, the AI enters a <b>Transitional State</b>. As mentioned above, these states do not perform active behaviors themselves - instead, they extract and prepare parameters from the event payload (such as a noise location or actor reference) and immediately transition to a <b>Behavioral State</b> that can act on that information.

For example, if the AI is currently in <b>Neutral</b> and receives an <b>OnNoise</b> event, it will first check if the Neutral permits a transition to the <b>Detect Noise</b> transitional state. If allowed, it enters <b>Detect Noise</b>, populates a SearchGroupData with the designated search position and alert type, and then transitions to <b>Search</b>. From there, additional decision logic within <b>Search</b> selects appropriate child state, such as <b>Cautious</b> or <b>Aggressive</b>, depending on the payload data.

{% include figure.liquid path="assets/img/projects/fia/state-tree-debugger.png" caption="Click to zoom" class="img-fluid rounded z-depth-1" zoomable=true %}

| Legend | Description                                                                              |
| :----- | ---------------------------------------------------------------------------------------- |
| 1      | Transition from <b>Neutral</b> to <b>Aggressive</b> search state                         |
| 2      | State Tree event <b>OnNoise</b> sent from <b>AI Controller</b>                           |
| 3      | Trigger transition <b>Detect Noise</b> since <b>Neutral</b> state allows it              |
| 4      | Populate SearchGroupData by executing task of the Transitional State                     |
| 5      | Immediate transition trigger to the <b>Search</b> State                                  |
| 6      | Successful check for child <b>Aggressive</b> Behavioral State                            |
| 7      | Enter <b>Aggressive</b> behavioral state and set Blackboard values by executing its task |

<br>

This layered approach to event handling not only makes the system easier to maintain but also makes it straightforward to add new event types or states without rewriting existing behaviour logic.

<br>

<h3>
Parameters - State Group Data
</h3>

State Group Data in the State Tree represent the <b>data requirements of a state group</b>. Each Behavioral State defines what information it needs to operate effectively - this data can be <b>used by tasks</b> to execute actions <b>and</b> by <b>state conditions</b> to determine whether a transition into that state is valid.

{% include figure.liquid path="assets/img/projects/fia/state-tree-group-data-usage.png" caption="Click to zoom" class="img-fluid rounded z-depth-1" zoomable=true %}

| Legend | Description                                                     |
| :----- | --------------------------------------------------------------- |
| 1      | Parameter for Search Group Data                                 |
| 2      | State Group where group data parameter is used.                 |
| 3      | Behavioral State which uses group data parameter                |
| 4      | Group Data parameter used as state Enter Condition              |
| 5      | Group data parameter used in state task                         |
| 6      | Alternative version of parameter used for state Enter Condition |

<br>

These data are implemented as `USTRUCT`s and exposed as <b>State Tree parameters</b>, making them accessible to both Transitional and Behavioral States. The key principle is that a State Group Data can be <b>populated by a task in any Transitional State</b>, regardless of which event triggered it.

```c++
USTRUCT(BlueprintType)
struct FStateTreeGroupData_Search
{
	GENERATED_BODY()

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category="State Group Data")
	TEnumAsByte<EAlertType> AlertType;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category="State Group Data")
	FVector SearchLocation;
};
```

For example:

- FStateTreeGroupData_Search - Stores a search location and an alert type (Cautious, Aggressive). It could be populated after a <b>Sight Lost</b> event, a <b>Noise Heard</b> event, or any future event type that logically leads into a search behavior.

<div class="row mt-3 align-items-stretch">
  <div class="col-md-6 d-flex flex-column">
      {% include figure.liquid loading="eager" path="assets/img/projects/fia/state-tree-group-data-populate-1.png" caption="Click to zoom" class="img-fluid rounded z-depth-1"  zoomable=true%}
  </div>
  <div class="col-md-6 d-flex flex-column justify-content-between">
    <div class="md-2 flex-fill">
        {% include figure.liquid loading="eager" path="assets/img/projects/fia/state-tree-group-data-populate-2.png" caption="Click to zoom" class="img-fluid rounded z-depth-1"  zoomable=true%}
    </div>
    <div class="md-2 flex-fill">
        {% include figure.liquid loading="eager" path="assets/img/projects/fia/state-tree-group-data-populate-3.png" caption="Click to zoom" class="img-fluid rounded z-depth-1"  zoomable=true%}
    </div>
  </div>
</div>

| Legend | Description                                                                                                                                             |
| :----- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1      | Transitional States, selected from different state tree events, which transition to the same State Group - <b>"Search"</b>                              |
| 2      | <b>"Lose Target"</b> Transitional State uses relative event payload where last known location of the target is known, and set's the alert type manually |
| 3      | <b>"Detect Noise"</b> Transitional state uses relative event payload fully                                                                              |

<br>

<h4>Workflow</h4>
  1. A <b>Transitional State</b> is entered after an event is received and allowed by the current Behavioral State.
  2. Tasks inside the Transitional State <b>populate the required group data(s)</b> for the target Behavioral State Group.
  3. When the transition completes, the <b>Behavioral State</b> reads its associated group data(s) to validate their selection, set Blackboard values, adjust Controller parameters or execute other tasks.

By designing StateGroupData around <b>state needs</b> rather than event specifics, the system becomes highly flexible - new events can reuse existing payloads, and new state groups or states can be added simply by defining their required data and the tasks that fill it.

---

<br>

<h2>
Behavior Tree
</h2>

Once the State Tree has determined the current Behavioral State and relative Blackboard values have been updated, the Behavior Tree executes <b> the specific actions</b> needed for that state. It reads the updated <b>Blackboard values</b> to decide which branches to run.

For instance:

- In `Neutral` state, the Behavior Tree might run a patrol route service and idle animations.
  {% include video.liquid path="assets/video/fia/patrolling.mp4" class="img-fluid rounded z-depth-1" autoplay=true loop=true controls=true %}

- In `Search->Aggressive` state, the AI is directed to move toward the last known clue location at high pase, scan and interact with the environment (Covers, Lockers and other hiding spots).
  {% include video.liquid path="assets/video/fia/search-aggresive.mp4" class="img-fluid rounded z-depth-1" autoplay=true loop=true controls=true %}

- In `Hostile->Combat` state, movement towards the player, attack execeution and target tracking is handled.
  > ##### TODO
  >
  > Add footage for `Hostile->Combat`
  > {: .block-tip}

By having the State Tree control what state the AI is in and the Behavior Tree handle <b>how</b> that state behaves, the system remains both flexible and focused.
