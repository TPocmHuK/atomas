import 'package:flutter/material.dart';

import '../game/atom.dart';

class AtomWidget extends StatelessWidget {
  const AtomWidget({
    super.key,
    required this.atom,
    this.size = 44,
    this.highlighted = false,
  });

  final Atom atom;
  final double size;
  final bool highlighted;

  @override
  Widget build(BuildContext context) {
    final color = atom.color;
    return AnimatedContainer(
      duration: const Duration(milliseconds: 180),
      width: size,
      height: size,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        gradient: RadialGradient(
          colors: [color, color.withOpacity(0.65)],
          radius: 0.85,
        ),
        border: Border.all(
          color: highlighted ? Colors.white : Colors.black26,
          width: highlighted ? 2.5 : 1,
        ),
        boxShadow: [
          BoxShadow(
            color: color.withOpacity(0.45),
            blurRadius: highlighted ? 14 : 6,
            spreadRadius: highlighted ? 1 : 0,
          ),
        ],
      ),
      alignment: Alignment.center,
      child: Text(
        atom.symbol,
        style: TextStyle(
          color: Colors.white,
          fontWeight: FontWeight.bold,
          fontSize: size * 0.38,
        ),
      ),
    );
  }
}
