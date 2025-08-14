---
title: Implementing AI Logic
description: Implementation of AI System in Faith in Abyss
project: faith-in-abyss
thumbnail: assets/img/3.jpg
priority: 1
layout: page
permalink: /projects/faith-in-abyss/:name/
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
AI System Overview
</h2>

In this project, the AI system is designed to create reactive and believable enemy vehavior while keeping the underlying logic <b>modular</b>, <b>maintanable, and easy to extend.</b> Its purpose is to manage how enemies perceive the world, decide their current state, and execute appropriate actions in real time.

Gameplay-wise, I took inspiration from the <b>unpredictable and relentless enemy encounters</b> in <i>Outlast</i>, and the <b>tense, location-driven threat dynamics</b> of the series <i>From</i>. Both emphasize the importance of enemies that react believably to the player's actions and surroundings, which informed my focus on clear state transitions and context-driven behaviors.

Behavior Trees are a powerful tool for implementing AI decision-making logic. However, I found that tracking the AI’s <b>current high-level state</b> at specific moments-and dynamically changing its behavior was inconvenient when using Behavior Trees alone.

To address this, I chose to combine a <b>State Tree</b> with the Behavior Tree.The State Tree manages <b>high-level transitions</b> (such as Neutral, Search, Hostile) and updates shared data, while the Behavior Tree executes <b>low-level actions</b> based on that state. This hybrid approach resulted in <b>cleaner structure, clearer separation of responsibilities, and easier scalability</b> for future gameplay features.

---

<h2>
Architecture Overview
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

> ##### TIP
>
> Show footage of actual gameplay and code exeuction which corresponds to the graph drawn above.
> {: .block-tip }

---

<h2>
AI Controller & Perception
</h2>

<h3>
Perception Setup
</h3>

<h4>	
AIPerceptionComponent Configuration
</h4>

<h4>	
Default Senses (Sight, Hearing)
</h4>

<h4>	
Custom Safe-zone Sense (UAISense_Safezone)
</h4>

<h3>
Event Handling & Communication with State Tree
</h3>

<h4>
OnTargetPerceptionUpdated workflow
</h4>

<h4>
Converting FAIStimuli into State Tree Events using FGameplayTags
</h4>

<h4>
Passing relative payload data structures
</h4>

<h4>
How Transitional States use this payload
</h4>

<h4>
Benefits of decoupling perception from behavior logic
</h4>

---

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
  > ##### TIP
  >
  > Add footage for `Hostile->Combat`
  > {: .block-tip}

By having the State Tree control what state the AI is in and the Behavior Tree handle <b>how</b> that state behaves, the system remains both flexible and focused.

---

<br>
<br>
<br>
<br>
<br>
<br>

<h2>
NEEDS TO BE MANAGED
</h2>

> ##### NOTE
>
> The highlighted section shows how the state-tree is notified about an perception event using FGameplayTag and relative Payload Data to the event
> {: .block-note }

{% tabs a %}

{% tab a Handling Perception Update %}
{% include figure.liquid loading="eager" path="assets/img/projects/fia/ai-controller-perception-update-handler-highlight.png" caption="Click to zoom" class="img-fluid rounded z-depth-1" zoomable=true %}

{% details Click here to see whole code snippet %}

