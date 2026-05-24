import 'dart:math';

import 'atom.dart';

/// Pure game logic: ring of atoms plus the "next" atom to place.
///
/// The ring is a circular list of [Atom]s. Placement index `i` means
/// "insert before ring[i]" (modulo length). After placing a plus, any
/// matching atoms on either side merge into the next element, repeating
/// outward as long as the next pair matches.
class GameState {
  GameState({
    List<Atom>? ring,
    Atom? next,
    int score = 0,
    Random? random,
    this.capacity = 18,
  })  : _ring = List.of(ring ?? const []),
        _next = next ?? const Atom(1),
        _score = score,
        _random = random ?? Random();

  final List<Atom> _ring;
  Atom _next;
  int _score;
  final Random _random;
  final int capacity;

  List<Atom> get ring => List.unmodifiable(_ring);
  Atom get next => _next;
  int get score => _score;
  bool get isGameOver => _ring.length >= capacity;

  /// Highest element that may currently be drawn as the next atom.
  /// Tracks the ring's maximum so the difficulty scales as you progress.
  int get _maxElement {
    var m = 1;
    for (final a in _ring) {
      if (!a.isPlus && a.atomicNumber > m) m = a.atomicNumber;
    }
    return m;
  }

  /// Create a fresh game with a small starting ring.
  factory GameState.newGame({Random? random, int capacity = 18}) {
    final rng = random ?? Random();
    final initial = <Atom>[
      for (var i = 0; i < 6; i++) Atom(1 + rng.nextInt(3)),
    ];
    return GameState(
      ring: initial,
      next: _drawNext(rng, initial),
      capacity: capacity,
      random: rng,
    );
  }

  static Atom _drawNext(Random rng, List<Atom> ring) {
    // 1-in-5 chance of a plus; otherwise a regular atom up to (max + 2).
    if (rng.nextInt(5) == 0) return Atom.plus;
    var maxEl = 1;
    for (final a in ring) {
      if (!a.isPlus && a.atomicNumber > maxEl) maxEl = a.atomicNumber;
    }
    final ceiling = (maxEl + 2).clamp(2, 30);
    return Atom(1 + rng.nextInt(ceiling));
  }

  /// Place [next] at the given insertion index (0..ring.length).
  /// Returns true when the move was applied.
  bool place(int insertIndex) {
    if (isGameOver) return false;
    if (_ring.length >= capacity) return false;
    if (insertIndex < 0 || insertIndex > _ring.length) return false;

    if (_next.isPlus) {
      if (_ring.length < 2) {
        // No fusion possible with fewer than two atoms; drop the plus.
        _drawNew();
        return true;
      }
      _ring.insert(insertIndex, _next);
      _resolvePlusAt(insertIndex);
    } else {
      _ring.insert(insertIndex, _next);
    }

    _drawNew();
    return true;
  }

  void _drawNew() {
    _next = _drawNext(_random, _ring);
  }

  /// Greedily fuse outward from a plus at [plusIndex].
  void _resolvePlusAt(int plusIndex) {
    var idx = plusIndex;
    var streak = 0;
    while (true) {
      if (_ring.length < 3) break;
      final leftIdx = (idx - 1 + _ring.length) % _ring.length;
      final rightIdx = (idx + 1) % _ring.length;
      if (leftIdx == rightIdx) break;
      final left = _ring[leftIdx];
      final right = _ring[rightIdx];
      if (left.isPlus || right.isPlus) break;
      if (left.atomicNumber != right.atomicNumber) break;

      final fused = Atom(left.atomicNumber + 1);
      streak += 1;
      _score += fused.atomicNumber * streak * 2;

      // Remove right, plus, and left; insert fused at the lower position.
      final indices = [leftIdx, idx, rightIdx]..sort((a, b) => b.compareTo(a));
      for (final i in indices) {
        _ring.removeAt(i);
      }
      final insertAt = indices.last; // smallest of the three after sort desc
      _ring.insert(insertAt, fused);
      idx = insertAt;
    }
  }

  GameState copy() => GameState(
        ring: List.of(_ring),
        next: _next,
        score: _score,
        capacity: capacity,
        random: _random,
      );
}
