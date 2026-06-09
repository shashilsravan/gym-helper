/* ===== Goal templates: each has Mon–Sat routine + macro targets =====
   Reuses exercise names from exercise-meta.js so GIFs + how-tos work.        */
(function () {
  const T = (min, max, unit, mode) => ({ min, max, unit, mode });
  const M = (name, sets, reps, note) => ({ name, sets, reps, note });
  const sec = (title, kind, items, note) => ({ title, kind, items, note });
  const rest = { label: "Sunday", focus: "Full rest", rest: true, secondary: "Rest or a light 20-min walk",
    sections: [sec("Recovery", "rest", [{ name: "Rest / light 20-min walk", note: "Muscles grow on rest days. Sleep 7.5h+." }])] };

  /* ---------- Weight Loss ---------- */
  const weightloss = {
    key: "weightloss", name: "Weight Loss", icon: "cut",
    blurb: "Full-body strength + lots of cardio in a calorie deficit. Burn fat, keep muscle.",
    targets: { calories: T(1500, 1650, "kcal", "range"), protein: T(130, 150, "g", "atLeast"), carbs: T(120, 150, "g", "range"), fats: T(45, 55, "g", "range"), water: T(3.5, 4, "L", "atLeast") },
    schedule: {
      day1: { label: "Monday", focus: "Full Body + HIIT", secondary: "Strength circuit + 20 min HIIT", sections: [
        sec("Main Work", "main", [M("Barbell back squat", 3, "12", "Controlled, full depth"), M("Flat barbell / dumbbell bench press", 3, "12", "Steady tempo"), M("Seated cable row", 3, "12", "Squeeze mid-back"), M("Walking lunges", 3, "20 steps", "Keep it moving — minimal rest")]),
        sec("Core", "core", [M("Plank hold", 3, "40s", "Brace hard")], "6 min"),
        sec("Cardio — HIIT", "cardio", [M("Treadmill / bike intervals", null, "30s hard / 90s easy × 8", "Above 150 bpm on hard")], "20 min") ] },
      day2: { label: "Tuesday", focus: "Cardio + Core", secondary: "Steady fat-burn + abs", sections: [
        sec("Cardio — Steady", "cardio", [M("Incline walk / cycle", null, "30 min", "Conversational pace, fat-burn zone")], "30 min"),
        sec("Core", "core", [M("Hanging leg raises or lying leg raises", 3, "15", "Slow"), M("Bicycle crunches (slow, controlled)", 3, "20", "Obliques"), M("Side plank + hip dip", 3, "30s / side", "Tight waist")]) ] },
      day3: { label: "Wednesday", focus: "Full Body + HIIT", secondary: "Strength circuit + 20 min HIIT", sections: [
        sec("Main Work", "main", [M("Deadlift (conventional or Romanian)", 3, "10", "Form first"), M("Overhead dumbbell press (seated)", 3, "12", "Core tight"), M("Pull-ups or lat pulldown", 3, "10", "Full stretch"), M("Leg press (wide stance)", 3, "15", "Glutes")]),
        sec("Core", "core", [M("Cable crunch (kneeling)", 3, "15", "Full contraction")], "6 min"),
        sec("Cardio — HIIT", "cardio", [M("Bike intervals", null, "20s all-out / 40s easy", "20 min")], "20 min") ] },
      day4: { label: "Thursday", focus: "Upper + Cardio", secondary: "Tone upper body + steady cardio", sections: [
        sec("Main Work", "main", [M("Incline dumbbell press", 3, "12", "Upper chest"), M("Seated cable row", 3, "12", "Posture"), M("Lateral raises (light dumbbell)", 3, "15", "Shoulder width"), M("Barbell or dumbbell curl", 3, "12", "Strict"), M("Tricep cable pushdown", 3, "12", "Squeeze")]),
        sec("Cardio — Steady", "cardio", [M("Incline walk", null, "20 min", "Low stress")], "20 min") ] },
      day5: { label: "Friday", focus: "Full Body + HIIT", secondary: "Strength circuit + 20 min HIIT", sections: [
        sec("Main Work", "main", [M("Front squat or goblet squat", 3, "12", "Upright torso"), M("Romanian deadlift", 3, "12", "Hamstring stretch"), M("Face pull (cable)", 3, "15", "Posture"), M("Bulgarian split squat", 3, "10 / leg", "Burns — that's the point")]),
        sec("Core", "core", [M("Plank hold", 3, "45s", "Squeeze glutes")], "6 min"),
        sec("Cardio — HIIT", "cardio", [M("Treadmill sprints", null, "30s / 90s × 8", "20 min")], "20 min") ] },
      day6: { label: "Saturday", focus: "Long Cardio + Core", secondary: "Longer cardio + full core", sections: [
        sec("Cardio — Run", "cardio", [M("Outdoor run / treadmill", null, "35–40 min", "Steady, track your distance")], "35–40 min"),
        sec("Core Circuit", "core", [M("Hanging leg raises", 3, "15", "Slow"), M("Cable woodchops", 3, "12 / side", "Rotation"), M("Side plank + hip dip", 3, "30s / side", "Obliques")]) ] },
      day7: rest
    }
  };

  /* ---------- Bulk muscle ---------- */
  const bulk = {
    key: "bulk", name: "Bulk Muscle", icon: "bulk",
    blurb: "Heavy PPL hypertrophy in a calorie surplus. Maximise size and strength.",
    targets: { calories: T(2500, 2700, "kcal", "range"), protein: T(150, 175, "g", "atLeast"), carbs: T(300, 340, "g", "range"), fats: T(70, 85, "g", "range"), water: T(3.5, 4, "L", "atLeast") },
    schedule: {
      day1: { label: "Monday", focus: "Push — Chest, Shoulders, Triceps", secondary: "Heavy pressing", sections: [
        sec("Main Work", "main", [M("Flat barbell / dumbbell bench press", 4, "8", "Heavy, 2 min rest"), M("Overhead barbell press (standing)", 4, "8", "Strict"), M("Incline dumbbell press", 3, "10", "Upper chest"), M("Lateral raises (light dumbbell)", 3, "15", "Width"), M("Tricep overhead extension + skull crushers superset", 3, "12", "Triceps")]) ] },
      day2: { label: "Tuesday", focus: "Pull — Back, Biceps", secondary: "Heavy rows + pulls", sections: [
        sec("Main Work", "main", [M("Deadlift (conventional or Romanian)", 4, "6", "King of lifts"), M("Pull-ups or lat pulldown", 4, "8", "Wide grip"), M("T-bar row or bent-over barbell row", 4, "10", "Thickness"), M("Barbell or dumbbell curl", 3, "12", "Strict"), M("Hammer curls + reverse curls superset", 3, "12", "Forearms")]) ] },
      day3: { label: "Wednesday", focus: "Legs", secondary: "Heavy lower body", sections: [
        sec("Main Work", "main", [M("Barbell back squat", 4, "8", "Deep, heavy"), M("Romanian deadlift", 4, "10", "Hamstrings"), M("Leg press (wide stance)", 3, "12", "Quads + glutes"), M("Leg curl (seated or lying)", 3, "12", "Slow eccentric"), M("Calf raises (heavy)", 4, "15", "Full stretch")]) ] },
      day4: { label: "Thursday", focus: "Push — Shoulder focus", secondary: "Delts + arms", sections: [
        sec("Main Work", "main", [M("Overhead barbell press (standing)", 4, "8", "More core"), M("Dips (chest version — lean forward)", 3, "10", "Add weight"), M("Arnold press", 3, "10", "All 3 heads"), M("Cable lateral raise (single arm)", 3, "12 / side", "Constant tension"), M("Tricep cable pushdown", 3, "12", "Squeeze")]) ] },
      day5: { label: "Friday", focus: "Pull — Back width", secondary: "Width + thickness", sections: [
        sec("Main Work", "main", [M("Weighted pull-ups", 4, "8", "Add plate"), M("T-bar row or bent-over barbell row", 4, "8", "3D back"), M("Single arm dumbbell row", 3, "10 / side", "Full stretch"), M("Face pull (cable)", 3, "15", "Posture"), M("Barbell or dumbbell curl", 4, "10", "Pump")]) ] },
      day6: { label: "Saturday", focus: "Legs — Quad focus", secondary: "Volume legs", sections: [
        sec("Main Work", "main", [M("Front squat or goblet squat", 4, "8", "Quads"), M("Bulgarian split squat", 3, "10 / leg", "Unilateral"), M("Leg extension", 3, "15", "Teardrop"), M("Leg curl (seated or lying)", 3, "12", "Hamstrings"), M("Calf raises (heavy)", 4, "20", "Full range")]) ] },
      day7: rest
    }
  };

  /* ---------- General fitness ---------- */
  const general = {
    key: "general", name: "General Fitness", icon: "heart",
    blurb: "Balanced strength + cardio at maintenance. Feel good, stay strong and healthy.",
    targets: { calories: T(2000, 2150, "kcal", "range"), protein: T(110, 130, "g", "atLeast"), carbs: T(230, 260, "g", "range"), fats: T(60, 72, "g", "range"), water: T(3, 3.5, "L", "atLeast") },
    schedule: {
      day1: { label: "Monday", focus: "Upper Body", secondary: "Push + pull balance", sections: [
        sec("Main Work", "main", [M("Flat barbell / dumbbell bench press", 3, "10", "Steady"), M("Seated cable row", 3, "10", "Squeeze"), M("Overhead dumbbell press (seated)", 3, "12", "Core tight"), M("Barbell or dumbbell curl", 3, "12", "Strict"), M("Tricep cable pushdown", 3, "12", "Squeeze")]) ] },
      day2: { label: "Tuesday", focus: "Lower Body", secondary: "Legs + core", sections: [
        sec("Main Work", "main", [M("Barbell back squat", 3, "10", "Form"), M("Romanian deadlift", 3, "10", "Hamstrings"), M("Walking lunges", 3, "16 steps", "Balance"), M("Calf raises (heavy)", 3, "15", "Full range")]),
        sec("Core", "core", [M("Plank hold", 3, "40s", "Brace")], "5 min") ] },
      day3: { label: "Wednesday", focus: "Cardio + Core", secondary: "Conditioning + abs", sections: [
        sec("Cardio — Steady", "cardio", [M("Run / row / cycle", null, "25 min", "Moderate")], "25 min"),
        sec("Core", "core", [M("Hanging leg raises or lying leg raises", 3, "15", "Slow"), M("Bicycle crunches (slow, controlled)", 3, "20", "Obliques"), M("Side plank + hip dip", 3, "30s / side", "Waist")]) ] },
      day4: { label: "Thursday", focus: "Upper Body", secondary: "Variation day", sections: [
        sec("Main Work", "main", [M("Incline dumbbell press", 3, "10", "Upper chest"), M("Pull-ups or lat pulldown", 3, "10", "Back width"), M("Lateral raises (light dumbbell)", 3, "15", "Shoulders"), M("Face pull (cable)", 3, "15", "Posture"), M("Hammer curls + reverse curls superset", 3, "12", "Arms")]) ] },
      day5: { label: "Friday", focus: "Lower Body", secondary: "Legs variation", sections: [
        sec("Main Work", "main", [M("Leg press (wide stance)", 3, "12", "Quads + glutes"), M("Romanian deadlift", 3, "10", "Hamstrings"), M("Bulgarian split squat", 3, "10 / leg", "Unilateral"), M("Leg extension", 3, "15", "Quads"), M("Calf raises (heavy)", 3, "15", "Full range")]) ] },
      day6: { label: "Saturday", focus: "Full Body + Cardio", secondary: "Compound day + cardio", sections: [
        sec("Main Work", "main", [M("Deadlift (conventional or Romanian)", 3, "8", "Form"), M("Overhead barbell press (standing)", 3, "10", "Core"), M("Seated cable row", 3, "10", "Back")]),
        sec("Core", "core", [M("Cable crunch (kneeling)", 3, "15", "Abs")], "5 min"),
        sec("Cardio — Steady", "cardio", [M("Bike / row", null, "15 min", "Cooldown cardio")], "15 min") ] },
      day7: rest
    }
  };

  /* athletic reuses the original plan from data.js */
  const athletic = {
    key: "athletic", name: "Athletic / Lean Muscle", icon: "bolt",
    blurb: "Lean muscle, strength, abs and posture. PPL split with cardio baked in.",
    targets: {
      calories: T(1750, 1850, "kcal", "range"), protein: T(140, 160, "g", "atLeast"),
      carbs: T(200, 220, "g", "range"), fats: T(55, 65, "g", "range"), water: T(3.5, 4, "L", "atLeast")
    },
    schedule: window.PLAN.schedule
  };

  window.TEMPLATES = { athletic, weightloss, bulk, general };
  window.TEMPLATE_ORDER = ["weightloss", "athletic", "bulk", "general"];

  /* Suggested-weight factors: fraction of bodyweight for a working set.
     "bw" = bodyweight movement (no number), missing = no suggestion (cardio/core/holds). */
  window.LOAD_FACTORS = {
    "Barbell back squat": 1.0, "Front squat or goblet squat": 0.7,
    "Deadlift (conventional or Romanian)": 1.2, "Romanian deadlift": 0.9,
    "Leg press (wide stance)": 1.8, "Bulgarian split squat": 0.2,
    "Leg curl (seated or lying)": 0.35, "Leg extension": 0.4, "Calf raises (heavy)": 0.6,
    "Walking lunges": "bw",
    "Flat barbell / dumbbell bench press": 0.75, "Incline dumbbell press": 0.25,
    "Overhead dumbbell press (seated)": 0.18, "Overhead barbell press (standing)": 0.45,
    "Arnold press": 0.16, "Lateral raises (light dumbbell)": 0.06, "Cable lateral raise (single arm)": 0.05,
    "Tricep cable pushdown": 0.3, "Tricep overhead extension + skull crushers superset": 0.25,
    "Dips (chest version — lean forward)": "bw",
    "Pull-ups or lat pulldown": 0.6, "Weighted pull-ups": "bw",
    "Seated cable row": 0.55, "T-bar row or bent-over barbell row": 0.6, "Single arm dumbbell row": 0.3,
    "Face pull (cable)": 0.2, "Reverse flyes (dumbbell)": 0.07,
    "Barbell or dumbbell curl": 0.25, "Hammer curls + reverse curls superset": 0.18,
    "Dumbbell shrugs (slow, controlled)": 0.3, "Barbell shrugs (heavy)": 0.7
  };
  window.GOAL_MOD = { weightloss: 0.85, athletic: 1.0, bulk: 1.1, general: 0.9 };
})();
