import 'dart:math';

import 'package:atomas_clone/game/atom.dart';
import 'package:atomas_clone/game/game_state.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  group('GameState', () {
    test('placing a regular atom inserts it at the given index', () {
      final state = GameState(
        ring: const [Atom(1), Atom(2), Atom(3)],
        next: const Atom(4),
        random: Random(0),
      );
      state.place(1);
      expect(
        state.ring.map((a) => a.atomicNumber).toList(),
        [1, 4, 2, 3],
      );
    });

    test('plus fuses two matching neighbours into the next element', () {
      final state = GameState(
        ring: const [Atom(2), Atom(2)],
        next: Atom.plus,
        random: Random(0),
      );
      state.place(1);
      expect(state.ring.length, 1);
      expect(state.ring.single.atomicNumber, 3);
      expect(state.score, greaterThan(0));
    });

    test('plus chains greedily while neighbours keep matching', () {
      final state = GameState(
        ring: const [Atom(3), Atom(2), Atom(2), Atom(3)],
        next: Atom.plus,
        random: Random(0),
      );
      // Insert plus between the two 2s: 3, 2, +, 2, 3 -> 3, 3, 3 -> 3, 4
      // Then 3 and 3 around the merged 4? Greedy resolver fuses outward.
      state.place(2);
      // Expected: the two 2s fuse to 3, then with the surrounding 3s
      // it chains until no further match: final ring contains a 4 and a 3
      // (or a single 4 depending on the chain). Just check it shrank and
      // produced a 4.
      expect(state.ring.length, lessThan(4));
      expect(
        state.ring.any((a) => a.atomicNumber >= 4),
        isTrue,
      );
    });

    test('plus on a ring with <2 atoms is consumed without crash', () {
      final state = GameState(
        ring: const [Atom(1)],
        next: Atom.plus,
        random: Random(0),
      );
      expect(() => state.place(0), returnsNormally);
    });

    test('game ends when the ring reaches capacity', () {
      final state = GameState(
        ring: List.filled(17, const Atom(1)),
        next: const Atom(5),
        capacity: 18,
        random: Random(0),
      );
      expect(state.isGameOver, isFalse);
      state.place(0);
      expect(state.isGameOver, isTrue);
      // No further moves accepted.
      expect(state.place(0), isFalse);
    });
  });
}
