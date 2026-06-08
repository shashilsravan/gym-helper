// ===== Personal Gym Diary — plan data =====
// Numeric nutrition targets (parsed from the plan) used for progress bars.
window.TARGETS = {
  calories: { min: 1750, max: 1850, unit: "kcal", mode: "range" },
  protein:  { min: 140,  max: 160,  unit: "g",    mode: "atLeast" },
  carbs:    { min: 200,  max: 220,  unit: "g",    mode: "range" },
  fats:     { min: 55,   max: 65,   unit: "g",    mode: "range" },
  water:    { min: 3.5,  max: 4,    unit: "L",    mode: "atLeast" }
};

// Which plan day each weekday defaults to (0=Sun..6=Sat). User can override per date.
window.WEEKDAY_DEFAULT = { 0: "day7", 1: "day1", 2: "day2", 3: "day3", 4: "day4", 5: "day5", 6: "day6" };

window.PLAN = {
  meta: {
    goal: "Athletic lean body — lean muscle, strength, stamina, abs, fix posture & neck",
    commitment: "3–6 months, 6 days/week, ~55 min/session",
    plan_type: "PPL (Push / Pull / Legs) split with cardio baked in"
  },

  schedule: {
    day1: {
      label: "Monday", focus: "Push — Chest, Shoulders, Triceps",
      secondary: "Core finisher + 15 min HIIT",
      sections: [
        { title: "Warm-up", kind: "warmup", note: "5 min", items: [
          { name: "Arm circles + band pull-apart", note: "Shoulder prep — non-negotiable before any pressing" }
        ]},
        { title: "Main Work", kind: "main", items: [
          { name: "Flat barbell / dumbbell bench press", sets: 4, reps: "8–10", note: "Keep scapulas retracted — don't flare elbows wide" },
          { name: "Overhead dumbbell press (seated)", sets: 3, reps: "10–12", note: "Core tight, no arching lower back" },
          { name: "Incline dumbbell press", sets: 3, reps: "10", note: "Upper chest — gives the Kohli shelf look" },
          { name: "Lateral raises (light dumbbell)", sets: 3, reps: "15", note: "Shoulder width — critical for improving v-taper" },
          { name: "Tricep cable pushdown", sets: 3, reps: "12", note: "Superset with overhead tricep extension for efficiency" }
        ]},
        { title: "Core Finisher", kind: "core", note: "8 min", items: [
          { name: "Hanging leg raises or lying leg raises", sets: 3, reps: "15", note: "Lower abs — important for V-shape" },
          { name: "Plank hold", sets: 3, reps: "40s hold", note: "Full body tension — squeeze glutes at top" }
        ]},
        { title: "Cardio — HIIT", kind: "cardio", note: "15 min", items: [
          { name: "Treadmill sprints", reps: "30s sprint / 90s walk × 6–7", note: "Above 150 bpm during sprints" }
        ]}
      ]
    },

    day2: {
      label: "Tuesday", focus: "Pull — Back, Biceps, Rear Delts",
      secondary: "Neck & Posture + 15 min steady cardio",
      sections: [
        { title: "Main Work", kind: "main", items: [
          { name: "Deadlift (conventional or Romanian)", sets: 4, reps: "6–8", note: "King of all exercises. Nail form first. Don't round back." },
          { name: "Pull-ups or lat pulldown", sets: 4, reps: "6–10", note: "Wide grip — builds the V-taper. Go to failure if able." },
          { name: "Seated cable row", sets: 3, reps: "12", note: "Elbows to hips, squeeze mid-back for 1 sec" },
          { name: "Face pull (cable)", sets: 3, reps: "15", priority: "CRITICAL", note: "Critical for posture AND rear delt. Every pull day, no exceptions." },
          { name: "Reverse flyes (dumbbell)", sets: 3, reps: "15", note: "Rear delts + upper back — fixes hunched desk posture" },
          { name: "Barbell or dumbbell curl", sets: 3, reps: "12", note: "No swinging — strict form only" }
        ]},
        { title: "Neck & Posture", kind: "posture", note: "5 min", items: [
          { name: "Dumbbell shrugs (slow, controlled)", sets: 3, reps: "15", note: "Builds neck-to-shoulder thickness." },
          { name: "Neck isometric resistance (4 directions)", sets: 3, reps: "10s each dir", note: "Press hand against forehead, back, both sides. Gentle to start." }
        ]},
        { title: "Cardio — Steady", kind: "cardio", note: "15 min", items: [
          { name: "Incline treadmill walk", reps: "12% incline, 5–6 km/h", note: "Burns fat without taxing recovery" }
        ]}
      ]
    },

    day3: {
      label: "Wednesday", focus: "Legs + Glutes Focus",
      secondary: "Core + 20 min HIIT",
      priority_note: "MOST IMPORTANT DAY. Heavy leg work reshapes the glute/hip area fastest. Do not skip.",
      sections: [
        { title: "Main Work", kind: "main", items: [
          { name: "Barbell back squat", sets: 4, reps: "8", note: "Deep, heels flat, knees over toes. 3s down, 1s up. Money exercise." },
          { name: "Romanian deadlift", sets: 3, reps: "10", note: "Hamstrings + glute stretch." },
          { name: "Leg press (wide stance)", sets: 3, reps: "12", note: "Don't lock knees. Feet wide for glute involvement." },
          { name: "Walking lunges", sets: 3, reps: "20 steps", note: "Bodyweight or light dumbbells. Quad/glute shaping + balance." },
          { name: "Leg curl (seated or lying)", sets: 3, reps: "12", note: "Hamstring isolation. Slow eccentric — 3s down." }
        ]},
        { title: "Core Finisher", kind: "core", note: "8 min", items: [
          { name: "Cable woodchops", sets: 3, reps: "12 / side", note: "Rotational core — functional athletic look" },
          { name: "Ab wheel or dragon flag progression", sets: 3, reps: "10", note: "Most effective abs exercise. Start on knees." }
        ]},
        { title: "Cardio — HIIT", kind: "cardio", note: "20 min", items: [
          { name: "Stationary bike intervals", reps: "20s all-out / 40s easy", note: "Easier on legs post-squats than treadmill" }
        ]}
      ]
    },

    day4: {
      label: "Thursday", focus: "Push — Shoulder dominant",
      secondary: "Core + 15 min HIIT",
      sections: [
        { title: "Main Work", kind: "main", items: [
          { name: "Overhead barbell press (standing)", sets: 4, reps: "8", note: "Standing = more core engagement than seated." },
          { name: "Dips (chest version — lean forward)", sets: 3, reps: "10", note: "Full range. Add weight when bodyweight feels easy." },
          { name: "Arnold press", sets: 3, reps: "10", note: "Full rotation — hits all 3 deltoid heads" },
          { name: "Cable lateral raise (single arm)", sets: 3, reps: "12 / side", note: "Better constant tension than dumbbell" },
          { name: "Tricep overhead extension + skull crushers superset", sets: 3, reps: "12", note: "Arms are secondary — don't overtrain" }
        ]},
        { title: "Core Finisher", kind: "core", note: "8 min", items: [
          { name: "Bicycle crunches (slow, controlled)", sets: 3, reps: "20", note: "Don't rush — obliques and rectus both active" },
          { name: "Hollow body hold", sets: 3, reps: "30s hold", note: "Athletic core compression. Ronaldo uses this." }
        ]},
        { title: "Cardio — Steady", kind: "cardio", note: "15 min", items: [
          { name: "Rowing machine", reps: "moderate intensity", note: "Full body — lightly hits back and arms" }
        ]}
      ]
    },

    day5: {
      label: "Friday", focus: "Pull — Back width & thickness",
      secondary: "Neck & Posture + 15 min cardio",
      sections: [
        { title: "Main Work", kind: "main", items: [
          { name: "Weighted pull-ups", sets: 4, reps: "6–8", note: "Add plate/belt if bodyweight is easy. Full stretch at bottom." },
          { name: "T-bar row or bent-over barbell row", sets: 4, reps: "8", note: "Mid-back thickness — the 3D back look" },
          { name: "Single arm dumbbell row", sets: 3, reps: "10 / side", note: "Full stretch at bottom, row to hip" },
          { name: "Face pull + band pull-apart superset", sets: 3, reps: "15", priority: "CRITICAL", note: "Every pull day. Non-negotiable for posture." },
          { name: "Hammer curls + reverse curls superset", sets: 3, reps: "12", note: "Brachialis + forearm — thick arm look" }
        ]},
        { title: "Neck & Posture", kind: "posture", note: "5 min", items: [
          { name: "Barbell shrugs (heavy)", sets: 3, reps: "15", note: "Hold at top 2 sec. Builds neck-trap junction." },
          { name: "Neck flexion/extension with plate (light)", sets: 2, reps: "10", note: "Very light — 2.5kg max. Slow only. Tendons adapt slow." }
        ]},
        { title: "Cardio — Steady", kind: "cardio", note: "15 min", items: [
          { name: "Incline treadmill walk", reps: "steady, low stress", note: "You've had a heavy week by Friday" }
        ]}
      ]
    },

    day6: {
      label: "Saturday", focus: "Legs — Quad dominant",
      secondary: "Full Core Circuit + 20 min cardio (hardest session)",
      sections: [
        { title: "Main Work", kind: "main", items: [
          { name: "Front squat or goblet squat", sets: 4, reps: "8", note: "Quad dominant — upright torso, great for shaping" },
          { name: "Bulgarian split squat", sets: 3, reps: "10 / leg", priority: "CRITICAL", note: "Best for glute/hip reshaping. It burns — that's the point." },
          { name: "Leg extension", sets: 3, reps: "15", note: "Quad isolation — teardrop near the knee" },
          { name: "Calf raises (heavy)", sets: 4, reps: "20", note: "Full stretch at bottom — don't bounce." }
        ]},
        { title: "Core Circuit", kind: "core", note: "10 min", items: [
          { name: "Hanging leg raises", sets: 3, reps: "15", note: "Go slow — don't swing" },
          { name: "Cable crunch (kneeling)", sets: 3, reps: "15", note: "Best weighted abs exercise. Full contraction." },
          { name: "Side plank + hip dip", sets: 3, reps: "30s / side", note: "Obliques — tapered waist look" }
        ]},
        { title: "Cardio — Run", kind: "cardio", note: "20 min", items: [
          { name: "Outdoor run or 5km treadmill", reps: "target sub-30 min", note: "Track your 5km time monthly — stamina benchmark" }
        ]}
      ]
    },

    day7: {
      label: "Sunday", focus: "Full rest", rest: true,
      secondary: "Rest or light 20-min walk only",
      sections: [
        { title: "Recovery", kind: "rest", items: [
          { name: "Rest / light 20-min walk", note: "Muscles grow on rest days. Sleep 7.5hrs minimum." }
        ]}
      ]
    }
  },

  posture: {
    when: "Daily — at home, 10 minutes. As an EM on a laptop all day, this fixes forward head, tight chest/hip flexors, weak neck. Anterior pelvic tilt makes the bum look bigger — daily stretching shows results before fat loss does.",
    exercises: [
      { name: "Chin tucks", detail: "3×10, hold 5s — double chin position. Do at desk during calls too." },
      { name: "Doorway chest stretch", detail: "2× hold 30s/side — elbows at 90°, lean forward gently." },
      { name: "Wall angels (standing)", detail: "3×10 — back flat on wall, arms slide up/down." },
      { name: "Hip flexor stretch (kneeling lunge)", detail: "2× hold 45s/side — every single day. Fixes pelvic tilt." },
      { name: "Cat-cow (floor)", detail: "2×10 — spine mobility, every morning." },
      { name: "Neck rotation + lateral flexion (gentle)", detail: "1×10 each direction — slow, mobility only." }
    ],
    desk: [
      "Monitor at eye level (laptop stand + external keyboard) — most impactful change.",
      "Stand up every 30–40 min. Set a timer. Sitting undoes your gym work.",
      "Chin tucks during calls — on mute. Use dead meeting time."
    ]
  },

  nutrition_tips: {
    strategy: "Slight caloric deficit (~350 below maintenance) for body recomposition — lose fat, build/preserve muscle.",
    sample_day: [
      { time: "6:30 AM", meal: "Pre-workout", food: "Banana + black coffee OR 1 scoop whey in water", kcal: "~200" },
      { time: "8:30 AM", meal: "Post-workout", food: "4 eggs + 2 rotis + 1 fruit", kcal: "~550" },
      { time: "1:00 PM", meal: "Lunch", food: "1 cup rice + dal/rajma + sabzi + curd + salad", kcal: "~650" },
      { time: "4:00 PM", meal: "Snack", food: "Greek yogurt OR paneer 100g + almonds/chana", kcal: "~300" },
      { time: "8:00 PM", meal: "Dinner", food: "Grilled chicken/fish 150g + 1 roti + sabzi (light carbs)", kcal: "~450" },
      { time: "Bedtime", meal: "Slow protein", food: "Milk 200ml OR casein", kcal: "~150" }
    ],
    cut: ["Fried food (samosa, chips, pakora)", "Maida products (biscuits, bread, noodles, pizza)", "Sugary drinks", "Alcohol", "Namkeen / packaged snacks", "Late-night heavy meals"],
    supplements: [
      { name: "Creatine monohydrate", dose: "5g/day, any time", priority: "HIGHLY RECOMMENDED" },
      { name: "Vitamin D3 + K2", dose: "2000–4000 IU D3 daily", priority: "HIGHLY RECOMMENDED" },
      { name: "Magnesium glycinate", dose: "300–400mg before bed", priority: "RECOMMENDED" },
      { name: "Whey protein", dose: "1 scoop if short of 140g protein", priority: "OPTIONAL" }
    ]
  },

  milestones: [
    { period: "Month 1 — Foundation", points: ["Establish routine, no missed sessions", "Fix form on compounds", "Better mobility & energy", "Scale may not move — don't panic"] },
    { period: "Month 2 — Recomposition", points: ["Visible shoulder/back width", "Posture noticeably better", "3–4kg drop", "Face leaner, glutes reshaping"] },
    { period: "Month 3 — Shaping", points: ["Abs visible in low light", "Glutes visibly reduced & shaped", "Neck thicker from shrugs", "Stronger on all lifts"] },
    { period: "Month 4–6 — Athletic", points: ["Abs visible in normal light", "Lean muscle throughout", "Functional strength & stamina", "5km under 25–27 min"] }
  ],

  warnings: [
    { topic: "Cortisol & stress", text: "EM stress elevates cortisol → stores face/belly fat, kills recovery. Sleep 7.5h minimum — part of the plan." },
    { topic: "Timeline", text: "You'll feel different in 30 days, look different around week 6–8. The physique is a 4–6 month honest commitment." },
    { topic: "Spot reduction myth", text: "Can't spot-reduce glutes. But hip-flexor tightness makes the bum look bigger — daily stretching shows results in weeks." },
    { topic: "Form before weight", text: "Especially deadlifts & squats. Ego lifting injures you and ends the plan. Film from the side. Month 1 = perfect form." },
    { topic: "Face fat", text: "Reduces with overall fat loss + water retention drop. Caloric deficit + 4L water/day. Can't target it." }
  ]
};