```c++
// ---------------------- EnemyAIController.cpp -------------------- //
void AEnemyAIController::PerceptionUpdateHandler(AActor* Actor, FAIStimulus Stimulus)
{
// ID's for each sense
  const FAISenseID AISenseID_Sight = UAISense::GetSenseID<UAISense_Sight>();
  const FAISenseID AISenseID_Hearing = UAISense::GetSenseID<UAISense_Hearing>();
  const FAISenseID AISenseID_Safezone = UAISense::GetSenseID<UAISense_Safezone>();

// Filter out Handler
  if (Stimulus.Type == AISenseID_Sight)
  {
    if (Stimulus.WasSuccessfullySensed())
      HandleSensingSight(Actor);
    else
      HandleLosingSight(Actor);
  }
  else if (Stimulus.Type == AISenseID_Hearing)
  {
    HandleSensingSound(Stimulus);
  }
  else if (Stimulus.Type == AISenseID_Safezone)
  {
    HandleSensingSafezone(Actor, Stimulus);
  }
}

void AEnemyAIController::HandleSensingSound(FAIStimulus Stimulus) const
{
  const FVector StimulusLocation = Stimulus.StimulusLocation;

// Project Location onto a Navigable Location (Example: Sound is reported by a bottle being shattered to a wall)
  UNavigationSystemV1* NavSys = FNavigationSystem::GetCurrent<UNavigationSystemV1>(GetWorld());
  if (NavSys == nullptr) return;
  FNavLocation ProjectedLocation;
  FVector SearchExtent(500.0f, 500.0f, 500.0f); // TODO: Expose search extent

  if (!NavSys->ProjectPointToNavigation(StimulusLocation, ProjectedLocation, SearchExtent))
  {
    UE_LOG(LogTemp, Warning, TEXT("Couldn't find navigable location for sound stimuli"));
    return;
  }

// Get payload values
  int64 AlertTypeValue = StaticEnum<EAlertType>()->GetValueByName(Stimulus.Tag);
  const EAlertType AlertType = AlertTypeValue == INDEX_NONE ? Cautious : static_cast<EAlertType>(AlertTypeValue);

// Create Payload for NoiseEvent
  const FStateTreePayload_NoiseEvent Payload(ProjectedLocation.Location, AlertType);

// Notify State Tree about Noise Event
  StateTreeComponent->SendStateTreeEvent(NoiseEventTag, FConstStructView::Make(Payload));
}

// ---------------------- EnemyAIController.h -------------------- //
USTRUCT(BlueprintType)
struct FStateTreePayload_NoiseEvent
{
	GENERATED_BODY()

	// Location where the event has occurred
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category="Payload")
	FVector Location;

	// What type of alert is the noise [Cautious, Aggressive]
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category="Payload")
	TEnumAsByte<EAlertType> AlertType;
};
```

{% enddetails %}
{% endtab %}

{% tab a Handling State-Tree Events %}
{% include figure.liquid loading="eager" path="assets/img/projects/fia/state-tree-transitions-highlight.png" caption="Click to zoom" class="img-fluid rounded z-depth-1" zoomable=true %}
| Legend | Description |
| :--- | :------------- |
| 1 | Possible `Transitional` states from current state |
| 2 | Configuration for OnNoise Event Trigger Transition |
| 3 | FGameplayTag Identifier for transition |
| 4 | Payload passed within the State-Tree Event |
{% endtab %}

{% endtabs %}

This design ensures a clean separation of concerns: the AI Controller handles sensory input and contextual data; the State Tree decides how the AI interprets and reacts to that input; and the Behavior Tree drives the specific actions. This modularity made the system easier to debug and extend. For example, adding new senses or stimuli types didn’t require touching existing behavior or state logic.

---

<h3>
Custom Perception: Safezone Sense
</h3>

To support gameplay mechanics like protected Safezone where the player can’t be chased, I implemented a custom perception sense called `SafezoneSense`. Unreal’s build-in senses were insufficient for this case [EXPLAIN WHY]

The custom sense follows Unreal’s standard pattern using:

- `UAISenseConfig_Safezone`: configurable settings for perception range and filtering
- `FAISafezoneEvent`: encapsulates data about the event trigger
- `FDigestedSafezoneProperties`: stores the processed listener-specific data like range

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

A unique aspect of the implementation is how I handle additional event data beyond what <b>FAIStimulus</b> can carry. I assign a <b>GUID</b> as the tag in the stimulus, and use it as a key to retrieve the actual payload from a <b>static map</b>. When the AI Controller receives the stimulus through `OnTargetPerceptionUpdated`, it uses the <b>GUID</b> to:

1. Retrieve the full event data
2. Pass the information to the State Tree as a tagged event
3. Immediately remove the event from the map to avoid memory buildup

<div class="caption">
    Safezone Event Management
</div>

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
    Use case inside EnemyAIController
</div>

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

This approach allowed me to preserve Unreal’s perception API structure while extending it with robust, memory-safe event data flow.
