---
title: Implementing AI Logic
description: Implementation of AI System in Faith in Abyss
project: faith-in-abyss
thumbnail: assets/img/3.jpg
priority: 1
layout: page
permalink: /projects/faith-in-abyss/:name/
toc:
  sidebar: right
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

<br>
<br>

<h2>
AI Controller & Perception System
</h2>

The `EnemyAIController` manages how the AI perceives its surroundings using Unreal’s `AIPerceptionComponent`. The perception system includes both built-in senses (sight, hearing) and a <b>custom sense</b> I implemented – <b>UAISense_Safezone</b>. This custom sense allows the AI to detect whether the player has entered special areas such as designated “Safezones”, which are invisible to standard perception but play a key role in gameplay tension.

<h3>
Handling Perception Updates
</h3>
Perception updates are handled in the controller’s `OnTargetPerceptionUpdated` callback. Instead of directly modifying the behavior or state, these events are converted into `State Tree events`, identified by `Gameplay Tags`. Each event also carries <b>relative payload data</b>, providing additional context (such as stimulus strength, actor location, relative player information). These are dispatched to the State Tree, which interprets the data and determines whether to transition to a new state – such as from <b>Patrol</b> to <b>Search</b>, or from <b>Search</b> to <b>Hostile</b>.

<div class="caption">
    AEnemyAIController.cp
</div>
{% raw %}
```c++
void AEnemyAIController::PerceptionUpdateHandler(AActor* Actor, FAIStimulus Stimulus)
{
    // ID's for senses
	const FAISenseID AISenseID_Sight = UAISense::GetSenseID<UAISense_Sight>();
	const FAISenseID AISenseID_Hearing = UAISense::GetSenseID<UAISense_Hearing>();
	const FAISenseID AISenseID_Safezone = UAISense::GetSenseID<UAISense_Safezone>();

    if (Stimulus.Type == AISenseID_Hearing)
    {
    	HandleSensingSound(Stimulus);
    }

}

````

```c++
void AEnemyAIController::HandleSensingSound(FAIStimulus Stimulus) const
{
	const FVector StimulusLocation = Stimulus.StimulusLocation;

	int64 AlertTypeValue = StaticEnum<EAlertType>()->GetValueByName(Stimulus.Tag);
	const EAlertType AlertType = AlertTypeValue == INDEX_NONE ? Cautious : static_cast<EAlertType>(AlertTypeValue);

	const FStateTreePayload_NoiseEvent Payload(ProjectedLocation.Location, AlertType);
	StateTreeComponent->SendStateTreeEvent(NoiseEventTag, FConstStructView::Make(Payload));
}
````

{% endraw %}

This design ensures a clean separation of concerns: the AI Controller handles sensory input and contextual data; the State Tree decides how the AI interprets and reacts to that input; and the Behavior Tree drives the specific actions. This modularity made the system easier to debug and extend. For example, adding new senses or stimuli types didn’t require touching existing behavior or state logic.
