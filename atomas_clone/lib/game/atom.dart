import 'package:flutter/material.dart';

/// An atom in the Atomas game. Either a regular element (atomicNumber >= 1)
/// or the special "plus" trigger that fuses two adjacent matching atoms.
class Atom {
  const Atom(this.atomicNumber);

  /// >= 1 for an element. 0 = special "plus" trigger.
  final int atomicNumber;

  bool get isPlus => atomicNumber == 0;

  static const Atom plus = Atom(0);

  static const List<String> _symbols = [
    '+', 'H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne',
    'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar', 'K', 'Ca',
    'Sc', 'Ti', 'V', 'Cr', 'Mn', 'Fe', 'Co', 'Ni', 'Cu', 'Zn',
  ];

  String get symbol {
    if (atomicNumber < _symbols.length) return _symbols[atomicNumber];
    return 'E$atomicNumber';
  }

  /// A stable, pleasant color per atomic number.
  Color get color {
    if (isPlus) return const Color(0xFFB0BEC5);
    const palette = <Color>[
      Color(0xFFE53935), // red
      Color(0xFFFB8C00), // orange
      Color(0xFFFDD835), // yellow
      Color(0xFF43A047), // green
      Color(0xFF1E88E5), // blue
      Color(0xFF8E24AA), // purple
      Color(0xFFD81B60), // pink
      Color(0xFF00897B), // teal
      Color(0xFF6D4C41), // brown
      Color(0xFF3949AB), // indigo
    ];
    return palette[(atomicNumber - 1) % palette.length];
  }

  @override
  String toString() => isPlus ? '+' : symbol;

  @override
  bool operator ==(Object other) =>
      other is Atom && other.atomicNumber == atomicNumber;

  @override
  int get hashCode => atomicNumber.hashCode;
}
