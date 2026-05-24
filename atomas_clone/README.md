# Atomas Clone

A Flutter clone of the puzzle game Atomas.

## Game Rules

- Atoms are arranged in a circular ring.
- A new atom appears in the center; tap a slot between existing atoms to place it.
- When the placed atom is a **plus (+)**, it merges any two adjacent atoms with the same element on either side of it, producing the next element. Merges chain greedily.
- The game ends when the ring is full (18 atoms).

## Running

```bash
cd atomas_clone
flutter pub get
flutter run
```

## Tests

```bash
flutter test
```

## Project layout

```
atomas_clone/
├── pubspec.yaml
├── analysis_options.yaml
├── lib/
│   ├── main.dart
│   ├── game/
│   │   ├── atom.dart
│   │   └── game_state.dart
│   ├── widgets/
│   │   ├── atom_widget.dart
│   │   └── game_board.dart
│   └── screens/
│       └── game_screen.dart
└── test/
    └── game_state_test.dart
```
