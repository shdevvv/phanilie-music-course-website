export interface Lesson {
  title: string
  subItems?: string[]
}

export interface Topic {
  title: string
  lessons: Lesson[]
}

export interface Level {
  number: number
  title: string
  subtitle: string
  topics: Topic[]
}

// Helper for Level 2's repetitive key topics
const majorSub = [
  'Major Scale (1 Octave)', 'Major Scale (2 Octaves)', 'Diatonic Chords',
  'Four Common Chord Progressions', 'Chord Inversions', 'Song Application', 'Performance with Backing Track',
]
const minorSub = [
  'Natural Minor Scale', 'Harmonic Minor Scale', 'Melodic Minor Scale',
  'Four Common Chord Progressions', 'Chord Inversions', 'Song Application', 'Performance with Backing Track',
]
function keyTopic(title: string, maj: string, min: string): Topic {
  return { title, lessons: [{ title: maj, subItems: [...majorSub] }, { title: min, subItems: [...minorSub] }] }
}

export const levels: Level[] = [
  // ═══════════════════════════════════════════════════════════════
  // LEVEL 1
  // ═══════════════════════════════════════════════════════════════
  {
    number: 1, title: 'Level 1', subtitle: 'Piano Foundations',
    topics: [
      { title: 'Piano Basics', lessons: [
        { title: 'Introduction to the Piano' }, { title: 'Keyboard Orientation' },
        { title: 'White Key Note Names' }, { title: 'Black Key Note Names' },
        { title: 'Finding Notes Quickly' }, { title: 'Understanding the Keyboard Pattern' },
      ]},
      { title: 'Piano Technique', lessons: [
        { title: 'Proper Sitting Posture' }, { title: 'Correct Hand Position' },
        { title: 'Finger Numbers' }, { title: 'Wrist & Arm Relaxation' },
        { title: 'Basic Touch Control' }, { title: 'Developing Good Playing Habits' },
      ]},
      { title: 'Finger Development', lessons: [
        { title: 'Finger Independence Exercises' }, { title: 'Finger Stretching Warm-Ups' },
        { title: 'Playing in C Position' }, { title: 'Basic Fingering Principles' },
        { title: 'Smooth Finger Transitions' }, { title: 'Finger Strength Exercises' },
      ]},
      { title: 'Reading & Rhythm Fundamentals', lessons: [
        { title: 'Note Values' }, { title: 'Whole Notes' }, { title: 'Half Notes' },
        { title: 'Quarter Notes' }, { title: 'Eighth Notes' }, { title: 'Counting Rhythm' },
        { title: 'Playing with a Steady Pulse' }, { title: 'Reading Simple Rhythms' },
      ]},
      { title: 'Beginner Songs', lessons: [
        { title: 'Ode to Joy (Jazz Style)' }, { title: 'Mary Had a Little Lamb (Latin Style)' },
        { title: 'William Jonathan (Jazz Ballad)' }, { title: "I'll Be There (Pop Style)" },
        { title: 'Twinkle Twinkle (Blues Style)' }, { title: 'Playing with Expression' },
        { title: 'Performance with Backing Track' },
      ]},
      { title: 'Practice Fundamentals', lessons: [
        { title: 'How to Practice Effectively' }, { title: 'Daily Practice Routine' },
        { title: 'Practicing Without Mistakes' }, { title: 'Using a Metronome' },
        { title: 'Building Finger Memory' }, { title: 'Practice Checklist' },
        { title: 'Level 1 Performance Challenge' },
      ]},
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // LEVEL 2
  // ═══════════════════════════════════════════════════════════════
  {
    number: 2, title: 'Level 2', subtitle: 'The Complete 12-Key System',
    topics: [
      keyTopic('C Major & A Minor', 'C major', 'A minor'),
      keyTopic('G Major & E Minor', 'G major', 'E minor'),
      keyTopic('F Major & D Minor', 'F major', 'D minor'),
      keyTopic('D Major & B Minor', 'D major', 'B minor'),
      keyTopic('Bb Major & G Minor', 'Bb major', 'G minor'),
      keyTopic('Eb Major & C Minor', 'Eb major', 'C minor'),
      keyTopic('A Major & F# Minor', 'A major', 'F# minor'),
      keyTopic('E Major & C# Minor', 'E major', 'C# minor'),
      keyTopic('Ab Major & F Minor', 'Ab major', 'F minor'),
      keyTopic('B Major & G# Minor', 'B major', 'G# minor'),
      keyTopic('Db Major & Bb Minor', 'Db major', 'Bb minor'),
      keyTopic('Gb Major & Eb Minor', 'Gb major', 'Eb minor'),
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // LEVEL 3
  // ═══════════════════════════════════════════════════════════════
  {
    number: 3, title: 'Level 3', subtitle: 'Rhythm & Hand Coordination',
    topics: [
      { title: 'Hand Independence', lessons: [
        { title: 'Introduction to Hand Coordination' }, { title: 'Two-Hand Coordination Exercise 1' },
        { title: 'Playing Together with Both Hands' }, { title: 'Hand Independence Exercises' },
        { title: 'Coordination Practice Challenge' },
      ]},
      { title: 'Rhythm Development', lessons: [
        { title: 'Counting Half Notes' }, { title: 'Counting Eighth Notes' },
        { title: 'Quarter Note Pulse' }, { title: 'Basic Rhythmic Patterns' },
        { title: 'Right-Hand Rhythm Patterns' }, { title: 'Triplet Rhythms' },
        { title: 'Rhythm Variations' },
      ]},
      { title: 'Musical Vocabulary', lessons: [
        { title: 'Essential Musical Terms' }, { title: 'Musical Symbols' },
        { title: 'Tempo Markings' }, { title: 'Dynamic Markings' }, { title: 'Articulation Basics' },
      ]},
      { title: 'Interval Recognition', lessons: [
        { title: 'What Are Intervals?' }, { title: 'Ascending Intervals' },
        { title: 'Descending Intervals' }, { title: 'Interval Exercises' },
        { title: 'Interval Recognition Practice' },
      ]},
      { title: 'Melody Applications', lessons: [
        { title: 'Beginner Melody Applications' }, { title: 'Intermediate Melody Applications' },
        { title: 'Advanced Melody Applications' }, { title: 'Combining Rhythm & Melody' },
        { title: 'Performance Exercise' },
      ]},
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // LEVEL 4
  // ═══════════════════════════════════════════════════════════════
  {
    number: 4, title: 'Level 4', subtitle: 'Essential Music Theory',
    topics: [
      { title: 'Major Scale Improvisation', lessons: [
        { title: 'The Major Scale for Improvisation' }, { title: 'Major Chord Progressions' },
        { title: 'Improvisation Blocks' }, { title: 'Rhythm Exercises' },
        { title: 'Soloing with Stepwise Motion' }, { title: 'Outlining Chord Tones' },
        { title: 'Solo Performance' },
      ]},
      { title: 'Minor Scale Improvisation', lessons: [
        { title: 'Natural Minor Scale' }, { title: 'Harmonic Minor Scale' },
        { title: 'Melodic Minor Scale' }, { title: 'Minor Chord Progressions' },
        { title: 'Minor Chord Tone Soloing' }, { title: 'Solo Exercises' },
        { title: 'Performance Application' },
      ]},
      { title: 'Pentatonic Concepts', lessons: [
        { title: 'Major Pentatonic Scale' }, { title: 'Minor Pentatonic Scale' },
        { title: 'Major 9 Scale' }, { title: 'Cluster Positions' },
        { title: 'Pentatonic Improvisation' }, { title: 'Solo Exercises' },
      ]},
      { title: 'Blues & Gospel Scales', lessons: [
        { title: 'Major Blues Scale' }, { title: 'Minor Blues Scale' },
        { title: 'Gospel Scale Concepts' }, { title: 'Blues Scale Exercises' },
        { title: 'Gospel Style Applications' }, { title: 'Fingering in All 12 Keys' },
      ]},
      { title: 'Solo Development', lessons: [
        { title: 'Principles of Soloing' }, { title: 'Building Musical Phrases' },
        { title: 'Connecting Scale & Chords' }, { title: 'Rhythm Development' },
        { title: 'Creating Longer Solos' }, { title: 'Improvisation Performance' },
      ]},
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // LEVEL 5
  // ═══════════════════════════════════════════════════════════════
  {
    number: 5, title: 'Level 5', subtitle: 'Seventh Chord Foundations',
    topics: [
      { title: 'Major Seventh Chords', lessons: [
        { title: 'Understanding Major 7 Chords' }, { title: 'Building Major 7 Chords' },
        { title: 'Major 7 Chord Symbols' }, { title: 'Major 7 Chord Shapes' },
        { title: 'Major 7 Inversions' }, { title: 'Circle of Fifths Exercises' },
        { title: 'Song Applications' }, { title: 'Performance Practice' },
      ]},
      { title: 'Dominant Seventh Chords', lessons: [
        { title: 'Understanding Dominant 7 Chords' }, { title: 'Building Dominant 7 Chords' },
        { title: 'Dominant 7 Chord Symbols' }, { title: 'Dominant 7 Chord Shapes' },
        { title: 'Dominant 7 Inversions' }, { title: 'Common Dominant Progressions' },
        { title: 'Song Applications' }, { title: 'Performance Practice' },
      ]},
      { title: 'Minor Seventh Chords', lessons: [
        { title: 'Understanding Minor 7 Chords' }, { title: 'Building Minor 7 Chords' },
        { title: 'Minor 7 Chord Symbols' }, { title: 'Minor 7 Chord Shapes' },
        { title: 'Minor 7 Inversions' }, { title: 'Common Minor Progressions' },
        { title: 'Song Applications' }, { title: 'Performance Practice' },
      ]},
      { title: 'Diminished Harmony', lessons: [
        { title: 'Diminished Seventh Chords' }, { title: 'Half-Diminished Chords (m7♭5)' },
        { title: 'Diminished Chord Construction' }, { title: 'Blocked & Broken Chord Exercises' },
        { title: 'Applying Diminished Harmony' }, { title: 'Performance Practice' },
      ]},
      { title: 'Ⅱ-Ⅴ-Ⅰ Progressions', lessons: [
        { title: 'Understanding the Ⅱ–Ⅴ–Ⅰ Progression' }, { title: 'Major Ⅱ–Ⅴ–Ⅰ Progressions' },
        { title: 'Minor Ⅱ–Ⅴ–Ⅰ Progressions' }, { title: 'Voice Leading Basics' },
        { title: 'Chord Inversions in Ⅱ–Ⅴ–Ⅰ' }, { title: 'Practice Around the Circle of Fifths' },
      ]},
      { title: 'Lead Sheet Applications', lessons: [
        { title: 'Reading Lead Sheets' }, { title: 'Cycle of Fifths Progression' },
        { title: 'Turnaround Progression' }, { title: 'Extended Turnaround' },
        { title: 'Chromatic Walk-Up' }, { title: 'Minor Turnaround' },
        { title: 'Misty Progression' }, { title: 'Sentimental Progression' },
        { title: '12-Bar Blues Progression' }, { title: 'Performance with Lead Sheets' },
      ]},
      { title: 'Ear Training', lessons: [
        { title: 'Identifying Major 7 Chords' }, { title: 'Identifying Dominant 7 Chords' },
        { title: 'Identifying Minor 7 Chords' }, { title: 'Identifying Diminished Chords' },
        { title: 'Recognizing Chord Inversions' }, { title: 'Ear Training Practice' },
        { title: 'Progression Recognition Exercises' },
      ]},
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // LEVEL 6
  // ═══════════════════════════════════════════════════════════════
  {
    number: 6, title: 'Level 6', subtitle: 'Modern Jazz Harmony',
    topics: [
      { title: 'Shell Voicings', lessons: [
        { title: 'Understanding Shell Voicings' }, { title: 'Major 7 Shell Voicings' },
        { title: 'Dominant 7 Shell Voicings' }, { title: 'Minor 7 Shell Voicings' },
        { title: 'Circle of Fifths Shell Exercises' }, { title: 'Major II–V–I Shell Voicings' },
        { title: 'Minor II–V–I Shell Voicings' }, { title: 'Song Applications' },
      ]},
      { title: 'Guide Tones', lessons: [
        { title: 'Understanding Guide Tones' }, { title: 'The 3rd & 7th Guide Tones' },
        { title: 'Voice Leading with Guide Tones' }, { title: 'Guide Tone Exercises' },
        { title: 'Guide Tone Progressions' }, { title: 'Song Applications' },
      ]},
      { title: 'Chord Extensions', lessons: [
        { title: 'Introduction to Chord Extensions' }, { title: 'Major Chord Extensions' },
        { title: 'Minor Chord Extensions' }, { title: 'Dominant Chord Extensions' },
        { title: 'Extension Practice Exercises' }, { title: 'Circle of Fifths Extension Exercises' },
        { title: 'Song Applications' },
      ]},
      { title: 'Chord Alterations', lessons: [
        { title: 'Introduction to Chord Alterations' }, { title: 'Dominant 7(b9) Chords' },
        { title: 'Dominant 7(#9) Chords' }, { title: 'Dominant 7(#11) Chords' },
        { title: 'Dominant 7(b13) Chords' }, { title: 'Alteration Practice Exercises' },
        { title: 'Song Applications' },
      ]},
      { title: 'Upper Structures', lessons: [
        { title: 'Introduction to Upper Structures' }, { title: 'Upper Structure Triad I' },
        { title: 'Upper Structure Triad II' }, { title: 'Upper Structure Triad III' },
        { title: 'Upper Structure Triad IV' }, { title: 'Upper Structure Triad V' },
        { title: 'Song Applications' },
      ]},
      { title: 'Advanced Ⅱ-Ⅴ-Ⅰ Harmony', lessons: [
        { title: 'Extended II–V–I Progressions' }, { title: 'Altered II–V–I Progressions' },
        { title: 'Voice Leading Techniques' }, { title: 'Circle of Fifths Practice' },
        { title: 'Song Applications' },
      ]},
      { title: 'Passing Chords', lessons: [
        { title: 'Introduction to Passing Chords' }, { title: 'Secondary Dominant Passing Chords' },
        { title: 'Tritone Substitute Passing Chords' }, { title: 'II–V–I Passing Chords' },
        { title: 'Extended II–V–I Passing Chords' }, { title: 'Musical Applications' },
      ]},
      { title: 'Reharmonization', lessons: [
        { title: 'Introduction to Reharmonization' }, { title: 'Secondary Dominant Reharmonization' },
        { title: 'Tritone Substitution Reharmonization' }, { title: 'Passing Chord Reharmonization' },
        { title: 'Song Applications' },
      ]},
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // LEVEL 7
  // ═══════════════════════════════════════════════════════════════
  {
    number: 7, title: 'Level 7', subtitle: 'Professional Piano Voicings',
    topics: [
      { title: 'Major Rootless', lessons: [
        { title: 'Understanding Rootless Voicings' }, { title: 'Major 9 "A" Voicings' },
        { title: 'Major 9 "B" Voicings' }, { title: 'Combining A & B Voicings' },
        { title: 'Voice Leading with Rootless Voicings' }, { title: 'Song Applications' },
      ]},
      { title: 'Minor Rootless', lessons: [
        { title: 'Minor 9 "A" Voicings' }, { title: 'Minor 9 "B" Voicings' },
        { title: 'Combining A & B Voicings' }, { title: 'Minor Rootless Exercises' },
        { title: 'Song Applications' },
      ]},
      { title: 'Dominant Rootless', lessons: [
        { title: 'Dominant 13 "A" Voicings' }, { title: 'Dominant 13 "B" Voicings' },
        { title: 'Alternate Dominant Rootless Voicings' }, { title: 'Voice Leading with Dominant Rootless Voicings' },
        { title: 'Song Applications' },
      ]},
      { title: 'Half-Diminished Rootless', lessons: [
        { title: 'Minor 7(b5) "A" Voicings' }, { title: 'Minor 7(b5) "B" Voicings' },
        { title: 'Alternate Half-Diminished Rootless Voicings' }, { title: 'Practice Exercises' },
      ]},
      { title: 'Altered Dominant Rootless', lessons: [
        { title: 'Dominant 7(b9) Rootless Voicings' }, { title: 'Dominant 7(b9♭13) Rootless Voicings' },
        { title: 'Dominant 7(#9♭13) Rootless Voicings' }, { title: 'Altered Dominant Voicing Reference' },
        { title: 'Musical Applications' },
      ]},
      { title: 'Major Ⅱ-Ⅴ-Ⅰ Rootless', lessons: [
        { title: 'A-B-A Rootless Progressions' }, { title: 'B-A-B Rootless Progressions' },
        { title: 'Short II–V–I Progressions' }, { title: 'Long II–V–I Progressions' },
        { title: 'Circle of Fifths Practice' },
      ]},
      { title: 'Minor Ⅱ-Ⅴ-Ⅰ Rootless', lessons: [
        { title: 'A-B-A Rootless Progressions' }, { title: 'B-A-B Rootless Progressions' },
        { title: 'Short II–V–I Progressions' }, { title: 'Long II–V–I Progressions' },
        { title: 'Circle of Fifths Practice' },
      ]},
      { title: 'Rootless Lead Sheet Performance', lessons: [
        { title: 'Cycle of Fifths Progression' }, { title: 'Turnaround Progression' },
        { title: 'Extended Turnaround Progression' }, { title: 'Chromatic Walk-Up Progression' },
        { title: 'Minor Turnaround Progression' }, { title: 'Misty Progression' },
        { title: 'Sentimental Progression' }, { title: 'Blues Progression' },
        { title: 'Performance Practice' },
      ]},
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // LEVEL 8
  // ═══════════════════════════════════════════════════════════════
  {
    number: 8, title: 'Level 8', subtitle: 'Block Chords',
    topics: [
      { title: 'Major Block Chords', lessons: [
        { title: 'Introduction to Major Block Chords' }, { title: 'Major Block Chord Positions' },
        { title: 'Major Block Chord Exercises (C, F, Bb)' }, { title: 'Major Block Chord Exercises (Ab, Eb, Db)' },
        { title: 'Major Block Chord Exercises (F#, B, E)' }, { title: 'Major Block Chord Exercises (A, D, G)' },
        { title: 'Song Applications' },
      ]},
      { title: 'Minor Block Chords', lessons: [
        { title: 'Introduction to Minor Block Chords' }, { title: 'Minor Block Chord Positions' },
        { title: 'Minor Block Chord Exercises (Cm, Fm, Bbm)' }, { title: 'Minor Block Chord Exercises (Ebm, Abm, Dbm)' },
        { title: 'Minor Block Chord Exercises (F#m, Bm, Em)' }, { title: 'Minor Block Chord Exercises (Am, Dm, Gm)' },
        { title: 'Song Applications' },
      ]},
      { title: 'Dominant Block Chords', lessons: [
        { title: 'Introduction to Dominant Block Chords' }, { title: 'Dominant Block Chord Positions' },
        { title: 'Dominant Block Chord Exercises (C, F, Bb)' }, { title: 'Dominant Block Chord Exercises (Eb, Ab, Db)' },
        { title: 'Dominant Block Chord Exercises (F#, B, E)' }, { title: 'Dominant Block Chord Exercises (A, D, G)' },
        { title: 'Song Applications' },
      ]},
      { title: 'Half-Diminished Block Chords', lessons: [
        { title: 'Understanding Half-Diminished Block Chords' }, { title: 'Half-Diminished Block Chord Positions' },
        { title: 'Exercises Set 1' }, { title: 'Exercises Set 2' },
        { title: 'Exercises Set 3' }, { title: 'Song Applications' },
      ]},
      { title: 'Diminished Block Chords', lessons: [
        { title: 'Diminished Scale Concepts' }, { title: 'Dominant-Diminished Scale Concepts' },
        { title: 'Diminished Scale Exercises 1' }, { title: 'Diminished Scale Exercises 2' },
        { title: 'Diminished Scale Exercises 3' }, { title: 'Song Applications' },
      ]},
      { title: 'Block Chord Lead Sheet Performance', lessons: [
        { title: 'Circle of Fifths Progressions' }, { title: 'Basic Turnaround Progressions' },
        { title: 'Extended Turnaround Progressions' }, { title: 'Chromatic Passing Progressions' },
        { title: 'Minor Turnaround Progressions' }, { title: 'Ballad Harmony Applications' },
        { title: 'Jazz Standard Harmony Applications' }, { title: 'Blues Harmony Applications' },
        { title: 'Performance Project' },
      ]},
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // LEVEL 9
  // ═══════════════════════════════════════════════════════════════
  {
    number: 9, title: 'Level 9', subtitle: 'Styles & Accompaniment',
    topics: [
      { title: 'Major Drop 2', lessons: [
        { title: 'Introduction to Major Drop 2' }, { title: 'Major Drop 2 Positions' },
        { title: 'Major Drop 2 Exercises (C, F, Bb)' }, { title: 'Major Drop 2 Exercises (Eb, Ab, Db)' },
        { title: 'Major Drop 2 Exercises (F#, B, E)' }, { title: 'Major Drop 2 Exercises (A, D, G)' },
        { title: 'Song Applications' },
      ]},
      { title: 'Minor Drop 2', lessons: [
        { title: 'Introduction to Minor Drop 2' }, { title: 'Minor Drop 2 Positions' },
        { title: 'Minor Drop 2 Exercises (Cm, Fm, Bbm)' }, { title: 'Minor Drop 2 Exercises (Ebm, Abm, Dbm)' },
        { title: 'Minor Drop 2 Exercises (F#m, Bm, Em)' }, { title: 'Minor Drop 2 Exercises (Am, Dm, Gm)' },
        { title: 'Song Applications' },
      ]},
      { title: 'Dominant Drop 2', lessons: [
        { title: 'Introduction to Dominant Drop 2' }, { title: 'Dominant Drop 2 Positions' },
        { title: 'Dominant Drop 2 Exercises (C, F, Bb)' }, { title: 'Dominant Drop 2 Exercises (Eb, Ab, Db)' },
        { title: 'Dominant Drop 2 Exercises (F#, B, E)' }, { title: 'Dominant Drop 2 Exercises (A, D, G)' },
        { title: 'Song Applications' },
      ]},
      { title: 'Half-Diminished Drop 2', lessons: [
        { title: 'Understanding Half-Diminished Drop 2' }, { title: 'Half-Diminished Drop 2 Positions' },
        { title: 'Exercises Set 1' }, { title: 'Exercises Set 2' },
        { title: 'Exercises Set 3' }, { title: 'Song Applications' },
      ]},
      { title: 'Diminished Drop 2', lessons: [
        { title: 'Diminished Scale Concepts' }, { title: 'Dominant-Diminished Scale Concepts' },
        { title: 'Diminished Drop 2 Exercises I' }, { title: 'Diminished Drop 2 Exercises II' },
        { title: 'Diminished Drop 2 Exercises III' }, { title: 'Song Applications' },
      ]},
      { title: 'Drop 2 Lead Sheet Performance', lessons: [
        { title: 'Circle of Fifths Progressions' }, { title: 'Basic Turnaround Progressions' },
        { title: 'Extended Turnaround Progressions' }, { title: 'Chromatic Passing Progressions' },
        { title: 'Minor Turnaround Progressions' }, { title: 'Ballad Repertoire Studies' },
        { title: 'Jazz Standard Applications' }, { title: 'Blues Performance Studies' },
        { title: 'Performance Project' },
      ]},
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // LEVEL 10
  // ═══════════════════════════════════════════════════════════════
  {
    number: 10, title: 'Level 10', subtitle: 'Piano Arranging',
    topics: [
      { title: 'Major Quartal', lessons: [
        { title: 'Introduction to Major Quartal Voicings' }, { title: 'Major Quartal Positions' },
        { title: 'Major Quartal Exercises (C, F, Bb)' }, { title: 'Major Quartal Exercises (Eb, Ab, Db)' },
        { title: 'Major Quartal Exercises (F#, B, E)' }, { title: 'Major Quartal Exercises (A, D, G)' },
        { title: 'Song Applications' },
      ]},
      { title: 'Minor Quartal', lessons: [
        { title: 'Introduction to Minor Quartal Voicings' }, { title: 'Minor Quartal Positions' },
        { title: 'Minor Quartal Exercises (Cm, Fm, Bbm)' }, { title: 'Minor Quartal Exercises (Ebm, Abm, Dbm)' },
        { title: 'Minor Quartal Exercises (F#m, Bm, Em)' }, { title: 'Minor Quartal Exercises (Am, Dm, Gm)' },
        { title: 'Song Applications' },
      ]},
      { title: 'Dominant Quartal', lessons: [
        { title: 'Introduction to Dominant Quartal Voicings' }, { title: 'Dominant Quartal Positions' },
        { title: 'Dominant Quartal Exercises (C7, F7, Bb7)' }, { title: 'Dominant Quartal Exercises (Eb7, Ab7, Db7)' },
        { title: 'Dominant Quartal Exercises (F#7, B7, E7)' }, { title: 'Dominant Quartal Exercises (A7, D7, G7)' },
        { title: 'Song Applications' },
      ]},
      { title: 'Half-Diminished Quartal', lessons: [
        { title: 'Introduction to Half-Diminished Quartal Voicings' }, { title: 'Half-Diminished Quartal Positions' },
        { title: 'Exercises Set 1' }, { title: 'Exercises Set 2' },
        { title: 'Exercises Set 3' }, { title: 'Song Applications' },
      ]},
      { title: 'Dominant-Diminished Quartal', lessons: [
        { title: 'Diminished Scale Fundamentals' }, { title: 'Dominant-Diminished Scale Fundamentals' },
        { title: 'Quartal Exercises over Diminished Scale I' }, { title: 'Quartal Exercises over Diminished Scale II' },
        { title: 'Quartal Exercises over Diminished Scale III' }, { title: 'Song Applications' },
      ]},
      { title: 'Major Ⅱ-Ⅴ-Ⅰ Quartal', lessons: [
        { title: 'Understanding Major Quartal Ⅱ–Ⅴ–Ⅰ' }, { title: 'A-B-A Voicing System' },
        { title: 'B-A-B Voicing System' }, { title: 'Adding b9 & b13 Colors' },
        { title: 'Circle of Fifths Practice' }, { title: 'Song Applications' },
      ]},
      { title: 'Minor Ⅱ-Ⅴ-Ⅰ Quartal', lessons: [
        { title: 'Understanding Minor Quartal Ⅱ–Ⅴ–Ⅰ' }, { title: 'A-B-A Voicing System' },
        { title: 'B-A-B Voicing System' }, { title: 'Adding #9 & b13 Colors' },
        { title: 'Circle of Fifths Practice' }, { title: 'Song Applications' },
      ]},
      { title: 'Quartal Lead Sheet Performance', lessons: [
        { title: 'Circle of Fifths Progressions' }, { title: 'Basic Turnaround Progressions' },
        { title: 'Extended Turnaround Progressions' }, { title: 'Chromatic Passing Progressions' },
        { title: 'Minor Turnaround Progressions' }, { title: 'Ballad Repertoire Studies' },
        { title: 'Jazz Standard Applications' }, { title: 'Blues Performance Studies' },
        { title: 'Performance Project' },
      ]},
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // LEVEL 11
  // ═══════════════════════════════════════════════════════════════
  {
    number: 11, title: 'Level 11', subtitle: 'Performance & Musicianship',
    topics: [
      { title: 'Swing Piano', lessons: [
        { title: 'Swing Feel Fundamentals' }, { title: 'Left-Hand Swing Comping' },
        { title: 'Right-Hand Swing Phrasing' }, { title: 'Swing Improvisation' },
        { title: 'Swing Repertoire' }, { title: 'Performance Applications' },
      ]},
      { title: 'Blues Piano', lessons: [
        { title: 'Blues Harmony' }, { title: 'Blues Comping Patterns' },
        { title: 'Blues Licks & Vocabulary' }, { title: 'Blues Improvisation' },
        { title: 'Blues Repertoire' }, { title: 'Performance Applications' },
      ]},
      { title: 'Latin Piano', lessons: [
        { title: 'Introduction to Latin Piano' }, { title: 'Montuno Patterns' },
        { title: 'Syncopated Rhythms' }, { title: 'Latin Comping' },
        { title: 'Latin Improvisation' }, { title: 'Performance Applications' },
      ]},
      { title: 'Bossa Nova', lessons: [
        { title: 'Bossa Nova Groove' }, { title: 'Left-Hand Patterns' },
        { title: 'Right-Hand Comping' }, { title: 'Melody Interpretation' },
        { title: 'Bossa Improvisation' }, { title: 'Performance Applications' },
      ]},
      { title: 'Ballad Piano', lessons: [
        { title: 'Ballad Harmony' }, { title: 'Expressive Voicings' },
        { title: 'Rubato & Timing' }, { title: 'Ballad Improvisation' },
        { title: 'Emotional Interpretation' }, { title: 'Performance Applications' },
      ]},
      { title: 'Funk Piano', lessons: [
        { title: 'Funk Rhythm Concepts' }, { title: 'Funk Comping' },
        { title: 'Groove Development' }, { title: 'Funk Improvisation' },
        { title: 'Contemporary Funk Vocabulary' }, { title: 'Performance Applications' },
      ]},
      { title: 'Pop Piano', lessons: [
        { title: 'Contemporary Pop Harmony' }, { title: 'Pop Accompaniment Patterns' },
        { title: 'Piano Fills' }, { title: 'Modern Pop Arrangements' },
        { title: 'Contemporary Repertoire' }, { title: 'Performance Applications' },
      ]},
      { title: 'Performance Practice', lessons: [
        { title: 'Performance Preparation' }, { title: 'Building a Performance Setlist' },
        { title: 'Stage Confidence' }, { title: 'Musical Communication' },
        { title: 'Live Performance Techniques' }, { title: 'Final Performance Assessment' },
      ]},
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // LEVEL 12
  // ═══════════════════════════════════════════════════════════════
  {
    number: 12, title: 'Level 12', subtitle: 'Professional Pianist Development',
    topics: [
      { title: 'Advanced Harmony Integration', lessons: [
        { title: 'Combining Shells, Rootless & Quartal' }, { title: 'Harmonic Layering' },
        { title: 'Advanced Voice Leading' }, { title: 'Modern Harmonic Concepts' },
        { title: 'Harmony Applications' },
      ]},
      { title: 'Advanced Voicing Applications', lessons: [
        { title: 'Selecting the Right Voicing' }, { title: 'Style-Based Voicing Choices' },
        { title: 'Register & Texture' }, { title: 'Hybrid Voicings' },
        { title: 'Professional Applications' },
      ]},
      { title: 'Improvisation Integration', lessons: [
        { title: 'Connecting Scale Vocabulary' }, { title: 'Motivic Development' },
        { title: 'Advanced Solo Construction' }, { title: 'Dynamic Storytelling' },
        { title: 'Improvisation Performance' },
      ]},
      { title: 'Professional Accompaniment', lessons: [
        { title: 'Vocal Accompaniment' }, { title: 'Instrumental Accompaniment' },
        { title: 'Playing in an Ensemble' }, { title: 'Listening & Interaction Skills' },
        { title: 'Professional Performance Techniques' },
      ]},
      { title: 'Lead Sheet Mastery', lessons: [
        { title: 'Reading Complex Lead Sheets' }, { title: 'Reharmonizing Lead Sheets' },
        { title: 'Creating Original Arrangements' }, { title: 'Performance Preparation' },
        { title: 'Complete Lead Sheet Performance' },
      ]},
      { title: 'Performance Projects', lessons: [
        { title: 'Solo Piano Project' }, { title: 'Duo Performance Project' },
        { title: 'Trio Performance Project' }, { title: 'Contemporary Arrangement Project' },
        { title: 'Final Artist Showcase' },
      ]},
    ],
  },
]
