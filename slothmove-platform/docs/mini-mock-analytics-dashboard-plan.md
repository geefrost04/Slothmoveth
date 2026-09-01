# Mini Mock Analytics and Dashboard Plan

## Objective

Measure whether Mini Mock converts course visitors into registered learners and, later, paid Mock Test buyers. Keep the event volume low enough for GA4 reporting to remain usable.

## Event Funnel

| Event | Trigger | Key parameters | Decision supported |
| --- | --- | --- | --- |
| `mini_mock_impression` | Mini Mock block is visible on the Police Admin landing page | `placement`, `exam_set_id`, `question_count`, `duration_minutes` | Does the placement receive traffic? |
| `mini_mock_start_click` | Visitor selects the free Mini Mock | `source`, `exam_set_id` | Does the offer earn a click? |
| `practice_started` | A new exam session starts | `exam_set_id`, `subject_id`, `question_count` | Is the click becoming real practice? |
| `exam_progress_checkpoint` | 25%, 50%, or 75% of answers are completed | `exam_set_id`, `answered_count`, `progress_percent` | At which point do visitors abandon? |
| `practice_completed` | The exam is submitted or expires | `score`, `completion_reason`, `exam_set_id` | Completion rate and score distribution |
| `exam_save_prompt_shown` | Guest completes an exam and sees the account prompt | `exam_set_id`, `source` | How many completions are eligible for account conversion? |
| `exam_save_prompt_register_click` | Guest selects account registration | `exam_set_id` | Registration intent from the result page |

GA4 should register `exam_set_id`, `progress_percent`, `completion_reason`, and `source` as event-scoped custom dimensions. Do not send an email, user ID, answer text, or other personally identifiable data to GA4.

## Data Ownership

- GA4: anonymous acquisition and funnel behavior, including non-members.
- Supabase `attempts`: authenticated learner outcomes, duration, score, answers, and category-level weaknesses.
- Supabase `profiles`, `orders`, and `entitlements`: member activation and payment state.

## Dashboard Design

### Learner Dashboard

The existing `/dashboard` remains personal and action-oriented:

1. Start with the next action: Mini Mock for new learners, weakest subject for returning learners.
2. Keep Mini Mock and full Mock Test together as one mock-practice group, but show their titles separately in history.
3. Base the weak-subject recommendation only on completed attempts, not clicks or partial sessions.
4. Show a meaningful analysis after at least two attempts or 20 answered questions; before then, use a simple next action.

### Owner Dashboard

Build this as a separate admin view after seven days of event collection. It should answer only these questions:

1. Acquisition: users, sessions, and source/medium by day.
2. Activation: Mini Mock impressions -> starts -> 25% -> 75% -> completions.
3. Registration: completed Mini Mock -> registration prompt -> sign-up.
4. Revenue: sign-up -> checkout started -> purchase, split by Mock Test product.
5. Retention: day-1 and day-7 return rate for people who started Mini Mock.

Use a daily date range control, source/medium filter, and a compact funnel. Avoid user-level drilldowns until the sample size is large enough to act on.

## Cadence and Decisions

- Daily: inspect starts, completions, and registration prompt clicks from TikTok traffic.
- Weekly: compare completion rate by traffic source and inspect the largest funnel drop.
- Every two weeks: change one element only, such as Mini Mock copy, registration prompt, or post-result paid offer; tag the change with a campaign name.

## Initial Success Thresholds

- Landing to Mini Mock start: 12% or above.
- Start to 75% checkpoint: 55% or above.
- Start to completion: 45% or above.
- Completed Mini Mock to registration: 15% or above.
- Registered Mini Mock learner to paid Mock Test within 14 days: measure first; do not set a target until at least 30 registered completers exist.
