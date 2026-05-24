import 'dart:math';

import 'package:flutter/material.dart';

import '../game/atom.dart';
import '../game/game_state.dart';
import 'atom_widget.dart';

class GameBoard extends StatelessWidget {
  const GameBoard({
    super.key,
    required this.state,
    required this.onPlace,
  });

  final GameState state;
  final ValueChanged<int> onPlace;

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final size = min(constraints.maxWidth, constraints.maxHeight);
        final ring = state.ring;
        final radius = size * 0.4;
        final center = Offset(size / 2, size / 2);
        final atomSize = max(28.0, min(56.0, size / 9));

        final atomWidgets = <Widget>[];
        final slotWidgets = <Widget>[];

        final n = ring.length;
        if (n == 0) {
          slotWidgets.add(_positioned(
            center,
            atomSize,
            _SlotButton(onTap: () => onPlace(0), size: atomSize),
          ));
        } else {
          for (var i = 0; i < n; i++) {
            final angle = (2 * pi * i) / n - pi / 2;
            final pos = center + Offset(cos(angle), sin(angle)) * radius;
            atomWidgets.add(_positioned(
              pos,
              atomSize,
              AtomWidget(atom: ring[i], size: atomSize),
            ));

            final slotAngle = (2 * pi * (i + 0.5)) / n - pi / 2;
            final slotPos =
                center + Offset(cos(slotAngle), sin(slotAngle)) * radius;
            slotWidgets.add(_positioned(
              slotPos,
              atomSize * 0.7,
              _SlotButton(
                onTap: () => onPlace(i + 1),
                size: atomSize * 0.7,
              ),
            ));
          }
        }

        return SizedBox(
          width: size,
          height: size,
          child: Stack(
            children: [
              ...slotWidgets,
              ...atomWidgets,
              Positioned(
                left: center.dx - atomSize / 2,
                top: center.dy - atomSize / 2,
                width: atomSize,
                height: atomSize,
                child: _CenterAtom(atom: state.next),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _positioned(Offset pos, double size, Widget child) {
    return Positioned(
      left: pos.dx - size / 2,
      top: pos.dy - size / 2,
      width: size,
      height: size,
      child: child,
    );
  }
}

class _SlotButton extends StatelessWidget {
  const _SlotButton({required this.onTap, required this.size});
  final VoidCallback onTap;
  final double size;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      behavior: HitTestBehavior.opaque,
      child: Container(
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          color: Colors.white.withOpacity(0.08),
          border: Border.all(color: Colors.white24, width: 1),
        ),
      ),
    );
  }
}

class _CenterAtom extends StatelessWidget {
  const _CenterAtom({required this.atom});
  final Atom atom;

  @override
  Widget build(BuildContext context) {
    return AtomWidget(atom: atom, highlighted: true);
  }
}
